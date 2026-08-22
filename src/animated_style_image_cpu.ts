// The classic `StyleImageInterface#render` path, written only so it can be benchmarked head to
// head against `AnimatedStyleImage`. Same asset, same frame clock, same frame pixels. The only
// difference is that a frame reaches the atlas by being copied on the CPU and re-uploaded,
// instead of being copied on the GPU.
import {now} from 'maplibre-gl';

import type {Map, StyleImageInterface} from 'maplibre-gl';

type Frame = {
    width: number;
    height: number;
    data: Uint8ClampedArray;
    duration: number;
};

export class AnimatedStyleImageCPU implements StyleImageInterface {
    width: number;
    height: number;
    data: Uint8Array;

    private _frames: Frame[];
    private _totalDuration: number;
    private _index = -1;
    private _map: Map | undefined;

    private constructor(frames: Frame[]) {
        this._frames = frames;
        this.width = frames[0].width;
        this.height = frames[0].height;
        this.data = new Uint8Array(this.width * this.height * 4);
        this._totalDuration = frames.reduce((sum, frame) => sum + frame.duration, 0);
    }

    static async fromURL(url: string): Promise<AnimatedStyleImageCPU> {
        const response = await fetch(url);
        const type = response.headers.get('content-type');
        if (!type) throw new Error(`${url} was served with no content-type.`);
        const decoder = new ImageDecoder({data: await response.arrayBuffer(), type});
        try {
            await decoder.tracks.ready;
            await decoder.completed;
            const frameCount = decoder.tracks.selectedTrack?.frameCount;
            if (!frameCount) throw new Error(`${url} decoded to no frames.`);

            const frames: Frame[] = [];
            for (let i = 0; i < frameCount; i++) {
                const {image} = await decoder.decode({frameIndex: i});
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = image.displayWidth;
                    canvas.height = image.displayHeight;
                    const context = canvas.getContext('2d', {willReadFrequently: true});
                    if (!context) throw new Error('Could not create a 2d canvas context to convert a decoded frame.');
                    context.drawImage(image, 0, 0);
                    frames.push({
                        width: image.displayWidth,
                        height: image.displayHeight,
                        data: context.getImageData(0, 0, image.displayWidth, image.displayHeight).data,
                        duration: (image.duration ?? 0) / 1000,
                    });
                } finally {
                    image.close();
                }
            }
            return new AnimatedStyleImageCPU(frames);
        } finally {
            decoder.close();
        }
    }

    onAdd(map: Map): void {
        this._map = map;
    }

    render(): boolean {
        // This is what the "add an animated icon" example does: keep the map repainting for as
        // long as the icon is on it. An image on this path has no way to ask for a single frame.
        this._map?.triggerRepaint();

        let remaining = this._totalDuration > 0 ? now() % this._totalDuration : 0;
        let index = this._frames.length - 1;
        for (const [i, frame] of this._frames.entries()) {
            if (remaining < frame.duration) {
                index = i;
                break;
            }
            remaining -= frame.duration;
        }

        if (index === this._index) return false;
        this._index = index;
        this.data.set(this._frames[index].data);
        return true;
    }
}
