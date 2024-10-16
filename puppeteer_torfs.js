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

  await page.evaluate(() => {
    const button = document.querySelector(".btn.btn-primary.px-5");
    if (button) {
      button.scrollIntoView({ behavior: 'smooth', block: 'center' });
      button.click();
    }
  });
  console.log("Next page clicked using evaluate()");
  

  //await browser.close();
};

listShoes();
