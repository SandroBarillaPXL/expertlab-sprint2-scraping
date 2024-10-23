import { fetchData, createTable } from "./puppeteer_torfs.js";

const api = "http://localhost:3000/api/scrape";
const submitBtn = document.getElementById('submitBtn');
const devModeCheckbox = document.getElementById('devMode');  
const scrapeContainer = document.getElementById('scrapeContainer');
const urlInput = document.getElementById('url');
const maxPagesInput = document.getElementById('maxPages');
const messageBox = document.getElementById('messageBox');

submitBtn.addEventListener('click', async () => {
  event.preventDefault();
  scrapeContainer.innerHTML = '';
  messageBox.innerHTML = '';
  const url = urlInput.value;
  const devMode = devModeCheckbox.checked;
  const maxPages = maxPagesInput.value - 1;
  if (!url) {
    messageBox.innerHTML = 'Please enter a URL';
    return;
  }
  messageBox.innerHTML = 'Scraping page... please hold';
  document.body.style.cursor = 'wait';
  const items = await fetchData(api, url, devMode, maxPages);
  messageBox.innerHTML = `Successfully scraped <b>${items.length}</b> products`;
  createTable(items);
});

devModeCheckbox.addEventListener('change', () => {
  maxPages.style.visibility = devModeCheckbox.checked ? 'visible' : 'hidden';
});