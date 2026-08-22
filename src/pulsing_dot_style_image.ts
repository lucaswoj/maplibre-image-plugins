import {now} from 'maplibre-gl';

import {WebGLStyleImage} from './webgl_style_image.ts';

import type {StyleImageWebGLTarget} from 'maplibre-gl';

export type PulsingDotOptions = {
    /** Diameter of the whole image in device pixels, halo included. Default 100. */
    size?: number;
    /** Fill of the center dot, as any CSS color. Default MapLibre's location-dot blue. */
    color?: string;
    /** Ring around the center dot, as any CSS color. Default white. */
    strokeColor?: string;
    /** Thickness of that ring in device pixels. Default `size / 20`. */
    strokeWidth?: number;
    /** Radius of the center dot in device pixels, stroke excluded. Default `size / 7`. */
    dotRadius?: number;
    /** Color the pulse starts at before fading out, as any CSS color. Defaults to `color`. */
    haloColor?: string;
    /** One pulse cycle in milliseconds. Default 2000. */
    period?: number;
};

const FRAME_INTERVAL = 1000 / 30;

const vertexSource = `#version 300 es

in vec2 a_pos;
out vec2 v_pos;
void main() {
    // the icon atlas holds its rows top to bottom and a framebuffer is read bottom to top,
    // so the varying is flipped to draw the image upside down and cancel out the copy into
    // the atlas; flipping the varying rather than the position keeps v_pos in image space
    v_pos = vec2(a_pos.x, -a_pos.y);
    gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const fragmentSource = `#version 300 es

