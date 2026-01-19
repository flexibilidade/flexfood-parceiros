/**
 * Type declaration for next-pwa module
 */
declare module "next-pwa" {
  import { NextConfig } from "next";

  /**
   * Runtime caching configuration for workbox
   */
  interface RuntimeCachingEntry {
    urlPattern: RegExp | string;
    handler: string;
    options?: {
      cacheName?: string;
      expiration?: {
        maxEntries?: number;
        maxAgeSeconds?: number;
      };
      cacheableResponse?: {
        statuses?: number[];
        headers?: {
          [key: string]: string;
        };
      };
      networkTimeoutSeconds?: number;
      backgroundSync?: {
        name: string;
        options?: {
          maxRetentionTime?: number;
        };
      };
    };
  }

  interface PWAConfig {
    dest: string;
    disable?: boolean;
    register?: boolean;
    scope?: string;
    sw?: string;
    skipWaiting?: boolean;
    runtimeCaching?: RuntimeCachingEntry[];
    publicExcludes?: string[];
    buildExcludes?: string[] | RegExp[];
    fallbacks?: {
      [key: string]: string;
    };
  }

  export default function withPWA(
    pwaConfig: PWAConfig
  ): (nextConfig: NextConfig) => NextConfig;
}
