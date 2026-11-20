# AQURIVO

AQURIVO is a bilingual (**Arabic / English**) product discovery, editorial buying-guide, and interactive decision-tools platform built with **Next.js 15 (App Router)**. It combines curated affiliate product reviews, price transparency controls, editorial guides, 11 interactive shopping/finance/developer calculators, and an authenticated admin & MCP operations suite.

> **Important Licensing Note:** This codebase is distributed under the **PolyForm Noncommercial License 1.0.0** (`PolyForm-Noncommercial-1.0.0`), which permits noncommercial uses only and is **not** an OSI-approved open-source license. Commercial use requires separate permission from the copyright holder. See [`LICENSE`](./LICENSE).

> **Data and privacy:** Runtime data mirrors, user profiles, contact messages, issue reports, and analytics are not included in this repository. The local mirror under `server/data/` is generated at runtime and is deliberately excluded from version control. Configure Firebase or Turso for persistent application data.

---

## Core Features

- **Bilingual Storefront (`ar` & `en`)**: RTL/LTR layout switching via CSS logical properties, localized routing (`/[locale]/...`), and `Intl` formatting for numbers, dates, and currencies.
- **Curated Product Catalog & Price Transparency**:
  - Product reviews with pros, cons, technical specs, ratings, media galleries (Cloudinary & HLS video support), and related item recommendations.
  - Affiliate link disclosure and configurable price-display policies (`show_with_timestamp` and `hide_price_check_store`).
