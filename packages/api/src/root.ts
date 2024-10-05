import { accountRouter } from './router/account';
import { paymentRouter } from './router/payment';
import { subscriptionRouter } from './router/subscription';
import { subscriptionPlanRouter } from './router/subscriptionPlan';
import { tcgRouter } from './router/tcg';
import { userRouter } from './router/user';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  account: accountRouter,
  payment: paymentRouter,
  subscription: subscriptionRouter,
  subscriptionPlan: subscriptionPlanRouter,
  tcg: tcgRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
