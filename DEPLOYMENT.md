# ☕ Brew & Bean — Deployment Guide

Deploy the **frontend** to Vercel, the **backend** to Render, and set up **email confirmations** via Resend.

---

## Prerequisites

- [GitHub](https://github.com) account
- [Vercel](https://vercel.com) account (free tier)
- [Render](https://render.com) account (free tier)
- [Resend](https://resend.com) account — free tier: 100 emails/day

---

## Step 1: Push to GitHub

Run from the `coffee-shop-website` folder:

```bash
git remote add origin https://github.com/Daw00d14/brew-and-beans.git
git branch -M main
git push -u origin main
```

You'll be prompted for your GitHub username and a **personal access token** (password won't work with 2FA).
[Create a token here](https://github.com/settings/tokens) → select `repo` scope → copy and paste as password.

---

## Step 2: Deploy Frontend to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"** → select `Daw00d14/brew-and-beans`
3. Vercel will auto-detect **Vite**
4. Click **"Environment Variables"** — **leave `VITE_API_URL` empty for now** (we'll add it after step 3)
5. Click **"Deploy"**

Your site will be at: `https://brew-and-beans.vercel.app`

> ⚠️ The reservation form won't work yet — we'll update the API URL after the backend is deployed.

---

## Step 3: Deploy Backend to Render

1. Go to [dashboard.render.com](https://dashboard.render.com) → **"New +"** → **"Web Service"**
2. Connect GitHub → select `Daw00d14/brew-and-beans`
3. Configure:

| Setting | Value |
|---|---|
| **Name** | `brew-and-beans-api` |
| **Region** | Frankfurt (EU) |
| **Branch** | `main` |
| **Runtime** | `Node` |
| **Build Command** | `cd server && npm install && npm run build` |
| **Start Command** | `cd server && npm start` |
| **Plan** | **Free** |

4. Click **"Advanced"** → **"Add Environment Variable"**:

| Key | Value |
|---|---|
| `NODE_VERSION` | `20` |
| `PORT` | `10000` |
| `RESEND_API_KEY` | *(paste your Resend API key)* |
| `FRONTEND_URL` | `https://brew-and-beans.vercel.app` |

5. Click **"Create Web Service"**

Your API will be at: `https://brew-and-beans-api.onrender.com`

---

## Step 4: 🔄 Update Vercel & Redeploy (Critical!)

After the backend is live:

1. Go to Vercel project → **Settings** → **Environment Variables**
2. Add `VITE_API_URL` = `https://brew-and-beans-api.onrender.com/api`
3. Go to **Deployments** → click ⋯ on the latest → **Redeploy**

> **🚨 Why?** Vite bakes the API URL into the HTML at **build time**. Just updating the env var in the dashboard won't change the deployed site — you must trigger a new build.

---

## Step 5: Set Up Resend (Email Confirmations)

1. Go to [resend.com](https://resend.com) → sign up → **API Keys** → create a new key
2. Copy the key and add it to Render as `RESEND_API_KEY`
3. For production, verify a custom domain in Resend (optional — the test domain works for development)

---

## Step 6: Verify

```bash
# Health check
curl https://brew-and-beans-api.onrender.com/api/health

# Create a test reservation
curl -X POST https://brew-and-beans-api.onrender.com/api/reservations \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test User","email":"your@email.com","phone":"555-0000","date":"2026-07-01","time":"18:30","guests":4}'
```

Open your Vercel URL and submit a reservation — you should get a confirmation email.

### Admin Dashboard

Open `https://brew-and-beans.vercel.app/#admin`
Default password: `admin123` (configurable via `VITE_ADMIN_PASSWORD`)

---

## Troubleshooting

| Problem | Solution |
|---|---|
| Reservation form fails | Check `VITE_API_URL` in Vercel is set to your Render URL and **you redeployed** |
| Emails not sending | Verify `RESEND_API_KEY` is correctly set in Render env vars |
| CORS errors in browser | Check `FRONTEND_URL` in Render matches your Vercel domain |
| Server error on first load | Render free tier spins down after 15 min idle — first request takes ~30s to wake up |
| `Cannot find module` error | Make sure build command includes `&& npm run build` to compile TypeScript |
