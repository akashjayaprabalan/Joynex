# 🚀 Deploy Joynex to Production - Action Items

Your code is ready and pushed to GitHub! Follow these steps to go live on joynex.online.

---

## ✅ Step 1: Set Up Supabase Database (5 minutes)

1. Go to your Supabase project: https://app.supabase.com/project/spqyigrtimsuqhzebedn
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `supabase/schema.sql` from your repo
5. Click **Run** (bottom right)
6. Create another new query
7. Copy and paste the contents of `supabase/notifications.sql`
8. **IMPORTANT:** Before running, find this line near the end:
   ```sql
   SELECT cron.schedule(...)
   ```
   Comment it out or delete it (pg_cron requires paid tier):
   ```sql
   -- SELECT cron.schedule(...) -- Skip this if on free tier
   ```
9. Click **Run**
10. Verify tables exist: Click **Table Editor** → you should see:
    - users
    - verification_codes
    - groups
    - group_members
    - notifications

---

## ✅ Step 2: Configure Vercel Environment Variables (5 minutes)

1. Go to https://vercel.com/akashs-projects-b0436dd5/joynex/settings/environment-variables
2. Add these variables (click "Add" for each):

### Required (Supabase)
```
Name: VITE_SUPABASE_URL
Value: https://spqyigrtimsuqhzebedn.supabase.co
Environment: Production, Preview, Development
```

```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwcXlpZ3J0aW1zdXFoemViZWRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjAxOTAsImV4cCI6MjA3NzIzNjE5MH0.4ZwQS2ZN40MhnvorSLbPDM-9nR9vjozZx6FYZvX7HS4
Environment: Production, Preview, Development
```

### App Config
```
Name: VITE_APP_NAME
Value: Joynex
Environment: Production, Preview, Development
```

```
Name: VITE_APP_URL
Value: https://joynex.online
Environment: Production, Preview, Development
```

```
Name: VITE_API_URL
Value: https://joynex.online/api
Environment: Production, Preview, Development
```

### SendGrid (Email) - GET THESE FROM YOUR SENDGRID ACCOUNT
```
Name: VITE_SENDGRID_API_KEY
Value: [Your SendGrid API Key - get from https://app.sendgrid.com/settings/api_keys]
Environment: Production, Preview, Development
```

```
Name: VITE_SENDGRID_VERIFICATION_TEMPLATE_ID
Value: [Your verification template ID - create at https://mc.sendgrid.com/dynamic-templates]
Environment: Production, Preview, Development
```

```
Name: VITE_SENDGRID_WELCOME_TEMPLATE_ID
Value: [Your welcome template ID]
Environment: Production, Preview, Development
```

```
Name: VITE_SENDGRID_GROUP_JOIN_TEMPLATE_ID
Value: [Your group join template ID]
Environment: Production, Preview, Development
```

```
Name: VITE_SENDGRID_GROUP_UPDATE_TEMPLATE_ID
Value: [Your group update template ID]
Environment: Production, Preview, Development
```

### Sentry (Error Tracking) - GET FROM YOUR SENTRY ACCOUNT
```
Name: VITE_SENTRY_DSN
Value: [Your Sentry DSN - get from https://sentry.io/settings/]
Environment: Production, Preview, Development
```

### Google Analytics - GET FROM YOUR GA ACCOUNT
```
Name: VITE_GA_MEASUREMENT_ID
Value: [Your GA4 Measurement ID - get from https://analytics.google.com/]
Environment: Production, Preview, Development
```

---

## ✅ Step 3: Create SendGrid Templates (10 minutes)

1. Go to https://app.sendgrid.com/
2. Sign up if you haven't already (free tier is fine)
3. Verify your sender email (Settings → Sender Authentication)
4. Go to Email API → Dynamic Templates
5. Create 4 templates using the HTML files in `src/templates/`:

### Template 1: Verification Email
- Name: Joynex Verification
- Copy HTML from `src/templates/verification-email.html`
- Variables: `{{code}}`, `{{expiry}}`, `{{year}}`
- Copy the Template ID → use for `VITE_SENDGRID_VERIFICATION_TEMPLATE_ID`

### Template 2: Welcome Email
- Name: Joynex Welcome
- Copy HTML from `src/templates/welcome-email.html`
- Variables: `{{name}}`, `{{year}}`
- Copy the Template ID → use for `VITE_SENDGRID_WELCOME_TEMPLATE_ID`

