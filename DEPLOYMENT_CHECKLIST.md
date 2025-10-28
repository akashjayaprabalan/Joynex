# 🚀 Joynex Deployment Checklist

Use this checklist to track your deployment progress. Check off items as you complete them.

---

## Pre-Deployment Setup

- [ ] **Supabase Database**
  - [ ] Run `supabase/schema.sql` in SQL Editor
  - [ ] Run `supabase/notifications.sql` in SQL Editor (comment out pg_cron line)
  - [ ] Verify tables exist: users, verification_codes, groups, group_members, notifications

- [ ] **SendGrid Account**
  - [ ] Create SendGrid account (free tier)
  - [ ] Verify sender email
  - [ ] Create API key
  - [ ] Create verification email template
  - [ ] Create welcome email template
  - [ ] Create group join email template
  - [ ] Create group update email template
  - [ ] Copy all 4 template IDs

- [ ] **Sentry Setup**
  - [ ] Create Sentry account (free tier)
  - [ ] Create "Joynex" project (React)
  - [ ] Copy DSN

- [ ] **Google Analytics**
  - [ ] Create GA4 property
  - [ ] Add website: https://joynex.online
  - [ ] Copy Measurement ID (G-XXXXXXXXXX)

---

## Vercel Environment Variables

Go to: https://vercel.com/akashs-projects-b0436dd5/joynex/settings/environment-variables

- [ ] `VITE_SUPABASE_URL` = https://spqyigrtimsuqhzebedn.supabase.co
- [ ] `VITE_SUPABASE_ANON_KEY` = (your anon key)
- [ ] `VITE_APP_NAME` = Joynex
- [ ] `VITE_APP_URL` = https://joynex.online
- [ ] `VITE_API_URL` = https://joynex.online/api
- [ ] `VITE_SENDGRID_API_KEY` = (from SendGrid)
- [ ] `VITE_SENDGRID_VERIFICATION_TEMPLATE_ID` = (from SendGrid)
- [ ] `VITE_SENDGRID_WELCOME_TEMPLATE_ID` = (from SendGrid)
- [ ] `VITE_SENDGRID_GROUP_JOIN_TEMPLATE_ID` = (from SendGrid)
- [ ] `VITE_SENDGRID_GROUP_UPDATE_TEMPLATE_ID` = (from SendGrid)
- [ ] `VITE_SENTRY_DSN` = (from Sentry)
- [ ] `VITE_GA_MEASUREMENT_ID` = (from Google Analytics)

**Important:** Select "Production, Preview, Development" for all variables!

---

## Deployment

- [ ] **Deploy to Vercel**
  - Option A: Import from GitHub (Recommended)
  - Option B: Run `npx vercel --prod`
- [ ] **Wait for build to complete** (2-3 minutes)
- [ ] **Check deployment URL** (should show Joynex app)
- [ ] **Verify SSL certificate** is active on joynex.online

---

## Post-Deployment Testing

- [ ] **Authentication Flow**
  - [ ] Visit https://joynex.online/signup
  - [ ] Enter University of Melbourne email
  - [ ] Receive verification email
  - [ ] Enter code successfully
  - [ ] Redirected to /discover
  - [ ] Sign out and sign in again

- [ ] **Group Creation**
  - [ ] Go to /create
  - [ ] Fill all required fields
  - [ ] Submit form
  - [ ] Group appears in /my-groups under "Created" tab
  - [ ] Google Maps link opens correctly

- [ ] **Group Discovery & Joining**
  - [ ] Open incognito window
  - [ ] Sign up with different Unimelb email
  - [ ] See created group in /discover
  - [ ] Click "Join Group"
  - [ ] Group disappears from /discover
  - [ ] Group appears in /my-groups under "Joined" tab
  - [ ] Member count increments

- [ ] **Leave Group**
  - [ ] Click "Leave Group" in /my-groups
  - [ ] Group removed from "Joined" tab
  - [ ] Group reappears in /discover
  - [ ] Member count decrements

- [ ] **Notifications**
  - [ ] Bell icon shows unread count
  - [ ] Click bell to see notifications
  - [ ] Mark notification as read
  - [ ] Count updates

- [ ] **Email Notifications**
  - [ ] Verification code email received
  - [ ] Welcome email received after verification
  - [ ] Group join notification email received (optional)

- [ ] **Monitoring & Analytics**
  - [ ] Open Sentry dashboard
  - [ ] Verify page views are tracked
  - [ ] Open Google Analytics
  - [ ] Check real-time users
  - [ ] Force an error and check Sentry

---

## Optional: GitHub Actions CI/CD

- [ ] Go to https://github.com/akashjayaprabalan/Joynex/settings/secrets/actions
- [ ] Add all environment variables as repository secrets
- [ ] Add Vercel tokens:
  - [ ] `VERCEL_TOKEN` (from https://vercel.com/account/tokens)
  - [ ] `VERCEL_ORG_ID`
  - [ ] `VERCEL_PROJECT_ID`
- [ ] Test: Make a small change, commit, push
- [ ] Verify GitHub Actions runs successfully
- [ ] Verify deployment updates on Vercel

---

## 🎉 Launch Complete!

- [ ] All tests passing
- [ ] No errors in Sentry
- [ ] Users showing in Google Analytics
- [ ] Domain SSL active
- [ ] Share with first users!

---

## 📊 Your Dashboard Links

Save these for quick access:

- **Live Site:** https://joynex.online
- **Vercel:** https://vercel.com/akashs-projects-b0436dd5/joynex
- **GitHub:** https://github.com/akashjayaprabalan/Joynex
- **Supabase:** https://app.supabase.com/project/spqyigrtimsuqhzebedn
- **Sentry:** https://sentry.io/
- **Google Analytics:** https://analytics.google.com/
- **SendGrid:** https://app.sendgrid.com/

---

**Good luck with your launch! 🚀**