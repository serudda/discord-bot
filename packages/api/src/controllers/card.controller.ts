import type { Card, UserCard } from '@discord-bot/db';
import type { UserCardWithCardResponse } from '../common';
import {
  getRandomRarity,
  getSortingOptions,
  OrderBy,
  Response,
  TRPCErrorCode,
  type CardCreateResponse,
  type CardResponse,
  type CardsResponse,
  type Ctx,
  type PackCardsResponse,
  type Params,
  type UserCardResponse,
  type UserCardsResponse,
  type UserCoinsResponse,
} from '../common';
import {
  type AddCardToCollectionInputType,
  type BuyPackInputType,
  type CreateCardInputType,
  type GetAllCardsByRarityInputType,
  type GetAllCardsInputType,
  type GetCardByIdInputType,
  type GetCardsByPackIdInputType,
  type GetCardsBySeasonAndUserIdInputType,
  type GetCardsBySeasonInputType,
  type GetRandomCardByRarityInputType,
  type GetRandomCardsInputType,
  type GetUserCollectionInputType,
  type GiveCardInputType,
  type GiveCoinsInputType,
  type RemoveCardFromCollectionInputType,
  type SetCoinsInputType,
  type WonderPickInputType,
} from '../schema/card.schema';
import { ErrorCodes, ErrorMessages, errorResponse } from '../services';
import {
  decreaseUserGemsHandler,
  getUserByDiscordIdHandler,
  getUserByIdHandler,
  getUserCardByNumberHandler,
  getUserGemsHandler,
} from './user.controller';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

// Id domain to handle errors
const domain = 'CARD';

/**
 * Get card by ID.
 *
 * @param ctx Ctx.
 * @param input GetCardByIdInputType.
 * @returns Card.
 */
