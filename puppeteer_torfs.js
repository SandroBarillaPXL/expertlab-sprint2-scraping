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

  for (let i = 0; i < 5; i++) {
    // Wait for the next button to appear
    await page.waitForSelector(".btn.btn-primary.px-5", { visible: true, timeout: 10000 });
    console.log(`Next button is visible - Attempt ${i + 1}`);

    // Use evaluate method to scroll into view and click the next button
    await page.evaluate(() => {
      const nextButton = document.querySelector(".btn.btn-primary.px-5");
      if (nextButton) {
        nextButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
        nextButton.click();
      }
    });
    console.log(`Next page clicked using evaluate method - Attempt ${i + 1}`);

    // Wait for navigation or changes after clicking the next button
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    console.log(`Navigation to next page completed - Attempt ${i + 1}`);
  }

  //await browser.close();
};

listShoes();
