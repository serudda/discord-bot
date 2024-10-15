/* eslint-disable no-restricted-properties */

import type { AppRouter } from '@discord-bot/api';
import { httpBatchLink, loggerLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import superjson from 'superjson';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return 'http://localhost:5173';

  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  return `http://localhost:5173`;
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
