import { fetchData, createTable } from "./functions.js";

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
  const startTime = performance.now();
  let elapsedTime = 0;
  const timerInterval = setInterval(() => {
    elapsedTime = ((performance.now() - startTime) / 1000).toFixed(3);
    messageBox.innerHTML = `Scraping page... please hold <i>(${elapsedTime} seconds elapsed)</i>`;
  }, 100);
  
  const items = await fetchData(api, url, devMode, maxPages);
  clearInterval(timerInterval);
  const endTime = performance.now();
  const totalTimeTaken = ((endTime - startTime) / 1000).toFixed(3);
  messageBox.innerHTML = `Successfully scraped <b>${items.length}</b> products in <b>${totalTimeTaken}</b> seconds`;
  createTable(items);
});

devModeCheckbox.addEventListener('change', () => {
  maxPages.style.visibility = devModeCheckbox.checked ? 'visible' : 'hidden';
});