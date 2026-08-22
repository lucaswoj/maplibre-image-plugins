// src/animated_style_image.ts
import { now } from "maplibre-gl";

// src/webgl_style_image.ts
var WebGLStyleImage = class {
  data = {
    renderWithWebGL: (target) => {
      if (this._gl !== target.gl) {
        this._releaseGPU();
        this._gl = target.gl;
      }
      this._paint(target);
    }
  };
  _map;
  _gl;
  _timeout;
  onAdd(map) {
    if (this._map && this._map !== map) {
      console.warn(
        "This style image is already on another map. GPU state lives on one WebGL context, so a shared instance re-uploads it every frame; create one instance per map."
      );
    }
    this._map = map;
  }
  /**
   * Also called on WebGL context loss, after which the same image is reused without a
   * matching `onAdd`, so this has to leave the object able to start over. That is why
   * `_map` is kept: nothing would set it again.
   */
  onRemove() {
    clearTimeout(this._timeout);
    this._timeout = void 0;
    this._releaseGPU();
    this._gl = void 0;
  }
  /**
   * Ask the map to paint again in `delay` milliseconds, or never for `Infinity`. A pending
   * timer is already set for that same moment, so it is left alone: re-arming on every paint
   * costs two timer calls per painted frame for nothing.
   */
  _scheduleRepaint(delay) {
    if (delay === Infinity) return;
    this._timeout ??= setTimeout(() => {
      this._timeout = void 0;
      this._map?.triggerRepaint();
    }, delay);
  }
};

