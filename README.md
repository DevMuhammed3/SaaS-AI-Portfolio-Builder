# SaaS AI Portfolio Builder

An AI-powered, full-stack SaaS platform that enables developers and creators to build, customize, and publish professional portfolios in minutes. Features AI-assisted content generation, premium template marketplace, analytics dashboard, and integrated payments.

**Monorepo structure** with two independent Next.js applications:

| App | Port | Description |
|-----|------|-------------|
| `front/` | 3000 | Customer-facing frontend (Next.js + React) |
| `api/` | 3001 | Backend API (Next.js API Routes + MongoDB) |

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [AI Integration](#ai-integration)
- [Authentication and Authorization](#authentication-and-authorization)
- [Payments](#payments)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Authentication and User Management
- Email/password and OAuth sign-in (Google, GitHub) via Clerk
- Role-based access control (Admin, User)
- User profile management with avatar, bio, social links
- Admin dashboard for user management

### Portfolio Builder
- Create, edit, and manage multiple portfolios
- Add projects, work experiences, skills, certifications, and education
- Portfolio statuses: draft, published, archived
- Auto-generated unique slugs with uniqueness enforcement
- Duplicate existing portfolios
- Public portfolio pages with custom URLs

### AI Content Generation
- Generate professional profiles, work experiences, and projects using OpenAI GPT-4o-mini
- Deterministic offline AI engine with tone-based strategies (professional, technical, confident)
- MongoDB-backed AI response caching for cost optimization
- Fallback sample data when API is unavailable

### Template System
- 5 built-in templates: ModernProfessional, CreativeSplit, MinimalDev, BentoDeveloper, GlassmorphicElegant
- Free and premium template tiers
- Customizable fonts, colors, and layouts per template
- Admin CRUD for template management with tagging and search

### Analytics
- Portfolio view tracking (total views, unique visitors)
- Aggregation by day, week, month, and year intervals
- Per-portfolio analytics with date range filtering
- Recharts-based analytics dashboard

### Payments
- Stripe integration (PaymentIntents + webhook)
- PayPal integration (order verification + webhook)
- Automatic premium plan upgrade on successful payment
- Checkout and pricing pages

### Email System
- Nodemailer with Gmail SMTP (development) and production SMTP
- BullMQ + Redis job queue for async email processing
- Welcome emails, password reset, and notification emails
- Ethereal email preview in development

### Security
- CSRF double-submit token protection
- CORS with configurable origin allowlists
- In-memory rate limiting (20 requests/minute/IP)
- Security headers (HSTS, X-Frame-Options, X-Content-Type-Options)
- Input validation with Zod schemas
- Svix-verified webhooks

### Additional
- Internationalization (i18n) with locale detection
- Storybook for component documentation and visual testing
- Sentry integration for error tracking
- Google Analytics and Tawk.to live chat
- Swagger/OpenAPI documentation at `/api-docs`
- Docker and Docker Compose support
- SEO optimization (sitemap, robots.txt, manifest)

---

## Tech Stack

### Frontend (`front/`)

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Next.js (App Router) | 16.x |
| UI Library | React | 19 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | v4 |
| Component Library | shadcn/ui (new-york style) | - |
| State Management | Redux Toolkit + redux-persist | - |
| Animations | Framer Motion | - |
| 3D | React Three Fiber + Drei | - |
| Forms | React Hook Form + Zod | - |
| HTTP Client | Axios (with cache interceptor) | - |
| Authentication | Clerk | - |
| Payments | Stripe React Elements | - |
| Charts | Recharts | - |
| Icons | Lucide React | - |
| i18n | react-intl | - |
| Testing | Vitest + Playwright (browser) | - |
| Documentation | Storybook | 9.x |
| Monitoring | Sentry | - |

### Backend (`api/`)

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Next.js API Routes (App Router) | 16.x |
| Language | TypeScript | 5.x |
| Database | MongoDB + Mongoose | 8.x |
| Authentication | Clerk + Svix (webhooks) | - |
| AI | OpenAI SDK (GPT-4o-mini) | 5.x |
| AI SDK | Vercel AI SDK | 4.x |
| Payments | Stripe + PayPal | 18.x |
| Validation | Zod | - |
| Email | Nodemailer | - |
| Job Queue | BullMQ + Redis | - |
| API Docs | Swagger (next-swagger-doc) | - |
| Monitoring | Sentry | - |

### Infrastructure

| Category | Technology |
|----------|-----------|
| Runtime | Node.js 20.x |
| Package Manager | Bun |
| Containerization | Docker + Docker Compose |
| Database | MongoDB (Atlas or local) |
| Cache/Queue | Redis |
| Hosting | Netlify (configured) |

---

## Architecture

The project follows a **monorepo architecture** with two independent Next.js applications that communicate via HTTP:

```
Client (Browser)
       |
       v
+------------------+         +------------------+
|   Frontend       |  HTTP   |   Backend API    |
|   (Next.js)      | ------> |   (Next.js)      |
|   Port 3000      |         |   Port 3001      |
+------------------+         +------------------+
       |                           |
       |                           +----> MongoDB
       |                           +----> Redis (BullMQ)
       |                           +----> OpenAI API
       |                           +----> Stripe/PayPal
       |                           +----> SMTP (Email)
       |
       +----> Clerk (Auth)
```

### Backend Architecture Layers

The backend uses a **layered architecture** for separation of concerns:

- **API Routes** (`app/api/`) -- HTTP request handling and response formatting
- **Repositories** (`repositories/`) -- Database access and query logic
- **Models** (`models/`) -- Mongoose schemas and data structures
- **Lib** (`lib/`) -- Utilities, configurations, middleware, and services
- **Modules** (`modules/`) -- Domain-specific business logic (e.g., AI engine)
- **Actions** (`actions/`) -- Server-side reusable operations
- **Validations** (`lib/validations/`) -- Zod schemas for request validation

### Frontend Architecture

The frontend follows an **MVC-inspired structure**:

- **Hooks** (`hooks/`) -- State management and API fetching logic (Model layer)
- **Services** (`lib/services/`) -- API calls and business logic (Controller layer)
- **Components** (`components/`) -- React components and layouts (View layer)
- **Providers** (`providers/`) -- Context providers (Auth, Theme, i18n, etc.)
- **Store** (`store/`) -- Redux store and slices

---

## Project Structure

```
SaaS-AI-Portfolio-Builder/
├── docker-compose.yml
├── README.md
├── LICENSE.md
│
├── api/                                    # Backend API (port 3001)
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── Dockerfile
│   ├── netlify.toml
│   ├── middleware.ts                        # Clerk auth + CORS
│   ├── actions/                            # Server actions
│   │   ├── role.ts
│   │   └── user.ts
│   ├── app/
│   │   ├── api-docs/                       # Swagger UI page
│   │   └── api/
│   │       ├── admin/                      # Admin endpoints
│   │       │   ├── templates/              # Template CRUD + duplicate
│   │       │   └── users/                  # User management
│   │       ├── ai/
│   │       │   └── generate/               # Deterministic AI engine
│   │       ├── csrf/                       # CSRF token endpoint
│   │       ├── ping/                       # Health check
│   │       ├── public/                     # Public endpoints
│   │       │   ├── portfolio/              # Public portfolio + slug validation
│   │       │   ├── templates/              # Public template listing
│   │       │   └── sendmail/               # Contact form email
│   │       ├── seed/                       # Database seeding
│   │       ├── test-db/                    # DB connectivity test
│   │       └── user/                       # Authenticated user endpoints
│   │           ├── portfolios/             # Portfolio CRUD + publish/archive
│   │           ├── portfolio-analytics/    # Analytics data
│   │           ├── prompt/                 # AI generation (profile/experience/projects)
│   │           ├── stripe/                 # Stripe payment intents
│   │           └── paypal/                 # PayPal verification
│   ├── lib/
│   │   ├── authGuard.tsx                   # Authentication guard
│   │   ├── cors.ts                         # CORS configuration
│   │   ├── csrf.ts                         # CSRF protection
│   │   ├── database.ts                     # Mongoose connection
│   │   ├── mongo.ts                        # Native MongoDB driver
│   │   ├── ratelimit.ts                    # Rate limiting
│   │   ├── mail-service.ts                 # Email sending
│   │   ├── swagger.ts                      # Swagger configuration
│   │   ├── queue/                          # BullMQ email queue
│   │   ├── services/                       # Business services
│   │   └── validations/                    # Zod schemas
│   ├── models/                             # Mongoose models
│   │   ├── Contact.ts
│   │   ├── Portfolio.ts
│   │   ├── PortfolioAnalytic.ts
│   │   ├── Template.ts
│   │   └── User.ts
│   ├── modules/
│   │   └── ai/                             # Deterministic AI engine
│   │       ├── ai.facade.ts
│   │       ├── deterministic.engine.ts
│   │       ├── strategies/
│   │       ├── templates/
│   │       └── utils/
│   ├── netlify/functions/                  # Webhook handlers
│   │   ├── clerk-webhook.ts
│   │   ├── stripe-webhook.ts
│   │   └── paypal-webhook.ts
│   ├── repositories/                       # Data access layer
│   └── types/                              # TypeScript types
│
└── front/                                  # Frontend (port 3000)
    ├── package.json
    ├── tsconfig.json
    ├── next.config.ts
    ├── Dockerfile
    ├── netlify.toml
    ├── middleware.ts                        # Clerk auth + locale detection
    ├── vitest.config.ts                    # Test configuration
    ├── actions/                            # Server actions
    │   ├── auth.ts
    │   ├── portfolio.ts
    │   ├── role.ts
    │   └── user.ts
    ├── app/
    │   ├── manifest.ts
    │   ├── robots.ts
    │   ├── sitemap.ts
    │   └── [locale]/
    │       ├── layout.tsx
    │       ├── (landing)/                  # Landing page
    │       ├── (dashboard)/
    │       │   ├── admin/                  # Admin dashboard
    │       │   └── user/                   # User dashboard
    │       │       ├── analytics/          # Analytics views
    │       │       ├── payment/            # Checkout flow
    │       │       ├── portfolios/         # Portfolio management
    │       │       └── settings/           # User settings
    │       ├── (pages)/                    # Static pages
    │       │   ├── about/
    │       │   ├── checkout/
    │       │   ├── features/
    │       │   ├── pricing/
    │       │   ├── privacy/
    │       │   └── public-portfolios/
    │       ├── (portfolio)/
    │       │   └── [slug]/                 # Public portfolio view
    │       └── docs/                       # Documentation page
    ├── components/
    │   ├── custom/                         # Shared custom components
    │   ├── modules/                        # Feature-specific components
    │   ├── portfolio-templates/            # 5 portfolio templates
    │   └── ui/                             # shadcn/ui components
    ├── hooks/                              # Custom React hooks
    ├── lib/
    │   ├── api-client.ts                   # Axios with CSRF + cache
    │   ├── services/                       # API service layer
    │   └── validations/                    # Zod schemas
    ├── providers/                          # Context providers
    ├── store/                              # Redux store
    ├── stories/                            # Storybook stories
    ├── types/                              # TypeScript types
    └── public/
        ├── images/
        ├── locales/messages/               # i18n messages
        └── templates/                      # Template assets
```

---

## Getting Started

### Prerequisites

| Requirement | Version | Purpose |
|------------|---------|---------|
| Node.js | 20.x | Runtime |
| Bun | 1.x | Package manager |
| MongoDB | 6.x+ | Database (or MongoDB Atlas) |
| Redis | 7.x+ | Job queue for emails |
| Clerk account | - | Authentication |
| OpenAI API key | - | AI content generation |
| Stripe account | - | Payment processing (optional) |
| PayPal account | - | Payment processing (optional) |

### Installation

1. Clone the repository:

```bash
git clone https://github.com/sylvaincodes/portfolio-builder.git
cd portfolio-builder
```

2. Install backend dependencies:

```bash
cd api
bun install
```

3. Install frontend dependencies:

```bash
cd ../front
bun install
```

4. Configure environment variables (see [Environment Variables](#environment-variables)):

```bash
cp api/.env.local.example api/.env.local
cp front/.env.local.example front/.env.local
# Edit both files with your credentials
```

5. Seed the database with default templates:

```bash
cd ../api
bun run dev
# In another terminal:
curl http://localhost:3001/api/seed/templates
```

---

## Environment Variables

### Backend (`api/.env.local`)

#### Application

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SERVER_URL` | Backend server URL | `http://localhost:3001` |
| `NEXT_PUBLIC_WEBSITE_URL` | Frontend website URL | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | API base URL | `http://localhost:3001/api` |
| `NODE_ENV` | Environment mode | `development` |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated) | `http://localhost:3000,http://localhost:3001` |

#### Clerk Authentication

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `CLERK_WEBHOOK_SECRET` | Clerk webhook signing secret |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign-in page URL |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign-up page URL |

#### MongoDB

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |

#### OpenAI

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key for GPT-4o-mini |

#### Stripe

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |

#### PayPal

| Variable | Description |
|----------|-------------|
| `PAYPAL_CLIENT_ID` | PayPal client ID |
| `PAYPAL_SECRET` | PayPal secret key |
| `PAYPAL_WEBHOOK_SECRET` | PayPal webhook signing secret |

#### Redis (Email Queue)

| Variable | Description | Default |
|----------|-------------|---------|
| `REDIS_HOST` | Redis host | `127.0.0.1` |
| `REDIS_PORT` | Redis port | `6379` |
| `REDIS_PASSWORD` | Redis password | - |
| `REDIS_DB` | Redis database number | `0` |

#### Email (SMTP)

| Variable | Description |
|----------|-------------|
| `MAIL_USER` | SMTP username |
| `MAIL_PASSWORD` | SMTP password |
| `MAIL_HOST` | SMTP host |
| `MAIL_PORT` | SMTP port |
| `MAIL_SECURE` | Use TLS (`true`/`false`) |
| `MAIL_FROM` | Sender email address |

#### Sentry

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN (client) |
| `SENTRY_DSN` | Sentry DSN (server) |

### Frontend (`front/.env.local`)

The frontend requires the same Clerk, Stripe, PayPal, and Sentry variables as the backend, plus:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_CORS_ENABLED` | Enable CORS (`true`/`false`) |

Refer to `front/.env.local` for the complete list.

---

## Running the Application

### Development

Start both applications in separate terminals:

```bash
# Terminal 1 - Backend API (port 3001)
cd api
bun dev

# Terminal 2 - Frontend (port 3000)
cd front
bun dev
```

Access the applications at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Documentation: http://localhost:3001/api-docs

### Production Build

```bash
# Build and start backend
cd api
bun run build
bun start

# Build and start frontend
cd front
bun run build
bun start
```

### Docker

Run the entire stack with Docker Compose:

```bash
docker-compose up --build
```

This starts both the frontend (port 3000) and backend (port 3001) in production mode.

To stop:

```bash
docker-compose down
```

### Storybook

Run the component documentation and visual testing environment:

```bash
cd front
bun run storybook
```

Opens at http://localhost:6006.

---

## API Documentation

Interactive Swagger documentation is available at:

```
http://localhost:3001/api-docs
```

### Public Endpoints (No Authentication)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/ping` | Health check |
| GET | `/api/csrf` | Generate CSRF token |
| GET | `/api/test-db` | Test MongoDB connection |
| GET | `/api/seed/templates` | Seed default templates |
| GET | `/api/public/templates` | List templates (paginated, filterable) |
| GET | `/api/public/portfolio` | List published public portfolios |
| GET | `/api/public/portfolio/validate-slug` | Validate slug format and availability |
| GET | `/api/public/portfolio/[slug]` | Get published portfolio by slug |
| POST | `/api/public/portfolio/[slug]/addview` | Record a portfolio view |
| POST | `/api/public/portfolio/[slug]/sendmail` | Submit contact form |
| POST | `/api/public/sendmail` | Send generic contact email |

### User Endpoints (Authentication Required)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/user/portfolios` | List user's portfolios (paginated) |
| POST | `/api/user/portfolios` | Create a new portfolio |
| GET | `/api/user/portfolios/[id]` | Get portfolio by ID |
| PUT | `/api/user/portfolios/[id]` | Update portfolio |
| DELETE | `/api/user/portfolios/[id]` | Delete portfolio |
| PATCH | `/api/user/portfolios/[id]/duplicate` | Duplicate a portfolio |
| PATCH | `/api/user/portfolios/[id]/publish` | Publish portfolio |
| DELETE | `/api/user/portfolios/[id]/unpublish` | Unpublish portfolio |
| DELETE | `/api/user/portfolios/[id]/archive` | Archive portfolio |
| GET | `/api/user/portfolios/preview/[slug]` | Preview any portfolio by slug |
| GET | `/api/user/portfolio-analytics` | Get aggregate view analytics |
| GET | `/api/user/single-portfolio-analytics` | Get per-portfolio analytics |
| GET | `/api/user/templates` | List available templates |
| GET | `/api/user/[id]` | Get user profile |
| PUT | `/api/user/[id]` | Update user profile |
| DELETE | `/api/user/[id]` | Delete user account |
| POST | `/api/user/prompt/profile` | AI-generate profile content |
| POST | `/api/user/prompt/experience` | AI-generate work experiences |
| POST | `/api/user/prompt/projects` | AI-generate project entries |
| POST | `/api/user/stripe/create-payment-intent` | Create Stripe payment intent |
| POST | `/api/user/paypal` | Verify PayPal payment |
| POST | `/api/user/paypal/verify-payment` | Verify PayPal order (sandbox) |

### Admin Endpoints (Admin Role Required)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/admin/templates` | List all templates |
| POST | `/api/admin/templates` | Create a template |
| PUT | `/api/admin/templates/[id]` | Update a template |
| DELETE | `/api/admin/templates/[id]` | Delete a template |
| POST | `/api/admin/templates/[id]/duplicate` | Duplicate a template |
| GET | `/api/admin/users` | List users (paginated, filterable) |
| PUT | `/api/admin/users/[id]` | Update a user |
| DELETE | `/api/admin/users/[id]` | Delete a user |

### AI Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/ai/generate` | Deterministic template-based content generation |

### Webhook Endpoints (Netlify Functions)

| Function | Trigger | Description |
|----------|---------|-------------|
| `clerk-webhook` | Clerk events | Sync users to MongoDB, set roles/plans, send welcome email |
| `stripe-webhook` | Stripe events | Upgrade to premium on successful payment |
| `paypal-webhook` | PayPal events | Upgrade to premium on successful capture |

---

## AI Integration

### OpenAI GPT-4o-mini (Primary)

The main AI integration uses OpenAI's GPT-4o-mini model for generating portfolio content:

- **Profile generation** -- Creates a professional profile with name, title, bio, contact info, and social links
- **Experience generation** -- Generates 2-3 work experiences with titles, companies, descriptions, and date ranges
- **Project generation** -- Generates 3-4 projects with descriptions, tech stacks, thumbnail URLs, and demo/GitHub links

All generation endpoints use `temperature: 0.7` and return structured JSON validated against Zod schemas.

### Deterministic AI Engine (Offline)

A custom, zero-cost AI engine that generates content without API calls:

- **Tone strategies**: Professional, Technical, Confident
- **Seeded variations**: SHA-256-based deterministic phrasing from input seeds
- **MongoDB caching**: Results stored in `ai_cache` collection, keyed by `{ userId, type, hash }`
- **Facade pattern**: `DeterministicTemplateEngine` accessed through `ai.facade.ts`

### Frontend Integration

The `useAIPrompt` hook manages AI content generation on the frontend:

- Loading states for each generation type
- Automatic fallback to sample data if the API fails
- Integration with the portfolio wizard steps (profile, experience, projects)

---

## Authentication and Authorization

### Clerk Integration

Both applications use Clerk for authentication:

- **Sign-in methods**: Email/password, Google OAuth, GitHub OAuth
- **Session management**: Clerk middleware in both `api/middleware.ts` and `front/middleware.ts`
- **JWT tokens**: Bearer tokens used for API authentication

### Role-Based Access Control

| Role | Access |
|------|--------|
| User | Create/manage own portfolios, analytics, AI generation, payments |
| Admin | All user permissions + template CRUD, user management, admin dashboard |

Roles are stored in Clerk's `privateMetadata.role` and verified via the `authGuard` utility.

### Webhook Sync

Clerk webhooks (verified via Svix) keep MongoDB in sync:
- `user.created` / `user.updated` -- Create/update MongoDB user record
- `user.deleted` -- Remove user from MongoDB
- `session.created` / `session.removed` -- Session lifecycle events

### Security Layers

- **CSRF**: Double-submit cookie pattern via `/api/csrf` endpoint, automatically attached to non-GET requests by the frontend Axios client
- **CORS**: Configurable origin allowlists applied at middleware level
- **Rate Limiting**: In-memory rate limiter (20 requests/minute per IP)
- **Security Headers**: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and more (set in `next.config.ts`)
- **Input Validation**: All API inputs validated with Zod schemas

---

## Payments

### Stripe

- PaymentIntent creation at `/api/user/stripe/create-payment-intent`
- Stripe webhook at Netlify function `stripe-webhook`
- On `payment_intent.succeeded`: upgrades user to premium plan, stores billing info in both Clerk metadata and MongoDB

### PayPal

- PayPal order verification at `/api/user/paypal/verify-payment`
- PayPal webhook at Netlify function `paypal-webhook`
- HMAC signature verification for webhook authenticity
- Same premium upgrade flow as Stripe

### Premium Features

Premium users gain access to:
- Premium portfolio templates
- Priority AI generation
- Advanced analytics features

---

## Contributing

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/my-feature
   ```
3. Make your changes
4. Run linting to verify code quality:
   ```bash
   cd front && bun run lint
   cd api && bun run lint
   ```
5. Commit with a descriptive message:
   ```bash
   git commit -m "feat: add my feature"
   ```
6. Push to your fork:
   ```bash
   git push origin feature/my-feature
   ```
7. Open a Pull Request against `main`

---

## License

This project is licensed under the End-User License Agreement (EULA). See [LICENSE.md](LICENSE.md) for details.
