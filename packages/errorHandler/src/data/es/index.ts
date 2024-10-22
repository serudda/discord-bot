import type { AccountError } from './account';
import { AccountErrors } from './account';
import type { CardError } from './card';
import { CardErrors } from './card';
import type { CommonError } from './common';
import { CommonErrors } from './common';
import type { SeasonError } from './season';
import { SeasonErrors } from './season';
import type { UserError } from './user';
import { UserErrors } from './user';

export * from './account';
export * from './card';
export * from './common';
export * from './season';
export * from './user';

export type ErrorCode = AccountError | CardError | CommonError | SeasonError | UserError;

export const ErrorMessages: Record<ErrorCode, string> = {
  ...AccountErrors,
  ...CardErrors,
  ...CommonErrors,
  ...SeasonErrors,
  ...UserErrors,
};
