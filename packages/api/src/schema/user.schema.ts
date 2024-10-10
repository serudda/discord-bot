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

export const createUserInput = z.object({
  name: z.string(),
  email: z.string().optional(),
  image: z.string().default(''),
});
export type CreateUserInputType = TypeOf<typeof createUserInput>;

/*------------------------------------*/
