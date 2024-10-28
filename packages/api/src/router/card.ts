import {
  createCardHandler,
  getAllCardsByRarityHandler,
  getAllCardsHandler,
  getCardsBySeasonHandler,
  getRandomCardByRarityHandler,
  getRandomCardsHandler,
  getUserCollectionHandler,
  giveCoinsHandler,
  setCoinsHandler,
} from '../controllers/card.controller';
import {
  createCardInput,
  getAllCardsByRarityInput,
  getAllCardsInput,
  getCardsBySeasonInput,
  getRandomCardByRarityInput,
  getRandomCardsInput,
  getUserCollectionInput,
  giveCoinsInput,
  setCoinsInput,
} from '../schema/card.schema';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const cardRouter = createTRPCRouter({
  getAllCards: publicProcedure
    .input(getAllCardsInput)
    .query(async ({ ctx, input }) => getAllCardsHandler({ ctx, input })),
  getCardsBySeason: publicProcedure
    .input(getCardsBySeasonInput)
    .query(async ({ ctx, input }) => getCardsBySeasonHandler({ ctx, input })),
  getAllCardsByRarity: publicProcedure
    .input(getAllCardsByRarityInput)
    .query(async ({ ctx, input }) => getAllCardsByRarityHandler({ ctx, input })),
  getRandomCards: publicProcedure
    .input(getRandomCardsInput)
    .query(async ({ ctx, input }) => getRandomCardsHandler({ ctx, input })),
  getRandomCardByRarity: publicProcedure
    .input(getRandomCardByRarityInput)
    .query(async ({ ctx, input }) => getRandomCardByRarityHandler({ ctx, input })),
  giveCoins: publicProcedure.input(giveCoinsInput).mutation(async ({ ctx, input }) => giveCoinsHandler({ ctx, input })),
  setCoins: publicProcedure.input(setCoinsInput).mutation(async ({ ctx, input }) => setCoinsHandler({ ctx, input })),
  createCard: publicProcedure
    .input(createCardInput)
    .mutation(async ({ ctx, input }) => createCardHandler({ ctx, input })),
  getUserCollection: publicProcedure
    .input(getUserCollectionInput)
    .query(async ({ ctx, input }) => getUserCollectionHandler({ ctx, input })),
});
