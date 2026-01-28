# DomisLink Empire - Technology Stack

## Core Technologies

### Frontend Framework
- **Next.js 13+** with App Router for all applications
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for consistent styling across applications

### Backend & Database
- **Supabase** as unified backend-as-a-service
- **PostgreSQL** database with real-time subscriptions
- **Supabase Auth** for authentication across all platforms

### Build System & Deployment
- **Turborepo** for monorepo management and build optimization
- **Cloudflare Pages** for application deployment
- **Wrangler** for Cloudflare deployment automation

### Development Tools
- **TypeScript** for type safety across entire codebase
- **Prettier** for code formatting
- **ESLint** for code quality and consistency

## Programming Languages & Versions

### Primary Languages
- **TypeScript** - Primary language for all applications and packages
- **JavaScript** - Legacy support and configuration files
- **SQL** - Database schema and queries

### Runtime Requirements
- **Node.js** >= 20.0.0
- **npm** >= 10.0.0

## Package Management
- **npm workspaces** for monorepo dependency management
- **Turborepo** for build caching and task orchestration
- **Package Manager**: npm@10.0.0 (enforced via packageManager field)

## Key Dependencies

### Shared Infrastructure
- **@supabase/supabase-js** - Database and authentication client
- **next** - React framework for all applications
- **react** & **react-dom** - UI library
- **typescript** - Type system

### External Integrations
- **Kiwi.com API** - Flight data and booking integration
- **Paystack** - Payment processing for African markets
- **Geolocation APIs** - Location detection and currency conversion

## Development Commands

### Global Development
```bash
npm run dev                  # Start all applications
npm run build               # Build all applications
npm run lint                # Lint entire codebase
npm run format              # Format all files with Prettier
npm run type-check          # TypeScript type checking
```

### Application-Specific Development
```bash
npm run dev:hub             # Hub landing page
npm run dev:realestate      # Real estate platform
npm run dev:tickets         # Flight booking platform
npm run dev:flightmonitor   # Flight tracking platform
npm run dev:teachmaster     # Education platform
npm run dev:admin           # Admin AI builder
```

### Build & Deployment
```bash
npm run build:app-name      # Build specific application
npm run deploy:cloudflare   # Deploy all apps to Cloudflare
npm run deploy:cf:app-name  # Deploy specific app
```

### Docker Support
```bash
npm run docker:build        # Build Docker containers
npm run docker:up           # Start containerized environment
npm run docker:down         # Stop containers
npm run docker:logs         # View container logs
```

## Configuration Files

### Root Configuration
- **`package.json`** - Workspace configuration and scripts
- **`turbo.json`** - Build pipeline and caching configuration
- **`tsconfig.json`** - TypeScript configuration for entire monorepo
- **`.env.example`** - Environment variables template

### Application Configuration
- **`next.config.js`** - Next.js configuration per application
- **`wrangler.toml`** - Cloudflare deployment configuration
- **`tsconfig.json`** - Application-specific TypeScript settings

## Build Pipeline Configuration

### Turborepo Tasks
```json
{
  "build": {
    "dependsOn": ["^build"],
    "outputs": [".next/**", "!.next/cache/**"]
  },
  "dev": {
    "cache": false,
    "persistent": true
  }
}
```

### Caching Strategy
- Build outputs cached across applications
- Shared package builds cached and reused
- Development mode runs without caching for hot reload

## Deployment Architecture

### Cloudflare Pages
- Each application deployed as separate Cloudflare Pages project
- Static site generation with server-side rendering support
- Global CDN distribution for worldwide performance

### Environment Management
- Single `.env.local` file for all applications
- Environment variables shared across monorepo
- Cloudflare environment variables for production secrets

## Development Workflow
- Turborepo manages parallel builds and development servers
- Hot reload across all applications during development
- Shared package changes trigger dependent application rebuilds
- Unified linting and formatting across entire codebase