import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// Mock authentication middleware for now - replace with real Replit Auth when database is ready
const mockAuth = (req: any, res: any, next: any) => {
  req.user = {
    claims: {
      sub: 'mock-user-123',
      email: 'user@example.com',
      first_name: 'John',
      last_name: 'Doe',
      profile_image_url: 'https://via.placeholder.com/40'
    }
  };
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Mock auth routes for testing
  app.get('/api/login', (req, res) => {
    res.redirect('/');
  });

  app.get('/api/logout', (req, res) => {
    res.redirect('/');
  });

  app.get('/api/auth/user', mockAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      let user = await storage.getUser(userId);
      
      if (!user) {
        // Create user if doesn't exist
        user = await storage.upsertUser({
          id: userId,
          email: req.user.claims.email,
          firstName: req.user.claims.first_name,
          lastName: req.user.claims.last_name,
          profileImageUrl: req.user.claims.profile_image_url,
        });
      }
      
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
