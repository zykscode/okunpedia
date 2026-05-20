'use client';

import React from 'react';

/**
 * Client injection component registering the local service worker script supporting progressive web app offline resilience.
 * @returns {React.ReactNode} Inline registration script wrapper nodes.
 */
export const PwaRegistration = () => {
  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {
          // Fail gracefully in restricted sandbox testing environments
        });
      });
    }
  }, []);

  return null;
};
