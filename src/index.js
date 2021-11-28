const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  
  await page.goto('https://arthurdiluz.github.io/')
  await page.screenshot({ path: './src/screenshots/portfolio.png'})

  await browser.close()
})();
