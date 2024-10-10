import {
  createUserHandler,
  getUserByEmailHandler,
  getUserByIdHandler,
  getUserCoinsHandler,
  registerUserHandler,
} from '../controllers/user.controller';
import {
  createUserInput,
  getUserByEmailInput,
  getUserByIdInput,
  getUserCoinsInput,
  registerUserInput,
} from '../schema/user.schema';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const userRouter = createTRPCRouter({
  getById: publicProcedure.input(getUserByIdInput).query(({ ctx, input }) => getUserByIdHandler({ ctx, input })),

  getByEmail: publicProcedure
    .input(getUserByEmailInput)
    .query(({ ctx, input }) => getUserByEmailHandler({ ctx, input })),

  create: publicProcedure.input(createUserInput).mutation(async ({ ctx, input }) => createUserHandler({ ctx, input })),

  register: publicProcedure
    .input(registerUserInput)
    .mutation(async ({ ctx, input }) => registerUserHandler({ ctx, input })),

  getCoins: publicProcedure
    .input(getUserCoinsInput)
    .query(async ({ ctx, input }) => getUserCoinsHandler({ ctx, input })),
});
