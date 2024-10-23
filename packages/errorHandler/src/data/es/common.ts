export enum CommonError {
  ConfigNotFound = 'ConfigNotFound',
  InvalidInput = 'InvalidInput',
  Unknown = 'Unknown',
}

export const CommonErrors: Record<CommonError, string> = {
  [CommonError.ConfigNotFound]: 'Configuración no encontrada',
  [CommonError.InvalidInput]: 'Entrada inválida',
  [CommonError.Unknown]: 'Error desconocido, por favor intenta de nuevo',
};
