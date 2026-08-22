import {now} from 'maplibre-gl';

import {WebGLStyleImage} from './webgl_style_image.ts';

import type {StyleImageWebGLTarget} from 'maplibre-gl';

type Frame = {
    width: number;
    height: number;
    /** Premultiplied-alpha RGBA pixels, matching MapLibre's atlas. */
    data: Uint8ClampedArray;
    /** How long this frame is shown before advancing to the next, in milliseconds. */
    duration: number;
};

type GPUState = {
    strip: WebGLTexture;
    framebuffer: WebGLFramebuffer;
    columns: number;
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
export class AnimatedStyleImage extends WebGLStyleImage {
    readonly width: number;
    readonly height: number;

    private _frames: Frame[];
    private _index = 0;
    private _gpu: GPUState | undefined;

    private constructor(frames: Frame[]) {
        super();
        const first = frames[0];
        if (!first) throw new Error('An animated image needs at least one frame.');
        this._frames = frames;
        this.width = first.width;
        this.height = first.height;

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
        if (!response.body) throw new Error(`${url} was served with no body.`);

        const type = response.headers.get('content-type');
        if (!type) throw new Error(`${url} was served with no content-type.`);
        if (!(await ImageDecoder.isTypeSupported(type))) {
            throw new Error(`This browser cannot decode "${type}", which is what ${url} was served as.`);
        }

        // Handing the decoder the stream, rather than a buffered copy, lets decoding overlap
        // the download.
        const decoder = new ImageDecoder({data: response.body, type});
        try {
            // `selectedTrack` is null until the track list is populated, and the frame count
            // on it is only final once the whole image has been buffered.
            await decoder.tracks.ready;
            await decoder.completed;
            const frameCount = decoder.tracks.selectedTrack?.frameCount;
            if (!frameCount) throw new Error(`${url} decoded to no frames.`);

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d', {willReadFrequently: true});
            if (!context) throw new Error('Could not create a 2d canvas context to convert decoded frames.');

            const frames: Frame[] = [];
            for (let i = 0; i < frameCount; i++) {
                const {image} = await decoder.decode({frameIndex: i});
                try {
                    const {displayWidth: width, displayHeight: height} = image;
                    canvas.width = width;
                    canvas.height = height;
                    // A 2d canvas normalizes whatever pixel format the decoder hands back,
                    // which may be BGRA or YUV, to straight-alpha RGBA.
                    context.drawImage(image, 0, 0);
                    const data = context.getImageData(0, 0, width, height).data;
                    // MapLibre's atlas holds premultiplied pixels. Premultiplying once here
                    // keeps every upload, including re-uploads after a context loss, copy-only.
                    for (let offset = 0; offset < data.length; offset += 4) {
                        const alpha = (data[offset + 3] ?? 0) / 255;
                        data[offset + 0] = (data[offset + 0] ?? 0) * alpha;
                        data[offset + 1] = (data[offset + 1] ?? 0) * alpha;
                        data[offset + 2] = (data[offset + 2] ?? 0) * alpha;
                    }
                    // `VideoFrame.duration` is in microseconds, and is null for a still image.
                    frames.push({width, height, data, duration: (image.duration ?? 0) / 1000});
                } finally {
                    image.close();
                }
            }
            return new AnimatedStyleImage(frames);
        } finally {
            decoder.close();
        }
    }

    /**
     * Pick the frame the clock is on, and report whether it differs from the one already
     * painted. Waking the map on a timer, rather than on every frame, is what lets it go idle
     * in between.
     */
    render(): boolean {
        const totalDuration = this._frames.reduce((sum, frame) => sum + frame.duration, 0);
        let remaining = totalDuration > 0 ? now() % totalDuration : 0;
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
        this._scheduleRepaint(delay);

        if (index === this._index) return false;
        this._index = index;
        return true;
    }

    protected _paint({gl, texture, x, y, width, height}: StyleImageWebGLTarget): void {
        const gpu = (this._gpu ??= this._upload(gl));
        // A single frame that exceeds the device's texture size cannot be shown at all.
        if (!gpu) return;

        gl.bindFramebuffer(gl.FRAMEBUFFER, gpu.framebuffer);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.copyTexSubImage2D(
            gl.TEXTURE_2D,
            0,
            x,
            y,
            (this._index % gpu.columns) * width,
            Math.floor(this._index / gpu.columns) * height,
            width,
            height,
        );
    }

    private _upload(gl: WebGL2RenderingContext): GPUState | undefined {
        const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
        let columns = layOutFrames(this.width, this.height, this._frames.length, maxTextureSize);
        if (columns === undefined && this._frames.length > 1) {
            // Degrade to a still of frame 0 rather than breaking the map's render loop.
            // Trimming the frames makes the warning and the retry happen only once.
            console.warn(
                `${this._frames.length} frames of ${this.width}x${this.height} do not fit in this device's maximum texture size of ${maxTextureSize}. The image will not animate.`,
            );
            this._frames = this._frames.slice(0, 1);
            columns = layOutFrames(this.width, this.height, 1, maxTextureSize);
        }
        if (columns === undefined) return undefined;

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

        const stripTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, stripTexture);
        // The strip is only ever read by `copyTexSubImage2D`, never sampled, so it needs no
        // filtering or wrap state. The sized format keeps it color-renderable.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, stripWidth, rows * this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, strip);

        const framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, stripTexture, 0);

        return {strip: stripTexture, framebuffer, columns};
    }

    protected _releaseGPU(): void {
        // Leave the frames in memory: that is how the same instance survives a context loss.
        if (!this._gpu) return;
        this._gl?.deleteFramebuffer(this._gpu.framebuffer);
        this._gl?.deleteTexture(this._gpu.strip);
        this._gpu = undefined;
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
