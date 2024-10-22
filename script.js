function createTable(data) {
  const table = document.createElement('table');
  table.border = '1';
  const headerRow = document.createElement('tr');
  const headers = ['Name', 'Type', 'Amount of colors', 'Price', 'Image'];
  headers.forEach(headerText => {
    const header = document.createElement('th');
    header.textContent = headerText;
    headerRow.appendChild(header);
  });
  table.appendChild(headerRow);

  data.forEach(product => {
    const row = document.createElement('tr');
    Object.values(product).forEach(text => {
      const cell = document.createElement('td');
      if (text?.includes('http')) {
        const img = document.createElement('img');
        img.src = text;
        img.alt = 'Product Image';
        img.width = 100; // Set the desired width
        cell.appendChild(img);
      } else {
        cell.textContent = text;
      }
      row.appendChild(cell);
    });
    table.appendChild(row);
  });

  scrapeContainer.appendChild(table);
}

async function fetchData(api, url, devMode, maxPages) {
  try {
    const response = await fetch(api, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({url, devMode, maxPages})
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'An error occurred during scraping');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    messageBox.innerHTML = `Error: see console for more details`;
    console.log(`Error: ${error.message}`);
  } finally {
    document.body.style.cursor = 'default';
  }
}


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