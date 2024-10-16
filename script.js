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

  document.getElementById('scrapeContainer').appendChild(table);
}

async function fetchData() {
  const response = await fetch('http://localhost:3000/api/scrape');
  const data = await response.json();
  createTable(data);
}

document.addEventListener("DOMContentLoaded", function() {
  fetchData();
});