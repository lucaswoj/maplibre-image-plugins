# maplibre-image-plugins

Animated style image plugins for [MapLibre GL JS](https://github.com/maplibre/maplibre-gl-js), built on the public `StyleImageInterface` API. Any animated format the browser's `ImageDecoder` understands works: GIF, animated WebP, APNG, animated AVIF.

`AnimatedStyleImage` animates on the GPU: every frame is uploaded once, and advancing a frame is a single GPU-to-GPU copy into MapLibre's atlas. The map can go idle between frames.

```ts
import {AnimatedStyleImage} from 'maplibre-image-plugins';

map.addImage('spinner', await AnimatedStyleImage.fromURL('/spinner.gif'), {pixelRatio: 2});
```

Requires maplibre-gl >= 6.5, the first release with `StyleImageWebGLData` support.

## Developing

```
npm install
npm test
npm run fix
```

`@eslint/js` is pinned to `^9` because v10 requires eslint 10; bump the two together.
