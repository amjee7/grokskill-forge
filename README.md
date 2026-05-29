# GrokSkill Forge

**The Marketplace for Grok Skills.**

GrokSkill Forge is a clean, focused web application that lets users in the Grok ecosystem **buy and sell high-quality, reusable skills** for the Grok CLI and TUI.

Built with **Next.js 16 (App Router)**, **Supabase**, **Tailwind CSS**, and **shadcn/ui**.

---

## Current MVP Features

- **Marketplace** (`/marketplace`) — Browse public skills with search, category filters, and price filters (Free / Paid)
- **Skill Detail Pages** — View descriptions and purchase paid skills
- **Stripe Test Payments** — Full Checkout flow (test mode) for paid skills
- **Upload Skill** (`/upload`) — Simple form with tiered pricing ($0 / $4.99 / $9.99 / $19.99 / $29.99 + custom)
- **Dashboard** — "My Skills", "My Purchases", and "My Earnings" tabs
- **Authentication** — Email/password + magic links via Supabase
- **Purchase Fulfillment** — Webhook automatically grants access after successful payment

---

## Tech Stack

- Next.js 16 (App Router)
- Supabase (Postgres + Auth + RLS)
- Stripe Checkout (test mode)
- Tailwind CSS + shadcn/ui
- TypeScript

---

## Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings → API** and copy:
   - Project URL
   - `anon` public key
   - `service_role` key (keep this secret!)
3. Update your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...   # Required for Stripe webhooks
```

### 3. Run the Database Schema

In the Supabase SQL Editor, run the following files **in order**:

1. `supabase/schema.sql` (base schema + RLS)
2. `supabase/migrations/001_add_price_and_purchases.sql` (adds pricing + purchases table)

### 4. Set Up Stripe (Test Mode)

1. Go to [dashboard.stripe.com/test](https://dashboard.stripe.com/test)
2. Copy your **Publishable key** and **Secret key**
3. Add them to `.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...     # Will be set in the next step
```

### 5. Run the Stripe Webhook Forwarder (Required for Purchases)

In a separate terminal, run:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the `whsec_...` signing secret it outputs and add it to your `.env.local` as `STRIPE_WEBHOOK_SECRET`.

### 6. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## How to Test the Full Purchase Flow

1. Sign up / log in
2. Go to **Upload** and create a paid skill (e.g. $4.99)
3. (Optional) Log in with a second test account
4. Go to the Marketplace and purchase the skill using test card:
   - Card number: `4242 4242 4242 4242`
   - Any future date + any CVC
5. After successful payment, the skill should appear in **Dashboard → My Purchases** with full access

---

## Environment Variables

| Variable                              | Required     | Description                              |
|---------------------------------------|--------------|------------------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL`            | Yes          | Supabase project URL                     |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`       | Yes          | Supabase anon key                        |
| `SUPABASE_SERVICE_ROLE_KEY`           | Yes (webhooks) | Supabase service role key (secret)     |
| `STRIPE_SECRET_KEY`                   | Yes          | Stripe secret key (test)                 |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`  | Yes          | Stripe publishable key (test)            |
| `STRIPE_WEBHOOK_SECRET`               | Yes          | From `stripe listen`                     |

---

## Project Structure Highlights

```
app/
├── marketplace/           # Public skill browsing + detail
├── upload/                # Upload new skill form
├── dashboard/             # My Skills / My Purchases / My Earnings
├── api/
│   ├── checkout/          # Creates Stripe Checkout Sessions
│   └── webhooks/stripe/   # Handles payment fulfillment
lib/
├── supabase/              # Server + client clients + data layer
└── stripe.ts              # Stripe server client + helpers
steps/                     # Step-by-step diff documentation
```

---

## License

MIT

---

**Built for the Grok community.**  
Craft once. Share. Earn.
