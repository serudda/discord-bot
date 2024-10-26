/* eslint-disable no-restricted-properties */

import { type AppRouter } from '@discord-bot/api';
import { httpBatchLink, loggerLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import superjson from 'superjson';

const getBaseUrl = () => {
  console.log('👀 process.env.API_URL =>', process.env.API_URL);
  if (typeof window !== 'undefined') return ''; // browser should use relative url
  if (process.env.API_URL) return process.env.API_URL; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 5173}`; // dev SSR should use localhost
};

export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV !== 'production' || (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: process.env.VERCEL_URL ? `${getBaseUrl()}/api/trpc` : `${getBaseUrl()}`,
        }),
      ],
    };
  },
  ssr: false,
});

export { type RouterInputs, type RouterOutputs } from '@discord-bot/api';
export * from '@discord-bot/api/src/common';
export * from '@discord-bot/db/common';
