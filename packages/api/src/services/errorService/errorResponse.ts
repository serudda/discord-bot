import { Response } from '../../common';
import type { ErrorResponse } from './types';

export const errorResponse = (domain: string, handler: string, code: string, message: string): ErrorResponse => ({
  result: {
    status: Response.ERROR,
    error: {
      code,
      domain,
      handler,
      message,
    },
  },
});
