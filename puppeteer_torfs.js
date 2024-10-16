import puppeteer from "puppeteer";

const listShoes = async () => {
  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();

  await page.goto("https://www.torfs.be/nl/jongens/schoenen/sneakers/", {
    waitUntil: "domcontentloaded"
  });

  const cookieBtn = await page.$("#onetrust-reject-all-handler");
  if (cookieBtn) {
    await cookieBtn.click();
  }

  let attempt = 0;
  while (true) {
    // Wait for the next button to appear
    const nextButton = await page.$(".btn.btn-primary.px-5");
    if (!nextButton) {
      console.log("No more next button available, stopping the loop.");
      break;
    }

    console.log(`Next button is visible - Attempt ${attempt + 1}`);

    // Use evaluate method to scroll into view and click the next button
    await page.evaluate(() => {
      const nextButton = document.querySelector(".btn.btn-primary.px-5");
      if (nextButton) {
        nextButton.scrollIntoView();
        nextButton.click();
      }
    });
    console.log(`Next page clicked using evaluate method - Attempt ${attempt + 1}`);

    // Wait for navigation or changes after clicking the next button
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    console.log(`Navigation to next page completed - Attempt ${attempt + 1}`);

    attempt++;
  }

  //await browser.close();
};

listShoes();
