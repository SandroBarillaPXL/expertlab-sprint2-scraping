import puppeteer from "puppeteer";

const scrapePage = async (url, devMode) => {
  console.log("Scraping page:", url);
  const browser = await puppeteer.launch({
    headless: true
  });

  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: "domcontentloaded"
  });

  const cookieBtn = await page.$("#onetrust-reject-all-handler");
  if (cookieBtn) {
    await cookieBtn.click();
  }

  const maxAttempts = devMode ? 2 : Infinity;
  let attempt = 0;
  while (attempt < maxAttempts) {
    // Wait for the next button to appear
    const nextButton = await page.$(".btn.btn-primary.px-5");
    if (!nextButton) {
      console.log("No more next button available, stopping the loop.");
      break;
    }

    // Use evaluate method to scroll into view and click the next button
    await page.evaluate(() => {
      const nextButton = document.querySelector(".btn.btn-primary.px-5");
      if (nextButton) {
        nextButton.scrollIntoView();
        nextButton.click();
      }
    });
    
    // Wait for navigation or changes after clicking the next button
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

    attempt++;
  }

  const productDetails = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.product-tile')).map(product => {
      return {
        name: product.querySelector('.pdp-link > a')?.textContent.trim(),
        type: product.querySelector('.brand > a')?.textContent.trim(),
        amountOfColors: product.querySelector('.product-tile__color-amount')?.textContent.trim(),
        price: product.querySelector('.value')?.textContent.trim(),
        imageUrl: product.querySelector('.tile-image')?.getAttribute('data-src') 
                  || product.querySelector('.tile-image')?.getAttribute('src')
      };
    });
  });
  
  await browser.close();
  return productDetails;
};

export default scrapePage;