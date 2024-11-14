import {
  PrismaErrorCode,
  Response,
  TRPCErrorCode,
  type Ctx,
  type Params,
  type UserCardResponse,
  type UserCoinsResponse,
  type UserGemsResponse,
  type UserInventoryResponse,
  type UserPacksResponse,
  type UserRegisterResponse,
  type UserResponse,
  type UserSeasonProgressResponse,
} from '../common';
import type {
  CreateUserInputType,
  DecreaseUserCoinsInputType,
  DecreaseUserGemsInputType,
  GetUserByDiscordIdInputType,
  GetUserByEmailInputType,
  GetUserByIdInputType,
  GetUserByUsernameInputType,
  GetUserCardByNumberInputType,
  GetUserCoinsInputType,
  GetUserGemsInputType,
  GetUserInventoryInputType,
  GetUserPacksInputType,
  GetUserSeasonProgressInputType,
  IncreaseUserCoinsInputType,
  IncreaseUserGemsInputType,
  RegisterUserInputType,
  UpdateUserCoinsInputType,
  UpdateUserGemsInputType,
} from '../schema/user.schema';
import { ErrorCodes, ErrorMessages, errorResponse } from '../services';
import { createAccountHandler } from './account.controller';
import { getCardsBySeasonAndUserIdHandler, getCardsBySeasonHandler } from './card.controller';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

// Id domain to handle errors
const domain = 'USER';

/**
 * Get user by id.
 *
 * @param ctx Ctx.
 * @param input GetUserByIdInputType.
 * @returns User.
 */
