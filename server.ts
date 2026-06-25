import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes FIRST
  app.get("/api/prices", async (req, res) => {
    try {
      const response = await fetch('https://api.binance.com/api/v3/ticker/price');
      if (!response.ok) throw new Error(`Binance returned status ${response.status}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.warn('Error fetching prices from Binance, returning mock fallback prices:', error.message || error);
      const fallbackData = [
        { symbol: "BTCUSDT", price: "96500.00" },
        { symbol: "ETHUSDT", price: "3450.00" },
        { symbol: "BNBUSDT", price: "612.50" },
        { symbol: "SOLUSDT", price: "182.20" },
        { symbol: "XRPUSDT", price: "1.12" },
        { symbol: "ADAUSDT", price: "0.58" },
        { symbol: "DOGEUSDT", price: "0.22" },
        { symbol: "AVAXUSDT", price: "28.50" },
        { symbol: "DOTUSDT", price: "6.10" },
        { symbol: "MATICUSDT", price: "0.52" },
        { symbol: "LINKUSDT", price: "18.40" },
        { symbol: "UNIUSDT", price: "7.80" },
        { symbol: "LTCUSDT", price: "84.30" }
      ];
      res.json(fallbackData);
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
