import type { PackCard, UserCard } from '@discord-bot/db';
import type {
  BuyPackResponse,
  OpenPackResponse,
  PackWithCardsResponse} from '../common';
import {
  Response,
  TRPCErrorCode,
  type AmountOfPacksResponse,
  type Ctx,
  type Params,
  type UserPackResponse,
  type UserPacksResponse,
} from '../common';
import type {
  BuyPackInputType,
  CreatePackInputType,
  CreatePackWithCardsInputType,
  DeletePackInputType,
  GetAllPacksByUserIdInputType,
  GetAmountOfPacksByUserIdInputType,
  GetPackByIdInputType,
  GetUserPackByIdInputType,
  OpenPackInputType,
} from '../schema/pack.schema';
import { ErrorCodes, ErrorMessages, errorResponse } from '../services';
import { addCardToCollectionHandler, getCardsByPackIdHandler, getRandomCardsHandler } from './card.controller';
import { getCurrentSeasonHandler } from './season.controller';
import { decreaseUserCoinsHandler, getUserByDiscordIdHandler, getUserByIdHandler } from './user.controller';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

// Id domain to handle errors
const domain = 'PACK';

/**
 * Get pack by ID.
 *
 * @param ctx Ctx.
 * @param input GetPackByIdInputType.
 * @returns User Pack.
 */
