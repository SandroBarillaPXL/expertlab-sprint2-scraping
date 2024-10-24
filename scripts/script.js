import { fetchData, createTable, downloadJSON } from "./functions.js";

const api = "http://localhost:3000/api/scrape";
const submitBtn = document.getElementById('submitBtn');
const devModeCheckbox = document.getElementById('devMode');  
const scrapeContainer = document.getElementById('scrapeContainer');
const urlInput = document.getElementById('url');
const maxPagesInput = document.getElementById('maxPages');
const messageBox = document.getElementById('messageBox');
const downloadBtn = document.getElementById('downloadBtn');
let items = [];

submitBtn.addEventListener('click', async () => {
  event.preventDefault();
  scrapeContainer.innerHTML = '';
  messageBox.innerHTML = '';
  downloadBtn.style.visibility = 'hidden';
  const url = urlInput.value;
  const devMode = devModeCheckbox.checked;
  const maxPages = maxPagesInput.value != "" ? maxPagesInput.value - 1 : 0;
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
  /* source:
  https://chatgpt.com/share/671915f4-08c8-8009-b1cb-102f55368e6e */
  
  items = await fetchData(api, url, devMode, maxPages);
  clearInterval(timerInterval);
  const endTime = performance.now();
  const totalTimeTaken = ((endTime - startTime) / 1000).toFixed(3);
  messageBox.innerHTML = `Successfully scraped <b>${items.length}</b> products in <b>${totalTimeTaken}</b> seconds`;
  createTable(items);
  downloadBtn.style.visibility = 'visible';
});

downloadBtn.addEventListener('click', () => {
  downloadJSON(items);
});

devModeCheckbox.addEventListener('change', () => {
  maxPages.style.visibility = devModeCheckbox.checked ? 'visible' : 'hidden';
});