import {Map} from 'maplibre-gl';
import {Pane} from './vendor/tweakpane.min.js';

import {AnimatedStyleImage, PulsingDotStyleImage} from './plugins.mjs';

const map = new Map({
    container: 'map',
    style: 'https://demotiles.maplibre.org/style.json',
    center: [-20, 35],
    zoom: 1.8,
    attributionControl: {compact: true},
    // Lets the map idle between animation frames on stock 6.5.0; unneeded once
    // maplibre-gl-js#8208 ships.
    fadeDuration: 0,
});

// The knobs mirror PulsingDotOptions. Every change builds a fresh dot, since the
// options are baked in at construction.
const options = {
    size: 120,
    color: '#1da1f2',
    strokeColor: '#ffffff',
    strokeWidth: 6,
    dotRadius: 17,
    haloColor: '#1da1f2',
    period: 2000,
};

function refreshDot() {
    if (map.hasImage('location')) map.removeImage('location');
    map.addImage('location', new PulsingDotStyleImage(options), {pixelRatio: 2});
}

const pane = new Pane({container: document.getElementById('pane'), title: 'PulsingDotStyleImage'});
pane.addBinding(options, 'size', {min: 20, max: 240, step: 1});
pane.addBinding(options, 'dotRadius', {min: 1, max: 80, step: 1});
pane.addBinding(options, 'strokeWidth', {min: 0, max: 30, step: 1});
pane.addBinding(options, 'color');
pane.addBinding(options, 'strokeColor');
pane.addBinding(options, 'haloColor');
pane.addBinding(options, 'period', {min: 200, max: 8000, step: 100});
pane.on('change', refreshDot);

// Main-thread cost of each render pass, measured around the map's own `_render`.
// CPU submission time only; GPU time is unmeasured.
let renders = 0;
let idles = 0;
let renderMs = 0;
const mapRender = map._render.bind(map);
map._render = (paintStartTimeStamp) => {
    const start = performance.now();
    mapRender(paintStartTimeStamp);
    renderMs += performance.now() - start;
};
map.on('render', () => renders++);
map.on('idle', () => idles++);

const stats = document.getElementById('stats');
let spinnerNote = '';
setInterval(() => {
    stats.textContent =
        `renders/s  ${String(renders).padStart(4)}\n` +
        `idles/s    ${String(idles).padStart(4)}\n` +
        `render ms  ${(renders ? renderMs / renders : 0).toFixed(2).padStart(4)}` +
        spinnerNote;
    renders = 0;
    idles = 0;
    renderMs = 0;
}, 1000);

map.on('load', async () => {
    refreshDot();
    map.addSource('location', {
        type: 'geojson',
        data: {type: 'Feature', geometry: {type: 'Point', coordinates: [-0.1, 51.5]}},
    });
    map.addLayer({
        id: 'location',
        type: 'symbol',
        source: 'location',
        layout: {'icon-image': 'location', 'icon-allow-overlap': true},
    });

    try {
        map.addImage('spinner', await AnimatedStyleImage.fromURL('./spinner.gif'), {pixelRatio: 2});
        map.addSource('spinners', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: [
                    [-74, 40.7],
                    [-43.2, -22.9],
                    [18.4, -33.9],
                    [77.2, 28.6],
                    [151.2, -33.9],
                ].map((coordinates) => ({type: 'Feature', geometry: {type: 'Point', coordinates}})),
            },
        });
        map.addLayer({
            id: 'spinners',
            type: 'symbol',
            source: 'spinners',
            layout: {'icon-image': 'spinner', 'icon-allow-overlap': true},
        });
    } catch (error) {
        // Firefox and Safari have no ImageDecoder yet; the pulsing dot still works there.
        spinnerNote = `\nspinner    unavailable: ${error.message}`;
    }
});
