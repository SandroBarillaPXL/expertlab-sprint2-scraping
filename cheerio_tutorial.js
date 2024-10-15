/* source:
https://serpapi.com/blog/web-scraping-in-javascript-complete-tutorial-for-beginner/#step-1-preparation */

const axios = require('axios');
const cheerio = require('cheerio');  // new addition

async function scrapeSite(keyword) {
	const url = `https://www.google.com/search?gl=us&q=${keyword}&tbm=isch`;
	const { data } = await axios.get(url);
	
	const $ = cheerio.load(data);

	const results = [];
	$('table.RntSmf').each((i, elem) => {
		const imgSrc = $(elem).find('img').attr('src');
		const text = $(elem).find('span:first-child').text();
		results.push({ imgSrc, text });
	});

	return results;
}

const keyword = "coffee"; // change with any keyword you want

scrapeSite(keyword).then(result => {
        console.log(result)
    }).catch(err => console.log(err));