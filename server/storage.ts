import { users, apps, type User, type InsertUser, type App, type InsertApp } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllApps(): Promise<App[]>;
  getAppsByCategory(category: string): Promise<App[]>;
  searchApps(query: string): Promise<App[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
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
    const allApps = await db.select().from(apps);
    const lowercaseQuery = query.toLowerCase();
    return allApps.filter(app => 
      app.name.toLowerCase().includes(lowercaseQuery) ||
      app.description.toLowerCase().includes(lowercaseQuery) ||
      app.category.toLowerCase().includes(lowercaseQuery)
    );
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private apps: Map<number, App>;
  private currentUserId: number;
  private currentAppId: number;

  constructor() {
    this.users = new Map();
    this.apps = new Map();
    this.currentUserId = 1;
    this.currentAppId = 1;
    
    // Initialize with sample apps
    this.initializeApps();
  }

  private initializeApps() {
    const sampleApps: Omit<App, 'id'>[] = [
      {
        name: "EMI Calculator",
        description: "Calculate your monthly EMI payments for loans with detailed amortization schedule and interest breakdowns.",
        category: "Finance",
        icon: "calculator",
        featured: 1
      },
      {
        name: "BMI Calculator",
        description: "Calculate your Body Mass Index and get health recommendations based on WHO guidelines and standards.",
        category: "Health",
        icon: "heartbeat",
        featured: 1
      },
      {
        name: "SIP Calculator",
        description: "Plan your systematic investment portfolio with compound interest calculations and goal-based planning.",
        category: "Finance",
        icon: "chart-line",
        featured: 0
      },
      {
        name: "Text Formatter",
        description: "Format, clean, and transform text with multiple options including case conversion and special character handling.",
        category: "Utilities",
        icon: "file-alt",
        featured: 0
      },
      {
        name: "AI Text Extractor",
        description: "Extract and analyze text from images using advanced OCR technology with multi-language support.",
        category: "AI Tools",
        icon: "robot",
        featured: 1
      },
      {
        name: "Color Palette Generator",
        description: "Generate beautiful color palettes for your design projects with accessibility and contrast checking.",
        category: "Utilities",
        icon: "palette",
        featured: 0
      },
      {
        name: "Pomodoro Timer",
        description: "Boost productivity with customizable focus sessions, break reminders, and detailed time tracking analytics.",
        category: "Productivity",
        icon: "clock",
        featured: 0
      },
      {
        name: "Currency Converter",
        description: "Convert between global currencies with real-time exchange rates and historical trend analysis.",
        category: "Finance",
        icon: "coins",
        featured: 0
      },
      {
        name: "QR Code Generator",
        description: "Generate QR codes for URLs, text, WiFi passwords, and more with customizable styling options.",
        category: "Utilities",
        icon: "qrcode",
        featured: 0
      },
      {
        name: "Water Intake Tracker",
        description: "Track daily water consumption with personalized goals, reminders, and hydration insights.",
        category: "Health",
        icon: "tint",
        featured: 0
      },
      {
        name: "AI Language Detector",
        description: "Automatically detect the language of any text with confidence scores and support for 100+ languages.",
        category: "AI Tools",
        icon: "language",
        featured: 0
      },
      {
        name: "AI Prompt Generator",
        description: "Generate comprehensive prompt settings for ChatGPT, Gemini, and other LLMs with 20+ customizable parameters.",
        category: "AI Tools",
        icon: "robot",
        featured: 1
      },
      {
        name: "Task Prioritizer",
        description: "Organize and prioritize tasks using proven methodologies like Eisenhower Matrix and GTD principles.",
        category: "Productivity",
        icon: "tasks",
        featured: 0
      }
    ];

    sampleApps.forEach(app => {
      const id = this.currentAppId++;
      this.apps.set(id, { ...app, id });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
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

export const storage = new DatabaseStorage();
