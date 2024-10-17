import {
  addCoinsHandler,
  buyPackHandler,
  createCardHandler,
  getAllCardsByRarityHandler,
  getAllCardsHandler,
  getCollectionHandler,
  getRandomCardsHandler,
  setCoinsHandler,
} from '../controllers/card.controller';
import {
  addCoinsInput,
  buyPackInput,
  createCardInput,
  getAllCardsByRarityInput,
  getAllCardsInput,
  getCollectionInput,
  getRandomCardsInput,
  setCoinsInput,
} from '../schema/card.schema';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const cardRouter = createTRPCRouter({
  buyPack: publicProcedure.input(buyPackInput).mutation(async ({ ctx, input }) => buyPackHandler({ ctx, input })),
  getAllCards: publicProcedure
    .input(getAllCardsInput)
    .query(async ({ ctx, input }) => getAllCardsHandler({ ctx, input })),
  getAllCardsByRarity: publicProcedure
    .input(getAllCardsByRarityInput)
    .query(async ({ ctx, input }) => getAllCardsByRarityHandler({ ctx, input })),
  getRandomCards: publicProcedure
    .input(getRandomCardsInput)
    .query(async ({ ctx, input }) => getRandomCardsHandler({ ctx, input })),
  addCoins: publicProcedure.input(addCoinsInput).mutation(async ({ ctx, input }) => addCoinsHandler({ ctx, input })),
  setCoins: publicProcedure.input(setCoinsInput).mutation(async ({ ctx, input }) => setCoinsHandler({ ctx, input })),
  createCard: publicProcedure
    .input(createCardInput)
    .mutation(async ({ ctx, input }) => createCardHandler({ ctx, input })),
  getCollection: publicProcedure
    .input(getCollectionInput)
    .query(async ({ ctx, input }) => getCollectionHandler({ ctx, input })),
});
