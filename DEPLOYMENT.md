# ☕ Brew & Bean — Deployment Guide

Deploy the **frontend + API** entirely on **Vercel** with **Neon** (serverless Postgres) for storage and **Resend** for email confirmations.

**No credit card required** — Vercel (free tier) and Neon (free tier) don't require a card to start.

---

## Prerequisites

- [GitHub](https://github.com) account
- [Vercel](https://vercel.com) account (free tier — **no credit card needed**)
- [Neon](https://neon.tech) account (free tier — **no credit card needed**)
- [Resend](https://resend.com) account — free tier: 100 emails/day

---

## Step 1: Set Up Neon (Database)

1. Go to [console.neon.tech](https://console.neon.tech) → sign up → **Create a project**
2. Choose any region (pick one close to you)
3. Once created, go to **Connection Details** → copy the **connection string** (starts with `postgres://`)
4. Save this — you'll add it to Vercel in Step 3

> 💡 Neon's free tier gives you 0.5 GB storage and unlimited databases — plenty for a reservation system.

---

## Step 2: Deploy to Vercel

1. Push your code to GitHub (already done 🎉)
2. Go to [vercel.com/new](https://vercel.com/new)
3. Click **"Import Git Repository"** → select `Daw00d14/brew-and-beans`
4. Vercel will auto-detect **Vite** — default settings work
5. **Don't click "Deploy" yet** — add environment variables first

---

## Step 3: Add Environment Variables in Vercel

In the Vercel project dashboard (or during import):

| Key | Value |
|---|---|
| `DATABASE_URL` | `postgres://...` (from Neon — Step 1) |
| `RESEND_API_KEY` | *(from Resend — Step 5)* |
| `NODE_VERSION` | `20` |

To add them:
- **During import:** Click "Environment Variables" before deploying
- **After deploy:** Go to Project → **Settings** → **Environment Variables**

> **Important:** The frontend uses relative API paths (`/api/...`), so it works automatically on the same domain. You don't need `VITE_API_URL`.

---

## Step 4: Deploy

1. Click **"Deploy"** on Vercel
2. Wait ~1–2 minutes for the build
3. Your site is live at `https://brew-and-beans.vercel.app`

Verify the API works:

```bash
# Health check
curl https://brew-and-beans.vercel.app/api/health

# Create a test reservation
curl -X POST https://brew-and-beans.vercel.app/api/reservations \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test User","email":"your@email.com","phone":"555-0000","date":"2026-07-01","time":"18:30","guests":4}'
```

---

## Step 5: Set Up Resend (Email Confirmations)

1. Go to [resend.com](https://resend.com) → sign up → **API Keys** → create a new key
2. Copy the key and add it to your Vercel project as `RESEND_API_KEY`
3. For production, you can verify a custom domain in Resend (optional — the test domain `onboarding@resend.dev` works for development)

> **No credit card needed** — Resend's free tier gives 100 emails/day.

---

## Step 6: Verify Everything

1. Open your Vercel URL
2. Fill out and submit the reservation form
3. Check the admin dashboard at `/admin` (password: `admin123`)
4. You should see your reservation listed

### Admin Dashboard

Open `https://brew-and-beans.vercel.app/admin`
Default password: `admin123` (configurable via `VITE_ADMIN_PASSWORD`)

---

## Local Development

```bash
# Terminal 1: Start the Express backend (for API)
cd server && npm run dev

# Terminal 2: Start the Vite frontend (proxies /api to backend)
npm run dev
```

The frontend runs on `http://localhost:5173` and API requests are proxied to `http://localhost:3001`.

---

## Troubleshooting

| Problem | Solution |
|---|---|
| Reservation form fails | Check `DATABASE_URL` is correctly set in Vercel env vars |
| Emails not sending | Verify `RESEND_API_KEY` is correctly set in Vercel env vars |
| CORS errors | Vercel functions include CORS headers — should work on the same domain |
| `Cannot find module` | Make sure you deployed from the root of the repo (not the `server/` folder) |
| API returns 404 | Vercel automatically routes `/api/*` to files in the `api/` directory |
