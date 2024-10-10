import { AccountError, AccountErrors } from './account';
import { CardError, CardErrors } from './card';
import { CommonError, CommonErrors } from './common';
import { UserError, UserErrors } from './user';

export * from './account';
export * from './card';
export * from './common';
export * from './user';

export type ErrorCode = AccountError | CommonError | CardError | UserError;

export const ErrorMessages: Record<ErrorCode, string> = {
  ...AccountErrors,
  ...CommonErrors,
  ...CardErrors,
  ...UserErrors,
};
