import type { Express } from "express";
import { createServer, type Server } from "http";
import fetch from "node-fetch";

const CAT_API_URL = "https://api.thecatapi.com/v1/images/search";

interface CatApiResponse {
  id: string;
  url: string;
  width: number;
  height: number;
}

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);

  // Add CORS headers for development
  app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  app.get("/api/meow", async (_req, res) => {
    try {
      const response = await fetch(CAT_API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch from Cat API');
      }
      const data = await response.json() as CatApiResponse[];
      if (!data.length || !data[0]?.url) {
        throw new Error('Invalid response from Cat API');
      }
      res.json({ url: data[0].url });
    } catch (error) {
      console.error('Error fetching cat image:', error);
      res.status(500).json({ 
        error: 'Failed to generate cat image',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  return httpServer;
}