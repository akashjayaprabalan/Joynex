# Deployment Guide for Joynex

This guide will help you deploy your Joynex application to production with your domain `joynex.online`.

## Prerequisites

- Node.js 18+ installed
- Domain name configured (joynex.online)
- Supabase account (for database)
- Hosting provider account (Vercel, Netlify, or similar)

## Database Setup (Supabase)

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new project
2. Note your project URL and anon key from Settings > API
3. Create your database tables in the SQL Editor

### 2. Example Database Schema

```sql
-- Users table (if not using Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Example: Posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Public can read posts" ON posts
  FOR SELECT USING (true);
```

### 3. Update Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=https://joynex.online/api
VITE_APP_NAME=Joynex
VITE_APP_URL=https://joynex.online
```

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Add Environment Variables:**
   - Go to your project settings on Vercel dashboard
   - Add all environment variables from `.env`

5. **Configure Domain:**
   - Go to Settings > Domains
   - Add your domain: `joynex.online`
   - Update your DNS records as instructed by Vercel

### Option 2: Netlify

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Build your project:**
   ```bash
   npm run build
   ```

4. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

5. **Add Environment Variables:**
   - Go to Site settings > Environment variables
   - Add all variables from `.env`

6. **Configure Domain:**
   - Go to Domain settings
   - Add your custom domain: `joynex.online`

### Option 3: Manual VPS Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload to your server:**
   ```bash
   scp -r dist/* user@your-server:/var/www/joynex.online
   ```

3. **Configure Nginx:**
   ```nginx
   server {
       listen 80;
       server_name joynex.online www.joynex.online;
       
       root /var/www/joynex.online;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

4. **Install SSL Certificate:**
   ```bash
   sudo certbot --nginx -d joynex.online -d www.joynex.online
   ```

## Domain Configuration

### DNS Settings for joynex.online

Point your domain to your hosting provider:

**For Vercel:**
- Type: A Record
- Name: @
- Value: 76.76.21.21

**For Netlify:**
- Type: A Record
- Name: @
- Value: 75.2.60.5

**Add www subdomain:**
- Type: CNAME
- Name: www
- Value: your-project.vercel.app (or netlify.app)

### SSL Certificate

Most hosting providers (Vercel, Netlify) automatically provision SSL certificates. If deploying manually, use Let's Encrypt:

```bash
sudo certbot certonly --standalone -d joynex.online -d www.joynex.online
```

## Post-Deployment Checklist

- [ ] Verify all pages load correctly
- [ ] Test all forms and interactions
- [ ] Verify database connections work
- [ ] Check mobile responsiveness
- [ ] Test all API endpoints
- [ ] Verify SSL certificate is active
- [ ] Set up monitoring (e.g., Sentry, LogRocket)
- [ ] Configure analytics (e.g., Google Analytics, Plausible)
- [ ] Set up backup strategy for database
- [ ] Test performance with Lighthouse

## Monitoring and Analytics

### Add Google Analytics

Add to `index.html` before closing `</head>` tag:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Error Tracking with Sentry

```bash
npm install @sentry/react @sentry/tracing
```

Update `main.jsx`:

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

## Continuous Deployment

### GitHub Actions (for automatic deployment)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## Troubleshooting

### Build Errors

If you encounter build errors:

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf dist .vite

# Rebuild
npm run build
```

### Environment Variables Not Working

Make sure your environment variables start with `VITE_` prefix to be accessible in the client-side code.

### Routing Issues on Production

Ensure your hosting provider is configured to redirect all routes to `index.html` for proper React Router functionality.

## Support

For issues or questions:
- Email: support@joynex.online
- Documentation: https://docs.joynex.online
- GitHub Issues: https://github.com/your-org/joynex

---

**Last Updated:** October 23, 2025

