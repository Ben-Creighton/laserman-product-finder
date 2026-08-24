import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cache for Google ratings (update every 6 hours)
let ratingsCache: { rating: number; reviews: number; timestamp: number } | null = null;
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

async function scrapeGoogleRating(): Promise<{ rating: number; reviews: number }> {
  try {
    const response = await axios.get(
      "https://www.google.com/search?q=laserman+australia",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
        timeout: 10000,
      }
    );

    const html = response.data;

    // Extract rating (look for pattern like "4.8" in rating snippets)
    const ratingMatch = html.match(
      /(\d\.\d)\s*(?:out of|\/)\s*5/i
    );
    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : 4.8;

    // Extract review count (look for "X reviews" or similar)
    const reviewsMatch = html.match(/(\d+)\s*reviews/i);
    const reviews = reviewsMatch ? parseInt(reviewsMatch[1]) : 28;

    console.log(`[Ratings] Scraped: ${rating}/5 (${reviews} reviews)`);
    return { rating, reviews };
  } catch (error) {
    console.error("Error scraping Google rating:", error);
    // Fall back to correct values if scraping fails
    return { rating: 4.8, reviews: 28 };
  }
}

async function getRating(): Promise<{ rating: number; reviews: number }> {
  const now = Date.now();

  // Return cached value if still fresh
  if (ratingsCache && now - ratingsCache.timestamp < CACHE_DURATION) {
    return { rating: ratingsCache.rating, reviews: ratingsCache.reviews };
  }

  // Fetch fresh data
  const data = await scrapeGoogleRating();

  // Update cache
  ratingsCache = { ...data, timestamp: now };

  return data;
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // API endpoint to get Google ratings
  app.get("/api/ratings", async (_req, res) => {
    try {
      const data = await getRating();
      res.json(data);
    } catch (error) {
      console.error("Error fetching ratings:", error);
      res.status(500).json({ rating: 4.8, reviews: 28 });
    }
  });

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
