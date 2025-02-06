import type { Express } from "express";
import { createServer, type Server } from "http";

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);

  // Add CSP headers middleware
  app.use((_req, res, next) => {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self';" +
      "connect-src 'self' https://api.thecatapi.com https://cdn.freesound.org;" +
      "img-src 'self' https://*.thecatapi.com data:;" +
      "media-src 'self' https://cdn.freesound.org;" +
      "style-src 'self' 'unsafe-inline';" +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval';" +
      "font-src 'self' data:;"
    );
    next();
  });

  app.get("/api/meow", (_req, res) => {
    res.json({ success: true });
  });

  return httpServer;
}