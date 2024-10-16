export enum UserError {
  UnAuthorized = 'UnAuthorized',
  SenderNotFound = 'SenderNotFound',
  ReceiverNotFound = 'ReceiverNotFound',
  UserNotFound = 'UserNotFound',
  UserNotCreated = 'UserNotCreated',
  UserAlreadyExists = 'UserAlreadyExists',
}

export const UserErrors: Record<UserError, string> = {
  [UserError.UnAuthorized]: 'No estas autorizado para realizar esta acción',
  [UserError.SenderNotFound]: 'No logre encontrar tu usuario, verifica que coleccionas cartas',
  [UserError.ReceiverNotFound]: 'No logre encontrar al usuario receptor, verifica que colecciona cartas',
  [UserError.UserNotFound]: 'No logre encontrar al usuario, verifica que colecciona cartas',
  [UserError.UserNotCreated]: 'Algo ha sucedido, no pudimos crear al usuario',
  [UserError.UserAlreadyExists]: 'Este usuarios ya existe',
};
