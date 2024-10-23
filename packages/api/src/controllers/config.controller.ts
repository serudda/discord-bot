import { CommonError, UserError } from '@discord-bot/error-handler';
import { Response, TRPCErrorCode, type Params } from '../common';
import type { GetConfigInputType } from '../schema/config.schema';
import { TRPCError } from '@trpc/server';

/**
 * Get global configuration.
 *
 * @param ctx Ctx.
 * @param input GetConfigInputType.
 * @returns global configuration.
 */
export const getConfigHandler = async ({ ctx }: Params<GetConfigInputType>) => {
  try {
    // Get global configuration
    const config = await ctx.prisma.config.findMany();

    // Check if configuration was found
    if (!config || config.length === 0) {
      return {
        result: {
          status: Response.ERROR,
          message: CommonError.ConfigNotFound,
        },
      };
    }

    return {
      result: {
        status: Response.SUCCESS,
        config,
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