export const getUserByIdHandler = async ({ ctx, input }: Params<GetUserByIdInputType>): Promise<UserResponse> => {
  try {
    const handlerId = 'getUserByIdHandler';
    const user = await ctx.prisma.user.findUnique({
      where: { id: input.id },
      include: {
        accounts: true,
      },
    });

    // Check if user exists
    if (!user) return errorResponse(domain, handlerId, ErrorCodes.User.NoUser, ErrorMessages.User.NoUser);

    return {
      result: {
        status: Response.SUCCESS,
        user,
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
 * Get user by Discord Id.
 *
 * @param ctx Ctx.
 * @param input GetUserByDiscordIdInputType.
 * @returns User.
 */
export const getUserByDiscordIdHandler = async ({
  ctx,
  input,
}: Params<GetUserByDiscordIdInputType>): Promise<UserResponse> => {
  const handlerId = 'getUserByDiscordIdHandler';

  try {
    const user = await ctx.prisma.user.findFirst({
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
        packs: true,
      },
    });

    // Check if user exists
    if (!user) return errorResponse(domain, handlerId, ErrorCodes.User.NoUser, ErrorMessages.User.NoUser);

    return {
      result: {
        status: Response.SUCCESS,
        user,
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
 * Get user by email.
 *
 * @param ctx Ctx.
 * @param input GetUserByEmailInputType.
 * @returns User.
 */
export const getUserByEmailHandler = async ({ ctx, input }: Params<GetUserByEmailInputType>): Promise<UserResponse> => {
  const handlerId = 'getUserByEmailHandler';

  try {
    const user = await ctx.prisma.user.findUnique({
      where: {
        email: input.email,
      },
      include: {
        accounts: true,
      },
    });

    // Check if user exists
    if (!user) return errorResponse(domain, handlerId, ErrorCodes.User.NoUser, ErrorMessages.User.NoUser);

    return {
      result: {
        status: Response.SUCCESS,
        user,
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
 * Get user by username.
 *
 * @param ctx Ctx.
 * @param input GetUserByUsernameInputType.
 * @returns User.
 */
export const getUserByUsernameHandler = async ({
  ctx,
  input,
}: Params<GetUserByUsernameInputType>): Promise<UserResponse> => {
  const handlerId = 'getUserByUsernameHandler';
  try {
    const { username } = input;

    const user = await ctx.prisma.user.findFirst({
      where: {
        username,
      },
      include: {
        accounts: true,
      },
    });

    // Check if user exists
    if (!user) return errorResponse(domain, handlerId, ErrorCodes.User.NoUser, ErrorMessages.User.NoUser);

    return {
      result: {
        status: Response.SUCCESS,
        user,
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
 * Create user.
 *
 * @param ctx Ctx.
 * @param input CreateUserInputType.
 * @returns User.
 */
export const createUserHandler = async ({ ctx, input }: Params<CreateUserInputType>): Promise<UserResponse> => {
  try {
    const handlerId = 'createUserHandler';
    const { name, username, email, image, coins, gems } = input;

    const user = await ctx.prisma.user.create({
      data: {
        name,
        username,
        image,
        email,
        coins,
        gems,
      },
    });

    // Check if user was created
    if (!user) return errorResponse(domain, handlerId, ErrorCodes.User.NoUserCreated, ErrorMessages.User.NoUserCreated);

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
 * Register user.
 *
 * @param ctx Ctx.
 * @param input RegisterUserInputType.
 * @returns User.
 */
export const registerUserHandler = async ({
  ctx,
  input,
}: Params<RegisterUserInputType>): Promise<UserRegisterResponse> => {
  try {
    const handlerId = 'registerUserHandler';
    const { discordId, email, name, username, image } = input;
    const INIT_COINS = await ctx.configService.getGlobalConfig<number>('INIT_COINS', 500);
    const INIT_GEMS = await ctx.configService.getGlobalConfig<number>('INIT_GEMS', 5);

    return await ctx.prisma.$transaction(async (prismaTransaction) => {
      // Check if user already exists
      const userResponse = await getUserByDiscordIdHandler({
        ctx: { ...ctx, prisma: prismaTransaction } as Ctx,
        input: { discordId },
      });
      if (userResponse?.result && userResponse.result.status === Response.SUCCESS)
        return errorResponse(domain, handlerId, ErrorCodes.User.AlreadyExists, ErrorMessages.User.AlreadyExists);

      // Create user
      const newUserResponse = await createUserHandler({
        ctx: { ...ctx, prisma: prismaTransaction } as Ctx,
        input: {
          name,
          username,
          email,
          image,
          coins: INIT_COINS,
          gems: INIT_GEMS,
        },
      });

      // Check if user was created
      if (newUserResponse?.result.status === Response.ERROR) return newUserResponse as UserRegisterResponse;

      // Create account
      const newUser = newUserResponse?.result.user;
      const newAccountResponse = await createAccountHandler({
        ctx: { ...ctx, prisma: prismaTransaction } as Ctx,
        input: {
          type: 'discord',
          provider: 'discord',
          providerAccountId: discordId,
          userId: newUser.id,
        },
      });

      // Check if account was created
      if (newAccountResponse?.result.status === Response.ERROR) return newAccountResponse as UserRegisterResponse;

      return {
        result: {
          status: Response.SUCCESS,
          name: newUser.name,
          coins: newUser.coins,
          gems: newUser.gems,
        },
      } as UserRegisterResponse;
    });
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
 * Get user packs.
 *
 * @param ctx Ctx.
 * @param input GetUserPacksInputType.
 * @returns Pack[].
 */
export const getUserPacksHandler = async ({
  ctx,
  input,
}: Params<GetUserPacksInputType>): Promise<UserPacksResponse> => {
  try {
    const handlerId = 'getUserPacksHandler';
    const { discordId } = input;

    // Get user
    const userResponse = await getUserByDiscordIdHandler({
      ctx,
      input: { discordId },
    });

    // Check if user exists
    if (userResponse.result.status === Response.ERROR)
      return errorResponse(domain, handlerId, ErrorCodes.User.NoUser, ErrorMessages.User.NoUser);

    // Get user packs
    const user = userResponse.result.user;
    const userPacks = await ctx.prisma.pack.findMany({
      where: {
        userId: user?.id,
      },
    });

    // Check if user packs exists
    if (!userPacks || userPacks.length === 0)
      return errorResponse(domain, handlerId, ErrorCodes.User.NoUserPacks, ErrorMessages.User.NoUserPacks);

    return {
      result: {
        status: Response.SUCCESS,
        userPacks,
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
 * Get user inventory.
 *
 * @param ctx Ctx.
 * @param input GetUserInventoryInputType.
 * @returns Inventory.
 */
export const getUserInventoryHandler = async ({
  ctx,
  input,
}: Params<GetUserInventoryInputType>): Promise<UserInventoryResponse> => {
  try {
    const handlerId = 'getUserInventoryHandler';
    const { discordId } = input;

    // Get user
    // En getUserByDiscordIdHandler, modifica el include
    const user = await ctx.prisma.user.findFirst({
      where: {
        accounts: {
          some: {
            providerAccountId: discordId,
            provider: 'discord',
          },
        },
      },
      include: {
        _count: {
          select: {
            packs: true,
          },
        },
      },
    });

    // Check if user exists
    if (!user) return errorResponse(domain, handlerId, ErrorCodes.User.NoUser, ErrorMessages.User.NoUser);

    return {
      result: {
        status: Response.SUCCESS,
        packs: user._count.packs,
        coins: user.coins,
        gems: user.gems,
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
 * Get user card by number.
 *
 * @param ctx Ctx.
 * @param input GetUserCardByNumberInputType.
 * @returns Card by number.
 */
export const getUserCardByNumberHandler = async ({
  ctx,
  input,
}: Params<GetUserCardByNumberInputType>): Promise<UserCardResponse> => {
  try {
    const handlerId = 'getUserCardByNumberHandler';
    const { userId, cardNumber, isFoil } = input;

    // Get user
    const userResponse = await getUserByDiscordIdHandler({ ctx, input: { discordId: userId } });

    // Check if user exists
    if (userResponse.result.status === Response.ERROR)
      return errorResponse(domain, handlerId, ErrorCodes.User.NoUser, ErrorMessages.User.NoUser);

    // Get user card by number
    const user = userResponse.result.user;
    const userCard = await ctx.prisma.userCard.findFirst({
      where: {
        userId: user?.id,
        card: {
          cardNumber,
        },
        isFoil,
      },
    });

    // Check if user card exists
    if (!userCard) return errorResponse(domain, handlerId, ErrorCodes.User.NoUserCard, ErrorMessages.User.NoUserCard);

    return {
      result: {
        status: Response.SUCCESS,
        userCard,
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
 * Get user coins.
 *
 * @param ctx Ctx.
 * @param input GetUserCoinsInputType.
 * @returns Coins.
 */
export const getUserCoinsHandler = async ({
  ctx,
  input,
}: Params<GetUserCoinsInputType>): Promise<UserCoinsResponse> => {
  try {
    const handlerId = 'getUserCoinsHandler';
    const { discordId } = input;

    // Get user
    const userResponse = await getUserByDiscordIdHandler({ ctx, input: { discordId } });

    // Check if user exists
    if (userResponse.result.status === Response.ERROR) return userResponse as UserCoinsResponse;

    // Check if user has coins
    const user = userResponse.result.user;
    if (!user.coins) return errorResponse(domain, handlerId, ErrorCodes.User.NoCoins, ErrorMessages.User.NoCoins);

    return {
      result: {
        status: Response.SUCCESS,
        coins: user.coins,
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
 * Update user coins.
 *
 * @param ctx Ctx.
 * @param input UpdateUserCoinsInputType.
 * @returns User.
 */
export const updateUserCoinsHandler = async ({
  ctx,
  input,
}: Params<UpdateUserCoinsInputType>): Promise<UserResponse> => {
  try {
    const handlerId = 'updateUserCoinsHandler';
    const { discordId, coins } = input;

    // Get user
    const userResponse = await getUserByDiscordIdHandler({ ctx, input: { discordId } });

    // Check if user exists
    if (userResponse.result.status === Response.ERROR)
      return errorResponse(domain, handlerId, ErrorCodes.User.NoUser, ErrorMessages.User.NoUser);

    // Update user coins
    const user = userResponse.result.user;
    const updatedUser = await ctx.prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        coins,
      },
    });

    return {
      result: {
        status: Response.SUCCESS,
        user: updatedUser,
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
 * Increase user coins.
 *
 * @param ctx Ctx.
 * @param input IncreaseUserCoinsInputType.
 * @returns User.
 */
export const increaseUserCoinsHandler = async ({
  ctx,
  input,
}: Params<IncreaseUserCoinsInputType>): Promise<UserResponse> => {
  try {
    const handlerId = 'increaseUserCoinsHandler';
    const { discordId, coins } = input;

    // Get user
    const userResponse = await getUserByDiscordIdHandler({ ctx, input: { discordId } });

    // Check if user exists
    if (userResponse.result.status === Response.ERROR)
      return errorResponse(domain, handlerId, ErrorCodes.User.NoUser, ErrorMessages.User.NoUser);

    // Increase user coins
    const user = userResponse.result.user;
    const updatedUser = await ctx.prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        coins: {
          increment: coins,
        },
      },
    });

    // Check if user coins were increased
    if (!updatedUser)
      return errorResponse(domain, handlerId, ErrorCodes.User.NoIncreaseCoins, ErrorMessages.User.NoIncreaseCoins);

    return {
      result: {
        status: Response.SUCCESS,
        user: updatedUser,
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
 * Decrease user coins.
 *
 * @param ctx Ctx.
 * @param input DecreaseUserCoinsInputType.
 * @returns User.
 */
export const decreaseUserCoinsHandler = async ({
  ctx,
  input,
}: Params<DecreaseUserCoinsInputType>): Promise<UserResponse> => {
  try {
    const handlerId = 'decreaseUserCoinsHandler';
    const { discordId, coins } = input;

    // Get user
    const userResponse = await getUserByDiscordIdHandler({ ctx, input: { discordId } });

    // Check if user exists
    if (userResponse.result.status === Response.ERROR)
      return errorResponse(domain, handlerId, ErrorCodes.User.NoUser, ErrorMessages.User.NoUser);

    // Check if user has enough coins
    const user = userResponse.result.user;
    if (user.coins && user.coins < coins)
      return errorResponse(domain, handlerId, ErrorCodes.User.NoDecreaseCoins, ErrorMessages.User.NoDecreaseCoins);

    // Decrease user coins
    const updatedUser = await ctx.prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        coins: {
          decrement: coins,
        },
      },
    });

    // Check if user coins were decreased
    if (!updatedUser)
      return errorResponse(domain, handlerId, ErrorCodes.User.NoDecreaseCoins, ErrorMessages.User.NoDecreaseCoins);

    return {
      result: {
        status: Response.SUCCESS,
        user: updatedUser,
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
 * Get user gems.
 *
 * @param ctx Ctx.
 * @param input GetUserGemsInputType.
 * @returns Gems.
 */
export const getUserGemsHandler = async ({ ctx, input }: Params<GetUserGemsInputType>): Promise<UserGemsResponse> => {
  try {
    const handlerId = 'getUserGemsHandler';
    const { discordId } = input;

    // Get user
    const userResponse = await getUserByDiscordIdHandler({ ctx, input: { discordId } });

    // Check if user exists
    if (userResponse.result.status === Response.ERROR)
      return errorResponse(domain, handlerId, ErrorCodes.User.NoUser, ErrorMessages.User.NoUser);

    return {
      result: {
        status: Response.SUCCESS,
        userId: userResponse.result.user?.id,
        gems: userResponse.result.user?.gems,
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
 * Update user gems.
 *
 * @param ctx Ctx.
 * @param input UpdateUserGemsInputType.
 * @returns User.
 */
export const updateUserGemsHandler = async ({ ctx, input }: Params<UpdateUserGemsInputType>): Promise<UserResponse> => {
  try {
    const handlerId = 'updateUserGemsHandler';
    const { discordId, gems } = input;

    // Get user
    const userResponse = await getUserByDiscordIdHandler({ ctx, input: { discordId } });

    // Check if user exists
    if (userResponse.result.status === Response.ERROR)
      return errorResponse(domain, handlerId, ErrorCodes.User.NoUser, ErrorMessages.User.NoUser);

    // Update user gems
    const user = userResponse.result.user;
    const updatedUser = await ctx.prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        gems,
      },
    });

    // Check if user gems were updated
    if (!updatedUser)
      return errorResponse(domain, handlerId, ErrorCodes.User.NoUpdateUserGems, ErrorMessages.User.NoUpdateUserGems);

    return {
      result: {
        status: Response.SUCCESS,
        user: updatedUser,
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
 * Increase user gems.
 *
 * @param ctx Ctx.
 * @param input IncreaseUserGemsInputType.
 * @returns User.
 */
export const increaseUserGemsHandler = async ({
  ctx,
  input,
}: Params<IncreaseUserGemsInputType>): Promise<UserResponse> => {
  try {
    const handlerId = 'increaseUserGemsHandler';
    const { discordId, gems } = input;

    // Get user
    const userResponse = await getUserByDiscordIdHandler({ ctx, input: { discordId } });

    // Check if user exists
    if (userResponse.result.status === Response.ERROR)
      return errorResponse(domain, handlerId, ErrorCodes.User.NoUser, ErrorMessages.User.NoUser);

    // Increase user gems
    const user = userResponse.result.user;
    const updatedUser = await ctx.prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        gems: {
          increment: gems,
        },
      },
    });

    // Check if user gems were increased
    if (!updatedUser)
      return errorResponse(domain, handlerId, ErrorCodes.User.NoIncreaseGems, ErrorMessages.User.NoIncreaseGems);

    return {
      result: {
        status: Response.SUCCESS,
        user: updatedUser,
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
 * Decrease user gems.
 *
 * @param ctx Ctx.
 * @param input DecreaseUserGemsInputType.
 * @returns User.
 */
export const decreaseUserGemsHandler = async ({
  ctx,
  input,
}: Params<DecreaseUserGemsInputType>): Promise<UserResponse> => {
  try {
    const handlerId = 'decreaseUserGemsHandler';
    const { discordId, gems } = input;

    // Get user
    const userResponse = await getUserByDiscordIdHandler({ ctx, input: { discordId } });

    // Check if user exists
    if (userResponse.result.status === Response.ERROR)
      return errorResponse(domain, handlerId, ErrorCodes.User.NoUser, ErrorMessages.User.NoUser);

    // Decrease user gems
    const user = userResponse.result.user;
    const updatedUser = await ctx.prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        gems: {
          decrement: gems,
        },
      },
    });

    // Check if user gems were decreased
    if (!updatedUser)
      return errorResponse(domain, handlerId, ErrorCodes.User.NoDecreaseGems, ErrorMessages.User.NoDecreaseGems);

    return {
      result: {
        status: Response.SUCCESS,
        user: updatedUser,
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
 * Get user's progress in a specific season, showing owned
 * and missing cards.
 *
 * @param ctx Ctx.
 * @param input GetUserSeasonProgressInputType.
 * @returns User's progress in season (owned and missing
 *   cards).
 */
export const getUserSeasonProgressHandler = async ({
  ctx,
  input,
}: Params<GetUserSeasonProgressInputType>): Promise<UserSeasonProgressResponse> => {
  try {
    const { seasonId, userId } = input;

    // Start transaction
    return await ctx.prisma.$transaction(async (prismaTransaction) => {
      // Get all cards from season
      const seasonCardsResponse = await getCardsBySeasonHandler({
        ctx: { ...ctx, prisma: prismaTransaction } as Ctx,
        input: { seasonId },
      });

      // Check if season has cards
      if (seasonCardsResponse?.result.status === Response.ERROR)
        return seasonCardsResponse as UserSeasonProgressResponse;

      // Get user's card from the season
      const userCardsResponse = await getCardsBySeasonAndUserIdHandler({
        ctx: { ...ctx, prisma: prismaTransaction } as Ctx,
        input: { seasonId, userId },
      });

      // Check if user has cards in the season
      if (userCardsResponse?.result.status === Response.ERROR) return userCardsResponse as UserSeasonProgressResponse;

      // Combine season cards with user collection status
      const seasonCards = seasonCardsResponse?.result.cards;
      const userCards = userCardsResponse?.result.userCards;
      const seasonProgress = seasonCards.map((seasonCard) => {
        // Find matching user cards
        const matchingUserCards = userCards.filter((card) => card.cardId === seasonCard.id);

        // Find normal and foil cards
        const normalCard = matchingUserCards.find((card) => !card.isFoil);
        const foilCard = matchingUserCards.find((card) => card.isFoil);
        return {
          card: seasonCard,
          quantity: (normalCard?.quantity ?? 0) + (foilCard?.quantity ?? 0),
          isFoil: foilCard?.isFoil ?? false,
          foilQuantity: foilCard?.quantity ?? 0,
          isOwned: !!normalCard || !!foilCard,
        };
      });

      // Calculate progress statistics
      const totalCards = seasonCards.length;
      const ownedCards = userCards.length;
      const foilCards = userCards.filter((card) => card.isFoil).length;
      const progressPercentage = (ownedCards / totalCards) * 100;

      return {
        result: {
          status: Response.SUCCESS,
          progress: {
            progressCards: seasonProgress,
            stats: {
              total: totalCards,
              owned: ownedCards,
              foils: foilCards,
              missing: totalCards - ownedCards,
              percentage: progressPercentage,
            },
          },
        },
      };
    });
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