### Template 3: Group Join Email
- Name: Joynex Group Join
- Copy HTML from `src/templates/group-join-email.html`
- Variables: `{{groupName}}`, `{{groupType}}`, `{{date}}`, `{{time}}`, `{{location}}`, `{{locationLink}}`, `{{contactMethod}}`, `{{contactInfo}}`, `{{year}}`
- Copy the Template ID → use for `VITE_SENDGRID_GROUP_JOIN_TEMPLATE_ID`

### Template 4: Group Update Email
- Name: Joynex Group Update
- Copy HTML from `src/templates/group-update-email.html`
- Variables: same as Group Join
- Copy the Template ID → use for `VITE_SENDGRID_GROUP_UPDATE_TEMPLATE_ID`

---

## ✅ Step 4: Set Up Sentry (5 minutes)

1. Go to https://sentry.io/ and sign up (free tier)
2. Create a new project → Select "React"
3. Name it "Joynex"
4. Copy your DSN (looks like: `https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`)
5. Use this for `VITE_SENTRY_DSN` in Vercel

---

## ✅ Step 5: Set Up Google Analytics (5 minutes)

1. Go to https://analytics.google.com/
2. Create a new GA4 property
3. Name: "Joynex"
4. Website URL: https://joynex.online
5. Copy your Measurement ID (looks like: `G-XXXXXXXXXX`)
6. Use this for `VITE_GA_MEASUREMENT_ID` in Vercel

---

## ✅ Step 6: Deploy to Vercel (2 minutes)

### Option A: Automatic (via GitHub - Recommended)
1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import from GitHub → Select "Joynex"
4. Framework: Vite (auto-detected)
5. Root Directory: `./`
6. Build Command: `vite build`
7. Output Directory: `dist`
8. Click **Deploy**
9. Wait 2-3 minutes for deployment to complete

### Option B: Manual (via CLI)
```bash
npx vercel --prod
```

---

## ✅ Step 7: Configure Domain (Already Done!)

Your domain `joynex.online` should already be set up from earlier. Verify:

1. Go to Vercel → Your Project → Settings → Domains
2. Confirm `joynex.online` is listed
3. Check that SSL certificate shows "Valid" (may take a few minutes)

---

## ✅ Step 8: Set Up GitHub Actions Secrets (Optional - for CI/CD)

1. Go to https://github.com/akashjayaprabalan/Joynex/settings/secrets/actions
2. Click "New repository secret" for each:

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_SENDGRID_API_KEY
VITE_SENDGRID_VERIFICATION_TEMPLATE_ID
VITE_SENDGRID_WELCOME_TEMPLATE_ID
VITE_SENDGRID_GROUP_JOIN_TEMPLATE_ID
VITE_SENDGRID_GROUP_UPDATE_TEMPLATE_ID
VITE_SENTRY_DSN
VITE_GA_MEASUREMENT_ID
```

Plus these Vercel tokens (get from https://vercel.com/account/tokens):
```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

---

## ✅ Step 9: Test Your Production App

Visit https://joynex.online and test:

### Authentication
1. Go to `/signup`
2. Use a University of Melbourne email
3. Check for verification email
4. Enter code and complete signup
5. Sign out and sign in again

### Groups
1. Create a new group at `/create`
2. Open another browser (incognito)
3. Sign in with different account
4. Join the group from `/discover`
5. Check that notifications appear
6. Check member count updates

### Email Notifications
1. Check your inbox for:
   - Verification code email
   - Welcome email
   - Group join confirmation

### Monitoring
1. Open Sentry dashboard → check for events
2. Open Google Analytics → check real-time users

---

## 🎉 You're Live!

Your app is now running at **https://joynex.online**!

## 📊 Monitoring Dashboard

- **Vercel:** https://vercel.com/akashs-projects-b0436dd5/joynex
- **Supabase:** https://app.supabase.com/project/spqyigrtimsuqhzebedn
- **Sentry:** https://sentry.io/
- **Google Analytics:** https://analytics.google.com/
- **SendGrid:** https://app.sendgrid.com/

---

## 🚨 If Something Goes Wrong

### Rollback
1. Go to Vercel → Deployments
2. Find the last working deployment
3. Click "..." → "Promote to Production"

### Check Logs
- **Vercel:** Project → Deployments → Click deployment → Logs
- **Supabase:** Project → Logs
- **Sentry:** Issues tab
- **Browser:** Open DevTools → Console

---

## 📝 Next Steps

1. Monitor error rates in Sentry
2. Check email delivery in SendGrid
3. Watch user engagement in Google Analytics
4. Set up monitoring alerts
5. Consider adding:
   - Group editing functionality
   - Email notifications for group updates
   - User profile customization
   - Admin dashboard

---

**Congratulations on launching Joynex! 🚀**