// src/animated_style_image.ts
var AnimatedStyleImage = class _AnimatedStyleImage extends WebGLStyleImage {
  width;
  height;
  _frames;
  _index = 0;
  _gpu;
  _uploadFailed = false;
  constructor(frames) {
    super();
    const first = frames[0];
    if (!first) throw new Error("An animated image needs at least one frame.");
    this._frames = frames;
    this.width = first.width;
    this.height = first.height;
    for (const [i, frame] of frames.entries()) {
      if (frame.width !== this.width || frame.height !== this.height) {
        throw new Error(
          `All frames must be ${this.width}x${this.height} like frame 0, but frame ${i} is ${frame.width}x${frame.height}.`
        );
      }
    }
    if (frames.length > 1) {
      for (const frame of frames) {
        if (frame.duration < 11) frame.duration = 100;
      }
    }
  }
  /**
   * Fetch and decode an animated image. Any format the browser's `ImageDecoder` supports
   * works: GIF, animated WebP, APNG, animated AVIF. A still image loads as a single frame
   * that never changes. On a browser with no `ImageDecoder`, only GIF loads.
   *
   * The whole image is decoded up front, so an animation is limited by what fits in one
   * texture rather than by bandwidth.
   *
   * @param url - Where to fetch the image from.
   * @param fetchOptions - Passed through to `fetch`, for an `AbortSignal` or credentials.
   */
  static async fromURL(url, fetchOptions) {
    const response = await fetch(url, fetchOptions);
    if (!response.ok) throw new Error(`Could not fetch ${url}: ${response.status} ${response.statusText}.`);
    if (!response.body) throw new Error(`${url} was served with no body.`);
    const contentType = response.headers.get("content-type");
    if (!contentType) throw new Error(`${url} was served with no content-type.`);
    const type = (contentType.split(";")[0] ?? contentType).trim();
    if (typeof ImageDecoder === "undefined") {
      if (type !== "image/gif") {
        throw new Error(
          `This browser has no ImageDecoder, so it can only load a GIF, but ${url} was served as "${type}".`
        );
      }
      const { decodeFrames } = await import("./chunks/dist-PK3SP3G6.mjs");
      return new _AnimatedStyleImage(
        decodeFrames(await response.arrayBuffer()).map(({ width, height, data, delay }) => {
          premultiply(data);
          return { width, height, data, duration: delay };
        })
      );
    }
    if (!await ImageDecoder.isTypeSupported(type)) {
      throw new Error(`This browser cannot decode "${type}", which is what ${url} was served as.`);
    }
    const decoder = new ImageDecoder({ data: response.body, type });
    try {
      await decoder.tracks.ready;
      await decoder.completed;
      const frameCount = decoder.tracks.selectedTrack?.frameCount;
      if (!frameCount) throw new Error(`${url} decoded to no frames.`);
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) throw new Error("Could not create a 2d canvas context to convert decoded frames.");
      const frames = [];
      for (let i = 0; i < frameCount; i++) {
        const { image } = await decoder.decode({ frameIndex: i });
        try {
          const { displayWidth: width, displayHeight: height } = image;
          canvas.width = width;
          canvas.height = height;
          context.drawImage(image, 0, 0);
          const data = context.getImageData(0, 0, width, height).data;
          premultiply(data);
          frames.push({ width, height, data, duration: (image.duration ?? 0) / 1e3 });
        } finally {
          image.close();
        }
      }
      return new _AnimatedStyleImage(frames);
    } finally {
      decoder.close();
    }
  }
  /**
   * Pick the frame the clock is on, and report whether it differs from the one already
   * painted. Waking the map on a timer, rather than on every frame, is what lets it go idle
   * in between.
   */
  render() {
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
  _paint({ gl, texture, x, y, width, height }) {
    if (this._uploadFailed) return;
    const gpu = this._gpu ??= this._upload(gl);
    if (!gpu) {
      this._uploadFailed = true;
      return;
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, gpu.framebuffer);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.copyTexSubImage2D(
      gl.TEXTURE_2D,
      0,
      x,
      y,
      this._index % gpu.columns * width,
      Math.floor(this._index / gpu.columns) * height,
      width,
      height
    );
  }
  _upload(gl) {
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    let columns = layOutFrames(this.width, this.height, this._frames.length, maxTextureSize);
    if (columns === void 0 && this._frames.length > 1) {
      console.warn(
        `${this._frames.length} frames of ${this.width}x${this.height} do not fit in this device's maximum texture size of ${maxTextureSize}. The image will not animate.`
      );
      this._frames = this._frames.slice(0, 1);
      this._index = 0;
      columns = layOutFrames(this.width, this.height, 1, maxTextureSize);
    }
    if (columns === void 0) return void 0;
    const rows = Math.ceil(this._frames.length / columns);
    const stripWidth = columns * this.width;
    const strip = new Uint8Array(stripWidth * rows * this.height * 4);
    for (const [i, frame] of this._frames.entries()) {
      const originX = i % columns * this.width;
      const originY = Math.floor(i / columns) * this.height;
      for (let row = 0; row < this.height; row++) {
        strip.set(
          frame.data.subarray(row * this.width * 4, (row + 1) * this.width * 4),
          ((originY + row) * stripWidth + originX) * 4
        );
      }
    }
    const stripTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, stripTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, stripWidth, rows * this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, strip);
    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, stripTexture, 0);
    return { strip: stripTexture, framebuffer, columns };
  }
  _releaseGPU() {
    this._uploadFailed = false;
    if (!this._gpu) return;
    this._gl?.deleteFramebuffer(this._gpu.framebuffer);
    this._gl?.deleteTexture(this._gpu.strip);
    this._gpu = void 0;
  }
};
function premultiply(data) {
  for (let offset = 0; offset < data.length; offset += 4) {
    const alpha = (data[offset + 3] ?? 0) / 255;
    data[offset + 0] = (data[offset + 0] ?? 0) * alpha;
    data[offset + 1] = (data[offset + 1] ?? 0) * alpha;
    data[offset + 2] = (data[offset + 2] ?? 0) * alpha;
  }
}
function layOutFrames(width, height, count, maxTextureSize) {
  const columns = Math.min(count, Math.floor(maxTextureSize / width));
  if (columns < 1) return void 0;
  if (Math.ceil(count / columns) * height > maxTextureSize) return void 0;
  return columns;
}

