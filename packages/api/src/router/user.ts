import {
  createUserHandler,
  decreaseUserCoinsHandler,
  getUserByDiscordIdHandler,
  getUserByEmailHandler,
  getUserByIdHandler,
  getUserByUsernameHandler,
  getUserCoinsHandler,
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
  increaseUserCoinsInput,
  registerUserInput,
  updateUserCoinsInput,
} from '../schema/user.schema';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const userRouter = createTRPCRouter({
  getById: publicProcedure.input(getUserByIdInput).query(({ ctx, input }) => getUserByIdHandler({ ctx, input })),

  getByDiscordId: publicProcedure
    .input(getUserByDiscordIdInput)
    .query(({ ctx, input }) => getUserByDiscordIdHandler({ ctx, input })),

  getByEmail: publicProcedure
    .input(getUserByEmailInput)
    .query(({ ctx, input }) => getUserByEmailHandler({ ctx, input })),

  getUserByUsername: publicProcedure
    .input(getUserByUsernameInput)
    .query(({ ctx, input }) => getUserByUsernameHandler({ ctx, input })),

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
});
