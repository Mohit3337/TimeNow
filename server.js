const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
var cors = require("cors");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

// Function to fetch the latest stories from Time.com
async function fetchLatestStories() {
  try {
    const { data } = await axios.get("https://time.com");
    const $ = cheerio.load(data);
    const latestStories = [];

    $(".latest-stories__item").each((index, element) => {
      if (index < 6) {
        const title = $(element).find("a").text().trim();
        const link = `https://time.com${$(element).find("a").attr("href")}`;
        const date = $(element)
          .find(".latest-stories__item-timestamp")
          .text()
          .trim();

        latestStories.push({ title, link, date });
      }
    });

    return latestStories;
  } catch (error) {
    console.error("Error fetching latest stories:", error);
    return [];
  }
}

// API endpoint to get the latest stories
app.get("/getTimeStories", async (req, res) => {
  try {
    const stories = await fetchLatestStories();
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch latest stories" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