export const getPackByIdHandler = async ({ ctx, input }: Params<GetPackByIdInputType>): Promise<UserPackResponse> => {
  try {
    const handlerId = 'getPackByIdHandler';
    const { packId } = input;

    // Get pack by ID
    const userPack = await ctx.prisma.pack.findUnique({
      where: {
        id: packId,
      },
    });

    // Check if pack was found
    if (!userPack) return errorResponse(domain, handlerId, ErrorCodes.User.NoUserPack, ErrorMessages.User.NoUserPack);

    return {
      result: {
        status: Response.SUCCESS,
        userPack,
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
 * Get all user packs.
 *
 * @param ctx Ctx.
 * @param input GetAllPacksByUserIdInputType.
 * @returns Packs.
 */
export const getAllPacksByUserIdHandler = async ({
  ctx,
  input,
}: Params<GetAllPacksByUserIdInputType>): Promise<UserPacksResponse> => {
  try {
    const handlerId = 'getAllPacksByUserIdHandler';
    const { userId } = input;

    // Get packs by user ID
    const packs = await ctx.prisma.pack.findMany({
      where: {
        userId,
      },
    });

    // Check if packs were found
    if (!packs || packs.length === 0)
      return errorResponse(domain, handlerId, ErrorCodes.User.NoUserPacks, ErrorMessages.User.NoUserPacks);

    return {
      result: {
        status: Response.SUCCESS,
        userPacks: packs,
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
 * Get amount of packs by user ID.
 *
 * @param ctx Ctx.
 * @param input GetAmountOfPacksByUserIdInputType.
 * @returns Amount of user's packs.
 */
export const getAmountOfPacksByUserIdHandler = async ({
  ctx,
  input,
}: Params<GetAmountOfPacksByUserIdInputType>): Promise<AmountOfPacksResponse> => {
  try {
    const { userId } = input;

    // Check if user exists
    const userResponse = await getUserByIdHandler({ ctx, input: { id: userId } });
    if (userResponse.result.status === Response.ERROR) return userResponse as AmountOfPacksResponse;

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
 * Get user pack by ID.
 *
 * @param ctx Ctx.
 * @param input GetUserPackByIdInputType.
 * @returns User pack.
 */
export const getUserPackByIdHandler = async ({
  ctx,
  input,
}: Params<GetUserPackByIdInputType>): Promise<UserPackResponse> => {
  try {
    const handlerId = 'getUserPackByIdHandler';
    const { userId, packId } = input;

    // Get pack by ID
    const userPackResponse = await getPackByIdHandler({ ctx, input: { packId } });

    // Check if pack was found
    if (userPackResponse.result.status === Response.ERROR) return userPackResponse;

    // Check if pack belongs to user
    const userPack = userPackResponse.result.userPack;
    if (userPack.userId !== userId)
      return errorResponse(domain, handlerId, ErrorCodes.User.NoUserPack, ErrorMessages.User.NoUserPack);

    return {
      result: {
        status: Response.SUCCESS,
        userPack,
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
 * Create pack.
 *
 * @param ctx Ctx.
 * @param input CreatePackInputType.
 * @returns User Pack.
 */
export const createPackHandler = async ({ ctx, input }: Params<CreatePackInputType>): Promise<UserPackResponse> => {
  try {
    const handlerId = 'createPackHandler';
    const { seasonId, userId } = input;

    // Create pack
    const userPack = await ctx.prisma.pack.create({
      data: {
        seasonId,
        userId,
      },
    });

    // Check if pack was created
    if (!userPack)
      return errorResponse(domain, handlerId, ErrorCodes.Pack.NoCreatePack, ErrorMessages.Pack.NoCreatePack);

    return {
      result: {
        status: Response.SUCCESS,
        userPack,
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
 * Create pack with cards.
 *
 * @param ctx Ctx.
 * @param input CreatePackWithCardsInputType.
 * @returns Pack with cards.
 */
export const createPackWithCardsHandler = async ({
  ctx,
  input,
}: Params<CreatePackWithCardsInputType>): Promise<PackWithCardsResponse> => {
  try {
    const handlerId = 'createPackWithCardsHandler';
    const { seasonId, userId } = input;
    const CARD_AMOUNT_PACK = await ctx.configService.getGlobalConfig<number>('CARD_AMOUNT_PACK', 3);
    const FOIL_PROBABILITY = await ctx.configService.getGlobalConfig<number>('FOIL_PROBABILITY', 0.04);

    const executePackCreation = async (prisma: typeof ctx.prisma): Promise<PackWithCardsResponse> => {
      // Create pack
      const newUserPackResponse = await createPackHandler({
        ctx: { ...ctx, prisma },
        input: { seasonId, userId },
      });

      // Check if pack was created
      if (newUserPackResponse.result.status === Response.ERROR) return newUserPackResponse as PackWithCardsResponse;

      // Get random cards
      const randomCardsResponse = await getRandomCardsHandler({
        ctx: { ...ctx, prisma },
        input: {
          amount: CARD_AMOUNT_PACK,
        },
      });

      // Check if random cards were found
      if (randomCardsResponse.result.status === Response.ERROR) return randomCardsResponse as PackWithCardsResponse;

      // Add cards to pack
      const userPackId = newUserPackResponse?.result.userPack.id;
      const cards = randomCardsResponse?.result.cards;
      const cardsInPack = cards.map((card) => ({
        packId: userPackId,
        cardId: card.id,
        isFoil: Math.random() < FOIL_PROBABILITY,
      }));

      // Create cards in pack
      const newPackCards = (await prisma.packCard.createMany({
        data: cardsInPack,
      })) as unknown as Array<PackCard>;

      // Check if cards were added to pack
      if (!newPackCards)
        return errorResponse(
          domain,
          handlerId,
          ErrorCodes.Pack.NoCreatePackCards,
          ErrorMessages.Pack.NoCreatePackCards,
        );

      const pack = newUserPackResponse.result.userPack;
      return {
        result: {
          status: Response.SUCCESS,
          pack,
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
      const message = ErrorMessages.Common.InvalidInput;
      throw new TRPCError({
        code: TRPCErrorCode.BAD_REQUEST,
        message,
      });
    }

    // TRPC error (Custom error)
    if (error instanceof TRPCError) {
      if (error.code === TRPCErrorCode.UNAUTHORIZED) {
        const message = ErrorMessages.User.UnAuthorized;
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
export const buyPackHandler = async ({ ctx, input }: Params<BuyPackInputType>): Promise<BuyPackResponse> => {
  try {
    const handlerId = 'buyPackHandler';
    const { discordId } = input;
    const PACK_PRICE = await ctx.configService.getGlobalConfig<number>('PACK_PRICE', 100);

    return await ctx.prisma.$transaction(async (prismaTransaction) => {
      // Get user by Discord ID
      const userResponse = await getUserByDiscordIdHandler({
        ctx: { ...ctx, prisma: prismaTransaction } as Ctx,
        input: { discordId },
      });

      // Check if user was found
      if (userResponse.result.status === Response.ERROR) return userResponse as BuyPackResponse;

      // Check if user has enough coins
      const user = userResponse.result.user;
      if (!user || user.coins < PACK_PRICE)
        return errorResponse(domain, handlerId, ErrorCodes.User.NoCoins, ErrorMessages.User.NoCoins);

      // Get current season
      const seasonResponse = await getCurrentSeasonHandler({
        ctx: { ...ctx, prisma: prismaTransaction } as Ctx,
        input: {},
      });

      // Check if season was found
      if (seasonResponse.result.status === Response.ERROR) return seasonResponse as BuyPackResponse;

      // Create pack with cards
      const season = seasonResponse.result.season;
      const userId = user.id;
      const seasonId = season?.id;

      const newPackResponse = await createPackWithCardsHandler({
        ctx: { ...ctx, prisma: prismaTransaction } as Ctx,
        input: { seasonId, userId },
      });

      // Check if pack with cards was created
      if (newPackResponse.result.status === Response.ERROR) return newPackResponse as BuyPackResponse;

      // Decrease user coins
      const updateUserResponse = await decreaseUserCoinsHandler({
        ctx: { ...ctx, prisma: prismaTransaction } as Ctx,
        input: { discordId, coins: PACK_PRICE },
      });

      // Check if user coins were decreased
      if (updateUserResponse.result.status === Response.ERROR) return updateUserResponse as BuyPackResponse;

      // Get amount of packs by user ID
      const amountOfPacksResponse = await getAmountOfPacksByUserIdHandler({
        ctx: { ...ctx, prisma: prismaTransaction } as Ctx,
        input: { userId },
      });

      // Check if amount of packs was found
      if (amountOfPacksResponse.result.status === Response.ERROR) return amountOfPacksResponse as BuyPackResponse;

      const amountOfPacks = amountOfPacksResponse.result.amountOfPacks;
      const coins = updateUserResponse.result.user?.coins;
      return {
        result: {
          status: Response.SUCCESS,
          amountOfPacks,
          coins,
        },
      };
    });
  } catch (error: unknown) {
    // Zod error (Invalid input)
    if (error instanceof z.ZodError) {
      const message = ErrorMessages.Common.InvalidInput;
      throw new TRPCError({
        code: TRPCErrorCode.BAD_REQUEST,
        message,
      });
    }

    // TRPC error (Custom error)
    if (error instanceof TRPCError) {
      if (error.code === TRPCErrorCode.UNAUTHORIZED) {
        const message = ErrorMessages.User.UnAuthorized;
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
 * Open pack.
 *
 * @param ctx Ctx.
 * @param input OpenPackInputType.
 * @returns Pack.
 */
export const openPackHandler = async ({ ctx, input }: Params<OpenPackInputType>): Promise<OpenPackResponse> => {
  const handlerId = 'openPackHandler';
  const { userId } = input;

  try {
    return await ctx.prisma.$transaction(
      async (prismaTransaction) => {
        // Get random pack
        const randomPack = await prismaTransaction.pack.findFirst({
          where: {
            userId,
          },
        });

        // Check if pack was found
        if (!randomPack)
          return errorResponse(domain, handlerId, ErrorCodes.User.NoUserPack, ErrorMessages.User.NoUserPack);

        // Get cards by pack ID
        const cardsByPackIdResponse = await getCardsByPackIdHandler({
          ctx: { ...ctx, prisma: prismaTransaction } as Ctx,
          input: { packId: randomPack.id },
        });

        // Check if cards were found
        if (cardsByPackIdResponse.result.status === Response.ERROR) return cardsByPackIdResponse as OpenPackResponse;

        // Delete pack
        const deletePackResponse = await deletePackHandler({
          ctx: { ...ctx, prisma: prismaTransaction } as Ctx,
          input: { packId: randomPack.id },
        });

        // Check if pack was deleted
        if (deletePackResponse?.result.status === Response.ERROR) return deletePackResponse as OpenPackResponse;

        // Add cards to user's collection
        const randomCards = cardsByPackIdResponse?.result.packCards?.map((packCard) => {
          return {
            ...packCard,
            isFoil: packCard.isFoil,
          };
        });

        // Check if random cards were found
        if (!randomCards)
          return errorResponse(domain, handlerId, ErrorCodes.Card.NoCardsByPackId, ErrorMessages.Card.NoCardsByPackId);

        // Add cards to user's collection
        const userCards: Array<UserCard> = [];

        // Add cards to user's collection one by one
        for (const card of randomCards) {
          // Add user card
          const newAddedCardResponse = await addCardToCollectionHandler({
            ctx: { ...ctx, prisma: prismaTransaction } as Ctx,
            input: {
              userId,
              cardId: card.id,
              quantity: 1,
              isFoil: card.isFoil,
            },
          });

          // Check if card was added to user's collection
          if (newAddedCardResponse.result.status === Response.ERROR) return newAddedCardResponse as OpenPackResponse;

          userCards.push(newAddedCardResponse.result.userCard);
        }

        // Check if cards were added to user's collection
        if (!userCards)
          return errorResponse(
            domain,
            handlerId,
            ErrorCodes.Card.NoAddCardToUserCollection,
            ErrorMessages.Card.NoAddCardToUserCollection,
          );

        // Get amount of packs by user ID
        const amountOfPacksResponse = await getAmountOfPacksByUserIdHandler({
          ctx: { ...ctx, prisma: prismaTransaction } as Ctx,
          input: { userId },
        });

        // Check if amount of packs was found
        if (amountOfPacksResponse.result.status === Response.ERROR) return amountOfPacksResponse as OpenPackResponse;

        // Return random cards
        return {
          result: {
            status: Response.SUCCESS,
            newUserCards: userCards,
            amountOfPacks: amountOfPacksResponse.result.amountOfPacks,
          },
        };
      },
      {
        maxWait: 5000,
        timeout: 10000,
      },
    );
  } catch (error: unknown) {
    // Zod error (Invalid input)
    if (error instanceof z.ZodError) {
      const message = ErrorMessages.Common.InvalidInput;
      throw new TRPCError({
        code: TRPCErrorCode.BAD_REQUEST,
        message,
      });
    }

    // TRPC error (Custom error)
    if (error instanceof TRPCError) {
      if (error.code === TRPCErrorCode.UNAUTHORIZED) {
        const message = ErrorMessages.User.UnAuthorized;
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
 * Delete pack.
 *
 * @param ctx Ctx.
 * @param input DeletePackInputType.
 * @returns Pack.
 */
export const deletePackHandler = async ({ ctx, input }: Params<DeletePackInputType>): Promise<UserPackResponse> => {
  try {
    const handlerId = 'deletePackHandler';
    const { packId } = input;

    // Delete pack
    const deletedPack = await ctx.prisma.pack.delete({
      where: {
        id: packId,
      },
    });

    // Check if pack was deleted
    if (!deletedPack)
      return errorResponse(domain, handlerId, ErrorCodes.Pack.NoDeletePack, ErrorMessages.Pack.NoDeletePack);

    return {
      result: {
        status: Response.SUCCESS,
        userPack: deletedPack,
      },
    };
  } catch (error: unknown) {
    // Zod error (Invalid input)
    if (error instanceof z.ZodError) {
      const message = ErrorMessages.Common.InvalidInput;
      throw new TRPCError({
        code: TRPCErrorCode.BAD_REQUEST,
        message,
      });
    }

    // TRPC error (Custom error)
    if (error instanceof TRPCError) {
      if (error.code === TRPCErrorCode.UNAUTHORIZED) {
        const message = ErrorMessages.User.UnAuthorized;
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
