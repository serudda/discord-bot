import { z, type TypeOf } from 'zod';

/*------------------------------------*/

export const getAllSeasonsInput = z.object({});
export type GetAllSeasonsInputType = TypeOf<typeof getAllSeasonsInput>;

/*------------------------------------*/

export const getSeasonByIdInput = z.object({
  seasonId: z.string(),
});
export type GetSeasonByIdInputType = TypeOf<typeof getSeasonByIdInput>;

/*------------------------------------*/

export const getCurrentSeasonInput = z.object({});
export type GetCurrentSeasonInputType = TypeOf<typeof getCurrentSeasonInput>;

/*------------------------------------*/

export const getSeasonsByDateInput = z.object({
  startDate: z.string(),
  endDate: z.string(),
});
export type GetSeasonsByDateInputType = TypeOf<typeof getSeasonsByDateInput>;
