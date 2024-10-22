import scrapePage from "./puppeteer_torfs.js";
import express from "express";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors()); 
app.use(express.json());

app.post("/api/scrape", async (req, res) => {
  try {
    const url = req.body.url;
    const devMode = req.body.devMode;
    const data = await scrapePage(url, devMode);
    res.json(data);
  } catch (error) {
    res.status(500).send("Error scraping page");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});