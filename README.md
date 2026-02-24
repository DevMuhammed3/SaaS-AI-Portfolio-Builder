# ⚡ Full-Stack AI Portfolio Builder

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn/ui-Components-000000?style=flat-square&logo=radix-ui)](https://ui.shadcn.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-ODM-800000?style=flat-square&logo=mongoose)](https://mongoosejs.com/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-3B82F6?style=flat-square&logo=clerk)](https://clerk.com/)
[![Stripe](https://img.shields.io/badge/Payments-Stripe-635BFF?style=flat-square&logo=stripe)](https://stripe.com/)
[![i18n](https://img.shields.io/badge/Intl-React--Intl-FF4088?style=flat-square&logo=react)](https://formatjs.io/docs/react-intl/)
[![Axios](https://img.shields.io/badge/API-Axios-5A29E4?style=flat-square&logo=axios)](https://axios-http.com/)
[![Bun](https://img.shields.io/badge/Package-Bun-000000?style=flat-square&logo=bun)](https://bun.sh/)
[![Netlify](https://img.shields.io/badge/Hosting-Netlify-00C7B7?style=flat-square&logo=netlify)](https://www.netlify.com/)

---

An **AI-powered portfolio builder app** designed to help developers and creators showcase their work effortlessly.
Our platform combines a **modern frontend experience**, a **secure and scalable backend**, and built-in integrations for **authentication, payments, AI features, and multi-language support**.

With this app, you can quickly generate, customize, and publish a professional portfolio powered by the latest full-stack technologies.
---

## ✨ Features

### 1. User Features
- **Authentication & Profiles**
  - Sign up/login with **email/password** or **OAuth** (Google, GitHub)
  - Manage user profile: name, bio, photo, social links
  - Secure authentication using **JWT** or **Clerk**

- **Portfolio Creation & Management**
  - Create multiple portfolios
  - Add **projects**, **work experiences**, **skills**, and **education**
  - Choose **themes/templates**
  - Save as **draft** or **publish**

- **AI-Powered Content Generation**
  - Generate **professional work experiences**
  - Generate **projects** with descriptions, technologies, and demo links
  - Generate **personal profile/bio**
  - Suggest **skills and technologies**
  - Auto-generate unique **portfolio slug/URL**

- **Portfolio Customization**
  - Select multiple **design templates**
  - Custom colors, fonts, and layouts
  - Mark **featured projects**

- **Sharing & Export**
  - Publicly share portfolio via **unique URL**
  - Export to **PDF**
  - Social media sharing links

---

### 2. Admin / Analytics Features
- **Portfolio Analytics**
  - Track **views**, **clicks**, and **interactions**
  - Filter analytics by **date**, **portfolio**, or **interval**
  - Dashboard with **top-performing portfolios**

- **Template Management**
  - CRUD operations for templates
  - Filter by **premium/free**, **tags**, or **categories**
  - Preview templates

- **User Management**
  - View all users and portfolios
  - Role-based access control: Admin, User

---

### 3. AI Features
- **Deep AI Integration**
  - Generate realistic portfolio content using AI
  - Suggest **skills, projects, and achievements**
  - AI-generated project thumbnails and demo URLs
  - Editable AI-generated content

- **Personalization**
  - Tailored to user’s **industry and role**
  - Include relevant **technologies and achievements**

---


## 📚 Tech Stack Overview

- 📦 **Monorepo structure** for clean code organization
- **Frontend** → Next.js 15, React 19, Tailwind, shadcn/ui
- **Backend** → Next.js API Routes, MongoDB + Mongoose
- **Auth & Security** → Clerk
- **Payments** → Stripe and paypal
- **AI Enhancements** → DeepSeek AI
- **Deployment** → Netlify (edge functions & CDN)

---


---

## 🏗️ Project Structure

```
project-root/
├── front/ # Frontend Next.js Application
└── api/ # Backend API Application
```


## 🎨 Frontend Stack

- **Next.js 15** with App Router
- **React 19**
- **Tailwind CSS**
- **TypeScript**
- **shadcn/ui**
- **Framer Motion**
- **Redux Toolkit**
- **React Intl**
- **React Hook Form**
- **Lucide Icons**
- **Clerk Auth**
- **Stripe Payments**

#### Structure

```
front/
├── actions/       # Server actions and form handlers
├── app/           # Next.js App Router pages and layouts
├── components/    # Reusable React components
│   ├── ui/        # shadcn/ui components
│   ├── modules/   # Feature-specific components
│   └── custom/    # Custom shared components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions and configurations
├── providers/     # Context providers (Auth, Theme, etc.)
├── store/         # Redux store and slices
├── stories/       # React components documents stories
├── data/          # Mock data
├── types/         # TypeScript type definitions
└── public/        # Static assets
```

## ⚙️ Backend Stack

- **Next.js API Routes**
- **MongoDB + Mongoose**
- **Zod Validation**
- **CSRF + CORS + Security Headers**
- **Stripe Webhooks**
- **Clerk Webhooks**
- **DeepSeek Integration**

#### Structure

```
api/
├── actions/      # Server-side business logic and operations
├── app/          # Next.js App Router API routes
│   └── api/      # RESTful API endpoints
├── components/   # React Server Components (UI and layout)
├── hooks/        # React hooks (client & server)
├── lib/          # Utility functions and configurations
├── models/       # Mongoose database models
├── repositories/ # Business logic related to models
└── types/        # TypeScript type definitions

```

## 🔧 Getting Started

### Prerequisites

- Node.js 18.17+
- MongoDB instance
- Clerk account
- Stripe account (optional)
- ElevenLabs account (optional)


## 🚀 Installation

```
git clone https://github.com/sylvaincodes/10minportfolioclient.git
cd 10minportfolioclient
```


# Frontend
```
cd front && bun install
```

# Backend
```
cd ../api && bun install
```


## 🔐 Environment Variables
Frontend .env.local

```
#NEXTJS URL
NEXT_PUBLIC_SERVER_URL=http://localhost:3001
NEXT_PUBLIC_WEBSITE_URL=http://localhost:3000

#CLERK APIS
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/
CLERK_WEBHOOK_SECRET=

# GOOGLE ACCOUNT SEND EMAIL
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_SECURE=true


#SENTRY ERROR DEBUGGING
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_DSN=your_private_dsn_here

#DeepSeek
DEEPSEEK_API_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Paypal
PAYPAL_CLIENT_ID=
PAYPAL_SECRET=




```

Backend .env.local
```
#NEXTJS URL
NEXT_PUBLIC_SERVER_URL=http://localhost:3001
NEXT_PUBLIC_WEBSITE_URL=http://localhost:3000

#CLERK APIS
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/
CLERK_WEBHOOK_SECRET=

# GOOGLE ACCOUNT SEND EMAIL
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_SECURE=true

#MONGO DB
MONGODB_URI=

#CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
NODE_ENV=development

#SENTRY ERROR DEBUGGING
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_DSN=

DEEPSEEK_API_KEY=

# Stripe integration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Paypal
PAYPAL_CLIENT_ID=
PAYPAL_SECRET=

```


## 🧪 Run Development Servers
Terminal 1: Backend

```
cd api && bun dev
```

```
cd front && bun dev
```

## 📦 Build for Production

###  Frontend
```
cd front && bun run build
```

###  Backend
```
cd api && bun run build
```


## 🐳 Run the Project with Docker Compose

You can run the **frontend** and **backend** together using Docker Compose.

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)

### Steps

```bash
git clone https://github.com/sylvaincodes/10minportfolioclient.git
cd 10minportfolioclient
Ensure your .env files are correctly set

front/.env → Frontend environment variables

api/.env → Backend environment variables

Build and start the containers

docker-compose up --build
Access the app

Frontend: http://localhost:3000

Backend: http://localhost:3001

Stop the containers

docker-compose down
```

## 🤝 Contributing
Fork the repo

Create a feature branch: git checkout -b feature/my-feature

Commit: git commit -m "feat: my feature"

Push: git push origin feature/my-feature

Open a Pull Request

📄 License
License EULA - see the LICENSE file.

 Author
Sylvain Codes

Patreon https://www.patreon.com/c/sylvaincodes

Support Shop https://www.patreon.com/c/sylvaincodes/shop

Contact Me https://www.patreon.com/messages/8b25e025c56c4d47a903cd9b02049c63?mode=campaign&tab=chats

Built with ❤️ using Next.js, React, and TypeScript
