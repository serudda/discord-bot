import { type AppRouter } from './root';
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';

export * from './common';
export { appRouter, type AppRouter } from './root';
export { configService, ErrorCodes, ErrorMessages } from './services';
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
