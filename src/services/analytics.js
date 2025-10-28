// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined' && import.meta.env.PROD && import.meta.env.VITE_GA_MEASUREMENT_ID) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID);

    window.gtag = gtag;
  }
};

// Track page views
export const trackPageView = (path) => {
  if (typeof window !== 'undefined' && window.gtag && import.meta.env.PROD) {
    window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
      page_path: path,
    });
  }
};

// Track events
export const trackEvent = (category, action, label = null, value = null) => {
  if (typeof window !== 'undefined' && window.gtag && import.meta.env.PROD) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track user engagement
export const trackEngagement = {
  // Track group creation
  groupCreated: (groupType) => {
    trackEvent('Group', 'Created', groupType);
  },

  // Track group join
  groupJoined: (groupType) => {
    trackEvent('Group', 'Joined', groupType);
  },

  // Track group leave
  groupLeft: (groupType) => {
    trackEvent('Group', 'Left', groupType);
  },

  // Track search
  search: (term) => {
    trackEvent('Search', 'Performed', term);
  },

  // Track filter usage
  filterUsed: (filterType, value) => {
    trackEvent('Filter', 'Applied', `${filterType}:${value}`);
  },

  // Track verification attempts
  verificationAttempt: (success) => {
    trackEvent('Verification', success ? 'Success' : 'Failed');
  },

  // Track user signup
  userSignup: () => {
    trackEvent('User', 'Signup');
  },

  // Track user signin
  userSignin: () => {
    trackEvent('User', 'Signin');
  },
};
