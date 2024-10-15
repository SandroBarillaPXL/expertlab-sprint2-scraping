const axios = require('axios');
const cheerio = require('cheerio');  // new addition
const fs = require('fs');
const path = require('path');

async function scrapeSite(subpage) {
	const url = `https://www.torfs.be/nl/${subpage}`;
	const { data } = await axios.get(url);
	
	const $ = cheerio.load(data);

    const outputPath = path.join(__dirname, 'cheerio_torfs_output.html');
    fs.writeFileSync(outputPath, $.html(), 'utf8');

	return data;
}

const subpage = "jongens/schoenen/sneakers/"; // change with any subpage you want

scrapeSite(subpage).then(result => {
        console.log(result)
    }).catch(err => console.log(err));