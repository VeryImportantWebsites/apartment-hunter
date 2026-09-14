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
  const cleanName = apt.name.split(' - ')[0].trim();
  const cleanAddr = apt.address.split(',')[0].trim();
  
  const queries = [
    type === 'floorplan' 
      ? `"${cleanName}" "${cleanAddr}" floor plan` 
      : `"${cleanName}" "${cleanAddr}" interior luxury`,
    type === 'floorplan'
      ? `${cleanName} ${cleanAddr} floor plan layout`
      : `${cleanName} ${cleanAddr} apartment interior`,
    type === 'floorplan'
      ? `${cleanName} NYC floor plan`
      : `${cleanName} NYC luxury apartment`
  ];
  
  for (const query of queries) {
    const url = `https://images.search.yahoo.com/search/images?p=${encodeURIComponent(query)}`;
    
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
      await delay(1500, 3000);
      
      const images = await page.evaluate((numImages) => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs
          .map(img => img.src || img.getAttribute('data-src') || img.getAttribute('data-iurl'))
          .filter(src => src && (src.startsWith('http://') || src.startsWith('https://')))
          .filter(src => !src.includes('s.yimg.com') && !src.includes('images.search.yahoo.com') && !src.includes('clear.gif') && !src.includes('favicon'))
          .slice(0, numImages);
      }, type === 'floorplan' ? 1 : 3);
      
      if (images.length > 0) {
        return images;
      }
    } catch (error) {
      console.log(`Warning fetching query "${query}" for ${apt.name}: ${error.message}`);
    }
  }
  
  return [];
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
    
    // If it is missing real images or floor plan, fetch them.
    if (!apt.floorPlanImageUrl || !apt.images || apt.images.length === 0) {
      console.log(`[${updatedCount + 1}] Fetching data for: ${apt.name}`);
      let fetchedAny = false;
      if (!apt.floorPlanImageUrl) {
        const floorPlans = await fetchImagesForApartment(page, apt, 'floorplan');
        if (floorPlans.length > 0) {
          apt.floorPlanImageUrl = floorPlans[0];
          fetchedAny = true;
        }
      }
      
      if (!apt.images || apt.images.length === 0) {
        const interiorImages = await fetchImagesForApartment(page, apt, 'interior');
        if (interiorImages.length > 0) {
          apt.images = interiorImages;
          fetchedAny = true;
        }
      }
      
      if (fetchedAny) {
        apt.lastUpdated = new Date().toISOString();
        updatedCount++;
        fs.writeFileSync(APARTMENTS_FILE, JSON.stringify(data, null, 2));
      }
      
      await delay(1500, 3000);
    }
  }
  
  await browser.close();
  console.log(`Finished. Updated ${updatedCount} apartments with real online images via CDP.`);
}

main().catch(console.error);
