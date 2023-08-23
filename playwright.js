require('dotenv').config();

const { chromium } = require('playwright');

(async () => {
    // Launch a browser instance (visible mode)
    const browser = await chromium.launch({ headless: false, args: ['--disable-blink-features=AutomationControlled' ] });

    // Open a new page
    const page = await browser.newPage();

    // Navigate to Gmail
    await page.goto('https://mail.google.com', { waitUntil: 'networkidle' });


    // Wait for and fill in the email address
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', process.env.EMAIL);
    await page.keyboard.press('Enter');

    // Wait for and fill in the password
    await page.waitForSelector('input[type="password"]', { visible: true });
    await page.type('input[type="password"]', process.env.PASSWORD);
    await page.keyboard.press('Enter');

// Wait for the "Не сейчас" button to appear
    const elementToClick = await page.waitForSelector('span[jsname="V67aGc"]', { timeout: 5000 }).catch(() => null);

    if (elementToClick) {
        // Click on the "Не сейчас" button
        await elementToClick.click();
    } else {
        // The element with selector 'V67aGc' was not found
        console.log("Element with selector 'V67aGc' not found.");
    }

    // Find and extract the unread count
    const pageTitle = await page.title();
    console.log(pageTitle)
    const matches = pageTitle.match(/\((\d+)\)/);
    if (matches) {
        const unreadCountText = matches[1];
        const unreadCount = parseInt(unreadCountText);
        console.log(`Number of unread emails: ${unreadCount}`);
    } else {
        console.log("Not found");
    }

    // Close the browser
    await browser.close();
})();

