import puppeteer from "puppeteer";

export default async function scrapePage(url, devMode, maxPages) {
  let browser;
  try {
    console.log("Scraping page:", url);
    browser = await puppeteer.launch({
      headless: true,
      args: ["--headless=old"]
    });

    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: "domcontentloaded"
    });

    const cookieBtn = await page.$("#onetrust-reject-all-handler");
    await cookieBtn?.click();

    let currentPageNr = 0;
    const limit = devMode ? maxPages : Infinity;
    while (currentPageNr < limit) {
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
      currentPageNr++;
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
    return productDetails;
  } catch (error) {
    console.error("An error occurred during scraping:", error.message);
    return error;
  } finally {
    await browser.close();
  }
};