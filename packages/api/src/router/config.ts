import { getConfigHandler } from '../controllers/config.controller';
import { getConfigInput } from '../schema/config.schema';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const configRouter = createTRPCRouter({
  getConfig: publicProcedure.input(getConfigInput).query(async ({ ctx, input }) => getConfigHandler({ ctx, input })),
});
