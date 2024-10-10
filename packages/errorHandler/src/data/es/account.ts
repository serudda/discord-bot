export enum AccountError {
  AccountNotCreated = 'AccountNotCreated',
  DiscordUserNotFound = 'DiscordUserNotFound',
}

export const AccountErrors: Record<AccountError, string> = {
  [AccountError.AccountNotCreated]: 'Algo ha sucedido, no pudimos crear la cuenta del usuario',
  [AccountError.DiscordUserNotFound]: 'No logre encontrar al usuario de Discord. Algo anda mal con el ID proporcionado',
};
