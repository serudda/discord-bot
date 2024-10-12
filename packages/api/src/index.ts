import { appRouter, type AppRouter } from './root';
import { createTRPCContext } from './trpc';
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';

export * from './common';
export { appRouter, type AppRouter } from './root';
export { createTRPCContext } from './trpc';

/**
 * Inference helpers for input types.
 *
 * @example type HelloInput =
 * RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helpers for output types.
 *
 * @example type HelloOutput =
 * RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;

/**
 * Create a standalone HTTP server with the app router.
 */
const server = createHTTPServer({
  router: appRouter,
  createContext: createTRPCContext,
});

/**
 * Start the server.
 */
const port = 5173;

server.listen(port);

console.log(`🚀 Server ready at http://localhost:${port}`);
