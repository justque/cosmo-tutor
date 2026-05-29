# Google OAuth Setup Guide

Cosmo now supports "Sign in with Google" for parents. This guide walks through setting up Google OAuth credentials.

## Step 1: Create OAuth Credentials in Google Cloud Console

1. **Go to Google Cloud Console:** https://console.cloud.google.com/
2. **Create a new project:**
   - Click the project dropdown at the top
   - Click "NEW PROJECT"
   - Name it "Cosmo" (or your app name)
   - Click "CREATE"

3. **Enable Google+ API:**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click it, then click "ENABLE"

4. **Create OAuth 2.0 credentials:**
   - Go to "APIs & Services" > "Credentials"
   - Click "CREATE CREDENTIALS" > "OAuth client ID"
   - If prompted, click "CONFIGURE CONSENT SCREEN" first:
     - User Type: "External"
     - Click "CREATE"
     - Fill in "App name" (e.g., "Cosmo")
     - Add your email under "User support email"
     - Click "SAVE AND CONTINUE" through all pages
   - Back to credentials, click "CREATE CREDENTIALS" > "OAuth client ID"
   - Application type: "Web application"
   - Name: "Cosmo Web Client"

5. **Add Authorized Redirect URIs:**
   - In the OAuth credentials, scroll to "Authorized redirect URIs"
   - Add these two URLs:
     ```
     http://localhost:3000/auth/callback
     https://your-domain.vercel.app/auth/callback
     ```
   - Replace `your-domain.vercel.app` with your actual Vercel domain
   - Click "SAVE"

6. **Copy your credentials:**
   - Copy the **Client ID** and **Client Secret**
   - Keep these safe — you'll need them for Supabase

## Step 2: Add Google Provider to Supabase

1. **Go to Supabase Dashboard:** https://supabase.com/
2. **Select your project**
3. **Go to Authentication > Providers**
4. **Find "Google" and click it**
5. **Toggle "Enabled"**
6. **Paste credentials:**
   - Client ID: (from Google Cloud)
   - Client Secret: (from Google Cloud)
7. **Click "Save"**

## Step 3: Test Locally

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Go to http://localhost:3000/auth/signup**

3. **Click "Sign in with Google"**

4. **You should be redirected to Google login, then back to the app**

## Step 4: Deploy to Vercel

1. **Add environment variables (same as before):**
   - In Vercel project settings, your Supabase URL and keys should already be set
   - Google OAuth is configured in Supabase, not as env vars

2. **Update redirect URI in Google Cloud:**
   - Go back to Google Cloud Console
   - Find your OAuth credentials
   - Update the redirect URI to use your Vercel domain:
     ```
     https://your-app-name.vercel.app/auth/callback
     ```

3. **Redeploy to Vercel:**
   ```bash
   git add -A
   git commit -m "Add Google OAuth support"
   git push
   ```

## Troubleshooting

### "Redirect URI mismatch" error
- Make sure the redirect URI in Google Cloud exactly matches what the app is trying to use
- For local: `http://localhost:3000/auth/callback`
- For production: `https://your-domain.vercel.app/auth/callback`

### "Invalid client" error
- Check that Client ID and Client Secret are correctly pasted into Supabase
- Make sure you have the correct Google Project selected in Google Cloud Console

### "Sign in with Google" button doesn't work
- Check browser console (F12) for errors
- Verify Supabase auth is enabled and Google provider is toggled on
- Make sure you're using the right redirect URL

### Users can sign up with Google but can't log in
- This is expected — Supabase treats sign-up and sign-in with OAuth the same way
- After signing up with Google once, use the same button to "log in"

## Security Notes

- **Never commit** `Client Secret` to git — always use environment variables or Supabase's built-in provider setup
- **Limit redirect URIs** to only your actual domains (localhost for dev, Vercel for prod)
- **Keep secrets safe** — if you accidentally expose your Client Secret, regenerate it in Google Cloud

## Optional: Custom Profile Data

When users sign up with Google, Supabase automatically stores:
- Email
- First name
- Last name
- Avatar URL

You can access this in the Supabase `auth.users` table. Currently, Cosmo doesn't use this data, but you could extend it to pre-fill parent names on signup.
