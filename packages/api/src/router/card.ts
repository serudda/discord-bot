import {
  addCardToCollectionHandler,
  createCardHandler,
  getAllCardsByRarityHandler,
  getAllCardsHandler,
  getCardsByPackIdHandler,
  getCardsBySeasonAndUserIdHandler,
  getCardsBySeasonHandler,
  getRandomCardByRarityHandler,
  getRandomCardsHandler,
  getUserCollectionHandler,
  giveCardHandler,
  giveCoinsHandler,
  removeCardFromCollectionHandler,
  setCoinsHandler,
  wonderPickHandler,
} from '../controllers/card.controller';
import {
  addCardToCollectionInput,
  createCardInput,
  getAllCardsByRarityInput,
  getAllCardsInput,
  getCardsByPackIdInput,
  getCardsBySeasonAndUserIdInput,
  getCardsBySeasonInput,
  getRandomCardByRarityInput,
  getRandomCardsInput,
  getUserCollectionInput,
  giveCardInput,
  giveCoinsInput,
  removeCardFromCollectionInput,
  setCoinsInput,
  wonderPickInput,
} from '../schema/card.schema';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const cardRouter = createTRPCRouter({
  addCardToCollection: publicProcedure
    .input(addCardToCollectionInput)
    .mutation(async ({ ctx, input }) => addCardToCollectionHandler({ ctx, input })),
  getAllCards: publicProcedure
    .input(getAllCardsInput)
    .query(async ({ ctx, input }) => getAllCardsHandler({ ctx, input })),
  getCardsBySeason: publicProcedure
    .input(getCardsBySeasonInput)
    .query(async ({ ctx, input }) => getCardsBySeasonHandler({ ctx, input })),
  getCardsByPackId: publicProcedure
    .input(getCardsByPackIdInput)
    .query(async ({ ctx, input }) => getCardsByPackIdHandler({ ctx, input })),
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
  giveCard: publicProcedure.input(giveCardInput).mutation(async ({ ctx, input }) => giveCardHandler({ ctx, input })),
  getUserCollection: publicProcedure
    .input(getUserCollectionInput)
    .query(async ({ ctx, input }) => getUserCollectionHandler({ ctx, input })),
  getCardsBySeasonAndUserId: publicProcedure
    .input(getCardsBySeasonAndUserIdInput)
    .query(async ({ ctx, input }) => getCardsBySeasonAndUserIdHandler({ ctx, input })),
  wonderPick: publicProcedure
    .input(wonderPickInput)
    .mutation(async ({ ctx, input }) => wonderPickHandler({ ctx, input })),
  removeCardFromCollection: publicProcedure
    .input(removeCardFromCollectionInput)
    .mutation(async ({ ctx, input }) => removeCardFromCollectionHandler({ ctx, input })),
});
