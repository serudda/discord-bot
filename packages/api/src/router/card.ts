import {
  buyPackHandler,
  getAllCardsByRarityHandler,
  getRandomCardsHandler,
  giveCoinsHandler,
} from '../controllers/card.controller';
import { buyPackInput, getAllCardsByRarityInput, getRandomCardsInput, giveCoinsInput } from '../schema/card.schema';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const cardRouter = createTRPCRouter({
  buyPack: publicProcedure.input(buyPackInput).mutation(async ({ ctx, input }) => buyPackHandler({ ctx, input })),
  getAllCardsByRarity: publicProcedure
    .input(getAllCardsByRarityInput)
    .query(async ({ ctx, input }) => getAllCardsByRarityHandler({ ctx, input })),
  getRandomCards: publicProcedure
    .input(getRandomCardsInput)
    .query(async ({ ctx, input }) => getRandomCardsHandler({ ctx, input })),
  giveCoins: publicProcedure.input(giveCoinsInput).mutation(async ({ ctx, input }) => giveCoinsHandler({ ctx, input })),
});
