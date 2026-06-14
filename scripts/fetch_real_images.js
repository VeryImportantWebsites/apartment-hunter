const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const fs = require('fs');
const path = require('path');

const APARTMENTS_FILE = path.join(__dirname, '../src/data/apartments.json');

async function delay(minMs, maxMs) {
  const ms = maxMs ? Math.floor(Math.random() * (maxMs - minMs + 1) + minMs) : minMs;
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchImagesForApartment(page, apt, type) {
  const query = type === 'floorplan' 
    ? `"${apt.name.split(' - ')[0]}" "${apt.address}" floor plan` 
    : `"${apt.name.split(' - ')[0]}" "${apt.address}" interior luxury`;
    
  const url = `https://images.search.yahoo.com/search/images?p=${encodeURIComponent(query)}`;
  
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await delay(2000, 4000);
    
    const images = await page.evaluate((numImages) => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs
        .map(img => img.src || img.getAttribute('data-src'))
        .filter(src => src && (src.startsWith('http') || src.startsWith('data:image')))
        .filter(src => !src.includes('s.yimg.com') && !src.includes('images.search.yahoo.com')) // exclude yahoo logos and search urls
        .slice(0, numImages);
    }, type === 'floorplan' ? 1 : 3);
    
    return images;
  } catch (error) {
    console.log(`Warning fetching ${type} for ${apt.name}: ${error.message}`);
    return [];
  }
}

async function main() {
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

  let updatedCount = 0;
  
  for (let i = 0; i < data.length; i++) {
    if (updatedCount >= 200) {
      console.log("Successfully fetched data for 200 apartments. Stopping.");
      break;
    }
    
    const apt = data[i];
    
    // If it already has real images, we skip it.
    if (!apt.floorPlanImageUrl) {
      console.log(`[${updatedCount + 1}/50] Fetching data for: ${apt.name}`);
      
      const floorPlans = await fetchImagesForApartment(page, apt, 'floorplan');
      if (floorPlans.length > 0) {
        apt.floorPlanImageUrl = floorPlans[0];
      }
      
      const interiorImages = await fetchImagesForApartment(page, apt, 'interior');
      if (interiorImages.length > 0) {
        apt.images = interiorImages;
      }
      
      if (floorPlans.length > 0 || interiorImages.length > 0) {
        apt.lastUpdated = new Date().toISOString();
        updatedCount++;
        fs.writeFileSync(APARTMENTS_FILE, JSON.stringify(data, null, 2));
      }
      
      await delay(3000, 6000);
    }
  }
  
  await browser.close();
  console.log(`Finished. Updated ${updatedCount} apartments with real online images via CDP.`);
}

main().catch(console.error);
