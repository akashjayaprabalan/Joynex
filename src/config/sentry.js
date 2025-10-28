import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

export const initSentry = () => {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [new BrowserTracing()],
      tracesSampleRate: 0.1,
      environment: import.meta.env.MODE,
      beforeSend(event) {
        // Don't send events in development
        if (import.meta.env.DEV) {
          return null;
        }
        return event;
      },
    });
  }
};

export const captureError = (error, context = {}) => {
  console.error(error);
  if (import.meta.env.PROD) {
    Sentry.captureException(error, {
      extra: context,
    });
  }
};

export const setUserContext = (user) => {
  if (import.meta.env.PROD && user) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
    });
  }
};

export const clearUserContext = () => {
  if (import.meta.env.PROD) {
    Sentry.setUser(null);
  }
};