// src/pulsing_dot_style_image.ts
import { now as now2 } from "maplibre-gl";
var FRAME_INTERVAL = 1e3 / 30;
var vertexSource = `#version 300 es

in vec2 a_pos;
out vec2 v_pos;
void main() {
    // the icon atlas holds its rows top to bottom and a framebuffer is read bottom to top,
    // so the varying is flipped to draw the image upside down and cancel out the copy into
    // the atlas; flipping the varying rather than the position keeps v_pos in image space
    v_pos = vec2(a_pos.x, -a_pos.y);
    gl_Position = vec4(a_pos, 0.0, 1.0);
}`;
var fragmentSource = `#version 300 es

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
var PulsingDotStyleImage = class extends WebGLStyleImage {
  width;
  height;
  _period;
  _frame = -1;
  _dotRadius;
  _strokeRadius;
  _color;
  _strokeColor;
  _haloColor;
  _gpu;
  _setupFailed = false;
  constructor(options = {}) {
    super();
    const haloRadius = options.haloRadius ?? 50;
    this.width = haloRadius * 2;
    this.height = haloRadius * 2;
    this._period = options.period ?? 2e3;
    this._dotRadius = (options.dotRadius ?? 15) / haloRadius;
    this._strokeRadius = (options.strokeRadius ?? 20) / haloRadius;
    this._color = parseColor(options.dotColor ?? "#1da1f2");
    this._strokeColor = parseColor(options.strokeColor ?? "white");
    this._haloColor = parseColor(options.haloColor ?? options.dotColor ?? "#1da1f2");
  }
  /**
   * Pick the frame the clock is on, and report whether it differs from the one already
   * painted. Waking the map on a timer at 30 fps, rather than on every map frame, is what
   * lets it go idle in between.
   */
  render() {
    this._scheduleRepaint(FRAME_INTERVAL - now2() % FRAME_INTERVAL);
    const frame = Math.floor(now2() / FRAME_INTERVAL);
    if (frame === this._frame) return false;
    this._frame = frame;
    return true;
  }
  _paint({ gl, texture, x, y, width, height }) {
    if (this._setupFailed) return;
    const gpu = this._gpu ??= this._setup(gl);
    if (!gpu) {
      this._setupFailed = true;
      return;
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, gpu.framebuffer);
    gl.viewport(0, 0, width, height);
    gl.disable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.SCISSOR_TEST);
    gl.useProgram(gpu.program);
    const time = this._frame * FRAME_INTERVAL;
    gl.uniform1f(gpu.phaseUniform, time % this._period / this._period);
    gl.bindVertexArray(gpu.vertexArray);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.copyTexSubImage2D(gl.TEXTURE_2D, 0, x, y, 0, 0, width, height);
  }
  _setup(gl) {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return void 0;
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
      console.warn(`Could not link the pulsing dot's shaders: ${gl.getProgramInfoLog(program) ?? ""}`);
      gl.deleteProgram(program);
      return void 0;
    }
    gl.useProgram(program);
    gl.uniform1f(gl.getUniformLocation(program, "u_dot_radius"), this._dotRadius);
    gl.uniform1f(gl.getUniformLocation(program, "u_stroke_radius"), this._strokeRadius);
    gl.uniform4fv(gl.getUniformLocation(program, "u_color"), premultiply2(this._color));
    gl.uniform4fv(gl.getUniformLocation(program, "u_stroke_color"), premultiply2(this._strokeColor));
    gl.uniform4fv(gl.getUniformLocation(program, "u_halo_color"), premultiply2(this._haloColor));
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    const buffer = gl.createBuffer();
    const vertexArray = gl.createVertexArray();
    gl.bindVertexArray(vertexArray);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const posAttribute = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(posAttribute);
    gl.vertexAttribPointer(posAttribute, 2, gl.FLOAT, false, 0, 0);
    return {
      program,
      phaseUniform: gl.getUniformLocation(program, "u_phase"),
      texture,
      framebuffer,
      buffer,
      vertexArray
    };
  }
  _releaseGPU() {
    this._setupFailed = false;
    if (!this._gpu) return;
    this._gl?.deleteProgram(this._gpu.program);
    this._gl?.deleteFramebuffer(this._gpu.framebuffer);
    this._gl?.deleteTexture(this._gpu.texture);
    this._gl?.deleteBuffer(this._gpu.buffer);
    this._gl?.deleteVertexArray(this._gpu.vertexArray);
    this._gpu = void 0;
  }
};
function parseColor(color) {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Could not create a 2d canvas context to parse a color.");
  context.fillStyle = "#000";
  context.fillStyle = color;
  const parsed = context.fillStyle;
  context.fillStyle = "#fff";
  context.fillStyle = color;
  if (context.fillStyle !== parsed) throw new Error(`"${color}" is not a valid CSS color.`);
  context.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data;
  return [(r ?? 0) / 255, (g ?? 0) / 255, (b ?? 0) / 255, (a ?? 0) / 255];
}
function premultiply2([r, g, b, a]) {
  return [r * a, g * a, b * a, a];
}
export {
  AnimatedStyleImage,
  PulsingDotStyleImage
};
