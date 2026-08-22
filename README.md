# maplibre-image-plugins

Animated style image plugins for [MapLibre GL JS](https://github.com/maplibre/maplibre-gl-js), built on the public `StyleImageInterface` API. Any animated format the browser's `ImageDecoder` understands works: GIF, animated WebP, APNG, animated AVIF.

`AnimatedStyleImage` animates on the GPU: every frame is uploaded once, and advancing a frame is a single GPU-to-GPU copy into MapLibre's atlas. The map can go idle between frames.

`PulsingDotStyleImage` is a pulsing location dot drawn entirely by a fragment shader, with no image asset or per-frame pixel upload. Size, colors, proportions, and pulse speed are all configurable.

```ts
map.addImage('location', new PulsingDotStyleImage({color: 'tomato', size: 150}), {pixelRatio: 2});
```

```ts
import {AnimatedStyleImage} from 'maplibre-image-plugins';

map.addImage('spinner', await AnimatedStyleImage.fromURL('/spinner.gif'), {pixelRatio: 2});
```

Requires maplibre-gl >= 6.5, the first release with `StyleImageWebGLData` support.

Both plugins wake the map on a timer and let it rest between animation frames. On maplibre-gl 6.5 and older, each frame still drags a ~300 ms tail of extra renders out of the symbol placement machinery, unless the map is created with `fadeDuration: 0`. [maplibre-gl-js#8208](https://github.com/maplibre/maplibre-gl-js/pull/8208) removes the tail; once it ships, the map idles between frames with no configuration.

## Demo site

`docs/` is a GitHub Pages site showing both plugins, with Tweakpane controls for the pulsing dot and a live renders-and-idles overlay. `npm run build-site` rebuilds its plugin bundle and vendored dependencies; preview with any static server, e.g. `python3 -m http.server --directory docs`.

## Developing

```
npm install
npm test
npm run fix
```

`@eslint/js` is pinned to `^9` because v10 requires eslint 10; bump the two together.

`bench/` measures the pulsing dot against a maplibre build: build `bench/plugins.mjs` with the esbuild command in `bench/index.html`, serve the parent folder of this repo, and open the page with `?maplibre=npm` or `?maplibre=local` (a sibling `maplibre-gl-js` checkout's `dist`). At the floor, frames, renders, and idles per second are all 30. Note the maplibre ESM dist has no default export; import `{Map}` by name.
