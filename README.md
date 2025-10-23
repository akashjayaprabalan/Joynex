# Joynex - Building Connections That Matter

A modern, scalable React application built with Vite, Tailwind CSS, and Supabase. Originally created with Lovable and transformed into a production-ready codebase optimized for scale and maintainability.

## 🚀 Features

- ⚡️ **Lightning Fast** - Built with Vite for optimal performance
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- 🔐 **Secure Authentication** - Powered by Supabase Auth
- 📱 **Fully Responsive** - Works seamlessly on all devices
- 🧩 **Component-Based** - Reusable, modular components
- 🎯 **Type-Safe** - Ready for TypeScript conversion
- 🔄 **Real-time Database** - Supabase integration
- 🌐 **Production Ready** - Optimized for deployment

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier available)
- Domain configured (joynex.online)

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Joynex
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_API_URL=https://joynex.online/api
   VITE_APP_NAME=Joynex
   VITE_APP_URL=https://joynex.online
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
Joynex/
├── src/
│   ├── components/          # Reusable components
│   │   ├── ui/             # Base UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   └── Container.jsx
│   │   ├── layout/         # Layout components
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   └── features/       # Feature-specific components
│   │
│   ├── pages/              # Page components
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   └── Features.jsx
│   │
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.js
│   │   └── useLocalStorage.js
│   │
│   ├── utils/              # Utility functions
│   │   ├── cn.js          # Tailwind class merger
│   │   └── helpers.js     # Helper functions
│   │
│   ├── services/           # API services
│   │   └── api.js         # API client & database helpers
│   │
│   ├── config/             # Configuration files
│   │   ├── supabase.js    # Supabase client setup
│   │   └── index.js       # App configuration
│   │
│   ├── constants/          # App constants
│   │   └── index.js
│   │
│   ├── App.jsx            # Main App component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
│
├── public/                 # Static assets
├── .env                    # Environment variables
├── .env.example           # Environment variables template
├── vite.config.js         # Vite configuration
├── package.json           # Dependencies
├── DEPLOYMENT.md          # Deployment guide
└── README.md              # This file
```

## 🎨 Architecture Highlights

### Path Aliases

Clean imports using path aliases:

```javascript
import { Button, Card } from '@components/ui';
import { useAuth } from '@hooks';
import { db } from '@services';
```

Configured in `vite.config.js`:
- `@` → `src/`
- `@components` → `src/components/`
- `@pages` → `src/pages/`
- `@hooks` → `src/hooks/`
- `@utils` → `src/utils/`
- `@services` → `src/services/`
- `@config` → `src/config/`

### Reusable Components

All UI components are built with:
- Tailwind CSS for styling
- `clsx` and `tailwind-merge` for conditional classes
- Props for customization
- Consistent API across components

Example:
```jsx
<Button variant="primary" size="lg" loading={isLoading}>
  Submit
</Button>
```

### Database Integration

Supabase helpers in `services/api.js`:

```javascript
import { db } from '@services';

// Get all records
const { data, error } = await db.getAll('posts');

// Get by ID
const { data, error } = await db.getById('posts', postId);

// Create
const { data, error } = await db.create('posts', { title, content });

// Update
const { data, error } = await db.update('posts', postId, { title });

// Delete
const { error } = await db.delete('posts', postId);
```

### Authentication

Use the `useAuth` hook:

```javascript
import { useAuth } from '@hooks';

function MyComponent() {
  const { user, loading, signIn, signOut, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    const { data, error } = await signIn(email, password);
    if (!error) {
      // Handle successful login
    }
  };
}
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)

# Build
npm run build        # Build for production

# Preview
npm run preview      # Preview production build locally

# Lint
npm run lint         # Run ESLint
```

## 🗄️ Database Setup

### 1. Create Supabase Project

1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key

### 2. Create Tables

Use the SQL Editor in Supabase:

```sql
-- Example: Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

### 3. Set Environment Variables

Update your `.env` file with Supabase credentials.

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Configure domain: joynex.online
5. Deploy!

```bash
# Or use CLI
npm install -g vercel
vercel
```

## 📦 Key Dependencies

- **React 19** - UI library
- **React Router DOM** - Routing
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Supabase** - Backend & Database
- **Lucide React** - Icons
- **clsx & tailwind-merge** - Class management

## 🔐 Security

- Environment variables for sensitive data
- Row Level Security (RLS) in Supabase
- HTTPS enforced in production
- Secure authentication with Supabase Auth

## 🎯 Best Practices

1. **Component Structure** - Keep components small and focused
2. **Naming Conventions** - Use PascalCase for components, camelCase for functions
3. **File Organization** - Group related files together
4. **Code Reusability** - Extract common logic into hooks and utilities
5. **Type Safety** - Consider adding TypeScript for larger projects
6. **Error Handling** - Always handle errors gracefully
7. **Performance** - Use React.memo and useMemo for expensive operations
8. **Accessibility** - Ensure all components are accessible

## 🚦 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `VITE_API_URL` | API base URL | No |
| `VITE_APP_NAME` | Application name | No |
| `VITE_APP_URL` | Application URL | No |

## 📝 Adding New Features

### 1. Create a New Page

```bash
# Create page file
touch src/pages/NewPage.jsx
```

```jsx
// src/pages/NewPage.jsx
import { Container } from '@components/ui';

const NewPage = () => {
  return (
    <Container>
      <h1>New Page</h1>
    </Container>
  );
};

export default NewPage;
```

### 2. Add Route

Update `src/App.jsx`:

```jsx
import { NewPage } from '@pages';

<Route path="/new-page" element={<NewPage />} />
```

### 3. Add to Navigation

Update `src/components/layout/Header.jsx` to include the new link.

## 🐛 Troubleshooting

### Port Already in Use

Change the port in `vite.config.js`:

```javascript
server: {
  port: 3001, // Change to any available port
}
```

### Build Errors

Clear cache and rebuild:

```bash
rm -rf node_modules dist .vite
npm install
npm run build
```

### Environment Variables Not Loading

Ensure variables start with `VITE_` prefix and restart dev server.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📧 Contact

- Website: [joynex.online](https://joynex.online)
- Email: hello@joynex.online
- Support: support@joynex.online

---

Built with ❤️ using React, Vite, and Tailwind CSS

**Version:** 1.0.0  
**Last Updated:** October 23, 2025
