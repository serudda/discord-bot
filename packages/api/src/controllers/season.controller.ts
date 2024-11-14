import { Response, TRPCErrorCode, type Params, type SeasonResponse, type SeasonsResponse } from '../common';
import type {
  GetAllSeasonsInputType,
  GetCurrentSeasonInputType,
  GetSeasonByIdInputType,
  GetSeasonsByDateInputType,
} from '../schema/season.schema';
import { ErrorCodes, ErrorMessages, errorResponse } from '../services';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

// Id domain to handle errors
const domain = 'SEASON';

/**
 * Get all seasons.
 *
 * @param ctx Ctx.
 * @param input GetAllSeasonsInputType.
 * @returns All seasons.
 */
export const getAllSeasonsHandler = async ({ ctx }: Params<GetAllSeasonsInputType>): Promise<SeasonsResponse> => {
  try {
    const handlerId = 'getAllSeasonsHandler';
    // Get all seasons
    const seasons = await ctx.prisma.season.findMany();

    // Check if seasons were found
    if (!seasons || seasons.length === 0)
      return errorResponse(domain, handlerId, ErrorCodes.Season.NoSeasons, ErrorMessages.Season.NoSeasons);

    return {
      result: {
        status: Response.SUCCESS,
        seasons,
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
 * Get season by ID.
 *
 * @param ctx Ctx.
 * @param input GetSeasonByIdInputType.
 * @returns Season by ID.
 */
export const getSeasonByIdHandler = async ({ ctx, input }: Params<GetSeasonByIdInputType>): Promise<SeasonResponse> => {
  try {
    const handlerId = 'getSeasonByIdHandler';
    const { seasonId } = input;

    // Get season by ID
    const season = await ctx.prisma.season.findUnique({
      where: {
        id: seasonId,
      },
    });

    // Check if season was found
    if (!season) return errorResponse(domain, handlerId, ErrorCodes.Season.NoSeason, ErrorMessages.Season.NoSeason);

    return {
      result: {
        status: Response.SUCCESS,
        season,
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
 * Get current season.
 *
 * @param ctx Ctx.
 * @param input GetCurrentSeasonInputType.
 * @returns Current season.
 */
export const getCurrentSeasonHandler = async ({ ctx }: Params<GetCurrentSeasonInputType>): Promise<SeasonResponse> => {
  try {
    const handlerId = 'getCurrentSeasonHandler';
    // Get current season
    const season = await ctx.prisma.season.findFirst({
      where: {
        startDate: {
          lte: new Date(),
        },
        endDate: {
          gte: new Date(),
        },
      },
    });

    // Check if season was found
    if (!season) return errorResponse(domain, handlerId, ErrorCodes.Season.NoSeason, ErrorMessages.Season.NoSeason);

    return {
      result: {
        status: Response.SUCCESS,
        season,
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
 * Get seasons by date.
 *
 * @param ctx Ctx.
 * @param input GetSeasonsByDateInputType.
 * @returns Seasons by date.
 */
export const getSeasonsByDateHandler = async ({
  ctx,
  input,
}: Params<GetSeasonsByDateInputType>): Promise<SeasonsResponse> => {
  try {
    const handlerId = 'getSeasonsByDateHandler';
    const { startDate, endDate } = input;

    // Get seasons by date
    const seasons = await ctx.prisma.season.findMany({
      where: {
        startDate: {
          gte: new Date(startDate),
        },
        endDate: {
          lte: new Date(endDate),
        },
      },
    });

    // Check if seasons were found
    if (!seasons || seasons.length === 0)
      return errorResponse(domain, handlerId, ErrorCodes.Season.NoSeasons, ErrorMessages.Season.NoSeasons);

    return {
      result: {
        status: Response.SUCCESS,
        seasons,
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
