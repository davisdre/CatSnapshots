import type { Express } from "express";
import { createServer, type Server } from "http";

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);

  // Add CSP headers middleware
  app.use((_req, res, next) => {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; connect-src 'self' https://api.thecatapi.com; img-src 'self' https://cdn2.thecatapi.com https://cdn3.thecatapi.com https://cdn4.thecatapi.com https://cdn.thecatapi.com; media-src 'self' https://cdn.freesound.org; script-src 'self' 'unsafe-inline' 'unsafe-eval';"
    );
    next();
  });

  app.get("/api/meow", (_req, res) => {
    res.json({ success: true });
  });

  return httpServer;
}