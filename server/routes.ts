import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all apps
  app.get("/api/apps", async (req, res) => {
    try {
      const apps = await storage.getAllApps();
      res.json(apps);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch apps" });
    }
  });

  // Get apps by category
  app.get("/api/apps/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const apps = await storage.getAppsByCategory(category);
      res.json(apps);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch apps by category" });
    }
  });

  // Search apps
  app.get("/api/apps/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: "Search query is required" });
      }
      const apps = await storage.searchApps(q);
      res.json(apps);
    } catch (error) {
      res.status(500).json({ error: "Failed to search apps" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
