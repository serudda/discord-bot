import { OrderBy, Rarity, SortField } from '../common';
import { z, type TypeOf } from 'zod';

/*------------------------------------*/

export const buyPackInput = z.object({
  discordId: z.string(),
});
export type BuyPackInputType = TypeOf<typeof buyPackInput>;

/*------------------------------------*/

export const getCardByIdInput = z.object({
  id: z.string(),
});
export type GetCardByIdInputType = TypeOf<typeof getCardByIdInput>;

/*------------------------------------*/

export const getAllCardsInput = z.object({});
export type GetAllCardsInputType = TypeOf<typeof getAllCardsInput>;

/*------------------------------------*/

export const getCardsBySeasonInput = z.object({
  seasonId: z.string(),
});
export type GetCardsBySeasonInputType = TypeOf<typeof getCardsBySeasonInput>;

/*------------------------------------*/

export const getCardsBySeasonAndUserIdInput = z.object({
  seasonId: z.string(),
  userId: z.string(),
});
export type GetCardsBySeasonAndUserIdInputType = TypeOf<typeof getCardsBySeasonAndUserIdInput>;

/*------------------------------------*/

export const getCardsByPackIdInput = z.object({
  packId: z.string(),
});
export type GetCardsByPackIdInputType = TypeOf<typeof getCardsByPackIdInput>;

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

export const wonderPickInput = z.object({
  discordId: z.string(),
  position: z.string(),
  cards: z.array(z.string()),
});
export type WonderPickInputType = TypeOf<typeof wonderPickInput>;

/*------------------------------------*/

export const giveCardInput = z.object({
  senderId: z.string(),
  recipientId: z.string(),
  cardNumber: z.number(),
  isFoil: z.boolean().optional().default(false),
});
export type GiveCardInputType = TypeOf<typeof giveCardInput>;

/*------------------------------------*/

export const giveCoinsInput = z.object({
  senderId: z.string(),
  recipientId: z.string(),
  amount: z.number(),
});
export type GiveCoinsInputType = TypeOf<typeof giveCoinsInput>;

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

export const getUserCollectionInput = z.object({
  userId: z.string(),
  sortBy: z.nativeEnum(SortField).optional(),
  orderBy: z.nativeEnum(OrderBy).optional(),
});
export type GetUserCollectionInputType = TypeOf<typeof getUserCollectionInput>;

/*------------------------------------*/

export const addCardToCollectionInput = z.object({
  userId: z.string(),
  cardId: z.string(),
  quantity: z.number().optional().default(1),
  isFoil: z.boolean().optional().default(false),
});
export type AddCardToCollectionInputType = TypeOf<typeof addCardToCollectionInput>;

/*------------------------------------*/

export const removeCardFromCollectionInput = z.object({
  userId: z.string(),
  cardId: z.string(),
  quantity: z.number().optional().default(1),
  isFoil: z.boolean().optional().default(false),
});
export type RemoveCardFromCollectionInputType = TypeOf<typeof removeCardFromCollectionInput>;
