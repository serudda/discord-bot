export enum CommonError {
  InvalidInput = 'InvalidInput',

  Unknown = 'Unknown',
}

export const CommonErrors: Record<CommonError, string> = {
  [CommonError.InvalidInput]: 'Entrada inválida',
  [CommonError.Unknown]: 'Error desconocido, por favor intenta de nuevo',
};
