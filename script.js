function createTable(data) {
  const table = document.createElement('table');
  table.border = '1';
  const headerRow = document.createElement('tr');
  const headers = ['Name', 'Type', 'Amount of Colors', 'Price', 'Image URL'];
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

async function fetchData(api, url, devMode) {
  const response = await fetch(api, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({url, devMode})
    });
  const data = await response.json();
  messageBox.innerHTML = data.error ? data.error : 'Successfully scraped <b>' + data.length + '</b> products';
  createTable(data);
}

const api = "http://localhost:3000/api/scrape";
const submitBtn = document.getElementById('submitBtn');
const devModeCheckbox = document.getElementById('devMode');  
const scrapeContainer = document.getElementById('scrapeContainer');
const messageBox = document.getElementById('messageBox');

submitBtn.addEventListener('click', () => {
  event.preventDefault();
  scrapeContainer.innerHTML = '';
  messageBox.innerHTML = '';
  const url = document.getElementById("url").value;
  const devMode = devModeCheckbox.checked;
  fetchData(api, url, devMode);
});