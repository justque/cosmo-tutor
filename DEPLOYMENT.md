# Cosmo Science Tutor — Deployment Guide

## Overview

Cosmo is a web-based AI science tutor for kids aged 5–8, built with Next.js, Claude API, and Supabase.

**Live URL:** (will be set after Vercel deployment)

## Prerequisites

1. **Anthropic API Key** — Get one at https://console.anthropic.com/
2. **Supabase Account** — Create one at https://supabase.com/
3. **Unsplash API Key** — Create one at https://unsplash.com/developers
4. **Google OAuth Credentials** — (Optional) Set up in Google Cloud Console for "Sign in with Google" — See [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md)
5. **GitHub Account** — To deploy with Vercel

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create `.env.local` with your API keys:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Claude API
ANTHROPIC_API_KEY=your-anthropic-api-key

# Unsplash API
NEXT_PUBLIC_UNSPLASH_API_KEY=your-unsplash-api-key
```

### 3. Set Up Supabase

1. Create a new Supabase project
2. Run the SQL migration in `supabase/migrations/001_initial_schema.sql` to create tables and RLS policies
3. Copy your project URL and API keys from the Supabase dashboard
4. **(Optional) Enable Google OAuth:**
   - Follow [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md) to add Google Sign-In support
   - This allows parents to sign up with their Google account

### 4. Run Locally

```bash
npm run dev
```

Visit http://localhost:3000

## Deploying to Vercel

### 1. Push Code to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/cosmo-tutor.git
git branch -M main
git push -u origin main
```

### 2. Connect Vercel

1. Go to https://vercel.com/new
2. Select "Import Git Repository" and choose your repo
3. Accept the default Next.js settings
4. Click "Deploy"

### 3. Add Environment Variables in Vercel

In your Vercel project settings, add all variables from `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`
- `NEXT_PUBLIC_UNSPLASH_API_KEY`

### 4. Redeploy

After adding environment variables, redeploy to apply them:

```bash
git commit --allow-empty -m "Trigger redeploy with env vars"
git push
```

## Database Setup (Supabase)

The migration file `supabase/migrations/001_initial_schema.sql` creates:

- **children** — child profiles (name, age, avatar)
- **topics** — science topics (space, animals, weather, etc.)
- **progress** — track lessons completed per child per topic
- **sessions** — conversation sessions
- **messages** — chat history
- **api_usage** — track Claude API calls for rate limiting

**Row-Level Security (RLS):** All tables are protected so parents can only access their own children's data.

### Manual Migration (if needed)

1. In Supabase, go to SQL Editor
2. Copy the contents of `supabase/migrations/001_initial_schema.sql`
3. Paste and execute

## API Keys

### Anthropic (Claude API)
- Get key: https://console.anthropic.com/
- Used for: Cosmo's responses
- Billing: Pay-as-you-go, ~$0.003 per response (~200-500 tokens)
- Cost estimate: ~100-150 API calls/day = ~$0.30-0.45/day

### Supabase
- Get key: https://supabase.com/ (create project)
- Used for: Authentication, database
- Free tier: 50k monthly active users, enough for public launch
- To upgrade: Settings → Billing → Upgrade to Pro

### Unsplash
- Get key: https://unsplash.com/developers
- Used for: Fetching science images
- Free tier: 50 requests/hour, generous for our use case

## Monitoring

### Vercel Analytics
- Visit Vercel dashboard to see pageviews, response times, and errors

### Supabase Logs
- Database queries: Supabase > Logs > Postgres
- API usage: Supabase > Database > api_usage table

### Claude API Usage
- Visit https://console.anthropic.com/ to see total tokens and costs

## Scaling Considerations

- **Rate Limiting:** Currently 50 API calls per child per day. Adjust in `/api/chat/route.ts`
- **Database:** Free Supabase tier supports ~50k users. Upgrade to Pro if needed.
- **Image Fetching:** Unsplash free tier supports 50 requests/hour. Switch to a cached image service for higher volume.

## Troubleshooting

### "Supabase connection failed"
- Check that `NEXT_PUBLIC_SUPABASE_URL` and API keys are correct in Vercel environment variables
- Ensure RLS policies are enabled in Supabase

### "Rate limit exceeded"
- Implemented as friendly message in the UI
- Adjust limit in `/api/chat/route.ts` line 27

### "Speech recognition not working"
- Only works in Chrome, Edge, and Safari on iOS
- Firefox doesn't support Web Speech API

### "Images not loading"
- Check Unsplash API key is valid
- Ensure `NEXT_PUBLIC_UNSPLASH_API_KEY` is set in Vercel

## Next Steps

1. Test the app locally with a few conversations
2. Push to GitHub and deploy to Vercel
3. Add custom domain (optional)
4. Set up email notifications (optional, via Supabase)
5. Monitor usage and costs in first week
6. Scale infrastructure if needed based on traffic
