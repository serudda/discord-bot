import { AccountError, CommonError, UserError } from '@discord-bot/error-handler';
import { PrismaErrorCode, Response, TRPCErrorCode, type Params } from '../common';
import {
  type CreateUserInputType,
  type GetUserByDiscordIdInputType,
  type GetUserByEmailInputType,
  type GetUserByIdInputType,
  type GetUserCoinsInputType,
  type RegisterUserInputType,
} from '../schema/user.schema';
import { createAccountHandler } from './account.controller';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

/**
 * Get user by id.
 *
 * @param ctx Ctx.
 * @param input GetUserByIdInputType.
 * @returns User.
 */
export const getUserByIdHandler = async ({ ctx, input }: Params<GetUserByIdInputType>) =>
  ctx.prisma.user.findUnique({ where: { id: input.id }, include: { subscription: true } });

/**
 * Get user by Discord Id.
 *
 * @param ctx Ctx.
 * @param input GetUserByDiscordIdInputType.
 * @returns User.
 */
export const getUserByDiscordIdHandler = async ({ ctx, input }: Params<GetUserByDiscordIdInputType>) => {
  return ctx.prisma.user.findFirst({
    where: {
      accounts: {
        some: {
          providerAccountId: input.discordId,
          provider: 'discord',
        },
      },
    },
    include: {
      accounts: true,
    },
  });
};

/**
 * Get user by email.
 *
 * @param ctx Ctx.
 * @param input GetUserByEmailInputType.
 * @returns User.
 */
export const getUserByEmailHandler = async ({ ctx, input }: Params<GetUserByEmailInputType>) => {
  return ctx.prisma.user.findUnique({
    where: {
      email: input.email,
    },
    include: {
      accounts: true,
    },
  });
};

/**
 * Create user.
 *
 * @param ctx Ctx.
 * @param input CreateUserInputType.
 * @returns User.
 */
export const createUserHandler = async ({ ctx, input }: Params<CreateUserInputType>) => {
  try {
    const { name, username, email, image, coins } = input;

    const user = await ctx.prisma.user.create({
      data: {
        name,
        username,
        image,
        email,
        coins,
      },
    });

    // Check if user was created
    if (!user) {
      return {
        result: {
          status: Response.ERROR,
          message: UserError.UserNotCreated,
        },
      };
    }

    return {
      result: {
        status: Response.SUCCESS,
        user,
      },
    };
  } catch (error: unknown) {
    // Prisma error (Database issue)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === PrismaErrorCode.UniqueConstraintViolation) {
        const message = 'createUser: user already exists';
        throw new TRPCError({
          code: TRPCErrorCode.CONFLICT,
          message,
        });
      }
    }

    // Zod error (Invalid input)
    if (error instanceof z.ZodError) {
      const message = 'createUser: invalid input';
      throw new TRPCError({
        code: TRPCErrorCode.BAD_REQUEST,
        message,
      });
    }

    // TRPC error (Custom error)
    if (error instanceof TRPCError) {
      if (error.code === TRPCErrorCode.UNAUTHORIZED) {
        const message = 'createUser: unauthorized';
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

/**
 * Register user.
 *
 * @param ctx Ctx.
 * @param input RegisterUserInputType.
 * @returns User.
 */
export const registerUserHandler = async ({ ctx, input }: Params<RegisterUserInputType>) => {
  try {
    const { discordId, email, name, username, image } = input;
    const DEFAULT_COINS = 500;

    // Check if user already exists
    const user = await getUserByDiscordIdHandler({ ctx, input: { discordId } });

    if (user) {
      return {
        result: {
          status: Response.ERROR,
          message: UserError.UserAlreadyExists,
        },
      };
    }

    // Create user
    const newUser = await createUserHandler({
      ctx,
      input: {
        name,
        username,
        email,
        image,
        coins: DEFAULT_COINS,
      },
    });

    // Check if user was created
    if (!newUser || newUser.result.status === Response.ERROR) {
      return {
        result: {
          status: Response.ERROR,
          message: UserError.UserNotCreated,
        },
      };
    }

    // TODO: Create a TypeGuard
    if (!newUser?.result?.user?.id) {
      return {
        result: {
          status: Response.ERROR,
          message: UserError.UserNotFound,
        },
      };
    }

    // Create account
    const newAccount = await createAccountHandler({
      ctx,
      input: {
        type: 'discord',
        provider: 'discord',
        providerAccountId: discordId,
        userId: newUser.result.user.id,
      },
    });

    // Check if account was created
    if (!newAccount || newAccount.result.status === Response.ERROR) {
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
        name: newUser?.result?.user?.name,
        coins: newUser?.result?.user?.coins,
      },
    };
  } catch (error: unknown) {
    // Zod error (Invalid input)
    if (error instanceof z.ZodError) {
      throw new TRPCError({
        code: TRPCErrorCode.BAD_REQUEST,
        message: CommonError.InvalidInput,
      });
    }

    // TRPC error (Custom error)
    if (error instanceof TRPCError) {
      if (error.code === TRPCErrorCode.UNAUTHORIZED) {
        throw new TRPCError({
          code: TRPCErrorCode.UNAUTHORIZED,
          message: UserError.UnAuthorized,
        });
      }

      throw new TRPCError({
        code: TRPCErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  }
};

/**
 * Get user coins.
 *
 * @param ctx Ctx.
 * @param input GetUserCoinsInputType.
 * @returns Coins.
 */
export const getUserCoinsHandler = async ({ ctx, input }: Params<GetUserCoinsInputType>) => {
  return ctx.prisma.user.findFirst({
    where: {
      accounts: {
        some: {
          providerAccountId: input.discordId,
          provider: 'discord',
        },
      },
    },
    select: {
      coins: true,
    },
  });
};
