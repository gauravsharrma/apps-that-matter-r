# AppsThatMatter - Replit Configuration

## Overview

AppsThatMatter is a modern web application that showcases essential utility applications. It's built as a full-stack application with a React frontend and Express.js backend, featuring a curated collection of utility apps like EMI calculators, BMI calculators, and other productivity tools. The application uses a neomorphism design style for a modern, elegant user interface.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom neomorphism design system
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful API endpoints

### Data Storage
- **Primary Database**: PostgreSQL (via Neon Database)
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations
- **Development Storage**: In-memory storage implementation for development

## Key Components

### Database Schema
- **Users Table**: Stores user authentication data (id, username, password)
- **Apps Table**: Stores application metadata (id, name, description, category, icon, featured status)

### API Endpoints
- `GET /api/apps` - Retrieve all applications
- `GET /api/apps/category/:category` - Filter apps by category
- `GET /api/apps/search?q=query` - Search apps by name/description

### Frontend Components
- **Header**: Navigation with brand and menu items
- **Hero**: Landing section with main messaging
- **SearchFilter**: Search input and category filtering
- **AppsGrid**: Display grid of application cards
- **Footer**: Site footer with links

### UI System
- **Design System**: Custom neomorphism design with CSS variables
- **Component Library**: shadcn/ui components built on Radix UI
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Icons**: Lucide React icon library

## Data Flow

1. **Client Request**: User interacts with the frontend (search, filter, browse)
2. **API Call**: Frontend makes HTTP requests to Express backend
3. **Data Processing**: Backend queries PostgreSQL database via Drizzle ORM
4. **Response**: JSON data returned to frontend
5. **UI Update**: React components re-render with new data
6. **State Management**: TanStack Query handles caching and synchronization

## External Dependencies

### Production Dependencies
- **Database**: Neon Database (serverless PostgreSQL)
- **UI Libraries**: Radix UI, Lucide React
- **Utility Libraries**: date-fns, clsx, class-variance-authority
- **Development Tools**: Vite, TypeScript, Tailwind CSS

### Development Environment
- **Runtime**: Node.js 20
- **Package Manager**: npm
- **Build Tools**: Vite for frontend, esbuild for backend
- **Database Tools**: Drizzle Kit for schema management

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: esbuild bundles Express server to `dist/index.js`
3. **Static Assets**: Frontend assets served by Express in production

### Environment Configuration
- **Development**: `npm run dev` - runs frontend and backend concurrently
- **Production**: `npm run build` then `npm run start`
- **Database**: Environment variable `DATABASE_URL` for PostgreSQL connection

### Replit Configuration
- **Modules**: Node.js 20, Web, PostgreSQL 16
- **Port**: Application runs on port 5000, exposed as port 80
- **Auto-deploy**: Configured for autoscale deployment target

## Recent Changes

✓ Built complete neomorphism-styled web application "AppsThatMatter"
✓ Implemented 10+ functional utility apps with real calculations and features
✓ Added AI Prompt Settings Generator with 22+ parameters for LLM optimization
✓ Created scroll-to-top/bottom navigation system with user customization
✓ Implemented Google OAuth authentication system working properly
✓ Added comprehensive Post-it Notes app with tags, colors, and timestamps
✓ Mobile-first responsive design across all applications

## Changelog

```
Changelog:
- June 24, 2025. Initial setup and complete application build
- June 24, 2025. Added functional utility apps with real calculations
- June 24, 2025. Implemented AI Prompt Generator with 22 parameters
- June 24, 2025. Added scroll navigation and Google OAuth authentication
- June 24, 2025. Created Post-it Notes app with full CRUD, tags, and colors
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```