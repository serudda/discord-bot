import type { AccountResponse, AccountsResponse} from '../common';
import { Response, TRPCErrorCode, type Params } from '../common';
import { type CreateAccountInputType, type GetAllProvidersByUserIdInputType } from '../schema/account.schema';
import { ErrorCodes, ErrorMessages, errorResponse } from '../services';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

// Id domain to handle errors
const domain = 'ACCOUNT';

/**
 * Get all providers by user id.
 *
 * @param ctx Ctx.
 * @param input GetAllProvidersByUserIdInputType.
 * @returns Account[]
 */
export const getAllProvidersByUserIdHandler = async ({
  ctx,
  input,
}: Params<GetAllProvidersByUserIdInputType>): Promise<AccountsResponse> => {
  const handlerId = 'getAllProvidersByUserIdHandler';

  try {
    const { userId } = input;
    const accounts = await ctx.prisma.account.findMany({
      where: {
        userId,
      },
    });

    // Check if account exists
    if (!accounts || accounts.length === 0)
      return errorResponse(
        domain,
        handlerId,
        ErrorCodes.Account.DiscordUserNotFound,
        ErrorMessages.Account.DiscordUserNotFound,
      );

    return {
      result: {
        status: Response.SUCCESS,
        accounts,
      },
    };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      throw new TRPCError({
        code: TRPCErrorCode.BAD_REQUEST,
        message: ErrorMessages.Common.InvalidInput,
      });
    }

    if (error instanceof TRPCError) {
      if (error.code === TRPCErrorCode.UNAUTHORIZED) {
        throw new TRPCError({
          code: TRPCErrorCode.UNAUTHORIZED,
          message: ErrorMessages.User.UnAuthorized,
        });
      }

      throw new TRPCError({
        code: TRPCErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }

    throw new TRPCError({
      code: TRPCErrorCode.INTERNAL_SERVER_ERROR,
      message: ErrorMessages.Common.Unknown,
    });
  }
};

/**
 * Create account.
 *
 * @param ctx Ctx.
 * @param input CreateAccountInputType.
 * @returns Account.
 */
export const createAccountHandler = async ({
  ctx,
  input,
}: Params<CreateAccountInputType>): Promise<AccountResponse> => {
  const handlerId = 'createAccountHandler';
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
    if (!account)
      return errorResponse(domain, handlerId, ErrorCodes.Account.NotCreated, ErrorMessages.Account.NotCreated);

    return {
      result: {
        status: Response.SUCCESS,
        account,
      },
    };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      throw new TRPCError({
        code: TRPCErrorCode.BAD_REQUEST,
        message: ErrorMessages.Common.InvalidInput,
      });
    }

    if (error instanceof TRPCError) {
      if (error.code === TRPCErrorCode.UNAUTHORIZED) {
        throw new TRPCError({
          code: TRPCErrorCode.UNAUTHORIZED,
          message: ErrorMessages.User.UnAuthorized,
        });
      }

      throw new TRPCError({
        code: TRPCErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }

    throw new TRPCError({
      code: TRPCErrorCode.INTERNAL_SERVER_ERROR,
      message: ErrorMessages.Common.Unknown,
    });
  }
};
