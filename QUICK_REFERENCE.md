# Quick Reference Guide

## 🚀 Common Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint

# Package Management
npm install              # Install dependencies
npm install <package>    # Install new package
npm update               # Update packages
```

## 📁 Path Aliases

```javascript
// Instead of this:
import Button from '../../../../components/ui/Button';

// Use this:
import { Button } from '@components/ui';

// Available aliases:
@                   → src/
@components         → src/components/
@pages              → src/pages/
@hooks              → src/hooks/
@utils              → src/utils/
@services           → src/services/
@constants          → src/constants/
@context            → src/context/
@config             → src/config/
```

## 🧩 Component Usage

### Button
```jsx
import { Button } from '@components/ui';

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
<Button variant="success">Success</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// With loading state
<Button loading={isLoading}>Submit</Button>
```

### Card
```jsx
import { Card } from '@components/ui';

<Card>
  <Card.Header>
    <h3>Title</h3>
  </Card.Header>
  <Card.Body>
    <p>Content</p>
  </Card.Body>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

### Input
```jsx
import { Input } from '@components/ui';

<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  placeholder="you@example.com"
/>
```

### Container
```jsx
import { Container } from '@components/ui';

<Container maxWidth="7xl">
  {/* Your content */}
</Container>

// Available max widths: sm, md, lg, xl, 2xl, 7xl, full
```

## 🗄️ Database Operations

```javascript
import { db } from '@services';

// Get all records
const { data, error } = await db.getAll('posts');

// Get by ID
const { data, error } = await db.getById('posts', postId);

// Create record
const { data, error } = await db.create('posts', {
  title: 'My Post',
  content: 'Content here'
});

// Update record
const { data, error } = await db.update('posts', postId, {
  title: 'Updated Title'
});

// Delete record
const { error } = await db.delete('posts', postId);
```

## 🔐 Authentication

```javascript
import { useAuth } from '@hooks';

function MyComponent() {
  const { user, loading, signIn, signUp, signOut, isAuthenticated } = useAuth();

  // Sign up
  const handleSignUp = async (email, password, metadata) => {
    const { data, error } = await signUp(email, password, { name: 'John' });
  };

  // Sign in
  const handleSignIn = async (email, password) => {
    const { data, error } = await signIn(email, password);
  };

  // Sign out
  const handleSignOut = async () => {
    const { error } = await signOut();
  };

  // Check auth status
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <LoginForm />;
  
  return <Dashboard user={user} />;
}
```

## 🛠️ Utilities

```javascript
import { cn, formatDate, truncateText, debounce } from '@utils';

// Merge Tailwind classes
const className = cn('base-class', condition && 'conditional-class');

// Format date
const formatted = formatDate(new Date()); // "October 23, 2025"

// Truncate text
const short = truncateText(longText, 100); // "Text... (truncated at 100 chars)"

// Debounce function
const debouncedSearch = debounce((query) => {
  // Search logic
}, 300);
```

## 🎨 Styling with Tailwind

### Common Patterns

```jsx
// Responsive design
<div className="text-sm md:text-base lg:text-lg" />

// Flexbox
<div className="flex items-center justify-between" />

// Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" />

// Spacing
<div className="p-4 m-2 mb-8 mx-auto" />

// Colors
<div className="bg-blue-600 text-white hover:bg-blue-700" />

// Gradients
<div className="bg-gradient-to-br from-blue-600 to-purple-600" />
```

## 🔄 Adding New Features

### 1. Add a New Page

```bash
# Create file
touch src/pages/Dashboard.jsx
```

```jsx
// src/pages/Dashboard.jsx
import { Container } from '@components/ui';

const Dashboard = () => {
  return (
    <Container>
      <h1>Dashboard</h1>
    </Container>
  );
};

export default Dashboard;
```

```jsx
// Export in src/pages/index.js
export { default as Dashboard } from './Dashboard';
```

```jsx
// Add route in src/App.jsx
import { Dashboard } from '@pages';

<Route path="/dashboard" element={<Dashboard />} />
```

### 2. Add a New Component

```bash
# Create file
touch src/components/ui/Badge.jsx
```

```jsx
// src/components/ui/Badge.jsx
import { cn } from '@utils/cn';

const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-200 text-gray-800',
    success: 'bg-green-200 text-green-800',
  };

  return (
    <span className={cn('px-2 py-1 rounded text-sm', variants[variant])}>
      {children}
    </span>
  );
};

export default Badge;
```

```jsx
// Export in src/components/ui/index.js
export { default as Badge } from './Badge';
```

### 3. Add a Custom Hook

```bash
# Create file
touch src/hooks/useFetch.js
```

```javascript
// src/hooks/useFetch.js
import { useState, useEffect } from 'react';

export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};
```

```javascript
// Export in src/hooks/index.js
export * from './useFetch';
```

## 📝 Environment Variables

```env
# Required for database
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional
VITE_API_URL=https://joynex.online/api
VITE_APP_NAME=Joynex
VITE_APP_URL=https://joynex.online
```

**Important:** 
- Variables must start with `VITE_`
- Restart dev server after changes
- Never commit `.env` to git

## 🚀 Deployment

### Vercel
```bash
npm install -g vercel
vercel login
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### Manual Build
```bash
npm run build
# Upload dist/ folder to your server
```

## 🐛 Troubleshooting

### Clear Cache
```bash
rm -rf node_modules package-lock.json
npm install
```

### Clear Build Cache
```bash
rm -rf dist .vite
npm run build
```

### Fix Permissions (Mac/Linux)
```bash
sudo chown -R $USER:$USER ~/.npm
```

## 📊 Project Stats

```bash
# Count components
find src/components -name "*.jsx" | wc -l

# Count pages
find src/pages -name "*.jsx" | wc -l

# Lines of code
find src -name "*.jsx" -o -name "*.js" | xargs wc -l
```

## 🔗 Useful Links

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase Docs](https://supabase.com/docs)
- [React Router](https://reactrouter.com)
- [Lucide Icons](https://lucide.dev)

## 📚 Your Documentation

- `README.md` - Full project overview
- `SETUP_GUIDE.md` - Step-by-step setup
- `DEPLOYMENT.md` - Deployment instructions
- `TRANSFORMATION_SUMMARY.md` - What was built
- `QUICK_REFERENCE.md` - This file

---

**Quick Start:**
1. Create `.env` with Supabase credentials
2. Run `npm run dev`
3. Open http://localhost:3000
4. Start building! 🚀

