import {
  buyPackHandler,
  createPackHandler,
  createPackWithCardsHandler,
  deletePackHandler,
  getAllPacksByUserIdHandler,
  getAmountOfPacksByUserIdHandler,
  getPackByIdHandler,
  getUserPackByIdHandler,
  openPackHandler,
} from '../controllers/pack.controller';
import {
  buyPackInput,
  createPackInput,
  createPackWithCardsInput,
  deletePackInput,
  getAllPacksByUserIdInput,
  getAmountOfPacksByUserIdInput,
  getPackByIdInput,
  getUserPackByIdInput,
  openPackInput,
} from '../schema/pack.schema';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const packRouter = createTRPCRouter({
  getAllPacksByUserId: publicProcedure
    .input(getAllPacksByUserIdInput)
    .query(async ({ ctx, input }) => getAllPacksByUserIdHandler({ ctx, input })),
  getAmountOfPacksByUserId: publicProcedure
    .input(getAmountOfPacksByUserIdInput)
    .query(async ({ ctx, input }) => getAmountOfPacksByUserIdHandler({ ctx, input })),
  getCardsBySeason: publicProcedure
    .input(getPackByIdInput)
    .query(async ({ ctx, input }) => getPackByIdHandler({ ctx, input })),
  getUserPackById: publicProcedure
    .input(getUserPackByIdInput)
    .query(async ({ ctx, input }) => getUserPackByIdHandler({ ctx, input })),
  createPack: publicProcedure
    .input(createPackInput)
    .mutation(async ({ ctx, input }) => createPackHandler({ ctx, input })),
  createPackWithCards: publicProcedure
    .input(createPackWithCardsInput)
    .mutation(async ({ ctx, input }) => createPackWithCardsHandler({ ctx, input })),
  buyPack: publicProcedure.input(buyPackInput).mutation(async ({ ctx, input }) => buyPackHandler({ ctx, input })),
  openPack: publicProcedure.input(openPackInput).mutation(async ({ ctx, input }) => openPackHandler({ ctx, input })),
  deletePack: publicProcedure
    .input(deletePackInput)
    .mutation(async ({ ctx, input }) => deletePackHandler({ ctx, input })),
});
