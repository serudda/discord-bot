import { CardError, CardErrors } from './card';
import { CommonError, CommonErrors } from './common';

export * from './card';
export * from './common';

export type ErrorCode = CommonError | CardError;

export const ErrorMessages: Record<ErrorCode, string> = {
  ...CommonErrors,
  ...CardErrors,
};
