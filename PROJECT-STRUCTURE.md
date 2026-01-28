# 📁 DOMISLINK EMPIRE - PROJECT STRUCTURE

## Complete overview of the project architecture and file organization

---

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    DOMISLINK EMPIRE                         │
│                  Monorepo Architecture                      │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
    ┌───▼────┐                            ┌────▼────┐
    │  APPS  │                            │ PACKAGES │
    └───┬────┘                            └────┬─────┘
        │                                      │
        ├─ hub                                 ├─ ui
        ├─ realestate                          ├─ database
        ├─ tickets                             ├─ auth
        ├─ flightmonitor                       ├─ payments
        ├─ teachmaster                         ├─ config
        └─ admin                               ├─ i18n
                                               ├─ geolocation
                                               └─ ai-characters
```

---

## 📂 Root Directory Structure

```
domislink-empire/
├── .env.example                    # Environment variables template
├── .dockerignore                   # Docker ignore patterns
├── .vercelignore                   # Vercel ignore patterns
├── .gitignore                      # Git ignore patterns
├── package.json                    # Root package.json with workspaces
├── package-lock.json               # Dependency lock file
├── turbo.json                      # Turborepo configuration
├── vercel.json                     # Vercel deployment config
├── docker-compose.yml              # Docker Compose configuration
├── Dockerfile.base                 # Base Dockerfile template
├── nginx.conf                      # Nginx reverse proxy config
├── database.sql                    # Database schema and migrations
├── README.md                       # Main project documentation
├── DEPLOYMENT.md                   # Deployment guide
├── PRODUCTION-SETUP.md             # Production setup guide
├── DEPLOYMENT-CHECKLIST.md         # Deployment checklist
├── PROJECT-STRUCTURE.md            # This file
│
├── .github/                        # GitHub configuration
│   └── workflows/
│       └── deploy.yml              # CI/CD pipeline
│
├── apps/                           # All applications
│   ├── hub/                        # Landing page (domislink.com)
│   ├── realestate/                 # Real estate app
│   ├── tickets/                    # Flight booking app
│   ├── flightmonitor/              # Flight tracking app
│   ├── teachmaster/                # Education platform
│   └── admin/                      # Admin panel
│
└── packages/                       # Shared packages
    ├── ui/                         # Shared UI components
    ├── database/                   # Database client & types
    ├── auth/                       # Authentication
    ├── payments/                   # Payment integration
    ├── config/                     # Shared configuration
    ├── i18n/                       # Internationalization
    ├── geolocation/                # Location services
    └── ai-characters/              # AI character definitions
```

---

## 🎯 Apps Directory Structure

### Standard Next.js App Structure

Each app follows this structure:

```
apps/[app-name]/
├── package.json                    # App-specific dependencies
├── next.config.js                  # Next.js configuration
├── tsconfig.json                   # TypeScript configuration
├── .env.local                      # Local environment variables
├── README.md                       # App-specific documentation
│
├── public/                         # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
└── src/
    ├── app/                        # Next.js 13+ App Router
    │   ├── layout.tsx              # Root layout
    │   ├── page.tsx                # Home page
    │   ├── globals.css             # Global styles
    │   │
    │   ├── api/                    # API routes
    │   │   ├── auth/
    │   │   ├── listings/
    │   │   └── webhooks/
    │   │
    │   ├── (auth)/                 # Auth route group
    │   │   ├── login/
    │   │   └── register/
    │   │
    │   └── [feature]/              # Feature routes
    │       ├── page.tsx
    │       ├── layout.tsx
    │       └── loading.tsx
    │
    ├── components/                 # React components
    │   ├── ui/                     # UI components
    │   ├── forms/                  # Form components
    │   ├── layouts/                # Layout components
    │   └── features/               # Feature-specific components
    │
    ├── lib/                        # Utility functions
    │   ├── utils.ts
    │   ├── constants.ts
    │   └── helpers.ts
    │
    ├── hooks/                      # Custom React hooks
    │   ├── useAuth.ts
    │   ├── useUser.ts
    │   └── usePayment.ts
    │
    ├── types/                      # TypeScript types
    │   ├── index.ts
    │   └── models.ts
    │
    └── styles/                     # Additional styles
        └── components.css
