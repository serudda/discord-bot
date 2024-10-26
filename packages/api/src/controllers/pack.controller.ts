import type { Card } from '@discord-bot/db';
import { CommonError, PackError, UserError } from '@discord-bot/error-handler';
import { Response, TRPCErrorCode, type Ctx, type Params } from '../common';
import type {
  BuyPackInputType,
  CreatePackInputType,
  CreatePackWithCardsInputType,
  GetAllPacksByUserIdInputType,
  GetAmountOfPacksByUserIdInputType,
  GetPackByIdInputType,
  GetUserPackByIdInputType,
} from '../schema/pack.schema';
import { getRandomCardsHandler } from './card.controller';
import { getCurrentSeasonHandler } from './season.controller';
import { decreaseUserCoinsHandler, getUserByDiscordIdHandler, getUserByIdHandler } from './user.controller';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

/**
 * Get pack by ID.
 *
 * @param ctx Ctx.
 * @param input GetPackByIdInputType.
 * @returns Pack.
 */
export const getPackByIdHandler = async ({ ctx, input }: Params<GetPackByIdInputType>) => {
  try {
    const { packId } = input;

    // Get pack by ID
    const pack = await ctx.prisma.pack.findUnique({
      where: {
        id: packId,
      },
    });

    // Check if pack was found
    if (!pack) {
      return {
        result: {
          status: Response.ERROR,
          message: PackError.PackNotFound,
        },
      };
    }

    return {
      result: {
        status: Response.SUCCESS,
        pack,
      },
    };
  } catch (error: unknown) {
    // Zod error (Invalid input)
    if (error instanceof z.ZodError) {
      const message = CommonError.InvalidInput;
      throw new TRPCError({
        code: TRPCErrorCode.BAD_REQUEST,
        message,
      });
    }

    // TRPC error (Custom error)
    if (error instanceof TRPCError) {
      if (error.code === TRPCErrorCode.UNAUTHORIZED) {
        const message = UserError.UnAuthorized;
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
 * Get all user packs.
 *
 * @param ctx Ctx.
 * @param input GetAllPacksByUserIdInputType.
 * @returns Packs.
 */
export const getAllPacksByUserIdHandler = async ({ ctx, input }: Params<GetAllPacksByUserIdInputType>) => {
  try {
    const { userId } = input;

    // Get packs by user ID
    const packs = await ctx.prisma.pack.findMany({
      where: {
        userId,
      },
    });

    // Check if packs were found
    if (!packs || packs.length === 0) {
      return {
        result: {
          status: Response.ERROR,
          message: PackError.UserPacksNotFound,
        },
      };
    }

    return {
      result: {
        status: Response.SUCCESS,
        packs,
      },
    };
  } catch (error: unknown) {
    // Zod error (Invalid input)
    if (error instanceof z.ZodError) {
      const message = CommonError.InvalidInput;
      throw new TRPCError({
        code: TRPCErrorCode.BAD_REQUEST,
        message,
      });
    }

    // TRPC error (Custom error)
    if (error instanceof TRPCError) {
      if (error.code === TRPCErrorCode.UNAUTHORIZED) {
        const message = UserError.UnAuthorized;
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

export const getAmountOfPacksByUserIdHandler = async ({ ctx, input }: Params<GetAmountOfPacksByUserIdInputType>) => {
  try {
    const { userId } = input;

    // Check if user exists
    const user = await getUserByIdHandler({ ctx, input: { id: userId } });
    if (!user || !user.result || user.result.status === Response.ERROR) {
      return {
        result: {
          status: Response.ERROR,
          message: UserError.UserNotFound,
        },
      };
    }

    // Get amount of packs by user ID
    const amountOfPacks = await ctx.prisma.pack.count({
      where: {
        userId,
      },
    });

    return {
      result: {
        status: Response.SUCCESS,
        amountOfPacks,
      },
    };
  } catch (error: unknown) {
    // Zod error (Invalid input)
    if (error instanceof z.ZodError) {
      const message = CommonError.InvalidInput;
      throw new TRPCError({
        code: TRPCErrorCode.BAD_REQUEST,
        message,
      });
    }

    // TRPC error (Custom error)
    if (error instanceof TRPCError) {
      if (error.code === TRPCErrorCode.UNAUTHORIZED) {
        const message = UserError.UnAuthorized;
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
 * Get user pack by ID.
 *
 * @param ctx Ctx.
 * @param input GetUserPackByIdInputType.
 * @returns User pack.
 */
export const getUserPackByIdHandler = async ({ ctx, input }: Params<GetUserPackByIdInputType>) => {
  try {
    const { userId, packId } = input;

    // Get pack by ID
    const response = await getPackByIdHandler({ ctx, input: { packId } });

    // Check if pack was found
    if (!response || !response.result.pack || response.result.status === Response.ERROR) {
      return {
        result: {
          status: Response.ERROR,
          message: response?.result.message,
        },
      };
    }

    // Check if pack belongs to user
    if (response.result.pack.userId !== userId) {
      return {
        result: {
          status: Response.ERROR,
          message: PackError.UserPackNotFound,
        },
      };
    }

    return {
      result: {
        status: Response.SUCCESS,
        pack: response.result.pack,
      },
    };
  } catch (error: unknown) {
    // Zod error (Invalid input)
    if (error instanceof z.ZodError) {
      const message = CommonError.InvalidInput;
      throw new TRPCError({
        code: TRPCErrorCode.BAD_REQUEST,
        message,
      });
    }

    // TRPC error (Custom error)
    if (error instanceof TRPCError) {
      if (error.code === TRPCErrorCode.UNAUTHORIZED) {
        const message = UserError.UnAuthorized;
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
 * Create pack.
 *
 * @param ctx Ctx.
 * @param input CreatePackInputType.
 * @returns Pack.
 */
export const createPackHandler = async ({ ctx, input }: Params<CreatePackInputType>) => {
  try {
    const { seasonId, userId } = input;

    // Create pack
    const pack = await ctx.prisma.pack.create({
      data: {
        seasonId,
        userId,
      },
    });

    // Check if pack was created
    if (!pack) {
      return {
        result: {
          status: Response.ERROR,
          message: PackError.NoCreatePack,
        },
      };
    }

    return {
      result: {
        status: Response.SUCCESS,
        pack,
      },
    };
  } catch (error: unknown) {
    // Zod error (Invalid input)
    if (error instanceof z.ZodError) {
      const message = CommonError.InvalidInput;
      throw new TRPCError({
        code: TRPCErrorCode.BAD_REQUEST,
        message,
      });
    }

    // TRPC error (Custom error)
    if (error instanceof TRPCError) {
      if (error.code === TRPCErrorCode.UNAUTHORIZED) {
        const message = UserError.UnAuthorized;
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
 * Create pack with cards.
 *
 * @param ctx Ctx.
 * @param input CreatePackWithCardsInputType.
 * @returns Pack with cards.
 */
export const createPackWithCardsHandler = async ({ ctx, input }: Params<CreatePackWithCardsInputType>) => {
  try {
    const { seasonId, userId } = input;
    const CARD_AMOUNT_PACK = await ctx.configService.getGlobalConfig<number>('CARD_AMOUNT_PACK', 3);

    const executePackCreation = async (prisma: typeof ctx.prisma) => {
      // Create pack
      const newPackResponse = await createPackHandler({
        ctx: { ...ctx, prisma },
        input: { seasonId, userId },
      });

      // Check if pack was created
      if (!newPackResponse || !newPackResponse.result || newPackResponse.result.status === Response.ERROR) {
        return {
          result: {
            status: Response.ERROR,
            message: newPackResponse?.result.message,
          },
        };
      }

      // Get random cards
      const randomCardsResponse = await getRandomCardsHandler({
        ctx: { ...ctx, prisma },
        input: {
          amount: CARD_AMOUNT_PACK,
        },
      });

      // Check if random cards were found
      if (!randomCardsResponse || !randomCardsResponse.result || randomCardsResponse.result.status === Response.ERROR) {
        return {
          result: {
            status: Response.ERROR,
            message: randomCardsResponse?.result.message,
          },
        };
      }

      // Add cards to pack
      const packId = newPackResponse?.result.pack?.id as string;
      const cards = randomCardsResponse?.result.cards as Array<Card>;
      const cardsInPack = cards.map((card) => ({
        packId,
        cardId: card.id,
      }));

      // Create cards in pack
      const newPackCards = await prisma.packCard.createMany({
        data: cardsInPack,
      });

      // Check if cards were added to pack
      if (!newPackCards) {
        return {
          result: {
            status: Response.ERROR,
            message: PackError.NoCreatePackCards,
          },
        };
      }

      return {
        result: {
          status: Response.SUCCESS,
          pack: newPackResponse.result.pack,
          cards: newPackCards,
        },
      };
    };

    if (!ctx.prisma.$transaction) return await executePackCreation(ctx.prisma);

    return await ctx.prisma.$transaction(async (tx) => {
      return await executePackCreation(tx as typeof ctx.prisma);
    });
  } catch (error: unknown) {
    // Zod error (Invalid input)
    if (error instanceof z.ZodError) {
      const message = CommonError.InvalidInput;
      throw new TRPCError({
        code: TRPCErrorCode.BAD_REQUEST,
        message,
      });
    }

    // TRPC error (Custom error)
    if (error instanceof TRPCError) {
      if (error.code === TRPCErrorCode.UNAUTHORIZED) {
        const message = UserError.UnAuthorized;
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

    throw new TRPCError({
      code: TRPCErrorCode.INTERNAL_SERVER_ERROR,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    });
  }
};

/**
 * Buy pack.
 *
 * @param ctx Ctx.
 * @param input BuyPackInputType.
 * @returns
 */
export const buyPackHandler = async ({ ctx, input }: Params<BuyPackInputType>) => {
  try {
    const { discordId } = input;
    const PACK_PRICE = await ctx.configService.getGlobalConfig<number>('PACK_PRICE', 100);

    return await ctx.prisma.$transaction(async (prismaTransaction) => {
      // Get user by Discord ID
      const userResponse = await getUserByDiscordIdHandler({
        ctx: { ...ctx, prisma: prismaTransaction } as Ctx,
        input: { discordId },
      });

      // Check if user was found
      if (!userResponse || !userResponse.result || userResponse.result.status === Response.ERROR) {
        return {
          result: {
            status: Response.ERROR,
            message: userResponse?.result.message,
          },
        };
      }

      // Check if user has enough coins
      const user = userResponse.result.user;
      if (!user || user.coins < PACK_PRICE) {
        return {
          result: {
            status: Response.ERROR,
            message: UserError.NoCoins,
          },
        };
      }

      console.log('**USER**', user);

      // Get current season
      const seasonResponse = await getCurrentSeasonHandler({
        ctx: { ...ctx, prisma: prismaTransaction } as Ctx,
        input: {},
      });

      // Check if season was found
      if (!seasonResponse || !seasonResponse.result || seasonResponse.result.status === Response.ERROR) {
        return {
          result: {
            status: Response.ERROR,
            message: seasonResponse?.result.message,
          },
        };
      }

      // Create pack with cards
      const season = seasonResponse.result.season;
      const userId = user.id;
      const seasonId = season?.id as string;

      const newPackResponse = await createPackWithCardsHandler({
        ctx: { ...ctx, prisma: prismaTransaction } as Ctx,
        input: { seasonId, userId },
      });

      // Check if pack with cards was created
      if (!newPackResponse || !newPackResponse.result || newPackResponse.result.status === Response.ERROR) {
        return {
          result: {
            status: Response.ERROR,
            message: newPackResponse?.result.message,
          },
        };
      }

      // Decrease user coins
      const updateUserResponse = await decreaseUserCoinsHandler({
        ctx: { ...ctx, prisma: prismaTransaction } as Ctx,
        input: { discordId, coins: PACK_PRICE },
      });

      // Check if user coins were decreased
      if (!updateUserResponse || !updateUserResponse.result || updateUserResponse.result.status === Response.ERROR) {
        return {
          result: {
            status: Response.ERROR,
            message: updateUserResponse?.result.message,
          },
        };
      }

      // Get amount of packs by user ID
      const amountOfPacksResponse = await getAmountOfPacksByUserIdHandler({
        ctx: { ...ctx, prisma: prismaTransaction } as Ctx,
        input: { userId },
      });

      console.log('**AMOUNT OF PACKS RESPONSE**', amountOfPacksResponse);

      // Check if amount of packs was found
      if (
        !amountOfPacksResponse ||
        !amountOfPacksResponse.result ||
        amountOfPacksResponse.result.status === Response.ERROR
      ) {
        return {
          result: {
            status: Response.ERROR,
            message: amountOfPacksResponse?.result.message,
          },
        };
      }

      return {
        result: {
          status: Response.SUCCESS,
          amountOfPacks: amountOfPacksResponse.result.amountOfPacks,
          coins: updateUserResponse.result.user?.coins,
        },
      };
    });
  } catch (error: unknown) {
    console.error('**TRPC ERROR**', error);

    // Zod error (Invalid input)
    if (error instanceof z.ZodError) {
      const message = CommonError.InvalidInput;
      throw new TRPCError({
        code: TRPCErrorCode.BAD_REQUEST,
        message,
      });
    }
  }
};
