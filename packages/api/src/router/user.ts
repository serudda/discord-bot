import {
  createUserHandler,
  getUserByEmailHandler,
  getUserByIdHandler,
  getUserCoinsHandler,
} from '../controllers/user.controller';
import { createUserInput, getUserByEmailInput, getUserByIdInput, getUserCoinsInput } from '../schema/user.schema';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const userRouter = createTRPCRouter({
  getById: publicProcedure.input(getUserByIdInput).query(({ ctx, input }) => getUserByIdHandler({ ctx, input })),

  getByEmail: publicProcedure
    .input(getUserByEmailInput)
    .query(({ ctx, input }) => getUserByEmailHandler({ ctx, input })),

  create: publicProcedure.input(createUserInput).mutation(async ({ ctx, input }) => createUserHandler({ ctx, input })),

  getCoins: publicProcedure
    .input(getUserCoinsInput)
    .query(async ({ ctx, input }) => getUserCoinsHandler({ ctx, input })),
});
