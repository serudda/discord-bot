import { Response, TRPCErrorCode, type Params } from '../common';
import type { GetConfigInputType } from '../schema/config.schema';
import { ErrorCodes, ErrorMessages, errorResponse } from '../services';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

// Id domain to handle errors
const domain = 'CONFIG';

/**
 * Get global configuration.
 *
 * @param ctx Ctx.
 * @param input GetConfigInputType.
 * @returns global configuration.
 */
export const getConfigHandler = async ({ ctx }: Params<GetConfigInputType>) => {
  try {
    const handlerId = 'getConfigHandler';
    // Get global configuration
    const config = await ctx.prisma.config.findMany();

    // Check if configuration was found
    if (!config || config.length === 0)
      return errorResponse(domain, handlerId, ErrorCodes.Common.ConfigNotFound, ErrorMessages.Common.ConfigNotFound);

    return {
      result: {
        status: Response.SUCCESS,
        config,
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
