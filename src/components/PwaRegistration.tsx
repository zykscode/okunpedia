'use client';

import React from 'react';
import { Env } from '@/libs/Env';

/**
 * Client injection component registering the local service worker script supporting progressive web app offline resilience.
 * @returns {React.ReactNode} Inline registration script wrapper nodes.
 */
export const PwaRegistration = () => {
  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      if (Env.NODE_ENV === 'production') {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js').catch(() => {
            // Fail gracefully in restricted sandbox testing environments
          });
        });
      } else {
        // Automatically unregister the service worker in development/test to prevent stale Turbopack module factory errors
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister();
          }
        });
        // Clear caches to remove stale dev chunks
        if (typeof window !== 'undefined' && 'caches' in window) {
          caches.keys().then((keys) => {
            for (const key of keys) {
              caches.delete(key);
            }
          });
        }
      }
    }
  }, []);

  return null;
};
