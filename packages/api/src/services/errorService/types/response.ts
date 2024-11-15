import type { Response } from '../../../common';

export interface ErrorDetail {
  code: string;
  domain: string;
  handler: string;
  message: string;
}

export interface ErrorResponse {
  result: {
    status: Response.ERROR;
    error: ErrorDetail;
  };
}
