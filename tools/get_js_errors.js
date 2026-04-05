const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.error('PAGE ERROR:', error));

  try {
    await page.goto('http://127.0.0.1:4000/maps/tribes/', { waitUntil: 'networkidle0' });
    console.log("Page loaded successfully.");
  } catch (e) {
    console.error("Navigation error:", e);
  }

  await browser.close();
})();
