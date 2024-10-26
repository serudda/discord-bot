import { accountRouter } from './router/account';
import { cardRouter } from './router/card';
import { configRouter } from './router/config';
import { packRouter } from './router/pack';
import { paymentRouter } from './router/payment';
import { seasonRouter } from './router/season';
import { subscriptionRouter } from './router/subscription';
import { subscriptionPlanRouter } from './router/subscriptionPlan';
import { userRouter } from './router/user';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  account: accountRouter,
  card: cardRouter,
  config: configRouter,
  payment: paymentRouter,
  pack: packRouter,
  season: seasonRouter,
  sub: subscriptionRouter,
  subscriptionPlan: subscriptionPlanRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
