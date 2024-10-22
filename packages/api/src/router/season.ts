import {
  getAllSeasonsHandler,
  getCurrentSeasonHandler,
  getSeasonByIdHandler,
  getSeasonsByDateHandler,
} from '../controllers/season.controller';
import {
  getAllSeasonsInput,
  getCurrentSeasonInput,
  getSeasonByIdInput,
  getSeasonsByDateInput,
} from '../schema/season.schema';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const cardRouter = createTRPCRouter({
  getAllSeasons: publicProcedure
    .input(getAllSeasonsInput)
    .query(async ({ ctx, input }) => getAllSeasonsHandler({ ctx, input })),
  getSeasonById: publicProcedure
    .input(getSeasonByIdInput)
    .query(async ({ ctx, input }) => getSeasonByIdHandler({ ctx, input })),
  getCurrentSeason: publicProcedure
    .input(getCurrentSeasonInput)
    .query(async ({ ctx, input }) => getCurrentSeasonHandler({ ctx, input })),
  getSeasonsByDate: publicProcedure
    .input(getSeasonsByDateInput)
    .query(async ({ ctx, input }) => getSeasonsByDateHandler({ ctx, input })),
});
