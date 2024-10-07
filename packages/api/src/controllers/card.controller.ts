import { CardError, CommonError } from '@discord-bot/error-handler';
import { getRandomRarity, Response, TRPCErrorCode, type Params } from '../common';
import type { BuyPackInputType, GetAllCardsByRarityInputType, GetRandomCardsInputType } from '../schema/card.schema';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

/**
 * Buy a pack of cards.
 *
 * @param ctx Ctx.
 * @param input BuyPackInputType.
 * @returns Random Cards.
 */
export const buyPackHandler = async ({ ctx, input }: Params<BuyPackInputType>) => {
  try {
    const { userId } = input;
    const PACK_PRICE = 100;
    const PACK_AMOUNT = 3;

    console.log('userId:', userId);

    // Get user by ID
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    // Check if user exists
    if (!user) {
      throw new TRPCError({
        code: TRPCErrorCode.NOT_FOUND,
        message: CommonError.UserNotFound,
      });
    }

    // Check if user has enough coins
    if (user.coins < PACK_PRICE) {
      throw new TRPCError({
        code: TRPCErrorCode.FORBIDDEN,
        message: CardError.NoCoins,
      });
    }

    // Decrease user's coins
    await ctx.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        coins: {
          decrement: PACK_PRICE,
        },
      },
    });

    // Get random cards
    const randomCards = await getRandomCardsHandler({
      ctx,
      input: {
        amount: PACK_AMOUNT,
      },
    });

    // Check if cards were selected
    if (!randomCards || !randomCards.result) return;

    return {
      status: Response.SUCCESS,
      result: {
        cards: randomCards.result.cards,
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
          message: CommonError.UnAuthorized,
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
 * Get all cards by rarity.
 *
 * @param ctx Ctx.
 * @param input GetAllCardsByRarityInputType.
 * @returns Cards by rarity.
 */
export const getAllCardsByRarityHandler = async ({ ctx, input }: Params<GetAllCardsByRarityInputType>) => {
  try {
    const { rarity } = input;

    // Get all cards by rarity
    const cards = await ctx.prisma.card.findMany({
      where: {
        rarity,
      },
    });

    if (!cards) {
      throw new TRPCError({
        code: TRPCErrorCode.NOT_FOUND,
        message: CardError.CardsNotFoundByRarety,
      });
    }

    return {
      status: Response.SUCCESS,
      result: {
        cards,
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
        const message = CommonError.UnAuthorized;
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
 * Get random cards.
 *
 * @param ctx Ctx.
 * @param input GetRandomCardsInputType.
 * @returns Random cards.
 */
export const getRandomCardsHandler = async ({ ctx, input }: Params<GetRandomCardsInputType>) => {
  try {
    const { amount } = input;

    // Get all cards by rarity
    const cards = await getAllCardsByRarityHandler({
      ctx,
      input: {
        rarity: getRandomRarity(),
      },
    });

    if (!cards || !cards.result) return;

    // Select random cards by amount
    const randomCards = [];
    for (let i = 0; i < amount; i++) {
      const randomIndex = Math.floor(Math.random() * cards.result.cards.length);
      randomCards.push(cards.result.cards[randomIndex]);
    }

    return {
      status: Response.SUCCESS,
      result: {
        cards: randomCards,
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
        const message = CommonError.UnAuthorized;
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
