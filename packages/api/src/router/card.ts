import {
  addCoinsHandler,
  buyPackHandler,
  getAllCardsByRarityHandler,
  getRandomCardsHandler,
  setCoinsHandler,
} from '../controllers/card.controller';
import {
  addCoinsInput,
  buyPackInput,
  getAllCardsByRarityInput,
  getRandomCardsInput,
  setCoinsInput,
} from '../schema/card.schema';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const cardRouter = createTRPCRouter({
  buyPack: publicProcedure.input(buyPackInput).mutation(async ({ ctx, input }) => buyPackHandler({ ctx, input })),
  getAllCardsByRarity: publicProcedure
    .input(getAllCardsByRarityInput)
    .query(async ({ ctx, input }) => getAllCardsByRarityHandler({ ctx, input })),
  getRandomCards: publicProcedure
    .input(getRandomCardsInput)
    .query(async ({ ctx, input }) => getRandomCardsHandler({ ctx, input })),
  addCoins: publicProcedure.input(addCoinsInput).mutation(async ({ ctx, input }) => addCoinsHandler({ ctx, input })),
  setCoins: publicProcedure.input(setCoinsInput).mutation(async ({ ctx, input }) => setCoinsHandler({ ctx, input })),
});
