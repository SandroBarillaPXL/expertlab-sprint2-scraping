import scrapePage from "./puppeteer_torfs.js";
import express from "express";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors()); 

app.get("/api/scrape", async (req, res) => {
  try {
    const data = await scrapePage();
    res.json(data);
  } catch (error) {
    res.status(500).send("Error scraping page");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});