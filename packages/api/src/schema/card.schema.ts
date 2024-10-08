import { Rarity } from '../common';
import { z, type TypeOf } from 'zod';

/*------------------------------------*/

export const buyPackInput = z.object({
  discordId: z.string(),
});
export type BuyPackInputType = TypeOf<typeof buyPackInput>;

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

export const giveCoinsInput = z.object({
  discordId: z.string(),
  amount: z.number(),
});
export type GiveCoinsInputType = TypeOf<typeof giveCoinsInput>;
