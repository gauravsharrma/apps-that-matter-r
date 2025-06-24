import {
  users,
  apps,
  notes,
  trials,
  type User,
  type UpsertUser,
  type App,
  type InsertApp,
  type Note,
  type InsertNote,
  type Trial,
  type InsertTrial,
} from "@shared/schema";
import { db } from "./db";

const database = db!;
import { eq, ilike, or, desc, and } from "drizzle-orm";

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
  // Note operations
  getUserNotes(userId: string): Promise<Note[]>;
  getNote(id: number, userId: string): Promise<Note | undefined>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: number, userId: string, updates: Partial<InsertNote>): Promise<Note>;
  deleteNote(id: number, userId: string): Promise<void>;
  searchUserNotes(userId: string, query: string): Promise<Note[]>;
  getUserTags(userId: string): Promise<string[]>;
  // Trial operations
  getUserTrials(userId: string): Promise<Trial[]>;
  createTrial(trial: InsertTrial): Promise<Trial>;
  updateTrial(id: number, userId: string, updates: Partial<InsertTrial>): Promise<Trial>;
  deleteTrial(id: number, userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await database.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await database
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
    return await database.select().from(apps);
  }

  async getAppsByCategory(category: string): Promise<App[]> {
    return await database.select().from(apps).where(eq(apps.category, category));
  }

  async searchApps(query: string): Promise<App[]> {
    return await database
      .select()
      .from(apps)
      .where(
        or(
          ilike(apps.name, `%${query}%`),
          ilike(apps.description, `%${query}%`)
        )
      );
  }

  // Note operations
  async getUserNotes(userId: string): Promise<Note[]> {
    return await database
      .select()
      .from(notes)
      .where(eq(notes.userId, userId))
      .orderBy(desc(notes.updatedAt));
  }

  async getNote(id: number, userId: string): Promise<Note | undefined> {
    const [note] = await database
      .select()
      .from(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, userId)));
    return note;
  }

  async createNote(note: InsertNote): Promise<Note> {
    const [newNote] = await database
      .insert(notes)
      .values({
        ...note,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return newNote;
  }

  async updateNote(id: number, userId: string, updates: Partial<InsertNote>): Promise<Note> {
    const [updatedNote] = await database
      .update(notes)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(and(eq(notes.id, id), eq(notes.userId, userId)))
      .returning();
    return updatedNote;
  }

  async deleteNote(id: number, userId: string): Promise<void> {
    await database
      .delete(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, userId)));
  }

  async searchUserNotes(userId: string, query: string): Promise<Note[]> {
    return await database
      .select()
      .from(notes)
      .where(
        and(
          eq(notes.userId, userId),
          or(
            ilike(notes.title, `%${query}%`),
            ilike(notes.content, `%${query}%`)
          )
        )
      )
      .orderBy(desc(notes.updatedAt));
  }

  async getUserTags(userId: string): Promise<string[]> {
    const userNotes = await database
      .select({ tags: notes.tags })
      .from(notes)
      .where(eq(notes.userId, userId));

    const allTags = userNotes.flatMap(note => note.tags || []);
    return Array.from(new Set(allTags));
  }

  // Trial operations
  async getUserTrials(userId: string): Promise<Trial[]> {
    return await database
      .select()
      .from(trials)
      .where(eq(trials.userId, userId))
      .orderBy(desc(trials.endDate));
  }

  async createTrial(trialData: InsertTrial): Promise<Trial> {
    const [trial] = await database
      .insert(trials)
      .values({
        ...trialData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return trial;
  }

  async updateTrial(
    id: number,
    userId: string,
    updates: Partial<InsertTrial>
  ): Promise<Trial> {
    const [trial] = await database
      .update(trials)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(and(eq(trials.id, id), eq(trials.userId, userId)))
      .returning();
    return trial;
  }

  async deleteTrial(id: number, userId: string): Promise<void> {
    await database.delete(trials).where(and(eq(trials.id, id), eq(trials.userId, userId)));
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
      },
      {
        name: "Post-it Notes",
        description: "Create, organize, and manage digital sticky notes with tags, colors, and timestamps for better productivity.",
        category: "Productivity",
        icon: "sticky-note",
        featured: true
      },
    ];

    sampleApps.forEach(app => {
      const id = this.currentAppId++;
      this.apps.set(id, { ...app, id, createdAt: new Date() });
    });
  }

  async getUserNotes(userId: string): Promise<Note[]> {
    return Array.from(this.notes.values())
      .filter(note => note.userId === userId)
      .sort((a, b) => new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime());
  }

  async getNote(id: number, userId: string): Promise<Note | undefined> {
    const note = this.notes.get(id);
    return note && note.userId === userId ? note : undefined;
  }

  async createNote(noteData: InsertNote): Promise<Note> {
    const id = this.currentNoteId++;
    const note: Note = {
      ...noteData,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.notes.set(id, note);
    return note;
  }

  async updateNote(id: number, userId: string, updates: Partial<InsertNote>): Promise<Note> {
    const existingNote = this.notes.get(id);
    if (!existingNote || existingNote.userId !== userId) {
      throw new Error('Note not found');
    }

    const updatedNote: Note = {
      ...existingNote,
      ...updates,
      updatedAt: new Date(),
    };
    this.notes.set(id, updatedNote);
    return updatedNote;
  }

  async deleteNote(id: number, userId: string): Promise<void> {
    const note = this.notes.get(id);
    if (note && note.userId === userId) {
      this.notes.delete(id);
    }
  }

  async searchUserNotes(userId: string, query: string): Promise<Note[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.notes.values())
      .filter(note => 
        note.userId === userId &&
        (note.title.toLowerCase().includes(lowercaseQuery) ||
         note.content.toLowerCase().includes(lowercaseQuery))
      )
      .sort((a, b) => new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime());
  }

  async getUserTags(userId: string): Promise<string[]> {
    const userNotes = Array.from(this.notes.values()).filter(note => note.userId === userId);
    const allTags = userNotes.flatMap(note => note.tags || []);
    return Array.from(new Set(allTags));
  }

  // Trial operations
  async getUserTrials(userId: string): Promise<Trial[]> {
    return Array.from(this.trials.values())
      .filter(trial => trial.userId === userId)
      .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
  }

  async createTrial(data: InsertTrial): Promise<Trial> {
    const id = this.currentTrialId++;
    const trial: Trial = {
      ...data,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Trial;
    this.trials.set(id, trial);
    return trial;
  }

  async updateTrial(id: number, userId: string, updates: Partial<InsertTrial>): Promise<Trial> {
    const existing = this.trials.get(id);
    if (!existing || existing.userId !== userId) {
      throw new Error('Trial not found');
    }
    const updated: Trial = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    } as Trial;
    this.trials.set(id, updated);
    return updated;
  }

  async deleteTrial(id: number, userId: string): Promise<void> {
    const t = this.trials.get(id);
    if (t && t.userId === userId) {
      this.trials.delete(id);
    }
  }
}

export const storage = new MemStorage();