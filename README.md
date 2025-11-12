## Fervent Blog · Kuku Inspired Studio

This project is a heavily customised Next.js blog system inspired by [KukuBlog](https://kukutx.github.io/kukuBlog.github.io/). It combines a Firebase powered content workflow with a multilingual presentation layer including:

- GitHub authentication (via Firebase Auth) restricted to a single owner.
- A private admin studio to create, update and delete Firestore backed blog posts.
- Dedicated portfolio, resume and creative tools pages.
- Live post pages with automatic real-time updates.
- Internationalisation with English, Simplified Chinese, Spanish and French translations.

## Prerequisites

- Node.js 18+
- A Firebase project configured with Authentication (GitHub provider) and Cloud Firestore.

## Environment variables

Create a `.env.local` file with the following public variables (values shown are placeholders):

```bash
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."
# optional comma separated list of emails allowed to access the admin studio
NEXT_PUBLIC_OWNER_EMAILS="me@example.com"
```

## Run locally

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and you will be automatically redirected to the default locale (`/en`).

## Project structure

- `src/app/[locale]` – App Router locale segments and pages.
- `src/components` – UI building blocks (layout shell, admin studio, tools, etc.).
- `src/lib/firebase.ts` – Firebase client initialisation.
- `src/lib/posts.ts` – Firestore helpers for post CRUD.
- `src/messages` – Translation dictionaries.

## Deployment

Deploy the app on any Next.js compatible platform (Vercel, Firebase Hosting, etc.). Ensure the environment variables above are configured in your hosting provider so Firebase can initialise in production.
