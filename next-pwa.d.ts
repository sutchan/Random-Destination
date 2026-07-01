declare module 'next-pwa' {
  import type { NextConfig } from 'next';

  interface PWAConfig {
    dest: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    [key: string]: unknown;
  }

  type WithPWA = (config: PWAConfig) => (nextConfig: NextConfig) => NextConfig;

  const withPWA: WithPWA;

  export default withPWA;
}