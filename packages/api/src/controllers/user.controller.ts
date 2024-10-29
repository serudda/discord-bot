import type { Card, UserCard } from '@discord-bot/db';
import { AccountError, CardError, CommonError, SeasonError, UserError } from '@discord-bot/error-handler';
import { PrismaErrorCode, Response, TRPCErrorCode, type Ctx, type Params } from '../common';
import type {
  CreateUserInputType,
  DecreaseUserCoinsInputType,
  GetUserByDiscordIdInputType,
  GetUserByEmailInputType,
  GetUserByIdInputType,
  GetUserByUsernameInputType,
  GetUserCoinsInputType,
  GetUserSeasonProgressInputType,
  IncreaseUserCoinsInputType,
  RegisterUserInputType,
  UpdateUserCoinsInputType,
} from '../schema/user.schema';
import { createAccountHandler } from './account.controller';
import { getCardsBySeasonAndUserIdHandler, getCardsBySeasonHandler } from './card.controller';
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
export const getUserByIdHandler = async ({ ctx, input }: Params<GetUserByIdInputType>) => {
  try {
    const user = await ctx.prisma.user.findUnique({
      where: { id: input.id },
      include: {
        accounts: true,
      },
    });

    // Check if user exists
    if (!user) {
      return {
        result: {
          status: Response.ERROR,
          message: UserError.UserNotFound,
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
      if (error.code === PrismaErrorCode.RecordDoesNotExist) {
        throw new TRPCError({
          code: TRPCErrorCode.NOT_FOUND,
          message: UserError.UserNotFound,
        });
      }
    }

    // TRPC error (Custom error)
    if (error instanceof TRPCError) {
      throw new TRPCError({
        code: TRPCErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  }
};

/**
 * Get user by Discord Id.
 *
 * @param ctx Ctx.
 * @param input GetUserByDiscordIdInputType.
 * @returns User.
 */
export const getUserByDiscordIdHandler = async ({ ctx, input }: Params<GetUserByDiscordIdInputType>) => {
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
      },
    });

    // Check if user exists
    if (!user) {
      return {
        result: {
          status: Response.ERROR,
          message: UserError.UserNotFound,
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
      if (error.code === PrismaErrorCode.RecordDoesNotExist) {
        throw new TRPCError({
          code: TRPCErrorCode.NOT_FOUND,
          message: UserError.UserNotFound,
        });
      }
    }

    // TRPC error (Custom error)
    if (error instanceof TRPCError) {
      throw new TRPCError({
        code: TRPCErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  }
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
 * Get user by username.
 *
 * @param ctx Ctx.
 * @param input GetUserByUsernameInputType.
 * @returns User.
 */
export const getUserByUsernameHandler = async ({ ctx, input }: Params<GetUserByUsernameInputType>) => {
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
    if (!user) {
      return {
        result: {
          status: Response.ERROR,
          message: UserError.UserNotFound,
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
      if (error.code === PrismaErrorCode.RecordDoesNotExist) {
        throw new TRPCError({
          code: TRPCErrorCode.NOT_FOUND,
          message: UserError.UserNotFound,
        });
      }
    }

    // TRPC error (Custom error)
    if (error instanceof TRPCError) {
      throw new TRPCError({
        code: TRPCErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  }
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
    const INIT_COINS = await ctx.configService.getGlobalConfig<number>('INIT_COINS', 500);

    return await ctx.prisma.$transaction(async (prismaTransaction) => {
      // Check if user already exists
      const user = await getUserByDiscordIdHandler({
        ctx: { ...ctx, prisma: prismaTransaction } as Ctx,
        input: { discordId },
      });

      if (user?.result && user.result.status === Response.SUCCESS) {
        return {
          result: {
            status: Response.ERROR,
            message: UserError.UserAlreadyExists,
          },
        };
      }

      // Create user
      const newUser = await createUserHandler({
        ctx: { ...ctx, prisma: prismaTransaction } as Ctx,
        input: {
          name,
          username,
          email,
          image,
          coins: INIT_COINS,
        },
      });

      // Check if user was created
      if (!newUser || !newUser.result.user || newUser.result.status === Response.ERROR) {
        return {
          result: {
            status: Response.ERROR,
            message: newUser?.result.message,
          },
        };
      }

      // Create account
      const newAccount = await createAccountHandler({
        ctx: { ...ctx, prisma: prismaTransaction } as Ctx,
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
    });
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
  try {
    const { discordId } = input;

    // Get user
    const userResponse = await getUserByDiscordIdHandler({ ctx, input: { discordId } });

    // Check if user exists
    if (!userResponse || !userResponse.result || userResponse.result.status === Response.ERROR) {
      return {
        result: {
          status: Response.ERROR,
          message: UserError.UserNotFound,
        },
      };
    }

    // Check if user has coins
    if (!userResponse.result.user?.coins) {
      return {
        result: {
          status: Response.ERROR,
          message: UserError.NoCoins,
        },
      };
    }

    return {
      result: {
        status: Response.SUCCESS,
        coins: userResponse.result.user?.coins,
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
 * Update user coins.
 *
 * @param ctx Ctx.
 * @param input UpdateUserCoinsInputType.
 * @returns User.
 */
export const updateUserCoinsHandler = async ({ ctx, input }: Params<UpdateUserCoinsInputType>) => {
  try {
    const { discordId, coins } = input;

    // Get user
    const userResponse = await getUserByDiscordIdHandler({ ctx, input: { discordId } });

    // Check if user exists
    if (!userResponse || !userResponse.result || userResponse.result.status === Response.ERROR) {
      return {
        result: {
          status: Response.ERROR,
          message: UserError.UserNotFound,
        },
      };
    }

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
 * Increase user coins.
 *
 * @param ctx Ctx.
 * @param input IncreaseUserCoinsInputType.
 * @returns User.
 */
export const increaseUserCoinsHandler = async ({ ctx, input }: Params<IncreaseUserCoinsInputType>) => {
  try {
    const { discordId, coins } = input;

    // Get user
    const userResponse = await getUserByDiscordIdHandler({ ctx, input: { discordId } });

    // Check if user exists
    if (!userResponse || !userResponse.result || userResponse.result.status === Response.ERROR) {
      return {
        result: {
          status: Response.ERROR,
          message: UserError.UserNotFound,
        },
      };
    }

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

    return {
      result: {
        status: Response.SUCCESS,
        user: updatedUser,
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
 * Decrease user coins.
 *
 * @param ctx Ctx.
 * @param input DecreaseUserCoinsInputType.
 * @returns User.
 */
export const decreaseUserCoinsHandler = async ({ ctx, input }: Params<DecreaseUserCoinsInputType>) => {
  try {
    const { discordId, coins } = input;

    // Get user
    const userResponse = await getUserByDiscordIdHandler({ ctx, input: { discordId } });

    // Check if user exists
    if (!userResponse || !userResponse.result || userResponse.result.status === Response.ERROR) {
      return {
        result: {
          status: Response.ERROR,
          message: UserError.UserNotFound,
        },
      };
    }

    // Check if user has enough coins
    const userCoins = userResponse.result.user?.coins;
    if (userCoins && userCoins < coins) {
      return {
        result: {
          status: Response.ERROR,
          message: UserError.NoDecreaseCoins,
        },
      };
    }

    // Decrease user coins
    const user = userResponse.result.user;
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
    if (!updatedUser) {
      return {
        result: {
          status: Response.ERROR,
          message: UserError.NoDecreaseCoins,
        },
      };
    }

    return {
      result: {
        status: Response.SUCCESS,
        user: updatedUser,
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
 * Get user's progress in a specific season, showing owned
 * and missing cards.
 *
 * @param ctx Ctx.
 * @param input GetUserSeasonProgressInputType.
 * @returns User's progress in season (owned and missing
 *   cards).
 */
export const getUserSeasonProgressHandler = async ({ ctx, input }: Params<GetUserSeasonProgressInputType>) => {
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
      if (!seasonCardsResponse || !seasonCardsResponse.result || seasonCardsResponse.result.status === Response.ERROR) {
        return {
          result: {
            status: Response.ERROR,
            message: SeasonError.CardsNotFoundBySeason,
          },
        };
      }

      // Get user's card from the season
      const userCardsResponse = await getCardsBySeasonAndUserIdHandler({
        ctx: { ...ctx, prisma: prismaTransaction } as Ctx,
        input: { seasonId, userId },
      });

      // Check if user has cards in the season
      if (!userCardsResponse || !userCardsResponse.result || userCardsResponse.result.status === Response.ERROR) {
        return {
          result: {
            status: Response.ERROR,
            message: CardError.CardsNotFoundBySeasonAndUserId,
          },
        };
      }

      // Combine season cards with user collection status
      const seasonCards = seasonCardsResponse.result.cards as Array<Card>;
      const userCards = userCardsResponse.result.cards as Array<UserCard>;
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
            cards: seasonProgress,
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
