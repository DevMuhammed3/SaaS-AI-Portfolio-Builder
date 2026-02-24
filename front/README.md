# 🌐 Frontend - Full-Stack AI Portfolio Builder

This is the **frontend** part of the AI Portfolio Builder project, built with **Next.js 15**, **React 19**, **Tailwind CSS**, **shadcn/ui**, and **TypeScript**.
It follows a **MVC-inspired architecture** with hooks for state management and services for API interactions.

---

## 🏗️ Features

### Core Features
- **Authentication & Profiles**
  - Sign up/login with **email/password** or **OAuth** (Google, GitHub)
  - Manage user profile: name, bio, photo, social links
  - Secure authentication with **Clerk**

- **Portfolio Builder**
  - Create multiple portfolios
  - Add **projects, work experiences, skills, education**
  - Choose **themes/templates**
  - Drafts and publishing support

- **AI-Powered Content Generation**
  - Generate professional work experiences
  - Generate projects with descriptions, technologies, demo URLs
  - Suggest skills and technologies
  - Auto-generate unique portfolio slugs/URLs

- **Customization**
  - Select **design templates**
  - Custom colors, fonts, and layouts
  - Mark featured projects

- **Sharing & Export**
  - Publicly share portfolio via **unique URL**
  - Export portfolio to **PDF**
  - Social media sharing links

- **Stories/Books**
  - Component documentation and usage examples
  - Interactive UI previews

---

## ⚙️ Tech Stack

- **Next.js 15** with App Router
- **React 19**
- **Tailwind CSS 3.4**
- **shadcn/ui**
- **Framer Motion**
- **Redux Toolkit**
- **React Intl** (i18n support)
- **TypeScript**
- **Clerk Auth**
- **Stripe Payments**
- **Axios** for API requests

---

## 🧩 Architecture

We use an **MVC-inspired structure**:

- **Hooks (Model)**: Manage component state, API fetching, and reusable logic.
- **Services (Controller)**: Handle API calls, business logic, and side effects.
- **Views (View)**: React components and layouts rendering the UI.

#### Directory Structure

front/
├── actions/ # Server actions & form handlers
├── app/ # Next.js App Router pages & layouts
├── components/ # Reusable React components
│ ├── ui/ # shadcn/ui components
│ ├── modules/ # Feature-specific components
│ └── custom/ # Custom shared components
├── hooks/ # Custom React hooks (Models)
├── lib/ # Utility functions and config
├── providers/ # Context providers (Auth, Theme, etc.)
├── services/ # API & business logic (Controllers)
├── store/ # Redux store and slices
├── stories/ # Component documentation (Storybook)
├── types/ # TypeScript type definitions
└── public/ # Static assets

yaml
Copy code

---

## 🔧 Setup & Run

### Prerequisites
- Node.js 18.17+
- Bun package manager
- `.env` file configured (see project root `.env.example`)

### Install Dependencies

```bash
cd front
bun install
Run Development Server

bun dev
Build for Production


bun run build
bun start
📖 Stories / UI Documentation
The project includes Storybook integration for UI components.

Stories are located in front/stories/.

Run Storybook with:


bun run storybook
🏷️ Environment Variables
Create a .env file in front/:


NEXT_PUBLIC_SERVER_URL=http://localhost:3001
NEXT_PUBLIC_WEBSITE_URL=http://localhost:3000

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=

DEEPSEEK_API_KEY=
