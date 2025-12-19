# Phoenix DM - Render.com Deployment Guide

## ✅ Pre-Deployment Checklist

Your app is now ready for deployment with all fixes applied:
- ✅ Correct Expo export command (`expo export --platform web --output-dir dist-web`)
- ✅ Server serves static files from `dist-web` directory
- ✅ Graceful shutdown handling for clean restarts
- ✅ Proper error handling and logging
- ✅ Build tested and working locally

---

## Step 1: Push to GitHub (5 min)

1. Open **GitHub Desktop**
2. You should see changes to `package.json` and `server/_core/index.ts`
3. Commit message: "Fix build for Render deployment"
4. Click **"Push origin"**

---

## Step 2: Configure Render Service (10 min)

### A. Service Settings

1. Go to https://render.com/dashboard
2. Find your **phoenix-dm** service (or create new Web Service if deleted)
3. Go to **Settings** → **Build & Deploy**

### B. Build Configuration

**Build Command:**
```
npm install -g pnpm && pnpm install && pnpm build
```

**Start Command:**
```
pnpm start
```

**Root Directory:** (leave blank)

**Branch:** `main`

### C. Environment Variables

Click **Environment** tab and add these variables:

```
NODE_ENV=production
PORT=10000
GOOGLE_SHEET_ID=1gi2N5tDW98zRPjKcSNHAuEH57XYW8uufbTjXbHUCIOI
```

**Save all changes**

---

## Step 3: Add PostgreSQL Database (5 min)

1. In Render dashboard, click **"New +"** → **"PostgreSQL"**
2. Name: `phoenix-db`
3. Database: `phoenix`
4. User: `phoenix`
5. Region: Same as your web service
6. Plan: **Free**
7. Click **"Create Database"**

### Connect Database to App

1. Go to your **phoenix-db** database
2. Copy the **Internal Database URL** (starts with `postgresql://`)
3. Go back to your **phoenix-dm** web service
4. **Environment** tab → Add variable:
   ```
   DATABASE_URL=<paste the internal database URL here>
   ```
5. **Save**

---

## Step 4: Deploy! (10-15 min)

1. Click **"Manual Deploy"** → **"Deploy latest commit"**
2. Watch the build logs
3. Wait for "Your service is live at..." message

**Expected build time:** 10-15 minutes (first deploy is slower)

---

## Step 5: Test the Deployment (2 min)

1. Open the Render URL: `https://phoenix-dm.onrender.com` (or similar)
2. You should see the Phoenix DM home screen
3. Test the profile selector - switch between users
4. Check that Google Sheets data loads

**If you get a 502 error:** Check the logs for errors. Common issues:
- Database connection failed (check DATABASE_URL)
- Port binding issue (should be fixed now)
- Build artifacts missing (re-deploy)

---

## Step 6: Add Custom Domain (15 min)

### A. In Render

1. Go to your **phoenix-dm** service
2. Click **Settings** → **Custom Domain**
3. Click **"Add Custom Domain"**
4. Enter: `app.phoenixdm.co`
5. Render will show you DNS records to add

### B. In Your Domain Registrar

1. Log into your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)
2. Find DNS settings for `phoenixdm.co`
3. Add the CNAME record Render provided:
   - **Type:** CNAME
   - **Name:** app
   - **Value:** `phoenix-dm.onrender.com` (or whatever Render shows)
   - **TTL:** Auto or 3600

4. Save DNS changes
5. Wait 5-30 minutes for DNS propagation

### C. Verify

1. Try opening `https://app.phoenixdm.co`
2. If it doesn't work immediately, wait 10-15 minutes and try again
3. DNS changes can take up to 24 hours but usually work within 30 minutes

---

## Common Issues & Solutions

### Build Fails with "pnpm: command not found"
**Solution:** Make sure Build Command includes `npm install -g pnpm`

### 502 Bad Gateway after successful build
**Solution:** 
1. Check logs for errors
2. Verify DATABASE_URL is set correctly
3. Try restarting the service

### App loads but shows infinite loading spinner
**Solution:**
1. Check browser console for errors
2. Verify GOOGLE_SHEET_ID is correct
3. Make sure Google Sheet is set to "Anyone with link can view"

### Database connection errors
**Solution:**
1. Use the **Internal Database URL** not the external one
2. Make sure DATABASE_URL starts with `postgresql://`
3. Verify the database is in the same region as your web service

---

## Next Steps After Deployment

Once your app is live and stable:

1. **Enable Login Authentication** (45-60 min)
   - Configure OAuth for your domain
   - Remove profile selector
   - Add login requirement
   - Lock users to their own data

2. **Test with Your Team** (30 min)
   - Have team members try logging in
   - Verify role-based permissions work
   - Check that data loads correctly for each user

3. **Production Hardening** (optional)
   - Set up monitoring/alerts
   - Configure backup schedule for database
   - Add error tracking (Sentry, etc.)
   - Set up SSL certificate (Render does this automatically)

---

## Support

If you run into issues:
1. Check Render logs first (most errors show up there)
2. Verify all environment variables are set correctly
3. Make sure your GitHub repo has the latest code
4. Try a fresh deploy if something seems stuck

**Render Free Tier Limitations:**
- App sleeps after 15 min of inactivity
- 750 hours/month of runtime
- Database limited to 1GB storage
- First request after sleep takes 30-60 seconds

**To avoid sleep:** Upgrade to paid plan ($7/month for web service)
