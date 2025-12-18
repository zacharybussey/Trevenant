// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Trevenant Damage Calculator', () => {
  test('loads the homepage', async ({ page }) => {
    await page.goto('/');

    // Check the title contains Trevenant
    await expect(page).toHaveTitle(/Trevenant/i);
  });

  test('displays main calculator interface', async ({ page }) => {
    await page.goto('/');

    // Wait for the app to load - look for the Weather label which is always visible
    await expect(page.locator('text=Weather')).toBeVisible();

    // Check that Format selector exists
    await expect(page.locator('text=Format')).toBeVisible();

    // Check that Terrain selector exists
    await expect(page.locator('text=Terrain')).toBeVisible();
  });

  test('format selector works', async ({ page }) => {
    await page.goto('/');

    // Find the format selector by its label
    const formatSelect = page.locator('.form-control:has-text("Format") select');
    await expect(formatSelect).toBeVisible();

    // Default should be Singles
    await expect(formatSelect).toHaveValue('Singles');

    // Switch to Doubles
    await formatSelect.selectOption('Doubles');
    await expect(formatSelect).toHaveValue('Doubles');

    // Switch back to Singles
    await formatSelect.selectOption('Singles');
    await expect(formatSelect).toHaveValue('Singles');
  });

  test('weather selector works', async ({ page }) => {
    await page.goto('/');

    // Find the weather selector by its label
    const weatherLabel = page.locator('text=Weather');
    await expect(weatherLabel).toBeVisible();

    // Get the select that follows the Weather label
    const weatherSelect = page.locator('label:has-text("Weather") + select, label:has-text("Weather") ~ select').first();

    // If that doesn't work, try finding by the w-28 class near Weather label
    const weatherSelectAlt = page.locator('.form-control:has-text("Weather") select');

    // Try the alternative selector
    await expect(weatherSelectAlt).toBeVisible();

    // Select Sun
    await weatherSelectAlt.selectOption('Sun');

    // Verify Sun is now selected
    await expect(weatherSelectAlt).toHaveValue('Sun');
  });

  test('terrain selector works', async ({ page }) => {
    await page.goto('/');

    // Find the terrain selector
    const terrainSelect = page.locator('.form-control:has-text("Terrain") select');
    await expect(terrainSelect).toBeVisible();

    // Select Electric terrain
    await terrainSelect.selectOption('Electric');

    // Verify Electric is now selected
    await expect(terrainSelect).toHaveValue('Electric');
  });

  test('shows initial calculator state', async ({ page }) => {
    await page.goto('/');

    // The app should show a message when no Pokemon are selected
    // OR it might show damage results if defaults are loaded
    const hasMessage = await page.locator('text=Select Pokemon').isVisible().catch(() => false);
    const hasResults = await page.locator('.card').count() > 0;

    // At least one of these should be true
    expect(hasMessage || hasResults).toBeTruthy();
  });
});
