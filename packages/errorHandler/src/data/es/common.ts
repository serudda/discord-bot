export enum CommonError {
  InvalidInput = 'InvalidInput',
  UnAuthorized = 'UnAuthorized',
  Unknown = 'Unknown',
  UserNotFound = 'UserNotFound',
}

export const CommonErrors: Record<CommonError, string> = {
  [CommonError.InvalidInput]: 'Entrada inválida',
  [CommonError.UnAuthorized]: 'No estas autorizado para realizar esta acción',
  [CommonError.Unknown]: 'Error desconocido, por favor intenta de nuevo',
  [CommonError.UserNotFound]: 'No logre encontrar al usuario, verifica que estas registrado',
};
