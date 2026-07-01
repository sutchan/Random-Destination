import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Random Destination Wheel',
    short_name: 'Dest. Wheel',
    description: 'A customizable spinning wheel to pick a random travel destination with AI-powered insights, history, and favorites.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    orientation: 'portrait',
    categories: ['travel', 'utilities'],
    icons: [
      {
        src: '/icon-192x192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any'
      },
      {
        src: '/icon-192x192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'maskable'
      },
      {
        src: '/icon-512x512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any'
      },
      {
        src: '/icon-512x512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'maskable'
      }
    ],
    screenshots: [
      {
        src: '/screenshot-1080x1920.svg',
        sizes: '1080x1920',
        type: 'image/svg+xml',
        label: 'Home Screen'
      }
    ],
    shortcuts: [
      {
        name: 'Spin Now',
        url: '/',
        icons: [{ src: '/icon-96x96.svg', sizes: '96x96', type: 'image/svg+xml' }]
      }
    ]
  };
}
