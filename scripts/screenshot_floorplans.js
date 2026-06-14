const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const fs = require('fs');
const path = require('path');

const APARTMENTS_FILE = path.join(__dirname, '../src/data/apartments.json');
const SCREENSHOTS_DIR = path.join(__dirname, '../screenshots');

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  if (!fs.existsSync(SCREENSHOTS_DIR)){
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  console.log("Reading apartments.json...");
  let data = JSON.parse(fs.readFileSync(APARTMENTS_FILE, 'utf8'));
  
  console.log("Launching Puppeteer...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1280, height: 800 });

  let count = 0;
  
  for (let i = 0; i < data.length; i++) {
    const apt = data[i];
    if (apt.floorPlanImageUrl && apt.floorPlanImageUrl !== "") {
      const fileName = `${apt.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
      const filePath = path.join(SCREENSHOTS_DIR, fileName);
      
      if (!fs.existsSync(filePath)) {
        console.log(`[${count + 1}] Screenshotting floor plan for: ${apt.name}`);
        try {
          await page.goto(apt.floorPlanImageUrl, { waitUntil: 'networkidle2', timeout: 30000 });
          await page.screenshot({ path: filePath, fullPage: true });
          count++;
          await delay(1000);
        } catch (error) {
          console.log(`Failed to screenshot ${apt.name}: ${error.message}`);
        }
      }
    }
  }
  
  await browser.close();
  console.log(`Finished. Saved ${count} screenshots to ${SCREENSHOTS_DIR}.`);
}

main().catch(console.error);
