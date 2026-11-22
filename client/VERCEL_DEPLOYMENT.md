# Vercel Deployment Guide

This project is built with **Vite + React** and is fully pre-configured for instant deployment on [Vercel](https://vercel.com).

---

## Method 1: Deploy via Vercel Web Dashboard (Recommended)

1. Push your code to **GitHub**, **GitLab**, or **Bitbucket**.
2. Go to [vercel.com/new](https://vercel.com/new) and log in.
3. Import your repository (`EE7thSemBookLocator`).
4. Configure Project Settings:
   - **Framework Preset**: `Vite` (automatically detected)
   - **Root Directory**: Click `Edit` and select `client` (or leave default since the root `vercel.json` will route to `client` automatically).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Environment Variables**:
   - Add the following variable under **Environment Variables**:
     - **Key**: `VITE_GEMINI_API_KEY`
     - **Value**: Your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
6. Click **Deploy**. Your app will be live within seconds!

---

## Method 2: Deploy via Vercel CLI

If you have the Vercel CLI installed:

```bash
# 1. Navigate to the client folder
cd client

# 2. Deploy to preview
npx vercel

# 3. Deploy to production
npx vercel --prod
```

When prompted:
- **Set up and deploy?** -> `Y`
- **Which scope?** -> Select your account
- **Link to existing project?** -> `N`
- **What's your project's name?** -> `ee-7th-sem-book-locator`
- **In which directory is your code located?** -> `./`
- **Want to modify settings?** -> `N` (settings are already defined in `vercel.json`)

---

## Key Configurations Included

- **`vercel.json`**:
  - Handles **SPA routing rewrites** (`/(.*)` -> `/index.html`) so refreshing or direct links never trigger 404s.
  - Implements **long-term immutable caching** (`max-age=31536000`) for production hashed JS/CSS assets.
  - Enables **clean URLs**.
- **`.env.example`**:
  - Documents the required environment variable (`VITE_GEMINI_API_KEY`).
- **`.gitignore`**:
  - Excludes sensitive `.env` files and `.vercel` build artifacts from git.
