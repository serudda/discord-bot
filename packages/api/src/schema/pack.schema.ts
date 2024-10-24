import { z, type TypeOf } from 'zod';

/*------------------------------------*/

export const createPackInput = z.object({
  seasonId: z.string(),
  userId: z.string(),
});
export type CreatePackInputType = TypeOf<typeof createPackInput>;

/*------------------------------------*/

export const createPackWithCardsInput = z.object({
  seasonId: z.string(),
  userId: z.string(),
});
export type CreatePackWithCardsInputType = TypeOf<typeof createPackWithCardsInput>;

/*------------------------------------*/

export const buyPackInput = z.object({
  discordId: z.string(),
});
export type BuyPackInputType = TypeOf<typeof buyPackInput>;

/*------------------------------------*/

export const getPackByIdInput = z.object({
  packId: z.string(),
});
export type GetPackByIdInputType = TypeOf<typeof getPackByIdInput>;

/*------------------------------------*/

export const getUserPackByIdInput = z.object({
  userId: z.string(),
  packId: z.string(),
});
export type GetUserPackByIdInputType = TypeOf<typeof getUserPackByIdInput>;

/*------------------------------------*/

export const getAllPacksByUserIdInput = z.object({
  userId: z.string(),
});
export type GetAllPacksByUserIdInputType = TypeOf<typeof getAllPacksByUserIdInput>;

/*------------------------------------*/
