export enum AccountError {
  AccountNotCreated = 'AccountNotCreated',
}

export const AccountErrors: Record<AccountError, string> = {
  [AccountError.AccountNotCreated]: 'Algo ha sucedido, no pudimos crear la cuenta del usuario',
};
