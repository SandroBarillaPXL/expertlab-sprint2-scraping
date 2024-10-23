import { fetchData, createTable } from "./functions.js";

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
  
  items = await fetchData(api, url, devMode, maxPages);
  clearInterval(timerInterval);
  const endTime = performance.now();
  const totalTimeTaken = ((endTime - startTime) / 1000).toFixed(3);
  messageBox.innerHTML = `Successfully scraped <b>${items.length}</b> products in <b>${totalTimeTaken}</b> seconds`;
  createTable(items);
  downloadBtn.style.visibility = 'visible';
});

downloadBtn.addEventListener('click', () => {
  const dataStr = JSON.stringify(items, null, 2); // Convert the items to a pretty-printed JSON string
  const blob = new Blob([dataStr], { type: 'application/json' }); // Create a blob for the JSON data
  const url = URL.createObjectURL(blob); // Create a URL for the blob
  const a = document.createElement('a'); // Create a temporary link element
  a.href = url;
  a.download = 'scraped-items.json'; // Name of the downloaded file
  document.body.appendChild(a); // Append the link to the DOM
  a.click(); // Programmatically click the link to trigger download
  document.body.removeChild(a); // Remove the link from the DOM
  URL.revokeObjectURL(url); // Revoke the URL after download
  /* source:
  https://chatgpt.com/share/6718fef5-8b2c-8009-ad24-afc78a75db24 */
});

devModeCheckbox.addEventListener('change', () => {
  maxPages.style.visibility = devModeCheckbox.checked ? 'visible' : 'hidden';
});