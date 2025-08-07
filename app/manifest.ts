import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Caly',
    short_name: 'Caly',
    description:
      'An open-source AI calendar, offering a fresh alternative to traditional calendar applications.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000',
    theme_color: '#000',
    icons: [
      {
        src: '/caly.svg',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
