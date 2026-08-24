// server/index.ts
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var ratingsCache = null;
var CACHE_DURATION = 6 * 60 * 60 * 1e3;
async function scrapeGoogleRating() {
  try {
    const response = await axios.get(
      "https://www.google.com/search?q=laserman+australia",
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        },
        timeout: 1e4
      }
    );
    const html = response.data;
    const ratingMatch = html.match(
      /(\d\.\d)\s*(?:out of|\/)\s*5/i
    );
    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : 4.8;
    const reviewsMatch = html.match(/(\d+)\s*reviews/i);
    const reviews = reviewsMatch ? parseInt(reviewsMatch[1]) : 28;
    console.log(`[Ratings] Scraped: ${rating}/5 (${reviews} reviews)`);
    return { rating, reviews };
  } catch (error) {
    console.error("Error scraping Google rating:", error);
    return { rating: 4.8, reviews: 28 };
  }
}
async function getRating() {
  const now = Date.now();
  if (ratingsCache && now - ratingsCache.timestamp < CACHE_DURATION) {
    return { rating: ratingsCache.rating, reviews: ratingsCache.reviews };
  }
  const data = await scrapeGoogleRating();
  ratingsCache = { ...data, timestamp: now };
  return data;
}
async function startServer() {
  const app = express();
  const server = createServer(app);
  const staticPath = process.env.NODE_ENV === "production" ? path.resolve(__dirname, "public") : path.resolve(__dirname, "..", "dist", "public");
  app.use(express.static(staticPath));
  app.get("/api/ratings", async (_req, res) => {
    try {
      const data = await getRating();
      res.json(data);
    } catch (error) {
      console.error("Error fetching ratings:", error);
      res.status(500).json({ rating: 4.8, reviews: 28 });
    }
  });
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
  const port = process.env.PORT || 3e3;
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
startServer().catch(console.error);
