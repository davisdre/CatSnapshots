import type { Express } from "express";
import { createServer, type Server } from "http";

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);

  app.get("/api/meow", (_req, res) => {
    // Send a simple success response for the meow sound effect
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true });
  });

  return httpServer;
}