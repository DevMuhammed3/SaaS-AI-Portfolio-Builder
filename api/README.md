# ⚙️ Backend - Full-Stack AI Portfolio Builder

This is the **backend** part of the AI Portfolio Builder project, built with **Next.js API Routes**, **MongoDB**, **Mongoose**, **TypeScript**, and **Bun**.
It provides a secure, scalable, and modular server-side layer for the frontend application.

---

## 🏗️ Features

### Core Features
- **Authentication & Authorization**
  - Secure authentication with **Clerk**
  - Role-based access control (Admin, User)
  - JWT support for protected endpoints

- **Portfolio Management**
  - CRUD operations for portfolios
  - Fetch public or user-specific portfolios
  - Draft and publish portfolios
  - AI-powered content generation for portfolio projects and experiences

- **Template Management**
  - CRUD operations for portfolio templates
  - Filter templates by **premium/free**, **tags**, or **categories**
  - Preview templates before selection

- **Analytics**
  - Track **portfolio views, clicks, and interactions**
  - Filter analytics by **date**, **portfolio**, or **interval**
  - Dashboard with **top-performing portfolios**

- **Payment Integration**
  - Stripe payments for premium templates
  - Webhook handling for payment confirmation

- **AI Integration**
  - Deep AI content generation for portfolios
  - Personalized suggestions for skills, projects, and achievements
  - Editable AI-generated content

---

## 🧩 Tech Stack

- **Node.js + Bun**
- **Next.js API Routes**
- **MongoDB + Mongoose**
- **Clerk Authentication**
- **Stripe Payment Integration**
- **DeepSeek AI**
- **Zod validation**
- **CSRF, CORS & Security headers**

---

## 🏗️ Architecture

The backend is **modular and scalable**, using the following layers:

- **Actions** → Server-side business logic and operations
- **API Routes (app/api)** → Next.js API endpoints
- **Repositories** → Database access & model business logic
- **Models** → Mongoose database schemas
- **Hooks** → Server-side reusable logic
- **Lib** → Utilities, configs, and helper functions
- **Types** → TypeScript type definitions

#### Directory Structure

api/
├── actions/ # Server-side business logic
├── app/ # Next.js App Router API routes
│ └── api/ # RESTful API endpoints
├── components/ # Server components (if any)
├── hooks/ # Reusable server hooks
├── lib/ # Utilities, configs, helper functions
├── models/ # Mongoose database models
├── repositories/ # Business logic related to models
└── types/ # TypeScript type definitions

---

## 🔧 Setup & Run

### Prerequisites
- Node.js 18.17+
- Bun package manager
- MongoDB instance
- `.env` file configured (see `.env.example`)

### Install Dependencies
```bash
cd api
bun install
Run Development Server

bun dev
Build for Production

bun run build
bun start
🏷️ Environment Variables
Create a .env file in api/:


NEXT_PUBLIC_SERVER_URL=http://localhost:3001
NEXT_PUBLIC_WEBSITE_URL=http://localhost:3000

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

MONGODB_URI=mongodb://localhost:27017/portfolio-db

DEEPSEEK_API_KEY=

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
NODE_ENV=development
🐳 Run Backend with Docker
You can run the backend using Docker Compose:


docker-compose up --build backend
Access the backend API at:

http://localhost:3001
Stop the container:

docker-compose down
🤝 Contributing
Fork the repo

Create a feature branch: git checkout -b feature/my-feature

Commit your changes: git commit -m "feat: my feature"

Push: git push origin feature/my-feature

Open a Pull Request

Author
Sylvain Codes

Patreon: https://www.patreon.com/c/sylvaincodes

Support Shop: https://www.patreon.com/c/sylvaincodes/shop

Contact: https://www.patreon.com/messages/8b25e025c56c4d47a903cd9b02049c63?mode=campaign&tab=chats
