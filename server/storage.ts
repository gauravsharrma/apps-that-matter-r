import {
  users,
  apps,
  type User,
  type UpsertUser,
  type App,
  type InsertApp,
} from "@shared/schema";
import { db } from "./db";
import { eq, ilike, or } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  // App operations
  getAllApps(): Promise<App[]>;
  getAppsByCategory(category: string): Promise<App[]>;
  searchApps(query: string): Promise<App[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getAllApps(): Promise<App[]> {
    return await db.select().from(apps);
  }

  async getAppsByCategory(category: string): Promise<App[]> {
    return await db.select().from(apps).where(eq(apps.category, category));
  }

  async searchApps(query: string): Promise<App[]> {
    return await db
      .select()
      .from(apps)
      .where(
        or(
          ilike(apps.name, `%${query}%`),
          ilike(apps.description, `%${query}%`)
        )
      );
  }
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private apps: Map<number, App>;
  private currentAppId: number;

  constructor() {
    this.users = new Map();
    this.apps = new Map();
    this.currentAppId = 1;
    
    // Initialize with sample apps
    this.initializeApps();
  }

  private initializeApps() {
    const sampleApps: Omit<App, 'id' | 'createdAt'>[] = [
      {
        name: "EMI Calculator",
        description: "Calculate your monthly EMI payments for loans with detailed amortization schedule and interest breakdowns.",
        category: "Finance",
        icon: "calculator",
        featured: true
      },
      {
        name: "BMI Calculator",
        description: "Calculate your Body Mass Index and get health recommendations based on WHO guidelines and standards.",
        category: "Health",
        icon: "heartbeat",
        featured: true
      },
      {
        name: "SIP Calculator",
        description: "Plan your systematic investment portfolio with compound interest calculations and goal-based planning.",
        category: "Finance",
        icon: "chart-line",
        featured: false
      },
      {
        name: "Text Formatter",
        description: "Format, clean, and transform text with multiple options including case conversion and special character handling.",
        category: "Utilities",
        icon: "file-alt",
        featured: false
      },
      {
        name: "Color Palette Generator",
        description: "Generate beautiful color palettes for your design projects with accessibility and contrast checking.",
        category: "Utilities",
        icon: "palette",
        featured: false
      },
      {
        name: "Pomodoro Timer",
        description: "Boost productivity with customizable focus sessions, break reminders, and detailed time tracking analytics.",
        category: "Productivity",
        icon: "clock",
        featured: false
      },
      {
        name: "Currency Converter",
        description: "Convert between global currencies with real-time exchange rates and historical trend analysis.",
        category: "Finance",
        icon: "coins",
        featured: false
      },
      {
        name: "QR Code Generator",
        description: "Generate QR codes for URLs, text, WiFi passwords, and more with customizable styling options.",
        category: "Utilities",
        icon: "qrcode",
        featured: false
      },
      {
        name: "Water Intake Tracker",
        description: "Track daily water consumption with personalized goals, reminders, and hydration insights.",
        category: "Health",
        icon: "tint",
        featured: false
      },
      {
        name: "AI Prompt Generator",
        description: "Generate comprehensive prompt settings for ChatGPT, Gemini, and other LLMs with 20+ customizable parameters.",
        category: "AI Tools",
        icon: "robot",
        featured: true
      }
    ];

    sampleApps.forEach(app => {
      const id = this.currentAppId++;
      this.apps.set(id, { ...app, id, createdAt: new Date() });
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const user: User = {
      ...userData,
      createdAt: this.users.get(userData.id!)?.createdAt || new Date(),
      updatedAt: new Date()
    };
    this.users.set(userData.id!, user);
    return user;
  }

  async getAllApps(): Promise<App[]> {
    return Array.from(this.apps.values());
  }

  async getAppsByCategory(category: string): Promise<App[]> {
    return Array.from(this.apps.values()).filter(app => 
      app.category.toLowerCase() === category.toLowerCase()
    );
  }

  async searchApps(query: string): Promise<App[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.apps.values()).filter(app => 
      app.name.toLowerCase().includes(lowercaseQuery) ||
      app.description.toLowerCase().includes(lowercaseQuery) ||
      app.category.toLowerCase().includes(lowercaseQuery)
    );
  }
}

export const storage = new MemStorage();
