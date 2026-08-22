import {now} from 'maplibre-gl';

import type {Map, StyleImageInterface, StyleImageWebGLData, StyleImageWebGLTarget} from 'maplibre-gl';

type Frame = {
    width: number;
    height: number;
    data: Uint8ClampedArray;
    /** How long this frame is shown before advancing to the next, in milliseconds. */
    duration: number;
};

/**
 * An animated icon or pattern for {@link Map.addImage}, loaded from a URL with
 * {@link AnimatedStyleImage.fromURL}. Any animated format the browser's `ImageDecoder`
 * understands works: GIF, animated WebP, APNG, animated AVIF.
 *
 * Every frame is uploaded once, packed into a grid in a private "strip" texture. Advancing a
 * frame copies it straight from that strip into the image's slot in MapLibre's shared atlas
 * with a GPU-to-GPU `copyTexSubImage2D`, so animating costs no per-frame CPU work, no
 * upload, and no atlas repack.
 *
 * The image asks to be drawn again on a timer when the next frame is due, rather than on every
 * frame, so an animated image does not stop the map from firing `idle`. Because the frame index
 * is derived from the clock rather than incremented, an image that was not drawn for a while
 * resumes on the right frame with no drift.
 *
 * All frames are held on the GPU at once, so they have to fit in a single texture on the
 * device. Frames that do not fit are reported with `console.warn` and the image degrades to a
 * still of frame 0.
 *
 * @example
 * ```ts
 * map.addImage('spinner', await AnimatedStyleImage.fromURL('/spinner.gif'), {pixelRatio: 2});
 * ```
 */
export class AnimatedStyleImage implements StyleImageInterface {
    width: number;
    height: number;
    readonly data: StyleImageWebGLData = {
        renderWithWebGL: (target) => {
            this._paint(target);
        },
    };

    private _frames: Frame[];
    private _totalDuration: number;
    private _map: Map | undefined;
    private _index = 0;
    private _timeout: ReturnType<typeof setTimeout> | undefined;

    /** `undefined` until the frames are known to fit in one texture. */
    private _columns: number | undefined;
    private _gl: WebGL2RenderingContext | undefined;
    private _strip: WebGLTexture | undefined;
    private _framebuffer: WebGLFramebuffer | undefined;

    private constructor(frames: Frame[]) {
        const first = frames[0];
        if (!first) throw new Error('An animated image needs at least one frame.');
        this._frames = frames;
        this.width = first.width;
        this.height = first.height;
        this._totalDuration = frames.reduce((sum, frame) => sum + frame.duration, 0);

        for (const [i, frame] of frames.entries()) {
            // The strip is a uniform grid and the atlas reserves a single slot, so a frame
            // that differs in size from frame 0 would blit the wrong pixels.
            if (frame.width !== this.width || frame.height !== this.height) {
                throw new Error(
                    `All frames must be ${this.width}x${this.height} like frame 0, but frame ${i} is ${frame.width}x${frame.height}.`,
                );
            }
        }
    }

    /**
     * Fetch and decode an animated image. Any format the browser's `ImageDecoder` supports
     * works: GIF, animated WebP, APNG, animated AVIF. A still image loads as a single frame
     * that never changes.
     *
     * The whole image is decoded up front, so an animation is limited by what fits in one
     * texture rather than by bandwidth.
     *
     * @param url - Where to fetch the image from.
     * @param fetchOptions - Passed through to `fetch`, for an `AbortSignal` or credentials.
     */
    static async fromURL(url: string, fetchOptions?: RequestInit): Promise<AnimatedStyleImage> {
        if (typeof ImageDecoder === 'undefined') {
            throw new Error(
                'This browser has no ImageDecoder, which AnimatedStyleImage needs in order to decode an animated image.',
            );
        }

        const response = await fetch(url, fetchOptions);
        if (!response.ok) throw new Error(`Could not fetch ${url}: ${response.status} ${response.statusText}.`);

        const type = response.headers.get('content-type');
        if (!type) throw new Error(`${url} was served with no content-type.`);
        if (!(await ImageDecoder.isTypeSupported(type))) {
            throw new Error(`This browser cannot decode "${type}", which is what ${url} was served as.`);
        }

        const decoder = new ImageDecoder({data: await response.arrayBuffer(), type});
        try {
            // `selectedTrack` is null until the track list is populated, and the frame count
            // on it is only final once the whole image has been buffered.
            await decoder.tracks.ready;
            await decoder.completed;
            const frameCount = decoder.tracks.selectedTrack?.frameCount;
            if (!frameCount) throw new Error(`${url} decoded to no frames.`);

            const frames: Frame[] = [];
            for (let i = 0; i < frameCount; i++) {
                const {image} = await decoder.decode({frameIndex: i});
                try {
                    // `VideoFrame.duration` is in microseconds, and is null for a still image.
                    frames.push({...videoFrameToRGBA(image), duration: (image.duration ?? 0) / 1000});
                } finally {
                    image.close();
                }
            }
            return new AnimatedStyleImage(frames);
        } finally {
            decoder.close();
        }
    }

