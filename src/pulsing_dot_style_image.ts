import {now} from 'maplibre-gl';

import type {Map, StyleImageInterface, StyleImageWebGLData, StyleImageWebGLTarget} from 'maplibre-gl';

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

const vertexSource = `#version 300 es

in vec2 a_pos;
out vec2 v_pos;
void main() {
    v_pos = a_pos;
    // the icon atlas holds its rows top to bottom and a framebuffer is read bottom to top,
    // so the y axis is flipped here to cancel out the copy into the atlas
    gl_Position = vec4(a_pos.x, -a_pos.y, 0.0, 1.0);
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
    float haloRadius = mix(u_stroke_radius, 1.0 - aa, u_phase);
    fragColor = u_halo_color * (1.0 - u_phase) * (1.0 - smoothstep(haloRadius - aa, haloRadius + aa, dist));
    fragColor = mix(fragColor, u_stroke_color, 1.0 - smoothstep(u_stroke_radius - aa, u_stroke_radius + aa, dist));
    fragColor = mix(fragColor, u_color, 1.0 - smoothstep(u_dot_radius - aa, u_dot_radius + aa, dist));
}`;

/**
 * A pulsing location dot for {@link Map.addImage}, drawn entirely by a fragment shader: no
 * image asset, no canvas, no per-frame pixel upload. Each frame is rendered into a private
 * texture and copied into the image's slot in MapLibre's shared atlas with a GPU-to-GPU
 * `copyTexSubImage2D`.
 *
 * Every part of the dot is set by {@link PulsingDotOptions}: size, colors, dot and stroke
 * proportions, and how fast it pulses.
 *
 * @example
 * ```ts
 * map.addImage('location', new PulsingDotStyleImage({color: 'tomato'}), {pixelRatio: 2});
 * ```
 */
export class PulsingDotStyleImage implements StyleImageInterface {
    readonly width: number;
    readonly height: number;
    readonly data: StyleImageWebGLData = {
        renderWithWebGL: (target) => {
            this._paint(target);
        },
    };

    private readonly _period: number;
    private readonly _dotRadius: number;
    private readonly _strokeRadius: number;
    private readonly _color: [number, number, number, number];
    private readonly _strokeColor: [number, number, number, number];
    private readonly _haloColor: [number, number, number, number];

    private _map: Map | undefined;
    private _gl: WebGL2RenderingContext | undefined;
    private _program: WebGLProgram | undefined;
    private _phaseUniform: WebGLUniformLocation | undefined;
    private _texture: WebGLTexture | undefined;
    private _framebuffer: WebGLFramebuffer | undefined;
    private _buffer: WebGLBuffer | undefined;
    private _vertexArray: WebGLVertexArrayObject | undefined;

    constructor(options: PulsingDotOptions = {}) {
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

    onAdd(map: Map): void {
        this._map = map;
    }

    /**
     * Also called on WebGL context loss, after which the same image is reused without a
     * matching `onAdd`, so this has to leave the object able to start over.
     */
    onRemove(): void {
        this._releaseGPU();
    }

    /** The pulse moves every frame, so every call reports dirty and asks for the next one. */
    render(): boolean {
        this._map?.triggerRepaint();
        return true;
    }

    private _paint({gl, texture, x, y, width, height}: StyleImageWebGLTarget): void {
        // A different context means everything built on the previous one died with it.
        if (this._gl !== gl) this._releaseGPU();
        if (!this._program) this._setup(gl);

        // Draw into a private texture, then copy into the slot. Copying rather than drawing
        // into the atlas directly means nothing here can touch another image's pixels.
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._framebuffer ?? null);
        gl.viewport(0, 0, width, height);
        gl.disable(gl.BLEND);
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.SCISSOR_TEST);
        gl.useProgram(this._program ?? null);
        gl.uniform1f(this._phaseUniform ?? null, (now() % this._period) / this._period);
        gl.bindVertexArray(this._vertexArray ?? null);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.copyTexSubImage2D(gl.TEXTURE_2D, 0, x, y, 0, 0, width, height);
    }

    private _setup(gl: WebGL2RenderingContext): void {
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        if (!vertexShader) throw new Error('Could not create a WebGL shader for the pulsing dot.');
        gl.shaderSource(vertexShader, vertexSource);
        gl.compileShader(vertexShader);

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        if (!fragmentShader) throw new Error('Could not create a WebGL shader for the pulsing dot.');
        gl.shaderSource(fragmentShader, fragmentSource);
        gl.compileShader(fragmentShader);

        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS) && !gl.isContextLost()) {
            throw new Error(`Could not link the pulsing dot's shaders: ${gl.getProgramInfoLog(program) ?? ''}`);
        }

        gl.useProgram(program);
        this._phaseUniform = gl.getUniformLocation(program, 'u_phase') ?? undefined;
        gl.uniform1f(gl.getUniformLocation(program, 'u_dot_radius'), this._dotRadius);
        gl.uniform1f(gl.getUniformLocation(program, 'u_stroke_radius'), this._strokeRadius);
        // The atlas holds premultiplied pixels, so the colors are premultiplied here and the
        // shader mixes in that space.
        gl.uniform4fv(gl.getUniformLocation(program, 'u_color'), premultiply(this._color));
        gl.uniform4fv(gl.getUniformLocation(program, 'u_stroke_color'), premultiply(this._strokeColor));
        gl.uniform4fv(gl.getUniformLocation(program, 'u_halo_color'), premultiply(this._haloColor));

        this._texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this._texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        this._framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._texture, 0);

        // One triangle covering the whole viewport, in its own vertex array so that this
        // image cannot disturb the attributes MapLibre has set up.
        this._buffer = gl.createBuffer();
        this._vertexArray = gl.createVertexArray();
        gl.bindVertexArray(this._vertexArray);
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const posAttribute = gl.getAttribLocation(program, 'a_pos');
        gl.enableVertexAttribArray(posAttribute);
        gl.vertexAttribPointer(posAttribute, 2, gl.FLOAT, false, 0, 0);

        this._gl = gl;
        this._program = program;
    }

    private _releaseGPU(): void {
        this._gl?.deleteProgram(this._program ?? null);
        this._gl?.deleteFramebuffer(this._framebuffer ?? null);
        this._gl?.deleteTexture(this._texture ?? null);
        this._gl?.deleteBuffer(this._buffer ?? null);
        this._gl?.deleteVertexArray(this._vertexArray ?? null);
        this._gl = undefined;
        this._program = undefined;
        this._phaseUniform = undefined;
        this._texture = undefined;
        this._framebuffer = undefined;
        this._buffer = undefined;
        this._vertexArray = undefined;
    }
}

/** Resolve any CSS color to straight-alpha RGBA in [0, 1], via a 1x1 canvas. */
function parseColor(color: string): [number, number, number, number] {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const context = canvas.getContext('2d', {willReadFrequently: true});
    if (!context) throw new Error('Could not create a 2d canvas context to parse a color.');
    context.fillStyle = color;
    context.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data;
    return [(r ?? 0) / 255, (g ?? 0) / 255, (b ?? 0) / 255, (a ?? 0) / 255];
}

function premultiply([r, g, b, a]: [number, number, number, number]): [number, number, number, number] {
    return [r * a, g * a, b * a, a];
}
