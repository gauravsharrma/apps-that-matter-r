import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import { storage } from "./storage";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const authEnabled = Boolean(googleClientId && googleClientSecret);

export function getSession() {
  return session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  });
}

async function upsertUser(profile: any) {
  return await storage.upsertUser({
    id: profile.id,
    email: profile.emails?.[0]?.value,
    firstName: profile.name?.givenName,
    lastName: profile.name?.familyName,
    profileImageUrl: profile.photos?.[0]?.value,
  });
}

export async function setupAuth(app: Express) {
  app.use(getSession());
  if (!authEnabled) {
    console.warn("Google OAuth not configured. Authentication disabled.");
    app.use((req, _res, next) => {
      (req as any).user = { id: "demo-user" };
      next();
    });
    return;
  }

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientId!,
        clientSecret: googleClientSecret!,
        callbackURL:
          process.env.NODE_ENV === "production"
            ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co/api/auth/google/callback`
            : "/api/auth/google/callback",
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const user = await upsertUser(profile);
          return done(null, user);
        } catch (error) {
          return done(error as any, null);
        }
      },
    ),
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error as any, null);
    }
  });

  app.get(
    "/api/login",
    passport.authenticate("google", { scope: ["profile", "email"] }),
  );

  app.get(
    "/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (_req, res) => {
      res.redirect("/");
    },
  );

  app.get("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
      }
      req.session.destroy((err2) => {
        if (err2) {
          console.error("Session destroy error:", err2);
        }
        res.redirect("/");
      });
    });
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (!authEnabled || req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};