precision highp float;
uniform float u_phase;
uniform float u_dot_radius;
uniform float u_stroke_radius;
uniform vec4 u_color;
uniform vec4 u_stroke_color;
uniform vec4 u_halo_color;
in vec2 v_pos;
out vec4 fragColor;
void main() {
    float dist = length(v_pos);
    float aa = fwidth(dist);
    // the halo stops a pixel short of the slot's edge so that linear filtering at fractional
    // scales never mixes in the transparent atlas padding along a hard edge
    float haloRadius = mix(u_stroke_radius, 1.0 - 2.0 * aa, u_phase);
    fragColor = u_halo_color * (1.0 - u_phase) * (1.0 - smoothstep(haloRadius - aa, haloRadius + aa, dist));
    fragColor = mix(fragColor, u_stroke_color, 1.0 - smoothstep(u_stroke_radius - aa, u_stroke_radius + aa, dist));
    fragColor = mix(fragColor, u_color, 1.0 - smoothstep(u_dot_radius - aa, u_dot_radius + aa, dist));
}`;

type GPUState = {
    program: WebGLProgram;
    phaseUniform: WebGLUniformLocation | null;
    texture: WebGLTexture;
    framebuffer: WebGLFramebuffer;
    buffer: WebGLBuffer;
    vertexArray: WebGLVertexArrayObject;
};

/**
 * A pulsing location dot for {@link Map.addImage}, drawn entirely by a fragment shader: no
 * image asset, no canvas, no per-frame pixel upload. Each frame is rendered into a private
 * texture and copied into the image's slot in MapLibre's shared atlas with a GPU-to-GPU
 * `copyTexSubImage2D`.
 *
 * Every part of the dot is set by {@link PulsingDotOptions}: size, colors, dot and stroke
 * proportions, and how fast it pulses.
 *
 * The image asks to be drawn again on a timer when the next frame is due, rather than on every
 * map frame, so the dot does not stop the map from firing `idle`. Because the frame index is
 * derived from the clock rather than incremented, the pulse stays on schedule no matter how
 * often the map actually paints.
 *
 * @example
 * ```ts
 * map.addImage('location', new PulsingDotStyleImage({color: 'tomato'}), {pixelRatio: 2});
 * ```
 */
export class PulsingDotStyleImage extends WebGLStyleImage {
    readonly width: number;
    readonly height: number;

    private readonly _period: number;
    private _frame = -1;
    private readonly _dotRadius: number;
    private readonly _strokeRadius: number;
    private readonly _color: [number, number, number, number];
    private readonly _strokeColor: [number, number, number, number];
    private readonly _haloColor: [number, number, number, number];
    private _gpu: GPUState | undefined;
    private _setupFailed = false;

    constructor(options: PulsingDotOptions = {}) {
        super();
        const size = options.size ?? 100;
        this.width = size;
        this.height = size;
        this._period = options.period ?? 2000;
        // The shader works in the quad's [-1, 1] space, so the pixel radii normalize to it.
        this._dotRadius = (options.dotRadius ?? size / 7) / (size / 2);
        this._strokeRadius = this._dotRadius + (options.strokeWidth ?? size / 20) / (size / 2);
        this._color = parseColor(options.color ?? '#1da1f2');
        this._strokeColor = parseColor(options.strokeColor ?? 'white');
        this._haloColor = parseColor(options.haloColor ?? options.color ?? '#1da1f2');
    }

    /**
     * Pick the frame the clock is on, and report whether it differs from the one already
     * painted. Waking the map on a timer at 30 fps, rather than on every map frame, is what
     * lets it go idle in between.
     */
    render(): boolean {
        this._scheduleRepaint(FRAME_INTERVAL - (now() % FRAME_INTERVAL));
        const frame = Math.floor(now() / FRAME_INTERVAL);
        if (frame === this._frame) return false;
        this._frame = frame;
        return true;
    }

    protected _paint({gl, texture, x, y, width, height}: StyleImageWebGLTarget): void {
        // A throw here would take down the map's whole render loop, and a failure would
        // repeat every frame, so a failed setup is warned about once and the dot goes blank.
        if (this._setupFailed) return;
        const gpu = (this._gpu ??= this._setup(gl));
        if (!gpu) {
            this._setupFailed = true;
            return;
        }

        // Draw into a private texture, then copy into the slot. Copying rather than drawing
        // into the atlas directly means nothing here can touch another image's pixels.
        gl.bindFramebuffer(gl.FRAMEBUFFER, gpu.framebuffer);
        gl.viewport(0, 0, width, height);
        gl.disable(gl.BLEND);
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.SCISSOR_TEST);
        gl.useProgram(gpu.program);
        // The same quantized clock as `render`, so the painted phase matches the reported frame.
        const time = this._frame * FRAME_INTERVAL;
        gl.uniform1f(gpu.phaseUniform, (time % this._period) / this._period);
        gl.bindVertexArray(gpu.vertexArray);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.copyTexSubImage2D(gl.TEXTURE_2D, 0, x, y, 0, 0, width, height);
    }

    private _setup(gl: WebGL2RenderingContext): GPUState | undefined {
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        // createShader only returns null on a lost context, where staying silent is right.
        if (!vertexShader || !fragmentShader) return undefined;
        gl.shaderSource(vertexShader, vertexSource);
        gl.compileShader(vertexShader);
        gl.shaderSource(fragmentShader, fragmentSource);
        gl.compileShader(fragmentShader);

        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS) && !gl.isContextLost()) {
            console.warn(`Could not link the pulsing dot's shaders: ${gl.getProgramInfoLog(program) ?? ''}`);
            gl.deleteProgram(program);
            return undefined;
        }

        gl.useProgram(program);
        gl.uniform1f(gl.getUniformLocation(program, 'u_dot_radius'), this._dotRadius);
        gl.uniform1f(gl.getUniformLocation(program, 'u_stroke_radius'), this._strokeRadius);
        // The atlas holds premultiplied pixels, so the colors are premultiplied here and the
        // shader mixes in that space.
        gl.uniform4fv(gl.getUniformLocation(program, 'u_color'), premultiply(this._color));
        gl.uniform4fv(gl.getUniformLocation(program, 'u_stroke_color'), premultiply(this._strokeColor));
        gl.uniform4fv(gl.getUniformLocation(program, 'u_halo_color'), premultiply(this._haloColor));

        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        const framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

        // One triangle covering the whole viewport, in its own vertex array so that this
        // image cannot disturb the attributes MapLibre has set up.
        const buffer = gl.createBuffer();
        const vertexArray = gl.createVertexArray();
        gl.bindVertexArray(vertexArray);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const posAttribute = gl.getAttribLocation(program, 'a_pos');
        gl.enableVertexAttribArray(posAttribute);
        gl.vertexAttribPointer(posAttribute, 2, gl.FLOAT, false, 0, 0);

        return {
            program,
            phaseUniform: gl.getUniformLocation(program, 'u_phase'),
            texture,
            framebuffer,
            buffer,
            vertexArray,
        };
    }

    protected _releaseGPU(): void {
        // A different context deserves a fresh try at compiling.
        this._setupFailed = false;
        if (!this._gpu) return;
        this._gl?.deleteProgram(this._gpu.program);
        this._gl?.deleteFramebuffer(this._gpu.framebuffer);
        this._gl?.deleteTexture(this._gpu.texture);
        this._gl?.deleteBuffer(this._gpu.buffer);
        this._gl?.deleteVertexArray(this._gpu.vertexArray);
        this._gpu = undefined;
    }
}

/** Resolve any CSS color to straight-alpha RGBA in [0, 1], via a 1x1 canvas. Throws on an invalid color, which would otherwise silently render as opaque black. */
function parseColor(color: string): [number, number, number, number] {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const context = canvas.getContext('2d', {willReadFrequently: true});
    if (!context) throw new Error('Could not create a 2d canvas context to parse a color.');
    // An invalid color leaves fillStyle unchanged, so it is parsed over two different
    // priors: any valid color resolves the same way both times, an invalid one cannot.
    context.fillStyle = '#000';
    context.fillStyle = color;
    const parsed = context.fillStyle;
    context.fillStyle = '#fff';
    context.fillStyle = color;
    if (context.fillStyle !== parsed) throw new Error(`"${color}" is not a valid CSS color.`);
    context.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data;
    return [(r ?? 0) / 255, (g ?? 0) / 255, (b ?? 0) / 255, (a ?? 0) / 255];
}

function premultiply([r, g, b, a]: [number, number, number, number]): [number, number, number, number] {
    return [r * a, g * a, b * a, a];
}
