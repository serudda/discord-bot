import { CardError, CommonError, UserError } from '@discord-bot/error-handler';
import { Ctx, getRandomRarity, Response, TRPCErrorCode, type Params } from '../common';
import type {
  AddCoinsInputType,
  BuyPackInputType,
  CreateCardInputType,
  GetAllCardsByRarityInputType,
  GetCollectionInputType,
  GetRandomCardByRarityInputType,
  GetRandomCardsInputType,
  SetCoinsInputType,
} from '../schema/card.schema';
import { getUserByDiscordIdHandler } from './user.controller';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

/**
 * Create a card.
 *
 * @param ctx Ctx.
 * @param input CreateCardInputType.
 */
export const createCardHandler = async ({ ctx, input }: Params<CreateCardInputType>) => {
  try {
    const { name, description, rarity, imageUrl } = input;

    // Create card
    const card = await ctx.prisma.card.create({
      data: {
        name,
        description,
        rarity,
        image: imageUrl,
      },
    });

    // Check if card was created
    if (!card) {
      return {
        result: {
          status: Response.ERROR,
          message: CardError.NoCreateCard,
        },
      };
    }

    return {
      result: {
        status: Response.SUCCESS,
        card,
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
 * Add coins to a user.
 *
 * @param ctx Ctx.
 * @param input AddCoinsInputType.
 * @returns User's coins.
 */
export const addCoinsHandler = async ({ ctx, input }: Params<AddCoinsInputType>) => {
  try {
    const { discordId, amount } = input;

    // Get user by Discord Id on Account table
    const user = await getUserByDiscordIdHandler({ ctx, input: { discordId } });

    // Check if user exists
    if (!user) {
      return {
        result: {
          status: Response.ERROR,
          message: UserError.UserNotFound,
        },
      };
    }

    // Increase user's coins
    const userUpdated = await ctx.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        coins: {
          increment: amount,
        },
      },
    });

    // Check if user's coins were updated
    if (!userUpdated) {
      return {
        result: {
          status: Response.ERROR,
          message: CardError.NoAddCoins,
        },
      };
    }

    return {
      result: {
        status: Response.SUCCESS,
        coins: userUpdated.coins,
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
 * Set coins to a user.
 *
 * @param ctx Ctx.
 * @param input SetCoinsInputType.
 * @returns User's coins.
 */
export const setCoinsHandler = async ({ ctx, input }: Params<SetCoinsInputType>) => {
  try {
    const { discordId, amount } = input;

    // Get user by Discord Id on Account table
    const user = await getUserByDiscordIdHandler({ ctx, input: { discordId } });

    // Check if user exists
    if (!user) {
      return {
        result: {
          status: Response.ERROR,
          message: UserError.UserNotFound,
        },
      };
    }

    // Increase user's coins
    const userUpdated = await ctx.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        coins: amount,
      },
    });

    // Check if user's coins were updated
    if (!userUpdated) {
      return {
        result: {
          status: Response.ERROR,
          message: CardError.NoSetCoins,
        },
      };
    }

    return {
      result: {
        status: Response.SUCCESS,
        coins: userUpdated.coins,
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
 * Buy a pack of cards.
 *
 * @param ctx Ctx.
 * @param input BuyPackInputType.
 * @returns Random Cards.
 */
export const buyPackHandler = async ({ ctx, input }: Params<BuyPackInputType>) => {
  try {
    const { discordId } = input;
    const PACK_PRICE = 100;
    const PACK_AMOUNT = 3;

    // Start transaction
    const result = await ctx.prisma.$transaction(async (prismaTransaction) => {
      // Get user by Discord Id on Account table
      const user = await getUserByDiscordIdHandler({
        ctx: { prisma: prismaTransaction } as Ctx,
        input: { discordId },
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

      // Check if user has enough coins
      if (user.coins < PACK_PRICE) {
        return {
          result: {
            status: Response.ERROR,
            message: CardError.NoCoins,
          },
        };
      }

      // Get random cards
      const randomCardsResponse = await getRandomCardsHandler({
        ctx: { prisma: prismaTransaction } as Ctx,
        input: {
          amount: PACK_AMOUNT,
        },
      });

      // Check if cards were selected
      if (!randomCardsResponse || !randomCardsResponse.result || !randomCardsResponse.result.cards) {
        return {
          result: {
            status: Response.ERROR,
            message: CardError.RandomCardsNotFound,
          },
        };
      }

      const { cards: randomCards } = randomCardsResponse.result;

      // Check if cards were selected
      if (!randomCards || randomCards.length === 0) {
        return {
          result: {
            status: Response.ERROR,
            message: CardError.RandomCardsNotFound,
          },
        };
      }

      // Add cards to user's collection
      const userCards = await randomCards.map(async (card) => {
        if (!card) return;

        // Add user card
        await prismaTransaction.userCard.create({
          data: {
            userId: user.id,
            cardId: card.id,
          },
        });
      });

      // Check if cards were added to user's collection
      if (!userCards) {
        return {
          result: {
            status: Response.ERROR,
            message: CardError.NoAddCardToUserCollection,
          },
        };
      }

      // Decrease user's coins
      await prismaTransaction.user.update({
        where: {
          id: user.id,
        },
        data: {
          coins: {
            decrement: PACK_PRICE,
          },
        },
      });

      // Return random cards
      return {
        result: {
          status: Response.SUCCESS,
          cards: randomCards,
        },
      };
    });

    return result;
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

    if (!cards || cards.length === 0) {
      return {
        result: {
          status: Response.ERROR,
          message: CardError.CardsNotFoundByRarety,
        },
      };
    }

    return {
      result: {
        status: Response.SUCCESS,
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
 * Get random cards.
 *
 * @param ctx Ctx.
 * @param input GetRandomCardsInputType.
 * @returns Random cards.
 */
export const getRandomCardsHandler = async ({ ctx, input }: Params<GetRandomCardsInputType>) => {
  try {
    const { amount } = input;

    // Select random cards by amount
    const randomCards = [];
    for (let i = 0; i < amount; i++) {
      const randomCardByRarity = await getRandomCardByRarityHandler({
        ctx,
        input: {
          rarity: getRandomRarity(),
        },
      });
      randomCards.push(randomCardByRarity?.result.card);
    }

    return {
      result: {
        status: Response.SUCCESS,
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
 * Get random card by rarity.
 *
 * @param ctx Ctx.
 * @param input GetRandomCardByRarityInputType.
 * @returns Random card.
 */
export const getRandomCardByRarityHandler = async ({ ctx, input }: Params<GetRandomCardByRarityInputType>) => {
  try {
    const { rarity } = input;

    // Get all cards by rarity
    const cards = await getAllCardsByRarityHandler({
      ctx,
      input: {
        rarity,
      },
    });

    if (!cards?.result?.cards || cards.result.cards.length === 0) {
      return {
        result: {
          status: Response.ERROR,
          message: CardError.CardsNotFoundByRarety,
        },
      };
    }

    const { cards: allCardsByRarity } = cards.result;
    const randomIndex = Math.floor(Math.random() * allCardsByRarity.length);
    const randomCard = allCardsByRarity[randomIndex];

    return {
      result: {
        status: Response.SUCCESS,
        card: randomCard,
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
 * Get user collection.
 *
 * @param ctx Ctx.
 * @param input GetCollectionInputType.
 * @returns User's collection.
 */
export const getCollectionHandler = async ({ ctx, input }: Params<GetCollectionInputType>) => {
  try {
    const { discordId } = input;

    // Get user by Discord Id on Account table
    const user = await getUserByDiscordIdHandler({ ctx, input: { discordId } });

    // Check if user exists
    if (!user) {
      return {
        result: {
          status: Response.ERROR,
          message: UserError.UserNotFound,
        },
      };
    }

    // Get user's collection
    const userCollection = await ctx.prisma.userCard.findMany({
      where: {
        userId: user.id,
      },
      include: {
        card: true,
      },
    });

    if (!userCollection || userCollection.length === 0) {
      return {
        result: {
          status: Response.ERROR,
          message: CardError.NoUserCards,
        },
      };
    }

    return {
      result: {
        status: Response.SUCCESS,
        collection: userCollection,
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
