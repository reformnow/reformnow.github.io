const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('pageerror', e => {
    console.log('--- ERROR LOG ---');
    console.log(e.message);
    console.log(e.stack);
  });
  
  await page.goto('https://reformnow.github.io/maps/tribes/', {waitUntil: 'networkidle0'});
  await browser.close();
})();
