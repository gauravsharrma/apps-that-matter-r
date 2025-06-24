import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup Google OAuth authentication
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // App routes
  app.get("/api/apps", async (req, res) => {
    try {
      const apps = await storage.getAllApps();
      res.json(apps);
    } catch (error) {
      console.error("Error fetching apps:", error);
      res.status(500).json({ message: "Failed to fetch apps" });
    }
  });

  app.get("/api/apps/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const apps = await storage.getAppsByCategory(category);
      res.json(apps);
    } catch (error) {
      console.error("Error fetching apps by category:", error);
      res.status(500).json({ message: "Failed to fetch apps" });
    }
  });

  app.get("/api/apps/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const apps = await storage.searchApps(query);
      res.json(apps);
    } catch (error) {
      console.error("Error searching apps:", error);
      res.status(500).json({ message: "Failed to search apps" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
