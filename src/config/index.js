export const config = {
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Joynex',
    url: import.meta.env.VITE_APP_URL || 'https://joynex.online',
  },
  api: {
    url: import.meta.env.VITE_API_URL || 'https://joynex.online/api',
  },
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
};

