import type {Map, StyleImageInterface, StyleImageWebGLData, StyleImageWebGLTarget} from 'maplibre-gl';

/**
 * The machinery this package's WebGL style images share: the map handle, one pending repaint
 * timer, and releasing GPU state when the WebGL context is replaced.
 */
export abstract class WebGLStyleImage implements StyleImageInterface {
    abstract readonly width: number;
    abstract readonly height: number;
    readonly data: StyleImageWebGLData = {
        renderWithWebGL: (target) => {
            // Not the context-loss path: a restored context is the same object, and loss is
            // handled through `onRemove`. A genuinely different context means a second map is
            // painting this instance, so the GPU state is rebuilt for it.
            if (this._gl !== target.gl) {
                this._releaseGPU();
                this._gl = target.gl;
            }
            this._paint(target);
        },
    };

    protected _map: Map | undefined;
    protected _gl: WebGL2RenderingContext | undefined;
    private _timeout: ReturnType<typeof setTimeout> | undefined;

    onAdd(map: Map): void {
        if (this._map && this._map !== map) {
            console.warn(
                'This style image is already on another map. GPU state lives on one WebGL context, so a shared instance re-uploads it every frame; create one instance per map.',
            );
        }
        this._map = map;
    }

    /**
     * Also called on WebGL context loss, after which the same image is reused without a
     * matching `onAdd`, so this has to leave the object able to start over. That is why
     * `_map` is kept: nothing would set it again.
     */
    onRemove(): void {
        clearTimeout(this._timeout);
        this._timeout = undefined;
        this._releaseGPU();
        this._gl = undefined;
    }

    /**
     * Ask the map to paint again in `delay` milliseconds, or never for `Infinity`. A pending
     * timer is already set for that same moment, so it is left alone: re-arming on every paint
     * costs two timer calls per painted frame for nothing.
     */
    protected _scheduleRepaint(delay: number): void {
        if (delay === Infinity) return;
        this._timeout ??= setTimeout(() => {
            this._timeout = undefined;
            this._map?.triggerRepaint();
        }, delay);
    }

    /**
     * Draw into the image's slot of the atlas. `this._gl` is already `target.gl`. MapLibre
     * restores its own GL state afterwards, so nothing set here needs undoing, but every
     * atlas holding the image paints in the same frame, so this has to be repeatable.
     */
    protected abstract _paint(target: StyleImageWebGLTarget): void;

    /** Delete everything built on `this._gl`. Called on remove and on context change. */
    protected abstract _releaseGPU(): void;
}
