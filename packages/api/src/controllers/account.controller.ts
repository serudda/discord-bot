import { AccountError } from '@discord-bot/error-handler';
import { Response, TRPCErrorCode, type Params } from '../common';
import { type CreateAccountInputType, type GetAllProvidersByUserIdInputType } from '../schema/account.schema';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

/**
 * Get all providers by user id.
 *
 * @param ctx Ctx.
 * @param input GetAllProvidersByUserIdInputType.
 * @returns Account[]
 */
export const getAllProvidersByUserIdHandler = async ({ ctx, input }: Params<GetAllProvidersByUserIdInputType>) => {
  return ctx.prisma.account.findMany({
    where: {
      userId: input.userId,
    },
  });
};

/**
 * Create account.
 *
 * @param ctx Ctx.
 * @param input CreateAccountInputType.
 * @returns Account.
 */
export const createAccountHandler = async ({ ctx, input }: Params<CreateAccountInputType>) => {
  try {
    const account = await ctx.prisma.account.create({
      data: {
        provider: input.provider,
        providerAccountId: input.providerAccountId,
        type: input.type,
        user: {
          connect: { id: input.userId },
        },
      },
    });

    // Check if account was created
    if (!account) {
      return {
        result: {
          status: Response.ERROR,
          message: AccountError.AccountNotCreated,
        },
      };
    }

    return {
      result: {
        status: Response.SUCCESS,
        account,
      },
    };
  } catch (error: unknown) {
    // Zod error (Invalid input)
    if (error instanceof z.ZodError) {
      const message = 'createAccount: invalid input';
      throw new TRPCError({
        code: TRPCErrorCode.BAD_REQUEST,
        message,
      });
    }

    // TRPC error (Custom error)
    if (error instanceof TRPCError) {
      if (error.code === TRPCErrorCode.UNAUTHORIZED) {
        const message = 'createAccount: unauthorized';
        throw new TRPCError({
          code: TRPCErrorCode.UNAUTHORIZED,
          message,
        });
      }

      throw new TRPCError({
        code: TRPCErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  }
};
