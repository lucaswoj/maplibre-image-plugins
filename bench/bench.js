import {Map} from 'maplibre-gl';

import {PulsingDotStyleImage} from './plugins.mjs';

const params = new URLSearchParams(location.search);
const seconds = Number(params.get('seconds') ?? 8);

const map = new Map({
    container: 'map',
    style: {
        version: 8,
        sources: {
            point: {type: 'geojson', data: {type: 'Feature', geometry: {type: 'Point', coordinates: [0, 0]}}},
        },
        layers: [],
    },
});

const dot = new PulsingDotStyleImage();

// Count the frames the dot reports as changed, from the outside, so the plugin itself stays
// exactly what ships.
let frames = 0;
const dotRender = dot.render.bind(dot);
dot.render = () => {
    const updated = dotRender();
    if (updated) frames++;
    return updated;
};

// Main-thread cost of each render pass, measured around the map's own `_render`.
let renderMs = 0;
const mapRender = map._render.bind(map);
map._render = (paintStartTimeStamp) => {
    const start = performance.now();
    mapRender(paintStartTimeStamp);
    renderMs += performance.now() - start;
};

window.__result = new Promise((resolve) => {
    map.on('load', () => {
        map.addImage('location', dot, {pixelRatio: 2});
        map.addLayer({id: 'dot', type: 'symbol', source: 'point', layout: {'icon-image': 'location'}});
        map.once('idle', () => {
            frames = 0;
            renderMs = 0;
            let renders = 0;
            let idles = 0;
            map.on('render', () => renders++);
            map.on('idle', () => idles++);
            const start = performance.now();
            setTimeout(() => {
                const elapsed = (performance.now() - start) / 1000;
                resolve({
                    build: params.get('maplibre') ?? 'local',
                    seconds: Number(elapsed.toFixed(1)),
                    framesPerSecond: Number((frames / elapsed).toFixed(1)),
                    rendersPerSecond: Number((renders / elapsed).toFixed(1)),
                    idlesPerSecond: Number((idles / elapsed).toFixed(1)),
                    renderMsPerSecond: Number((renderMs / elapsed).toFixed(2)),
                });
            }, seconds * 1000);
        });
    });
});
