# maplibre-image-plugins

**[Live demo](https://lucaswoj.github.io/maplibre-image-plugins/)**: both plugins on a real map, with controls for the pulsing dot.

Animated style image plugins for [MapLibre GL JS](https://github.com/maplibre/maplibre-gl-js), built on the public `StyleImageInterface` API. Any animated format the browser's `ImageDecoder` understands works: GIF, animated WebP, APNG, animated AVIF.

`AnimatedStyleImage` animates on the GPU: every frame is uploaded once, and advancing a frame is a single GPU-to-GPU copy into MapLibre's atlas. The map can go idle between frames.

`PulsingDotStyleImage` is a pulsing location dot drawn entirely by a fragment shader, with no image asset or per-frame pixel upload. The dot, stroke, and halo each take a radius and a color, and the pulse speed is configurable.

Safari has no `ImageDecoder`, so only GIF works there, decoded by [`modern-gif`](https://github.com/qq15725/modern-gif) loaded on demand. WebKit landed the WebCodecs image API in August 2026 ([bug 315546](https://bugs.webkit.org/show_bug.cgi?id=315546)), enabled by default, so the fallback can go once that ships.

## Getting started

```
npm install maplibre-image-plugins
```

maplibre-gl >= 6.5, the first release with `StyleImageWebGLData` support, is a peer dependency.

```ts
import {AnimatedStyleImage, PulsingDotStyleImage} from 'maplibre-image-plugins';

map.addImage('location', new PulsingDotStyleImage({dotColor: 'tomato', haloRadius: 75}), {pixelRatio: 2});
map.addImage('spinner', await AnimatedStyleImage.fromURL('/spinner.gif'), {pixelRatio: 2});
```

Without a bundler, everything loads from unpkg. The import map resolves the package's `maplibre-gl` import plus the GIF decoder it lazy-loads on browsers without `ImageDecoder`:

```html
<script type="importmap">
    {
        "imports": {
            "maplibre-gl": "https://unpkg.com/maplibre-gl@^6.5.0/dist/maplibre-gl.mjs",
            "modern-gif": "https://unpkg.com/modern-gif@^2.1.0/dist/index.mjs",
            "modern-palette": "https://unpkg.com/modern-palette@^2.0.0/dist/index.mjs"
        }
    }
</script>
<script type="module">
    import {PulsingDotStyleImage} from 'https://unpkg.com/maplibre-image-plugins@^0.1.0/dist/index.js';
</script>
```

Both plugins wake the map on a timer and let it rest between animation frames. On releases without [maplibre-gl-js#8208](https://github.com/maplibre/maplibre-gl-js/pull/8208) (unmerged as of maplibre-gl 6.6), each frame drags a ~300 ms tail of extra renders out of the symbol placement machinery unless the map is created with `fadeDuration: 0`. On releases that include it, the map idles between frames with no configuration.

## Developing

```
npm install
npm test
npm run fix
```
