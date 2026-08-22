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
            // A different context means everything built on the previous one died with it.
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
        this._map = map;
    }

    /**
     * Also called on WebGL context loss, after which the same image is reused without a
     * matching `onAdd`, so this has to leave the object able to start over.
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

    /** Draw into the image's slot of the atlas. `this._gl` is already `target.gl`. */
    protected abstract _paint(target: StyleImageWebGLTarget): void;

    /** Delete everything built on `this._gl`. Called on remove and on context change. */
    protected abstract _releaseGPU(): void;
}
