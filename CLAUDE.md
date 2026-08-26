# maplibre-image-plugins

- `docs/plugins.mjs` is gitignored build output. After editing `src/`, run
  `npm run build-site` or the demo page keeps serving the old bundle.
- `esbuild --serve` exits as soon as stdin closes, so it dies when run as a
  background task. Use `python3 -m http.server` to serve `docs/` in the background.
- The Playwright integration test can flake on `hasImage('spinner')`; rerun once
  before digging in.