```

---

## 🏠 Hub App (Landing Page)

**URL:** domislink.com  
**Purpose:** Main landing page and navigation hub

```
apps/hub/
├── src/
│   ├── app/
│   │   ├── page.tsx                # Homepage
│   │   ├── about/
│   │   ├── contact/
│   │   ├── pricing/
│   │   └── blog/
│   │
│   └── components/
│       ├── Hero.tsx
│       ├── Features.tsx
│       ├── AppShowcase.tsx
│       ├── Testimonials.tsx
│       └── Footer.tsx
```

**Key Features:**
- Hero section with CTA
- App showcase (all 6 apps)
- Pricing information
- Blog/News section
- Contact form

---

## 🏘️ Real Estate App

**URL:** realestate.domislink.com  
**Purpose:** Property listings and community management

```
apps/realestate/
├── src/
│   ├── app/
│   │   ├── listings/
│   │   │   ├── page.tsx            # Browse listings
│   │   │   ├── [id]/               # Listing detail
│   │   │   └── create/             # Create listing
│   │   │
│   │   ├── communities/
│   │   │   ├── page.tsx            # Browse communities
│   │   │   ├── [id]/               # Community detail
│   │   │   └── create/             # Create community
│   │   │
│   │   ├── providers/
│   │   │   ├── page.tsx            # Service providers
│   │   │   └── [id]/
│   │   │
│   │   └── dashboard/
│   │       ├── page.tsx            # User dashboard
│   │       ├── my-listings/
│   │       └── favorites/
│   │
│   └── components/
│       ├── ListingCard.tsx
│       ├── ListingForm.tsx
│       ├── CommunityCard.tsx
│       ├── SearchFilters.tsx
│       └── MapView.tsx
```

**Key Features:**
- Property listings (rent/sale)
- Community structure (Country → State → City → Community)
- Service providers directory
- AI-powered community creation
- Auto-archive expired listings
- Community discussion boards

---

## ✈️ Tickets App (Flight Booking)

**URL:** tickets.domislink.com  
**Purpose:** Flight search and booking

```
apps/tickets/
├── src/
│   ├── app/
│   │   ├── search/
│   │   │   └── page.tsx            # Flight search
│   │   │
│   │   ├── results/
│   │   │   └── page.tsx            # Search results
│   │   │
│   │   ├── booking/
│   │   │   ├── [id]/               # Booking details
│   │   │   └── confirm/            # Confirmation
│   │   │
│   │   └── dashboard/
│   │       ├── bookings/           # My bookings
│   │       └── history/            # Booking history
│   │
│   └── components/
│       ├── FlightSearch.tsx
│       ├── FlightCard.tsx
│       ├── AirlineLogos.tsx
│       ├── FareScroller.tsx
│       └── BookingForm.tsx
```

**Key Features:**
- Flight search (Kiwi.com API)
- Real-time fare display
- Airline logos carousel
- Booking management
- Payment integration
- Commission tracking (admin only)

---

## 📡 Flight Monitor App

**URL:** fm.domislink.com  
**Purpose:** Flight tracking and airline forums

```
apps/flightmonitor/
├── src/
│   ├── app/
│   │   ├── track/
│   │   │   └── page.tsx            # Track flights
│   │   │
│   │   ├── flights/
│   │   │   └── [id]/               # Flight details
│   │   │
│   │   ├── airlines/
│   │   │   ├── page.tsx            # Airlines list
│   │   │   └── [code]/             # Airline forum
│   │   │
│   │   └── forums/
│   │       ├── page.tsx            # All forums
│   │       └── [id]/               # Forum thread
│   │
│   └── components/
│       ├── FlightTracker.tsx
│       ├── FlightMap.tsx
│       ├── AirlineCard.tsx
│       ├── ForumPost.tsx
│       └── CommentSection.tsx
```

**Key Features:**
- Real-time flight tracking
- Airline community forums
- Flight status updates
- Link to TicketMaster for booking
- AI moderation for forums

---

## 🎓 TeachMaster App

**URL:** teachmaster.domislink.com  
**Purpose:** Gamified education platform

```
apps/teachmaster/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   └── page.tsx            # Student dashboard
│   │   │
│   │   ├── subjects/
│   │   │   ├── page.tsx            # Subject list
│   │   │   └── [id]/               # Subject detail
│   │   │
│   │   ├── characters/
│   │   │   ├── page.tsx            # Character gallery
│   │   │   └── [id]/               # Character detail
│   │   │
│   │   ├── lessons/
│   │   │   └── [id]/               # Lesson interface
│   │   │
│   │   ├── practice/
│   │   │   ├── flashcards/
│   │   │   ├── quizzes/
│   │   │   └── exams/
│   │   │
│   │   └── leaderboard/
│   │       └── page.tsx            # Leaderboard
│   │
│   └── components/
│       ├── CharacterAvatar.tsx
│       ├── LessonCard.tsx
│       ├── QuizInterface.tsx
│       ├── ProgressBar.tsx
│       ├── BadgeDisplay.tsx
│       └── StudySquad.tsx
```

**Key Features:**
- 30 AI characters
- Gamification (XP, badges, streaks)
- West African curriculum (JSS1-SS3)
- Flash cards with spaced repetition
- Study squads (team learning)
- Exam preparation (WAEC, NECO, JAMB)

---

## 🔧 Admin App

**URL:** admin.domislink.com  
**Purpose:** System administration and AI builder

```
apps/admin/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   └── page.tsx            # Admin dashboard
│   │   │
│   │   ├── users/
│   │   │   ├── page.tsx            # User management
│   │   │   └── [id]/               # User detail
│   │   │
│   │   ├── listings/
│   │   │   └── page.tsx            # Listing moderation
│   │   │
│   │   ├── payments/
│   │   │   ├── transactions/
│   │   │   └── commissions/
│   │   │
│   │   ├── analytics/
│   │   │   ├── overview/
│   │   │   ├── revenue/
│   │   │   └── users/
│   │   │
│   │   ├── ai-builder/
│   │   │   └── page.tsx            # AI assistant
│   │   │
│   │   └── settings/
│   │       ├── general/
│   │       ├── api-keys/
│   │       └── notifications/
│   │
│   └── components/
│       ├── StatsCard.tsx
│       ├── UserTable.tsx
│       ├── RevenueChart.tsx
│       ├── AIChat.tsx
│       └── SettingsForm.tsx
```

**Key Features:**
- User management
- Content moderation
- Payment tracking
- Commission management
- Analytics dashboard
- AI builder assistant
- System settings

---

## 📦 Packages Directory Structure

### @domislink/ui

Shared UI components used across all apps

```
packages/ui/
├── index.ts                        # Main export
├── package.json
│
└── components/
    ├── Button.tsx
    ├── Input.tsx
    ├── Card.tsx
    ├── Modal.tsx
    ├── Dropdown.tsx
    ├── Toast.tsx
    ├── Spinner.tsx
    └── Avatar.tsx
