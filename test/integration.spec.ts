import {expect, test} from '@playwright/test';

import type {Map} from 'maplibre-gl';

declare global {
    // Augmenting the global Window only works through interface merging.
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Window {
        map: Map;
    }
}

test('the demo map loads both plugins, animates, and reaches idle', async ({page}) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await page.goto('/');
    await page.evaluate(() => new Promise((resolve) => window.map.once('idle', resolve)));

    expect(await page.evaluate(() => window.map.hasImage('location'))).toBe(true);
    expect(await page.evaluate(() => window.map.hasImage('spinner'))).toBe(true);

    // The pulsing dot has a 2 s period, so two captures 500 ms apart must differ.
    const canvas = page.locator('.maplibregl-canvas');
    const before = await canvas.screenshot();
    await page.waitForTimeout(500);
    const after = await canvas.screenshot();
    expect(after.equals(before)).toBe(false);

    expect(errors).toEqual([]);
});
