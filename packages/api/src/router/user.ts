import {
  createUserHandler,
  decreaseUserCoinsHandler,
  getUserByDiscordIdHandler,
  getUserByEmailHandler,
  getUserByIdHandler,
  getUserByUsernameHandler,
  getUserCoinsHandler,
  getUserSeasonProgressHandler,
  increaseUserCoinsHandler,
  registerUserHandler,
  updateUserCoinsHandler,
} from '../controllers/user.controller';
import {
  createUserInput,
  decreaseUserCoinsInput,
  getUserByDiscordIdInput,
  getUserByEmailInput,
  getUserByIdInput,
  getUserByUsernameInput,
  getUserCoinsInput,
  getUserSeasonProgressInput,
  increaseUserCoinsInput,
  registerUserInput,
  updateUserCoinsInput,
} from '../schema/user.schema';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const userRouter = createTRPCRouter({
  getById: publicProcedure.input(getUserByIdInput).query(({ ctx, input }) => getUserByIdHandler({ ctx, input })),

  getByDiscordId: publicProcedure
    .input(getUserByDiscordIdInput)
    .query(async ({ ctx, input }) => getUserByDiscordIdHandler({ ctx, input })),

  getByEmail: publicProcedure
    .input(getUserByEmailInput)
    .query(async ({ ctx, input }) => getUserByEmailHandler({ ctx, input })),

  getByUsername: publicProcedure
    .input(getUserByUsernameInput)
    .query(async ({ ctx, input }) => getUserByUsernameHandler({ ctx, input })),

  create: publicProcedure.input(createUserInput).mutation(async ({ ctx, input }) => createUserHandler({ ctx, input })),

  register: publicProcedure
    .input(registerUserInput)
    .mutation(async ({ ctx, input }) => registerUserHandler({ ctx, input })),

  getCoins: publicProcedure
    .input(getUserCoinsInput)
    .query(async ({ ctx, input }) => getUserCoinsHandler({ ctx, input })),

  increaseCoins: publicProcedure
    .input(increaseUserCoinsInput)
    .mutation(async ({ ctx, input }) => increaseUserCoinsHandler({ ctx, input })),

  decreaseCoins: publicProcedure
    .input(decreaseUserCoinsInput)
    .mutation(async ({ ctx, input }) => decreaseUserCoinsHandler({ ctx, input })),

  updateCoins: publicProcedure
    .input(updateUserCoinsInput)
    .mutation(async ({ ctx, input }) => updateUserCoinsHandler({ ctx, input })),

  getUserSeasonProgress: publicProcedure
    .input(getUserSeasonProgressInput)
    .query(async ({ ctx, input }) => getUserSeasonProgressHandler({ ctx, input })),
});