    onAdd(map: Map): void {
        this._map = map;
        // The draw callback hands us a `gl`, but the strip has to be laid out before the first one.
        // Asking the canvas for `webgl2` again returns the context MapLibre already made.
        const gl = map.getCanvas().getContext('webgl2');
        if (!gl) throw new Error('AnimatedStyleImage needs the map to be rendering with WebGL2.');
        const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;

        this._columns = layOutFrames(this.width, this.height, this._frames.length, maxTextureSize);
        if (this._columns !== undefined) return;

        // Degrade to a still of frame 0, rather than throwing out of `addImage` and leaving a
        // half-added image behind.
        console.warn(
            `${this._frames.length} frames of ${this.width}x${this.height} do not fit in this device's maximum texture size of ${maxTextureSize}. The image will not animate.`,
        );
        this._frames = this._frames.slice(0, 1);
        this._totalDuration = 0;
        this._columns = layOutFrames(this.width, this.height, 1, maxTextureSize);
    }

    /**
     * Also called on WebGL context loss, after which the same image is reused without a
     * matching `onAdd`, so this has to leave the object able to start over.
     */
    onRemove(): void {
        clearTimeout(this._timeout);
        this._timeout = undefined;
        this._releaseGPU();
    }

    /**
     * Pick the frame the clock is on, and report whether it differs from the one already
     * painted. Waking the map on a timer, rather than on every frame, is what lets it go idle
     * in between.
     */
    render(): boolean {
        if (this._columns === undefined) return false;

        let remaining = this._totalDuration > 0 ? now() % this._totalDuration : 0;
        let index = this._frames.length - 1;
        let delay = Infinity;
        for (const [i, frame] of this._frames.entries()) {
            if (remaining < frame.duration) {
                index = i;
                delay = frame.duration - remaining;
                break;
            }
            remaining -= frame.duration;
        }

        // A pending timer is already set for that same moment, so leave it alone: re-arming on
        // every paint costs two timer calls per painted frame for nothing.
        if (this._timeout === undefined && delay < Infinity) {
            this._timeout = setTimeout(() => {
                this._timeout = undefined;
                this._map?.triggerRepaint();
            }, delay);
        }

        if (index === this._index) return false;
        this._index = index;
        return true;
    }

    private _paint({gl, texture, x, y, width, height}: StyleImageWebGLTarget): void {
        const columns = this._columns;
        if (columns === undefined) return;

        // A different context means the old strip died with the previous one.
        if (this._gl !== gl) this._releaseGPU();
        if (!this._strip) this._upload(gl, columns);

        gl.bindFramebuffer(gl.FRAMEBUFFER, this._framebuffer ?? null);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.copyTexSubImage2D(
            gl.TEXTURE_2D,
            0,
            x,
            y,
            (this._index % columns) * width,
            Math.floor(this._index / columns) * height,
            width,
            height,
        );
    }

    private _upload(gl: WebGL2RenderingContext, columns: number): void {
        const rows = Math.ceil(this._frames.length / columns);
        const stripWidth = columns * this.width;
        const strip = new Uint8Array(stripWidth * rows * this.height * 4);
        for (const [i, frame] of this._frames.entries()) {
            const originX = (i % columns) * this.width;
            const originY = Math.floor(i / columns) * this.height;
            for (let row = 0; row < this.height; row++) {
                strip.set(
                    frame.data.subarray(row * this.width * 4, (row + 1) * this.width * 4),
                    ((originY + row) * stripWidth + originX) * 4,
                );
            }
        }
        // MapLibre's atlas holds premultiplied pixels, so the copies out of the strip only
        // land correctly if the strip matches.
        for (let i = 0; i < strip.length; i += 4) {
            const alpha = (strip[i + 3] ?? 0) / 255;
            strip[i + 0] = (strip[i + 0] ?? 0) * alpha;
            strip[i + 1] = (strip[i + 1] ?? 0) * alpha;
            strip[i + 2] = (strip[i + 2] ?? 0) * alpha;
        }

        this._gl = gl;
        this._strip = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this._strip);
        // The strip is only ever read by `copyTexSubImage2D`, never sampled, so it needs no
        // filtering or wrap state. The sized format keeps it color-renderable.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, stripWidth, rows * this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, strip);

        this._framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._strip, 0);
    }

    private _releaseGPU(): void {
        // Leave the frames in memory: that is how the same instance survives a context loss.
        this._gl?.deleteFramebuffer(this._framebuffer ?? null);
        this._gl?.deleteTexture(this._strip ?? null);
        this._gl = undefined;
        this._strip = undefined;
        this._framebuffer = undefined;
    }
}

/**
 * Arrange `count` frames of `width` x `height` into a grid that fits in a texture no larger
 * than `maxTextureSize` on either side. Returns the number of columns, or `undefined` if the
 * frames cannot fit.
 */
export function layOutFrames(width: number, height: number, count: number, maxTextureSize: number): number | undefined {
    const columns = Math.min(count, Math.floor(maxTextureSize / width));
    if (columns < 1) return undefined;
    if (Math.ceil(count / columns) * height > maxTextureSize) return undefined;
    return columns;
}

/** Convert a decoded frame to raw straight-alpha RGBA pixels. */
function videoFrameToRGBA(frame: VideoFrame): {width: number; height: number; data: Uint8ClampedArray} {
    const {displayWidth: width, displayHeight: height} = frame;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    // A 2d canvas normalizes whatever pixel format the decoder hands back, which may be BGRA
    // or YUV, to straight-alpha RGBA.
    const context = canvas.getContext('2d', {willReadFrequently: true});
    if (!context) throw new Error('Could not create a 2d canvas context to convert a decoded frame.');
    context.drawImage(frame, 0, 0);
    return {width, height, data: context.getImageData(0, 0, width, height).data};
}
