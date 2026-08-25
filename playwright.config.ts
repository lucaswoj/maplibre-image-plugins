import {defineConfig} from '@playwright/test';

export default defineConfig({
    testDir: 'test',
    webServer: {
        command: 'npm run build-site && esbuild --servedir=docs --serve=127.0.0.1:8173',
        url: 'http://127.0.0.1:8173/',
        reuseExistingServer: true,
        timeout: 120000,
    },
    use: {baseURL: 'http://127.0.0.1:8173/'},
});
