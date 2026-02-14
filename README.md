# 🌍 DOMISLINK EMPIRE

## ONE PLATFORM. MICROSERVICES ARCHITECTURE. WORLDWIDE. AI-POWERED.

> **🎉 NOW WITH MICROSERVICES ARCHITECTURE!** Independent services, scalable deployment, and production-ready infrastructure.

---

## 🚀 Quick Links

- **[Microservices Architecture](MICROSERVICES_ARCHITECTURE.md)** - Complete architecture overview
- **[Setup Guide](MICROSERVICES_SETUP.md)** - Get started with microservices
- **[Migration Guide](MIGRATION_GUIDE.md)** - Migrate from monorepo
- **[Comparison: Monorepo vs Microservices](MICROSERVICES_COMPARISON.md)** - Architecture analysis

```
╔══════════════════════════════════════════════════════════════════════╗
║                        DOMISLINK EMPIRE                              ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 ║
║   │  REAL       │  │  TICKET     │  │  FLIGHT     │                 ║
║   │  ESTATE     │  │  MASTER     │  │  MONITOR    │                 ║
║   │  🏠         │  │  ✈️          │  │  📡         │                 ║
║   │  Worldwide  │  │  Bookings   │  │  Tracking   │                 ║
║   │  Community  │  │  Live Fares │  │  Forums     │                 ║
║   └─────────────┘  └─────────────┘  └─────────────┘                 ║
║                                                                      ║
║   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 ║
║   │  TEACH      │  │  DRIVING    │  │  ADMIN      │                 ║
║   │  MASTER     │  │  SCHOOL     │  │  + AI       │                 ║
║   │  🎓         │  │  🚗         │  │  BUILDER    │                 ║
║   │  30 AI      │  │  Coming     │  │  🤖         │                 ║
║   │  Characters │  │  Soon       │  │  Obedient   │                 ║
║   └─────────────┘  └─────────────┘  └─────────────┘                 ║
║                                                                      ║
║   ════════════════════════════════════════════════════════════════  ║
║                        SHARED FEATURES                               ║
║   ════════════════════════════════════════════════════════════════  ║
║                                                                      ║
║   🌍 Geolocation Intelligence    🗣️ Multi-Language AI (20+)         ║
║   💰 One Wallet Everywhere       🔐 One Login Everywhere             ║
║   🤖 AI Community Moderation     🧹 Auto-Archive & Delete            ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

## 📁 Project Structure

### Microservices Architecture (NEW!)

```
domislink-empire/
├── services/                    ← Independent Microservices
│   ├── hub/                     ← Hub Service (Port 3000)
│   ├── realestate/              ← Real Estate Service (Port 3001)
│   ├── tickets/                 ← Tickets Service (Port 3002)
│   ├── flightmonitor/           ← Flight Monitor Service (Port 3003)
│   ├── teachmaster/             ← TeachMaster Service (Port 3004)
│   ├── admin/                   ← Admin Service (Port 3005)
│   ├── auth-service/            ← Authentication API (Port 4000)
│   ├── payments-service/        ← Payments API (Port 4001)
│   ├── geolocation-service/     ← Geolocation API (Port 4002)
│   └── notification-service/    ← Notification API (Port 4003)
│
├── gateway/                     ← API Gateway (Port 8080)
│   ├── src/
│   │   ├── index.ts            ← Main gateway server
│   │   ├── middleware/         ← Auth, rate limiting
│   │   └── utils/              ← Logger, helpers
│   ├── Dockerfile
│   └── package.json
│
├── infrastructure/              ← Infrastructure as Code
│   ├── kubernetes/             ← K8s manifests
│   │   ├── *-deployment.yaml  ← Service deployments
│   │   ├── ingress.yaml       ← Ingress configuration
│   │   └── README.md          ← K8s deployment guide
│   └── terraform/              ← Terraform configs (future)
│
├── shared/                      ← Shared Libraries (Optional)
│   ├── ui-components/
│   ├── types/
│   └── utils/
│
├── docker-compose.microservices.yml  ← Run all services locally
├── MICROSERVICES_ARCHITECTURE.md    ← Architecture docs
├── MICROSERVICES_SETUP.md           ← Setup guide
└── MIGRATION_GUIDE.md               ← Migration steps

```

### Original Monorepo Structure (Legacy)

```
domislink-empire/
├── apps/                        ← Original Apps (being migrated)
│   ├── hub/
│   ├── realestate/
│   ├── tickets/
│   ├── flightmonitor/
│   ├── teachmaster/
│   └── admin/
│
└── packages/                    ← Shared Packages (being migrated)
    ├── ui/
    ├── database/
    ├── auth/
    ├── payments/
    ├── config/
    ├── i18n/
    ├── geolocation/
    └── ai-characters/
