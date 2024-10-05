import { createUserHandler } from '../controllers/user.controller';
import { createUserInput } from '../schema/user.schema';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const tcgRouter = createTRPCRouter({
  buyPack: publicProcedure.input(createUserInput).mutation(async ({ ctx, input }) => createUserHandler({ ctx, input })),
});
