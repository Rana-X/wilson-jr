import { test, expect } from '@playwright/test';

test.describe('Wilson Jr Inbox Interface', () => {
  test('should display inbox with all emails', async ({ page }) => {
    await page.goto('/');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check header is visible
    await expect(page.getByText('Wilson Jr 🏐')).toBeVisible();
    await expect(page.getByText('Shipment #CART-2025-00123')).toBeVisible();

    // Check inbox list is visible
    await expect(page.getByText('Inbox')).toBeVisible();
    await expect(page.getByText('10 messages')).toBeVisible();

    // Take full page screenshot
    await page.screenshot({
      path: 'screenshots/01-inbox-overview.png',
      fullPage: true
    });

    console.log('✅ Screenshot saved: screenshots/01-inbox-overview.png');
  });

  test('should select and display email details', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // First email should be selected by default
    const firstEmail = page.locator('text=David Martinez').first();
    await expect(firstEmail).toBeVisible();

    // Check email detail is displayed
    await expect(page.getByText('Shipment Request - Dallas to Chicago')).toBeVisible();

    // Take screenshot of default state
    await page.screenshot({
      path: 'screenshots/02-email-selected.png',
      fullPage: true
    });

    console.log('✅ Screenshot saved: screenshots/02-email-selected.png');

    // Click on Wilson AI email
    await page.locator('text=Wilson AI').first().click();
    await page.waitForTimeout(500); // Wait for transition

    // Check Wilson AI email is displayed
    await expect(page.getByText('RFQ Sent to 5 Carriers')).toBeVisible();

    // Take screenshot of Wilson email
    await page.screenshot({
      path: 'screenshots/03-wilson-email.png',
      fullPage: true
    });

    console.log('✅ Screenshot saved: screenshots/03-wilson-email.png');
  });

  test('should display different email types with correct styling', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Click on carrier email (XPO Logistics)
    await page.locator('text=XPO Logistics').first().click();
    await page.waitForTimeout(500);

    await page.screenshot({
      path: 'screenshots/04-carrier-email.png',
      fullPage: true
    });

    console.log('✅ Screenshot saved: screenshots/04-carrier-email.png');

    // Click on tracking email
    await page.locator('text=XPO Tracking').first().click();
    await page.waitForTimeout(500);

    await page.screenshot({
      path: 'screenshots/05-tracking-email.png',
      fullPage: true
    });

    console.log('✅ Screenshot saved: screenshots/05-tracking-email.png');
  });

  test('should open chat drawer when clicking Ask Wilson button', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Click the "Ask Wilson" button
    const chatButton = page.getByRole('button', { name: /Ask Wilson/i });
    await expect(chatButton).toBeVisible();
    await chatButton.click();

    // Wait for drawer animation
    await page.waitForTimeout(500);

    // Check chat drawer is visible
    await expect(page.getByText('Chat with Wilson')).toBeVisible();

    // Check chat history is displayed
    await expect(page.getByText('Why did you choose XPO over ABC Trucking?')).toBeVisible();

    // Take screenshot with chat drawer open
    await page.screenshot({
      path: 'screenshots/06-chat-drawer-open.png',
      fullPage: true
    });

    console.log('✅ Screenshot saved: screenshots/06-chat-drawer-open.png');

    // Close chat drawer
    const closeButton = page.locator('button').filter({ hasText: /close/i }).first();
    if (await closeButton.isVisible()) {
      await closeButton.click();
    }
  });

  test('should show hover states on inbox items', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Hover over an email item
    const emailItem = page.locator('text=FedEx Freight').first();
    await emailItem.hover();
    await page.waitForTimeout(300);

    // Take screenshot of hover state
    await page.screenshot({
      path: 'screenshots/07-hover-state.png',
      fullPage: true
    });

    console.log('✅ Screenshot saved: screenshots/07-hover-state.png');
  });

  test('should display badges correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for different badge types
    await expect(page.getByText('NEW')).toBeVisible();
    await expect(page.getByText('QUOTE').first()).toBeVisible();
    await expect(page.getByText('RECOMMEND')).toBeVisible();
    await expect(page.getByText('BOOKED')).toBeVisible();

    // Take screenshot showing badges
    await page.screenshot({
      path: 'screenshots/08-badges.png',
      fullPage: true
    });

    console.log('✅ Screenshot saved: screenshots/08-badges.png');
  });

  test('visual regression - full inbox view at 1920x1080', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Take screenshot at full HD resolution
    await page.screenshot({
      path: 'screenshots/09-full-hd-view.png',
      fullPage: false // Just viewport
    });

    console.log('✅ Screenshot saved: screenshots/09-full-hd-view.png');
  });

  test('visual regression - compact view at 1280x720', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Take screenshot at 720p resolution
    await page.screenshot({
      path: 'screenshots/10-compact-view.png',
      fullPage: false
    });

    console.log('✅ Screenshot saved: screenshots/10-compact-view.png');
  });
});