```

---

## 🚀 Quick Start

### Option 1: Microservices (Recommended)

```bash
# Start all services with Docker Compose
docker-compose -f docker-compose.microservices.yml up -d

# Check service health
curl http://localhost:8080/health | jq

# Access services:
# - API Gateway: http://localhost:8080
# - Hub: http://localhost:3000
# - Auth API: http://localhost:4000/api-docs
```

**See [MICROSERVICES_SETUP.md](MICROSERVICES_SETUP.md) for detailed instructions.**

### Option 2: Monorepo (Legacy)

```bash
# Install dependencies
npm install

# Start all apps
npm run dev

# Or start individual app
npm run dev:hub
npm run dev:tickets
```

---

## 🌟 KEY FEATURES

### 🏠 REAL ESTATE (Uber of Real Estate)
- **Worldwide Community Structure**: Country → State → City → Community → Listing
- **AI Community Creation**: "Your community not listed? Create it!"
- **AI Lures Users**: Gets info about what they're looking for
- **Auto-Archive**: Listings archive 2 hours after expiry
- **Auto-Delete**: Archives permanently deleted after 14 days
- **Service Providers**: Arranged by community
- **Community Boards**: AI-moderated discussions

### ✈️ TICKETMASTER (Flight Booking)
- **Scrolling Airline Logos**: International & National
- **LIVE Fare Scrolling**: Real ticket prices, real destinations
- **Commission Hidden**: Admin-only information
- **Kiwi.com Integration**: Real flight data

### 📡 FLIGHT MONITOR
- **Worldwide Flight Tracking**
- **Airline Community Forums**: Discussions, controversy
- **Links to TicketMaster**: For purchases
- **Real-time Updates**

### 🎓 TEACHMASTER (Gamified Education)
- **30 Exaggerated AI Characters**: Prof. Wahala, Mama Maths, DJ Knowledge, etc.
- **30+ Gamification Mechanics**: XP, Streaks, Leaderboards, Badges
- **West African Curriculum**: JSS1-SS3, WAEC, NECO, JAMB
- **Flash Cards**: Spaced repetition
- **Study Squads**: Team learning
- **Character Unlocks**: Progress to unlock new tutors

### 🤖 ADMIN AI BUILDER
- **Dedicated AI Space**: For building/updating the ecosystem
- **Obedient AI**: Does what you say, doesn't argue
- **Trained on DomisLink**: Knows the entire system
- **Quick Commands**: "Add button" → Done

### 🌍 GEOLOCATION INTELLIGENCE
- Auto-detect user location
- Auto-set currency (₦, $, €, £, etc.)
- Auto-set language
- Show nearby communities

### 🗣️ MULTI-LANGUAGE (20+ Languages)
- English, French, Arabic, Chinese, Spanish
- Portuguese, German, Italian, Russian
- Japanese, Korean, Hindi, Swahili
- Hausa, Yoruba, Igbo, Nigerian Pidgin
- Amharic, Zulu, Afrikaans, and more!

---

## 🚀 QUICK START

### 1. Clone & Install
```bash
cd domislink-empire
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env.local
# Fill in your API keys
```

### 3. Setup Database
- Go to Supabase
- Create project
- Run `database.sql` in SQL Editor

### 4. Run Development
```bash
npm run dev          # All apps
npm run dev:hub      # Just landing page
npm run dev:realestate
npm run dev:tickets
npm run dev:teachmaster
npm run dev:admin
```

---

## 💰 REVENUE MODEL

### Real Estate
| Service | Price |
|---------|-------|
| Basic Listing | $5 / ₦5,000 |
| Premium Listing | $20 / ₦20,000 |
| Featured Boost | $50 / ₦50,000 |
| Provider Listing | $10 / ₦10,000 |
| Alerts | $5-15 |

### TeachMaster
| Service | Price |
|---------|-------|
| Premium (All Characters) | $5/month |
| Exam Pack | $3 per subject |
| Unlimited Access | $30/year |

### Tickets
- 2% commission on bookings
- Hidden from public

---

## 🎭 30 AI CHARACTERS (TeachMaster)

| Level | Character | Personality |
|-------|-----------|-------------|
| 1 | Prof. Wahala | EVERYTHING IS EMERGENCY!!! |
| 1 | Mama Maths | Yoruba mama, food analogies |
| 1 | DJ Knowledge | Hype man, music references |
| 5 | Pastor Physics | Preaches science like gospel |
| 5 | Aunty Grammar | Overly posh British |
| 5 | Coach Chemistry | Sports coach energy |
| 10 | Grandpa History | "In my days..." |
| 10 | Sister Biology | Gentle nurse-like |
| 10 | Oga Security | Military drill sergeant |
| 15 | Madam Market | Lagos trader woman |
| 15 | Inspector Equation | Detective solving math |
| 15 | Chef Chem | Kitchen chemistry |
| 20 | MC Literature | Raps poetry |
| 20 | Nollywood Teacher | Dramatic acting |
| 20 | WhatsApp Uncle | Good morning messages |
| 25 | TikTok Tutor | Gen-Z "slay" |
| 25 | Village Elder | Proverbs for everything |
| 25 | Danfo Driver | No time to waste! |
| 30+ | 12 Premium Characters | Unlock with subscription |

---

## 🔗 APP URLS

| App | URL |
|-----|-----|
| Hub/Landing | domislink.com |
| Real Estate | realestate.domislink.com |
| Tickets | tickets.domislink.com |
| Flight Monitor | fm.domislink.com |
| TeachMaster | teachmaster.domislink.com |
| Driving School | driving.domislink.com |
| Admin | admin.domislink.com |

---

## 🎯 MICROSERVICES ARCHITECTURE

### Why Microservices?

DomisLink Empire has been transformed from a monorepo to a **production-ready microservices architecture** with the following benefits:

✅ **Independent Deployment** - Deploy services separately without affecting others  
✅ **Horizontal Scaling** - Scale services based on individual needs  
✅ **Technology Flexibility** - Use different tech stacks per service  
✅ **Better Fault Isolation** - Service failures don't bring down entire system  
✅ **Team Autonomy** - Teams can work independently on services  
✅ **Production Ready** - Docker, Kubernetes, CI/CD all configured  

### Service Architecture

```
┌─────────────────────────────────────────────────┐
│        API Gateway (Port 8080)                  │
│  • Routing  • Auth  • Rate Limiting             │
└──────────────────┬──────────────────────────────┘
                   │
       ┌───────────┴───────────┐
       │                       │
