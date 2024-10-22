import { CommonError, SeasonError, UserError } from '@discord-bot/error-handler';
import { Response, TRPCErrorCode, type Params } from '../common';
import type {
  GetAllSeasonsInputType,
  GetCurrentSeasonInputType,
  GetSeasonByIdInputType,
  GetSeasonsByDateInputType,
} from '../schema/season.schema';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

/**
 * Get all seasons.
 *
 * @param ctx Ctx.
 * @param input GetAllSeasonsInputType.
 * @returns All seasons.
 */
export const getAllSeasonsHandler = async ({ ctx }: Params<GetAllSeasonsInputType>) => {
  try {
    // Get all seasons
    const seasons = await ctx.prisma.season.findMany();

    // Check if seasons were found
    if (!seasons || seasons.length === 0) {
      return {
        result: {
          status: Response.ERROR,
          message: SeasonError.SeasonsNotFound,
        },
      };
    }

    return {
      result: {
        status: Response.SUCCESS,
        seasons,
      },
    };
  } catch (error: unknown) {
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
 * Get season by ID.
 *
 * @param ctx Ctx.
 * @param input GetSeasonByIdInputType.
 * @returns Season by ID.
 */
export const getSeasonByIdHandler = async ({ ctx, input }: Params<GetSeasonByIdInputType>) => {
  try {
    const { seasonId } = input;

    // Get season by ID
    const season = await ctx.prisma.season.findUnique({
      where: {
        id: seasonId,
      },
    });

    // Check if season was found
    if (!season) {
      return {
        result: {
          status: Response.ERROR,
          message: SeasonError.SeasonNotFound,
        },
      };
    }

    return {
      result: {
        status: Response.SUCCESS,
        season,
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
 * Get current season.
 *
 * @param ctx Ctx.
 * @param input GetCurrentSeasonInputType.
 * @returns Current season.
 */
export const getCurrentSeasonHandler = async ({ ctx }: Params<GetCurrentSeasonInputType>) => {
  try {
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
    if (!season) {
      return {
        result: {
          status: Response.ERROR,
          message: SeasonError.SeasonNotFound,
        },
      };
    }

    return {
      result: {
        status: Response.SUCCESS,
        season,
      },
    };
  } catch (error: unknown) {
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
 * Get seasons by date.
 *
 * @param ctx Ctx.
 * @param input GetSeasonsByDateInputType.
 * @returns Seasons by date.
 */
export const getSeasonsByDateHandler = async ({ ctx, input }: Params<GetSeasonsByDateInputType>) => {
  try {
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
    if (!seasons || seasons.length === 0) {
      return {
        result: {
          status: Response.ERROR,
          message: SeasonError.SeasonsNotFound,
        },
      };
    }

    return {
      result: {
        status: Response.SUCCESS,
        seasons,
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