```

### @domislink/database

Supabase client and database types

```
packages/database/
├── index.ts                        # Main export
├── package.json
│
├── client.ts                       # Supabase client
├── types.ts                        # Database types
│
└── queries/
    ├── users.ts
    ├── listings.ts
    ├── bookings.ts
    └── transactions.ts
```

### @domislink/auth

Authentication utilities

```
packages/auth/
├── index.ts                        # Main export
├── package.json
│
├── auth.ts                         # Auth functions
├── middleware.ts                   # Auth middleware
├── hooks.ts                        # Auth hooks
└── types.ts                        # Auth types
```

### @domislink/payments

Paystack integration

```
packages/payments/
├── index.ts                        # Main export
├── package.json
│
├── paystack.ts                     # Paystack client
├── webhooks.ts                     # Webhook handlers
├── types.ts                        # Payment types
└── utils.ts                        # Payment utilities
```

### @domislink/config

Shared configuration

```
packages/config/
├── index.ts                        # Main export
├── package.json
│
├── constants.ts                    # App constants
├── env.ts                          # Environment config
└── features.ts                     # Feature flags
```

### @domislink/i18n

Multi-language support

```
packages/i18n/
├── index.ts                        # Main export
├── package.json
│
├── config.ts                       # i18n configuration
├── hooks.ts                        # Translation hooks
│
└── locales/
    ├── en.json                     # English
    ├── fr.json                     # French
    ├── ar.json                     # Arabic
    ├── yo.json                     # Yoruba
    ├── ig.json                     # Igbo
    ├── ha.json                     # Hausa
    └── [20+ more languages]