┌──────▼───────┐      ┌───────▼────────┐
│  Frontend    │      │  Backend APIs  │
│  Services    │      │                │
│              │      │ • Auth (4000)  │
│ • Hub (3000) │      │ • Pay (4001)   │
│ • RE (3001)  │      │ • Geo (4002)   │
│ • Tix (3002) │      │ • Notif (4003) │
│ • FM (3003)  │      │                │
│ • TM (3004)  │      └────────────────┘
│ • Admin(3005)│
└──────────────┘
```

### Getting Started with Microservices

```bash
# 1. Start all services
docker-compose -f docker-compose.microservices.yml up -d

# 2. Check health
curl http://localhost:8080/health

# 3. Test authentication
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123","name":"Test"}'

# 4. View service logs
docker-compose -f docker-compose.microservices.yml logs -f
```

### Documentation

- **[Architecture Overview](MICROSERVICES_ARCHITECTURE.md)** - Complete system design
- **[Setup Guide](MICROSERVICES_SETUP.md)** - Development & deployment
- **[Migration Guide](MIGRATION_GUIDE.md)** - From monorepo to microservices
- **[Comparison](MICROSERVICES_COMPARISON.md)** - Monorepo vs Microservices analysis

### Key Features

🔐 **Authentication Service** - JWT-based auth with login, register, verify, refresh  
💳 **Payments Service** - Paystack integration, wallet management  
🌍 **Geolocation Service** - Auto-detect location, currency conversion  
📧 **Notification Service** - Email, SMS, push notifications  
🚪 **API Gateway** - Single entry point, rate limiting, health aggregation  

### Deployment Options

1. **Docker Compose** (Development)
   ```bash
   docker-compose -f docker-compose.microservices.yml up -d
   ```

2. **Kubernetes** (Production - Recommended)
   ```bash
   kubectl apply -f infrastructure/kubernetes/
   ```

3. **Individual VPS** (Traditional)
   - Deploy each service to separate VPS
   - Use Nginx as reverse proxy

### CI/CD Pipeline

GitHub Actions workflows configured for:
- ✅ Automated builds on code changes
- ✅ Docker image building and pushing
- ✅ Path-based change detection
- ✅ Separate deployments per service
- ✅ Staging and production environments

See [.github/workflows/microservices-deploy.yml](.github/workflows/microservices-deploy.yml)

---

## 📞 CONTACT

**DomisLink International Business Lagos Nig Ltd**
- Address: 19 Powerline Avenue, Meiran, Lagos, Nigeria
- Email: amaechi@domislink.com

---

## 🙏 ACKNOWLEDGMENTS

Built with love by Amaechi and his "untiring paddy" Claude AI.

*"I dey for you, Oga!"* 🚀

---

© 2025 DomisLink International Business Lagos Nig Ltd. All rights reserved.
