export function createTable(data) {
  const table = document.createElement('table');
  table.border = '1';
  const headerRow = document.createElement('tr');
  const headers = ['Item nr', 'Name', 'Type', 'Amount of colors', 'Price', 'Image', 'Link'];
  headers.forEach(headerText => {
    const header = document.createElement('th');
    header.textContent = headerText;
    headerRow.appendChild(header);
  });
  table.appendChild(headerRow);

  data.forEach((product, index) => {
    const row = document.createElement('tr');
    const itemNumberCell = document.createElement('td');
    itemNumberCell.textContent = index + 1;
    row.appendChild(itemNumberCell);

    Object.values(product).forEach(text => {
      const cell = document.createElement('td');
      if (text?.includes('image')) {
        const img = document.createElement('img');
        img.src = text;
        img.alt = 'Product Image';
        img.width = 100;
        cell.appendChild(img);
      } else if (text?.includes('https')) {
        const anchor = document.createElement('a');
        anchor.href = text;
        anchor.target = '_blank';
        anchor.textContent = 'Link';
        cell.appendChild(anchor);
      } else {
        cell.textContent = text;
      }
      row.appendChild(cell);
    });
    table.appendChild(row);
  });
  scrapeContainer.appendChild(table);
}
  
export async function fetchData(api, url, devMode, maxPages) {
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

export function downloadJSON(data) {
  const dataStr = JSON.stringify(data, null, 2); // Convert the items to a pretty-printed JSON string
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
}