```

### @domislink/geolocation

Location and currency detection

```
packages/geolocation/
├── index.ts                        # Main export
├── package.json
│
├── location.ts                     # Location detection
├── currency.ts                     # Currency detection
├── timezone.ts                     # Timezone handling
└── types.ts                        # Geo types
```

### @domislink/ai-characters

TeachMaster AI character definitions

```
packages/ai-characters/
├── index.ts                        # Main export
├── package.json
│
├── characters.ts                   # Character definitions
├── prompts.ts                      # AI prompts
└── types.ts                        # Character types
```

---

## 🗄️ Database Structure

See [`database.sql`](database.sql:1) for complete schema.

**Main Tables:**
- `users` - User accounts
- `profiles` - User profiles
- `listings` - Property listings
- `communities` - Community structure
- `bookings` - Flight bookings
- `transactions` - Payment transactions
- `lessons` - TeachMaster lessons
- `progress` - Student progress
- `forums` - Discussion forums
- `posts` - Forum posts
- `comments` - Post comments

---

## 🔐 Environment Variables

See [`.env.example`](.env.example:1) for complete list.

**Categories:**
1. Database (Supabase)
2. Payments (Paystack)
3. AI Services (Anthropic, OpenAI)
4. Flight APIs (Kiwi, Amadeus)
5. Geolocation (IPInfo, Google Maps)
6. Notifications (Twilio, SendGrid, Telegram)
7. App URLs
8. Admin credentials

---

## 🚀 Deployment Structure

### Vercel Deployment

Each app is deployed separately:
- `hub` → domislink.com
- `realestate` → realestate.domislink.com
- `tickets` → tickets.domislink.com
- `flightmonitor` → fm.domislink.com
- `teachmaster` → teachmaster.domislink.com
- `admin` → admin.domislink.com

### Docker Deployment

All apps run in containers:
- 6 app containers
- 1 nginx reverse proxy
- Shared network
- Volume for logs

---

## 📊 Technology Stack

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Custom + shadcn/ui
- **State Management:** React Context + Hooks
- **Forms:** React Hook Form + Zod

### Backend
- **API:** Next.js API Routes
- **Database:** PostgreSQL (Supabase)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **Real-time:** Supabase Realtime

### External Services
- **Payments:** Paystack
- **AI:** Anthropic Claude, OpenAI GPT
- **Flights:** Kiwi.com, Amadeus
- **Maps:** Google Maps
- **Geolocation:** IPInfo
- **Email:** SendGrid
- **SMS:** Twilio

### DevOps
- **Monorepo:** Turborepo
- **CI/CD:** GitHub Actions
- **Hosting:** Vercel / Docker
- **Monitoring:** Vercel Analytics, Sentry
- **Uptime:** UptimeRobot

---

## 📝 Development Workflow

### Local Development
```bash
# Install dependencies
npm install

# Run all apps
npm run dev

# Run specific app
npm run dev:realestate

# Build all apps
npm run build

# Build specific app
npm run build:realestate
```

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
```

### Deployment Workflow
```bash
# Deploy to Vercel
npm run deploy:vercel

# Deploy specific app
npm run deploy:vercel:realestate

# Docker deployment
npm run docker:build
npm run docker:up
```

---

## 🔗 Inter-App Communication

Apps communicate through:
1. **Shared packages** - Common code
2. **Database** - Shared data
3. **API calls** - Cross-app requests
4. **URL redirects** - Navigation between apps

Example:
- Flight Monitor → Tickets (booking link)
- Real Estate → Hub (navigation)
- All apps → Admin (analytics)

---

## 📚 Documentation Files

- [`README.md`](README.md:1) - Project overview
- [`DEPLOYMENT.md`](DEPLOYMENT.md:1) - Deployment guide
- [`PRODUCTION-SETUP.md`](PRODUCTION-SETUP.md:1) - Production setup
- [`DEPLOYMENT-CHECKLIST.md`](DEPLOYMENT-CHECKLIST.md:1) - Deployment checklist
- [`PROJECT-STRUCTURE.md`](PROJECT-STRUCTURE.md:1) - This file
- [`database.sql`](database.sql:1) - Database schema

---

## 🎯 Best Practices

### Code Organization
- Keep components small and focused
- Use TypeScript for type safety
- Follow Next.js conventions
- Share code through packages
- Document complex logic

### Performance
- Use Next.js Image optimization
- Implement proper caching
- Lazy load components
- Optimize database queries
- Monitor bundle size

### Security
- Never commit secrets
- Use environment variables
- Implement proper authentication
- Validate all inputs
- Enable RLS on database

### Testing
- Write unit tests for utilities
- Test API endpoints
- Test user flows
- Monitor error rates
- Use staging environment

---

© 2025 DomisLink International Business Lagos Nig Ltd. All rights reserved.
