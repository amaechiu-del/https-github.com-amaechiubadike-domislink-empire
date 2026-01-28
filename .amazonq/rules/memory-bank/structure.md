# DomisLink Empire - Project Structure

## Monorepo Architecture
DomisLink Empire follows a Turborepo-based monorepo structure with shared packages and independent applications, enabling code reuse while maintaining application isolation.

## Root Directory Structure
```
domislink-empire/
├── .env.example              # Unified environment configuration for all apps
├── database.sql              # Single database schema for entire ecosystem
├── package.json              # Root workspace configuration
├── turbo.json               # Turborepo build pipeline configuration
├── apps/                    # Independent applications
└── packages/                # Shared libraries and utilities
```

## Applications Directory (`apps/`)

### Core Applications
- **`hub/`** - Landing page and central navigation (domislink.com)
- **`realestate/`** - Property listings and community platform (realestate.domislink.com)
- **`tickets/`** - Flight booking and travel services (tickets.domislink.com)
- **`flightmonitor/`** - Flight tracking and airline forums (fm.domislink.com)
- **`teachmaster/`** - Gamified education with AI tutors (teachmaster.domislink.com)
- **`admin/`** - AI-powered administration and development tools (admin.domislink.com)

### Application Structure Pattern
Each application follows consistent Next.js structure:
```
app-name/
├── src/
│   ├── app/                 # Next.js 13+ app router
│   ├── components/          # React components
│   └── lib/                 # Application-specific utilities
├── next.config.js           # Next.js configuration
├── package.json             # App-specific dependencies
├── tsconfig.json            # TypeScript configuration
└── wrangler.toml           # Cloudflare deployment config
```

## Shared Packages Directory (`packages/`)

### Core Infrastructure Packages
- **`database/`** - Supabase client, types, and database utilities
- **`auth/`** - Authentication logic and session management
- **`config/`** - Shared configuration constants and environment handling

### Feature-Specific Packages
- **`ui/`** - Shared React components and design system
- **`payments/`** - Paystack integration and payment processing
- **`i18n/`** - Multi-language support (20+ languages)
- **`geolocation/`** - Location detection and currency conversion
- **`ai-characters/`** - 30 TeachMaster AI tutor personalities
- **`alerts/`** - Notification system and user alerts

## Architectural Patterns

### Shared Database Strategy
- Single Supabase database serves all applications
- Unified user accounts and authentication across platforms
- Shared wallet and payment system
- Cross-platform data relationships and referential integrity

### Package Dependencies
```
Applications depend on:
├── @domislink/database      # Database access layer
├── @domislink/auth          # Authentication
├── @domislink/ui            # Shared components
├── @domislink/config        # Configuration
└── Feature-specific packages as needed
```

### Build Pipeline
- Turborepo orchestrates builds across all apps and packages
- Shared dependencies are built once and cached
- Independent deployment of each application
- Parallel development and testing workflows

## Component Relationships

### Cross-Application Integration
- **Hub** → Central navigation to all other applications
- **Real Estate** → Links to flight booking for property viewing trips
- **Tickets** → Integration with flight monitor for tracking
- **Flight Monitor** → Direct booking links to tickets platform
- **TeachMaster** → Standalone with shared authentication
- **Admin** → Management interface for all other applications

### Shared Service Layer
- Authentication flows through all applications
- Payment processing unified across real estate and tickets
- Geolocation services provide consistent user experience
- AI characters extend beyond TeachMaster for community moderation

## Development Workflow
- Root-level scripts manage all applications simultaneously
- Individual app development with `npm run dev:app-name`
- Shared package changes automatically propagate to dependent apps
- Unified linting, formatting, and type-checking across entire codebase