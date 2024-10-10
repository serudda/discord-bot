import { PrismaErrorCode, Response, TRPCErrorCode, type Params } from '../common';
import type {
  CreateUserInputType,
  GetUserByDiscordIdInputType,
  GetUserByEmailInputType,
  GetUserByIdInputType,
  GetUserCoinsInputType,
} from '../schema/user.schema';
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
    const user = await ctx.prisma.user.create({
      data: {
        name: input.name,
        image: input.image,
        email: input.email,
      },
    });

    return {
      status: Response.SUCCESS,
      result: {
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
