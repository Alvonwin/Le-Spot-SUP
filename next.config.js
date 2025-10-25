/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Configuration pour le domaine de production et le développement local
  allowedDevOrigins: ['*'],
  // Base path pour le déploiement (si nécessaire)
  // basePath: '',
  // URL de production
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NODE_ENV === 'production'
      ? 'https://lespotsup.freeddns.org'
      : 'http://localhost:3000',
  },
};

module.exports = nextConfig;