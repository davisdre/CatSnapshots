import type { Express } from "express";
import { createServer, type Server } from "http";

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);

  app.get("/api/meow", (_req, res) => {
    res.json({ success: true });
  });

  return httpServer;
}