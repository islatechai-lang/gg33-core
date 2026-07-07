# GG33 - Cue Your Life (Whop App)

## Overview

GG33 is a spiritual numerology and Chinese astrology web application that helps users make informed decisions about relationships, business, and life events by combining Western numerology calculations with Chinese zodiac systems. The platform provides personalized energy profiles, compatibility analysis, daily energy readings, and access to a database of 22,000+ pre-calculated "cues" (brands, locations, people, and events with their energy signatures).

**Whop Integration**: This app is designed to work as a Whop app with proper authentication and views for both customers (Experience View) and admins (Dashboard View).

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

- **Dec 2024**: Implemented Frosted UI design system with 12-step Radix color scales
- **Dec 2024**: Added Whop SDK for server-side authentication
- **Dec 2024**: Switched from react-router-dom to wouter for routing
- **Dec 2024**: Updated all components with Frosted UI styling (glass morphism, amber accents)

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server with HMR support
- Client-side routing using wouter (lightweight alternative to React Router)
- Single-page application (SPA) architecture with code splitting

**UI Component System**
- Frosted UI design system inspired by Whop's design language
- 12-step Radix color scales for precise theming (gray, amber, green, red, violet, blue)
- Shadcn UI component library with custom Frosted UI variants
- Tailwind CSS with custom design tokens and glass morphism effects
- CVA (Class Variance Authority) for variant-based component styling
- Custom gradients and glow effects for premium feel

**Design System Features**
- Glass morphism cards and buttons
- Gold/amber gradient CTAs
- 12-step typography scale (text-0 to text-9)
- Dark-first design with vibrant accents
- Animated starfield background

**State Management**
- TanStack Query (React Query) for server state management and caching
- Local storage for user profile persistence (name, birth date)
- No global state management library - component-level state with React hooks

**Key Frontend Features**
- Profile setup flow capturing user name and birth date
- Numerology calculator (Life Path numbers, Chinese zodiac)
- Compatibility checker for people, brands, locations, and dates
- Daily energy calculator based on universal day numbers
- Locked/premium content sections (CueChats AI, Cues database, Study Zone)
- Animated cosmic starfield background component
- Responsive navigation with mobile hamburger menu

### Backend Architecture

**Server Framework**
- Express.js web server with TypeScript
- Custom HTTP server creation for potential WebSocket support
- Middleware: JSON body parsing, URL-encoded form data, raw body capture
- Custom request logging with timestamps and duration tracking

**Whop Integration**
- @whop/sdk for server-side SDK operations and built-in token verification
- Whop authentication middleware for protected routes (reads x-whop-user-token header)
- Access level checking (customer, admin, no_access) via SDK checkAccess method

**API Design**
- RESTful API structure (routes prefixed with `/api`)
- Whop auth middleware applied globally
- Storage abstraction layer with interface-based design
- In-memory storage implementation (MemStorage class)

**Build & Deployment**
- ESBuild for server-side bundling with dependency allowlist
- Vite for client-side bundling
- Static file serving in production from `dist/public`
- Separate development and production configurations

### Data Storage

**MongoDB Database**
- Mongoose ODM for MongoDB Atlas
- Connection via `MONGODB_URI` secret
- Lazy connection on first database operation

**Data Models**
- User: whopUserId (unique), name, birthDate, createdAt, updatedAt
- Numerology profiles calculated client-side
- Compatibility results computed on-demand

**Storage Interface**
- `getUser(whopUserId)` - Get user by Whop user ID
- `createOrUpdateUser(whopUserId, data)` - Create or update user profile

### Whop Authentication

**Server-Side**
- Whop SDK initialized with WHOP_API_KEY
- Token verification using SDK's built-in `verifyUserToken` method (reads x-whop-user-token header)
- Custom middleware extracts user from verified token
- Access checking via SDK checkAccess method

**Environment Variables Required**
- `WHOP_API_KEY`: API key from your Whop app's developer dashboard (found in Environment variables section)
- `WHOP_APP_ID`: Your app ID (looks like `app_xxxxxxxxxxxxxx`, found in your app settings)

### Core Numerology Logic

**Calculation Engine** (client-side `lib/numerology.ts`)
- Life Path Number calculation using date reduction algorithm
- Chinese Zodiac animal and element determination (12-year cycle, 5 elements)
- Energy signature generation combining numerology and astrology
- Compatibility scoring between two birth dates
- Daily universal energy calculation based on current date
- Personality trait derivation from Life Path numbers

**Algorithm Approach**
- Single-digit reduction with master numbers preserved (11, 22, 33)
- Chinese zodiac calculated from birth year modulo operations
- Yin/Yang balance determination
- Lucky colors, best days, and trait associations per Life Path

## External Dependencies

### Third-Party UI Libraries
- **Radix UI**: Complete set of accessible component primitives
- **Shadcn UI**: Pre-styled component system built on Radix UI
- **Lucide React**: Icon library for UI elements
- **Embla Carousel**: Touch-friendly carousel component
- **Sonner**: Toast notification system

### Styling & Design
- **Tailwind CSS**: Utility-first CSS framework with Frosted UI theme
- **PostCSS**: CSS processing with autoprefixer
- **Class Variance Authority (CVA)**: Type-safe component variant system
- **clsx & tailwind-merge**: Conditional className utilities

### Form Management
- **React Hook Form**: Form state and validation
- **Zod**: Schema validation library
- **Drizzle-Zod**: Zod schema generation from Drizzle tables

### Data Fetching
- **TanStack React Query**: Server state management and caching
- **wouter**: Lightweight client-side routing

### Whop Integration
- **@whop/sdk**: Server-side Whop SDK with built-in token verification

### Development Tools
- **TypeScript**: Type checking across client and server
- **Vite Plugins**: Runtime error overlay, cartographer, dev banner
- **ESBuild**: Production bundling
- **TSX**: TypeScript execution for development server

### Database & ORM (Configured)
- **Drizzle ORM**: Type-safe database toolkit
- **PostgreSQL (pg)**: Database driver