export const getCardByIdHandler = async ({ ctx, input }: Params<GetCardByIdInputType>): Promise<CardResponse> => {
  try {
    const handlerId = 'getCardByIdHandler';
    const { id } = input;
    const card = await ctx.prisma.card.findUnique({ where: { id } });

    if (!card) return errorResponse(domain, handlerId, ErrorCodes.Card.NoCard, ErrorMessages.Card.NoCard);

    return {
      result: {
        status: Response.SUCCESS,
        card,
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
 * Create a card.
 *
 * @param ctx Ctx.
 * @param input CreateCardInputType.
 */
export const createCardHandler = async ({ ctx, input }: Params<CreateCardInputType>): Promise<CardCreateResponse> => {
  try {
    const handlerId = 'createCardHandler';
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
    if (!card) return errorResponse(domain, handlerId, ErrorCodes.Card.NoCreateCard, ErrorMessages.Card.NoCreateCard);

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
        message: ErrorMessages.Common.InvalidInput,
      });
    }

    // TRPC error (Custom error)
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
 * Give a card to a user.
 *
 * @param ctx Ctx.
 * @param input GiveCardInputType.
 * @returns User's card.
 */
export const giveCardHandler = async ({ ctx, input }: Params<GiveCardInputType>): Promise<UserCardWithCardResponse> => {
  try {
    const handlerId = 'giveCardHandler';
    const { senderId, recipientId, cardNumber, isFoil } = input;

    // Check if sender and recipient are the same
    if (senderId === recipientId)
      return errorResponse(
        domain,
        handlerId,
        ErrorCodes.User.GiveCardRecipientEqualsSender,
        ErrorMessages.User.GiveCardRecipientEqualsSender,
      );

    // Start transaction
    return await ctx.prisma.$transaction(async (prismaTransaction) => {
      // Get Sender user by Discord Id on Account table
      const senderResponse = await getUserByDiscordIdHandler({
        ctx: { ...ctx, prisma: prismaTransaction } as Ctx,
        input: { discordId: senderId },
      });

      if (senderResponse.result.status === Response.ERROR) return senderResponse as UserCardWithCardResponse;

      // Get Recipient user by Discord Id on Account table
      const recipientResponse = await getUserByDiscordIdHandler({
        ctx: { ...ctx, prisma: prismaTransaction } as Ctx,
        input: { discordId: recipientId },
      });

      if (recipientResponse.result.status === Response.ERROR) return recipientResponse as UserCardWithCardResponse;

      // Get sender's card
      const sender = senderResponse.result.user;
      const senderCardResponse = await getUserCardByNumberHandler({
        ctx: { ...ctx, prisma: prismaTransaction } as Ctx,
        input: { userId: sender.id, cardNumber, isFoil },
      });

      // Check if sender has the card
      if (senderCardResponse?.result.status === Response.ERROR) return senderCardResponse as UserCardWithCardResponse;

      // Check if sender has enough cards
      const senderCard = senderCardResponse?.result.userCard;
      if (senderCard && senderCard.quantity < 1)
        return errorResponse(
          domain,
          handlerId,
          ErrorCodes.Card.InsufficientCards,
          ErrorMessages.Card.InsufficientCards,
        );

      // Remove card from sender's collection
      const senderCardRemovedResponse = await removeCardFromCollectionHandler({
        ctx: { ...ctx, prisma: prismaTransaction } as Ctx,
        input: {
          userId: sender.id,
          cardId: senderCard?.cardId,
          quantity: 1,
          isFoil: senderCard?.isFoil,
        },
      });

      // Check if card was removed from sender's collection
      if (senderCardRemovedResponse?.result.status === Response.ERROR)
        return senderCardRemovedResponse as UserCardWithCardResponse;

      // Add card to recipient's collection
      const recipient = recipientResponse.result.user;
      const recipientCardResponse = await addCardToCollectionHandler({
        ctx: { ...ctx, prisma: prismaTransaction } as Ctx,
        input: {
          userId: recipient.id,
          cardId: senderCard?.cardId,
          quantity: 1,
          isFoil: senderCard?.isFoil,
        },
      });

      // Check if card was added to recipient's collection
      if (recipientCardResponse?.result.status === Response.ERROR) return recipientCardResponse;

      return {
        result: {
          status: Response.SUCCESS,
          userCard: recipientCardResponse?.result.userCard,
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

/**
 * Give coins to a user.
 *
 * @param ctx Ctx.
 * @param input GiveCoinsInputType.
 * @returns User's coins.
 */
export const giveCoinsHandler = async ({ ctx, input }: Params<GiveCoinsInputType>): Promise<UserCoinsResponse> => {
  try {
    const handlerId = 'giveCoinsHandler';
    const { senderId, recipientId, amount } = input;

    // Start transaction
    return await ctx.prisma.$transaction(async (prismaTransaction) => {
      // Get Sender user by Discord Id on Account table
      const senderResponse = await getUserByDiscordIdHandler({
        ctx: { ...ctx, prisma: prismaTransaction } as Ctx,
        input: { discordId: senderId },
      });

      // Check if sender exists
      if (senderResponse.result.status === Response.ERROR) return senderResponse as UserCoinsResponse;

      // Check if sender has enough coins
      const sender = senderResponse.result.user;
      if (!sender || sender.coins < amount)
        return errorResponse(domain, handlerId, ErrorCodes.Card.NoCoinsToGive, ErrorMessages.Card.NoCoinsToGive);

      // Get Recipient user by Discord Id on Account table
      const recipientResponse = await getUserByDiscordIdHandler({
        ctx: { ...ctx, prisma: prismaTransaction } as Ctx,
        input: { discordId: recipientId },
      });

      // Check if recipient exists
      if (recipientResponse.result.status === Response.ERROR) return recipientResponse as UserCoinsResponse;

      // Decrease sender's coins
      const senderUpdated = await prismaTransaction.user.update({
        where: {
          id: sender.id,
        },
        data: {
          coins: {
            decrement: amount,
          },
        },
      });

      // Check if sender's coins were updated
      if (!senderUpdated)
        return errorResponse(domain, handlerId, ErrorCodes.User.NoDecreaseCoins, ErrorMessages.User.NoDecreaseCoins);

      // Increase recipient's coins
      const recipient = recipientResponse.result.user;
      const recepientUpdated = await prismaTransaction.user.update({
        where: {
          id: recipient?.id,
        },
        data: {
          coins: {
            increment: amount,
          },
        },
      });

      // Check if recipient's coins were updated
      if (!recepientUpdated)
        return errorResponse(domain, handlerId, ErrorCodes.User.NoGiveCoins, ErrorMessages.User.NoGiveCoins);

      return {
        result: {
          status: Response.SUCCESS,
          coins: sender.coins - amount,
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

/**
 * Set coins to a user.
 *
 * @param ctx Ctx.
 * @param input SetCoinsInputType.
 * @returns User's coins.
 */
export const setCoinsHandler = async ({ ctx, input }: Params<SetCoinsInputType>): Promise<UserCoinsResponse> => {
  try {
    const handlerId = 'setCoinsHandler';
    const { discordId, amount } = input;

    // Get user by Discord Id on Account table
    const userResponse = await getUserByDiscordIdHandler({ ctx, input: { discordId } });

    // Check if user exists
    if (userResponse.result.status === Response.ERROR) return userResponse as UserCoinsResponse;

    // Increase user's coins
    const user = userResponse.result.user;
    const userUpdated = await ctx.prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        coins: amount,
      },
    });

    // Check if user's coins were updated
    if (!userUpdated)
      return errorResponse(domain, handlerId, ErrorCodes.User.NoSetCoins, ErrorMessages.User.NoSetCoins);

    return {
      result: {
        status: Response.SUCCESS,
        coins: userUpdated.coins,
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
 * Buy a pack of cards.
 *
 * @param ctx Ctx.
 * @param input BuyPackInputType.
 * @returns UserCardsResponse.
 */
export const buyPackHandler = async ({ ctx, input }: Params<BuyPackInputType>): Promise<UserCardsResponse> => {
  try {
    const handlerId = 'buyPackHandler';
    const { discordId } = input;
    const PACK_PRICE = await ctx.configService.getGlobalConfig<number>('PACK_PRICE', 100);
    const CARD_AMOUNT_PACK = await ctx.configService.getGlobalConfig<number>('CARD_AMOUNT_PACK', 3);
    const FOIL_PROBABILITY = await ctx.configService.getGlobalConfig<number>('FOIL_PROBABILITY', 0.04);

    // Start transaction
    return await ctx.prisma.$transaction(async (prismaTransaction) => {
      // Get user by Discord Id on Account table
      const userResponse = await getUserByDiscordIdHandler({
        ctx: { ...ctx, prisma: prismaTransaction } as Ctx,
        input: { discordId },
      });

      // Check if user exists
      if (userResponse.result.status === Response.ERROR) return userResponse as UserCardsResponse;

      // Check if user has enough coins
      const user = userResponse.result.user;
      if (!user || user.coins < PACK_PRICE)
        return errorResponse(domain, handlerId, ErrorCodes.User.NoCoins, ErrorMessages.User.NoCoins);

      // Get random cards
      const randomCardsResponse = await getRandomCardsHandler({
        ctx: { ...ctx, prisma: prismaTransaction } as Ctx,
        input: {
          amount: CARD_AMOUNT_PACK,
        },
      });

      // Check if cards were selected
      if (randomCardsResponse?.result.status === Response.ERROR)
        return errorResponse(
          domain,
          handlerId,
          ErrorCodes.Card.RandomCardsNotFound,
          ErrorMessages.Card.RandomCardsNotFound,
        );

      const randomCards = randomCardsResponse?.result.cards;
      if (!randomCards || randomCards.length === 0)
        return errorResponse(
          domain,
          handlerId,
          ErrorCodes.Card.RandomCardsNotFound,
          ErrorMessages.Card.RandomCardsNotFound,
        );

      const userCards: Array<UserCard> = [];

      // Add cards to user's collection one by one
      for (const card of randomCards) {
        // Check if card is foil
        const isFoil = Math.random() < FOIL_PROBABILITY;

        // Add user card
        const newAddedCardResponse = await addCardToCollectionHandler({
          ctx: { ...ctx, prisma: prismaTransaction } as Ctx,
          input: {
            userId: user.id,
            cardId: card?.id,
            quantity: 1,
            isFoil,
          },
        });

        // Check if card was added to user's collection
        if (newAddedCardResponse.result.status === Response.ERROR) return newAddedCardResponse as UserCardsResponse;

        userCards.push(newAddedCardResponse.result.userCard);
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
          userCards,
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

/**
 * Get all cards.
 *
 * @param ctx Ctx.
 * @param input GetAllCardsInputType.
 * @returns All cards.
 */
export const getAllCardsHandler = async ({ ctx }: Params<GetAllCardsInputType>): Promise<CardsResponse> => {
  try {
    const handlerId = 'getAllCardsHandler';

    // Get all cards
    const cards = await ctx.prisma.card.findMany();

    // Check if cards were found
    if (!cards || cards.length === 0)
      return errorResponse(domain, handlerId, ErrorCodes.Card.NoCards, ErrorMessages.Card.NoCards);

    return {
      result: {
        status: Response.SUCCESS,
        cards,
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
 * Get all cards by season.
 *
 * @param ctx Ctx.
 * @param input GetCardsBySeasonInputType.
 * @returns Cards by season.
 */
export const getCardsBySeasonHandler = async ({
  ctx,
  input,
}: Params<GetCardsBySeasonInputType>): Promise<CardsResponse> => {
  try {
    const handlerId = 'getCardsBySeasonHandler';
    const { seasonId } = input;

    // Get all cards by season
    const cards = await ctx.prisma.card.findMany({
      where: {
        seasonId,
      },
      orderBy: {
        cardNumber: OrderBy.ASC,
      },
    });

    // Check if cards were found
    if (!cards || cards.length === 0)
      return errorResponse(domain, handlerId, ErrorCodes.Card.NoCardsBySeason, ErrorMessages.Card.NoCardsBySeason);

    return {
      result: {
        status: Response.SUCCESS,
        cards,
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
 * Get all cards by season and user ID.
 *
 * @param ctx Ctx.
 * @param input GetCardsBySeasonAndUserIdInputType.
 * @returns Cards by season and user ID.
 */
export const getCardsBySeasonAndUserIdHandler = async ({
  ctx,
  input,
}: Params<GetCardsBySeasonAndUserIdInputType>): Promise<UserCardsResponse> => {
  try {
    const handlerId = 'getCardsBySeasonAndUserIdHandler';
    const { seasonId, userId } = input;

    // Get all cards by season and user ID
    const userCards = await ctx.prisma.userCard.findMany({
      where: {
        userId,
        card: {
          seasonId,
        },
      },
    });

    // Check if cards were found
    if (!userCards || userCards.length === 0)
      return errorResponse(
        domain,
        handlerId,
        ErrorCodes.Card.NoCardsBySeasonAndUserId,
        ErrorMessages.Card.NoCardsBySeasonAndUserId,
      );

    return {
      result: {
        status: Response.SUCCESS,
        userCards,
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
 * Get cards by pack ID.
 *
 * @param ctx Ctx.
 * @param input GetCardsByPackIdInputType.
 * @returns Cards by pack ID.
 */
export const getCardsByPackIdHandler = async ({
  ctx,
  input,
}: Params<GetCardsByPackIdInputType>): Promise<PackCardsResponse> => {
  try {
    const handlerId = 'getCardsByPackIdHandler';
    const { packId } = input;

    // Get cards by pack ID
    const packCards = await ctx.prisma.packCard.findMany({
      where: {
        packId,
      },
      include: {
        card: true,
      },
    });

    // Check if cards were found
    if (!packCards || packCards.length === 0)
      return errorResponse(domain, handlerId, ErrorCodes.Card.NoCardsByPackId, ErrorMessages.Card.NoCardsByPackId);

    return {
      result: {
        status: Response.SUCCESS,
        packCards,
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
 * Get all cards by rarity.
 *
 * @param ctx Ctx.
 * @param input GetAllCardsByRarityInputType.
 * @returns Cards by rarity.
 */
export const getAllCardsByRarityHandler = async ({
  ctx,
  input,
}: Params<GetAllCardsByRarityInputType>): Promise<CardsResponse> => {
  try {
    const handlerId = 'getAllCardsByRarityHandler';
    const { rarity } = input;

    // Get all cards by rarity
    const cards = await ctx.prisma.card.findMany({
      where: {
        rarity,
      },
    });

    if (!cards || cards.length === 0)
      return errorResponse(domain, handlerId, ErrorCodes.Card.NoCardsByRarety, ErrorMessages.Card.NoCardsByRarety);

    return {
      result: {
        status: Response.SUCCESS,
        cards,
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
 * Get random cards.
 *
 * @param ctx Ctx.
 * @param input GetRandomCardsInputType.
 * @returns Random cards.
 */
export const getRandomCardsHandler = async ({
  ctx,
  input,
}: Params<GetRandomCardsInputType>): Promise<CardsResponse> => {
  try {
    const handlerId = 'getRandomCardsHandler';
    const { amount } = input;

    // Select random cards by amount
    const randomCards = [];
    for (let i = 0; i < amount; i++) {
      const randomCardByRarityResponse = await getRandomCardByRarityHandler({
        ctx,
        input: {
          rarity: getRandomRarity(),
        },
      });

      if (randomCardByRarityResponse.result.status === Response.ERROR)
        return randomCardByRarityResponse as CardsResponse;

      const randomCard = randomCardByRarityResponse?.result.card;
      randomCards.push(randomCard);
    }

    // Check if cards were selected
    if (!randomCards || randomCards.length === 0)
      return errorResponse(
        domain,
        handlerId,
        ErrorCodes.Card.RandomCardsNotFound,
        ErrorMessages.Card.RandomCardsNotFound,
      );

    return {
      result: {
        status: Response.SUCCESS,
        cards: randomCards,
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
 * User can get one of the cards (chosen randomly) from a
 * booster pack that was opened by another user. NOTE: That
 * player will not lose any cards.
 *
 * @param ctx Ctx.
 * @param input WonderPickInputType.
 * @returns Random Card got by wonder pick.
 */
export const wonderPickHandler = async ({
  ctx,
  input,
}: Params<WonderPickInputType>): Promise<UserCardWithCardResponse> => {
  try {
    const handlerId = 'wonderPickHandler';
    const { discordId, position, cards } = input;

    const GEMS_COST = await ctx.configService.getGlobalConfig<number>('GEM_COST_TO_GET_RANDOM_CARD', 1);

    if (!cards || cards.length === 0)
      return errorResponse(domain, handlerId, ErrorCodes.Card.NoCards, ErrorMessages.Card.NoCards);

    return await ctx.prisma.$transaction(
      async (prismaTransaction) => {
        // Get user gems
        const userResponse = await getUserGemsHandler({
          ctx: { ...ctx, prisma: prismaTransaction } as Ctx,
          input: { discordId },
        });

        if (userResponse.result.status === Response.ERROR) return userResponse as UserCardWithCardResponse;

        // Check if user has enough gems
        const userGems = userResponse?.result.gems;
        if (userGems && userGems < GEMS_COST)
          return errorResponse(domain, handlerId, ErrorCodes.User.NoGems, ErrorMessages.User.NoGems);

        // Get random card from user pack
        const shuffledCards = cards.sort(() => Math.random() - 0.5);
        const selectedCardIndex = parseInt(position, 10) - 1;
        const selectedCard = shuffledCards[selectedCardIndex];

        // Get card by ID
        const cardResponse = await getCardByIdHandler({
          ctx: { ...ctx, prisma: prismaTransaction } as Ctx,
          input: { id: selectedCard as string },
        });
        if (cardResponse.result.status === Response.ERROR) return cardResponse as UserCardWithCardResponse;

        // Add card to user collection
        const randomCard = cardResponse.result.card;
        const userId = userResponse?.result.userId;
        const addCardToCollectionResponse = await addCardToCollectionHandler({
          ctx: { ...ctx, prisma: prismaTransaction } as Ctx,
          input: { userId, cardId: randomCard?.id, quantity: 1, isFoil: false },
        });

        // Check if card was added to user collection
        if (addCardToCollectionResponse.result.status === Response.ERROR) return addCardToCollectionResponse;

        // Decrease user gems
        await decreaseUserGemsHandler({
          ctx: { ...ctx, prisma: prismaTransaction } as Ctx,
          input: { discordId, gems: GEMS_COST },
        });

        return {
          result: {
            status: Response.SUCCESS,
            userCard: addCardToCollectionResponse.result.userCard,
          },
        };
      },
      {
        timeout: 10000,
        maxWait: 10000,
      },
    );
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
 * Get random card by rarity.
 *
 * @param ctx Ctx.
 * @param input GetRandomCardByRarityInputType.
 * @returns Random card.
 */
export const getRandomCardByRarityHandler = async ({
  ctx,
  input,
}: Params<GetRandomCardByRarityInputType>): Promise<CardResponse> => {
  try {
    const handlerId = 'getRandomCardByRarityHandler';
    const { rarity } = input;

    // Get all cards by rarity
    const cardsResponse = await getAllCardsByRarityHandler({
      ctx,
      input: {
        rarity,
      },
    });

    if (cardsResponse.result.status === Response.ERROR) return cardsResponse as CardResponse;
    if (!cardsResponse.result.cards || cardsResponse.result.cards.length === 0)
      return errorResponse(domain, handlerId, ErrorCodes.Card.NoCardsByRarety, ErrorMessages.Card.NoCardsByRarety);

    const { cards: allCardsByRarity } = cardsResponse.result;
    const randomIndex = Math.floor(Math.random() * allCardsByRarity.length);
    const randomCard = allCardsByRarity[randomIndex] as Card;

    return {
      result: {
        status: Response.SUCCESS,
        card: randomCard,
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
 * Get user collection.
 *
 * @param ctx Ctx.
 * @param input GetCollectionInputType.
 * @returns User's collection.
 */
export const getUserCollectionHandler = async ({
  ctx,
  input,
}: Params<GetUserCollectionInputType>): Promise<UserCardsResponse> => {
  try {
    const handlerId = 'getUserCollectionHandler';
    const { userId, sortBy, orderBy } = input;

    // Check if user exists
    const userResponse = await getUserByIdHandler({ ctx, input: { id: userId } });
    if (userResponse.result.status === Response.ERROR) return userResponse as UserCardsResponse;

    // Get user's collection
    const user = userResponse.result.user;
    const userCards = await ctx.prisma.userCard.findMany({
      where: {
        userId: user?.id,
      },
      include: {
        card: true,
      },
      orderBy: [...getSortingOptions(sortBy, orderBy)],
    });

    if (!userCards || userCards.length === 0)
      return errorResponse(domain, handlerId, ErrorCodes.User.NoUserCards, ErrorMessages.User.NoUserCards);

    return {
      result: {
        status: Response.SUCCESS,
        userCards,
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
 * Add card to user collection.
 *
 * @param ctx Ctx.
 * @param input AddCardToCollectionInputType.
 * @returns User's new card.
 */
export const addCardToCollectionHandler = async ({
  ctx,
  input,
}: Params<AddCardToCollectionInputType>): Promise<UserCardWithCardResponse> => {
  try {
    const handlerId = 'addCardToCollectionHandler';
    const { userId, cardId, quantity = 1, isFoil = false } = input;

    // Get user
    const userResponse = await getUserByIdHandler({ ctx, input: { id: userId } });
    if (!userResponse || !userResponse.result || userResponse.result.status === Response.ERROR)
      return errorResponse(domain, handlerId, ErrorCodes.User.NoUser, ErrorMessages.User.NoUser);

    // Add or update user card
    const user = userResponse.result.user;
    // TODO: Continuar aqui
    console.log('user', user);
    console.log('cardId', cardId);
    const userCard = await ctx.prisma.userCard.upsert({
      where: {
        userId_cardId_isFoil: {
          userId: user?.id,
          cardId,
          isFoil,
        },
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        userId: user?.id,
        cardId,
        isFoil,
        quantity,
      },
      include: {
        card: true,
      },
    });

    console.log('userCard', userCard);

    // Check if card was added to user
    if (!userCard)
      return errorResponse(
        domain,
        handlerId,
        ErrorCodes.Card.NoAddCardToUserCollection,
        ErrorMessages.Card.NoAddCardToUserCollection,
      );

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
 * Remove card from user collection.
 *
 * @param ctx Ctx.
 * @param input RemoveCardFromCollectionInputType.
 * @returns User's updated card.
 */
export const removeCardFromCollectionHandler = async ({
  ctx,
  input,
}: Params<RemoveCardFromCollectionInputType>): Promise<UserCardResponse> => {
  try {
    const handlerId = 'removeCardFromCollectionHandler';
    const { userId, cardId, quantity = 1 } = input;

    // Get user
    const userResponse = await getUserByIdHandler({ ctx, input: { id: userId } });
    if (userResponse.result.status === Response.ERROR) return userResponse as UserCardResponse;

    // Get user card
    const user = userResponse.result.user;
    const userCard = await ctx.prisma.userCard.findFirst({
      where: { userId: user?.id, cardId },
    });
    if (!userCard) return errorResponse(domain, handlerId, ErrorCodes.Card.NoCard, ErrorMessages.Card.NoCard);

    // Calculate new quantity
    const newQuantity = userCard.quantity - quantity;

    // If new quantity is 0 or less, delete the record
    if (newQuantity <= 0) {
      const deletedUserCard = await ctx.prisma.userCard.delete({
        where: { id: userCard.id },
      });

      return {
        result: {
          status: Response.SUCCESS,
          userCard: deletedUserCard,
        },
      };
    }

    // Otherwise update the quantity
    const updatedUserCard = await ctx.prisma.userCard.update({
      where: { id: userCard.id },
      data: { quantity: newQuantity },
    });

    return {
      result: {
        status: Response.SUCCESS,
        userCard: updatedUserCard,
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
