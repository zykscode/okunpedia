import type { MetadataRoute } from 'next';
import { AppConfig } from '@/utils/AppConfig';

/**
 * Generate standard web application manifest configuration for Progressive Web App compliance.
 * @returns {MetadataRoute.Manifest} The structured web manifest JSON payload.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: AppConfig.name,
    short_name: 'Okunpedia',
    description: 'Digital Heritage Platform and Tribal Knowledge base for the Okun People',
    start_url: '/',
    display: 'standalone',
    background_color: '#022c22',
    theme_color: '#10b981',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
