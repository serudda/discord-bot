import { Rarity } from '../common';
import { z, type TypeOf } from 'zod';

/*------------------------------------*/

export const buyPackInput = z.object({
  discordId: z.string(),
});
export type BuyPackInputType = TypeOf<typeof buyPackInput>;

/*------------------------------------*/

export const getAllCardsInput = z.object({});
export type GetAllCardsInputType = TypeOf<typeof getAllCardsInput>;

/*------------------------------------*/

export const getAllCardsByRarityInput = z.object({
  rarity: z.nativeEnum(Rarity),
});
export type GetAllCardsByRarityInputType = TypeOf<typeof getAllCardsByRarityInput>;

/*------------------------------------*/

export const getRandomCardsInput = z.object({
  amount: z.number(),
});
export type GetRandomCardsInputType = TypeOf<typeof getRandomCardsInput>;

/*------------------------------------*/

export const getRandomCardByRarityInput = z.object({
  rarity: z.nativeEnum(Rarity),
});
export type GetRandomCardByRarityInputType = TypeOf<typeof getRandomCardByRarityInput>;

/*------------------------------------*/

export const addCoinsInput = z.object({
  senderId: z.string(),
  recipientId: z.string(),
  amount: z.number(),
});
export type AddCoinsInputType = TypeOf<typeof addCoinsInput>;

/*------------------------------------*/

export const setCoinsInput = z.object({
  discordId: z.string(),
  amount: z.number(),
});
export type SetCoinsInputType = TypeOf<typeof setCoinsInput>;

/*------------------------------------*/

export const createCardInput = z.object({
  name: z.string(),
  description: z.string(),
  rarity: z.nativeEnum(Rarity),
  imageUrl: z.string(),
});
export type CreateCardInputType = TypeOf<typeof createCardInput>;

/*------------------------------------*/

export const getCollectionInput = z.object({
  discordId: z.string(),
});
export type GetCollectionInputType = TypeOf<typeof getCollectionInput>;

/*------------------------------------*/

export const addCardToCollectionInput = z.object({
  userId: z.string(),
  cardId: z.string(),
  quantity: z.number().optional().default(1),
  isFoil: z.boolean().optional().default(false),
});
export type AddCardToCollectionInputType = TypeOf<typeof addCardToCollectionInput>;
