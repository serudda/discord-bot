import { buyPackHandler, getAllCardsByRarityHandler, getRandomCardsHandler } from '../controllers/card.controller';
import { buyPackInput, getAllCardsByRarityInput, getRandomCardsInput } from '../schema/card.schema';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const cardRouter = createTRPCRouter({
  buyPack: publicProcedure.input(buyPackInput).mutation(async ({ ctx, input }) => buyPackHandler({ ctx, input })),
  getAllCardsByRarity: publicProcedure
    .input(getAllCardsByRarityInput)
    .query(async ({ ctx, input }) => getAllCardsByRarityHandler({ ctx, input })),
  getRandomCards: publicProcedure
    .input(getRandomCardsInput)
    .query(async ({ ctx, input }) => getRandomCardsHandler({ ctx, input })),
});
