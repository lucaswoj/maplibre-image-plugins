# maplibre-image-plugins

**[Live demo](https://lucaswoj.github.io/maplibre-image-plugins/)**: both plugins on a real map, with controls for the pulsing dot.

Animated style image plugins for [MapLibre GL JS](https://github.com/maplibre/maplibre-gl-js), built on the public `StyleImageInterface` API. Any animated format the browser's `ImageDecoder` understands works: GIF, animated WebP, APNG, animated AVIF.

Safari has no `ImageDecoder`, so there GIF alone works, decoded by [`modern-gif`](https://github.com/qq15725/modern-gif) loaded on demand. WebKit landed the WebCodecs image API in August 2026 ([bug 315546](https://bugs.webkit.org/show_bug.cgi?id=315546)), enabled by default, so the fallback can go once that ships. `modern-gif` is the one that returns fully composited, uniform-size frames honouring disposal 0-3; `gifuct-js` and `omggif` return patches and leave the compositing to you, and `decode-gif` gets it wrong by allocating a fresh zeroed buffer per frame.

`AnimatedStyleImage` animates on the GPU: every frame is uploaded once, and advancing a frame is a single GPU-to-GPU copy into MapLibre's atlas. The map can go idle between frames.

`PulsingDotStyleImage` is a pulsing location dot drawn entirely by a fragment shader, with no image asset or per-frame pixel upload. The dot, stroke, and halo each take a radius and a color, and the pulse speed is configurable.

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

## Demo site

`docs/` is a GitHub Pages site showing both plugins, with Tweakpane controls for the pulsing dot and a live renders-and-idles overlay, published at [lucaswoj.github.io/maplibre-image-plugins](https://lucaswoj.github.io/maplibre-image-plugins/).

Only the hand-written sources are committed. `npm run build-site` generates the rest, `docs/plugins.mjs`, `docs/chunks/`, and `docs/vendor/`, all of which are gitignored, so run it once after cloning or nothing loads. Preview with any static server, e.g. `python3 -m http.server --directory docs`. `.github/workflows/pages.yml` runs the same build on every push to `main` and publishes the result, so the live site can never serve a stale bundle.

The build uses `--splitting` so the GIF decoder lands in a lazy chunk under `docs/chunks/` instead of inflating `docs/plugins.mjs`; esbuild inlines a dynamic import when splitting is off.

## Developing

```
npm install
npm test
npm run fix
```

`npm run test-integration` drives the demo site with Playwright: it builds `docs/`, serves it with esbuild, and checks that both plugins load, the canvas animates, and the map reaches `idle`. Run `npx playwright install chromium` once first. It fetches the demotiles style from the network.

`@eslint/js` is pinned to `^9` because v10 requires eslint 10; bump the two together.

`bench/` measures the pulsing dot against a maplibre build: build `bench/plugins.mjs` with the esbuild command in `bench/index.html`, serve the parent folder of this repo, and open the page with `?maplibre=npm` or `?maplibre=local` (a sibling `maplibre-gl-js` checkout's `dist`). At the floor, frames, renders, and idles per second are all 30. Note the maplibre ESM dist has no default export; import `{Map}` by name.
