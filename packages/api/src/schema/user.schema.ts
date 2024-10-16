import { z, type TypeOf } from 'zod';

/*------------------------------------*/

export const getUserByIdInput = z.object({
  id: z.string(),
});
export type GetUserByIdInputType = TypeOf<typeof getUserByIdInput>;

/*------------------------------------*/

export const getUserByDiscordIdInput = z.object({
  discordId: z.string(),
});
export type GetUserByDiscordIdInputType = TypeOf<typeof getUserByDiscordIdInput>;

/*------------------------------------*/

export const getUserByEmailInput = z.object({
  email: z.string(),
});
export type GetUserByEmailInputType = TypeOf<typeof getUserByEmailInput>;

/*------------------------------------*/

export const getUserByUsernameInput = z.object({
  username: z.string(),
});
export type GetUserByUsernameInputType = TypeOf<typeof getUserByUsernameInput>;

/*------------------------------------*/

export const createUserInput = z.object({
  name: z.string(),
  username: z.string(),
  email: z.string().optional(),
  image: z.string().default(''),
  coins: z.number().default(0),
});
export type CreateUserInputType = TypeOf<typeof createUserInput>;

/*------------------------------------*/

export const registerUserInput = z.object({
  name: z.string(),
  username: z.string(),
  email: z.string().optional(),
  image: z.string().default(''),
  discordId: z.string(),
});
export type RegisterUserInputType = TypeOf<typeof registerUserInput>;

/*------------------------------------*/

export const getUserCoinsInput = z.object({
  discordId: z.string(),
});
export type GetUserCoinsInputType = TypeOf<typeof getUserCoinsInput>;

/*------------------------------------*/