- **Editorial Buying Guides (`/guides`)**: Bilingual buying guides, structured SEO metadata, Open Graph routes (`/api/og`), robots, and dynamic sitemaps.
- **11 Interactive Calculators & Utilities (`/tools`)**:
  1. Cost-Per-Use (\"Is It Worth Buying?\") Calculator
  2. Hidden Installment Interest Calculator
  3. Cost of Living Comparison Tool
  4. Real Net Salary Calculator
  5. Savings Goal Calculator
  6. Work Time Value Calculator
  7. Freelance Price Checker
  8. Loan Comparison Calculator
  9. Carbon Footprint Calculator
  10. Compound Investment Growth Calculator
  11. Code-to-Image Snippet Studio
- **Visitor Engagement & Trust**: Saved items wishlist synced for signed-in users, moderated product reviews & visitor testimonials, contact form with optional SMTP notifications, and broken-link / price-mismatch issue reporting.
- **Admin Dashboard (`/admin`) & Editorial Agent**:
  - Manage products, categories, partner sources, buying guides, messages, testimonials, issue reports, click analytics, and site settings.
  - Server-side Canopy API & Amazon PA-API 5.0 product import workflows with key pooling, redaction, and failover.
  - Encrypted server-side AI provider key storage and editorial drafting assistant (`admin/editorial-agent`).
  - Read-only-by-default **AQURIVO MCP** server (`mcp/server.ts`) with explicit admin write controls (`docs/AQURIVO_MCP.md`).

---

## Tech Stack

- **Framework**: Next.js 15 (`App Router`), React 19, TypeScript 5.9
- **Styling**: CSS Modules + global design tokens (`styles/tokens.css`) and Tailwind CSS v4 utilities
- **Authentication & Data Layer**:
  - Firebase Auth (verified email / Google sign-in + HMAC-signed `httpOnly` session cookies)
  - Cloud Firestore / Firebase Realtime Database adapter **or** Turso (`@libsql/client`) relational adapter (`DATA_STORE=firestore|turso`)
- **Security & Bot Defense**: Server-signed CSRF tokens, daily salted IP hashing, rate limiting, strict CSP headers (`middleware.ts`, `vercel.json`, `netlify.toml`), `zod` input validation, `botid`, and `crypto.timingSafeEqual` verification
- **Media, Email & Tooling**: Cloudinary signed uploads, `hls.js`, `nodemailer`, `@google/genai`, `@modelcontextprotocol/sdk`, `lucide-react`, `motion`
- **Testing & Quality**: Node/TSX test runner (`tsx --test`), ESLint 9 (`eslint-config-next`), TypeScript (`tsc --noEmit`)

---

## Project Structure

```text
├── app/                  # Next.js App Router pages, localized routes, SEO, and /api routes
├── components/           # Shared UI primitives and layout sections
├── database/             # SQL / Turso schema and migration definitions
├── docs/                 # Architecture, tool specs, SEO, and MCP documentation
├── features/             # Client feature modules (catalog, tools, saved items, admin views)
├── hooks/                # Reusable React hooks
├── i18n/                 # Arabic & English dictionaries and I18nProvider
├── lib/                  # Pure business logic, calculators, recommendation scoring, Firebase client
├── mcp/                  # AQURIVO Model Context Protocol server & safety gates
├── public/               # Static images, icons, and public assets
├── scripts/              # Database migration utilities
├── server/               # Server-only config, database adapters, middleware, repos, services, validators
├── styles/               # Design tokens and global stylesheets
└── tests/                # Automated unit & integration tests (tsx --test)
```

---

## Getting Started

### Prerequisites

- **Node.js 20+**
- **npm** (project includes `package-lock.json`)

### 1. Install Dependencies

```bash
npm ci
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials before running in production or connecting external services:

```bash
cp .env.example .env.local
```

Generate strong random secrets (`32+` characters) for `SESSION_COOKIE_SECRET`, `IP_HASH_SALT`, `AI_SECRETS_ENCRYPTION_KEY`, and `FIRESTORE_BACKUP_ENCRYPTION_KEY`, for example:

```bash
openssl rand -base64 32
```

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Build the production bundle (`next build`) |
| `npm run start` | Start the built production server |
| `npm run lint` | Run ESLint across the codebase |
| `npm run typecheck` | Run strict TypeScript typechecking |
| `npm test` | Run automated tests via `tsx --test` |
| `npm run mcp` | Launch the local AQURIVO MCP server |
| `npm run migrate:firestore` | Run the Firestore-to-Turso data migration script |
| `npm run clean` | Remove the local Next.js build output |

---

## Environment Variables Reference

All variables are listed in [`.env.example`](./.env.example). Key groups include:

| Group | Variables | Scope |
| :--- | :--- | :--- |
| **Site URLs** | `SITE_URL`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SITE_URL_COM`, `APP_URL` | Mixed |
| **Security & Auth** | `ADMIN_EMAILS`, `SESSION_COOKIE_SECRET`, `IP_HASH_SALT`, `AI_SECRETS_ENCRYPTION_KEY`, `FIRESTORE_BACKUP_ENCRYPTION_KEY` | Server-only |
| **Data Store** | `DATA_STORE`, `NEXT_PUBLIC_DATA_STORE`, `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` | Mixed (`TURSO_*` server-only) |
| **Firebase Client** | `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_DATABASE_URL`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`, `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Public browser SDK |
| **Firebase Admin** | `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY` | Server-only |
| **Email (SMTP)** | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_APP_PASSWORD`, `CONTACT_NOTIFICATION_EMAIL`, `SMTP_FROM_NAME` | Server-only |
| **Media & Commerce** | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `AMAZON_ACCESS_KEY`, `AMAZON_SECRET_KEY`, `AMAZON_ASSOCIATE_TAG`, `AMAZON_REGION`, `CANOPY_API_KEYS`, `GEMINI_API_KEY` | Server-only (except cloud name) |
| **MCP Gates** | `AQURIVO_MCP_TARGET`, `AQURIVO_MCP_ENABLE_WRITES`, `AQURIVO_MCP_ALLOW_PRODUCTION_READS`, `AQURIVO_MCP_ALLOW_PRODUCTION_WRITES`, `AQURIVO_MCP_ALLOW_PRODUCTION_PRODUCT_WRITES`, `AQURIVO_MCP_ALLOW_PRODUCTION_EDITORIAL_WRITES`, `AQURIVO_MCP_ALLOW_DELETES` | Server/CLI only |

---

## Security & Privacy Notes

- Never commit `.env`, `.env.local`, service-account JSON keys, or runtime data backups.
- Configure verified admin email addresses in both `ADMIN_EMAILS` and [`firestore.rules`](./firestore.rules) before deploying Firestore security rules.
- All third-party API keys (Canopy API, AI providers, SMTP, Cloudinary secret, Amazon PA-API) remain on the server and are never exposed to client components.
- Visitor IP addresses are hashed daily with `IP_HASH_SALT` before rate limiting or click analytics storage.
- The local data mirror is created/updated at runtime and must remain untracked; do not attach production data files to issue reports or pull requests.

---

## License

This software is licensed under the **PolyForm Noncommercial License 1.0.0** (`PolyForm-Noncommercial-1.0.0`). See [`LICENSE`](./LICENSE) for full terms and [`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md) for third-party dependency attributions.

**Before making this repository public:** replace the copyright-holder placeholder in `LICENSE` with the correct legal rights holder and verify that you have the right to license every source file and asset.
