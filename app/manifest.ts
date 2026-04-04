import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Digitadist App',
    short_name: 'Digitadist',
    lang: 'en-AR',
    description: 'Aplicacion mobile para gestion de ventas',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#f80000',
    icons: [
      {
        src: '/apple-touch-icon.png',
        sizes: 'any',
        type: 'image/png',
      },
      {
        src: '/favicon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  //   // "related_applications": [
  //   // {
  //   //   "platform": "web"
  //   // }
  // ]
  }
}