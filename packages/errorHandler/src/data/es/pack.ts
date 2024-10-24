export enum PackError {
  NoCreatePack = 'NoCreatePack',
  PackNotFound = 'PackNotFound',
  UserPackNotFound = 'UserPackNotFound',
  UserPacksNotFound = 'UserPacksNotFound',
  NoCreatePackCards = 'NoCreatePackCards',
}

export const PackErrors: Record<PackError, string> = {
  [PackError.NoCreatePack]: 'No se pudo crear el paquete',
  [PackError.NoCreatePackCards]: 'No se pudieron añadir las cartas al paquete',
  [PackError.PackNotFound]: 'No encontramos el paquete que buscas',
  [PackError.UserPackNotFound]: 'No encontramos el paquete del usuario que buscas',
  [PackError.UserPacksNotFound]: 'No encontramos los paquetes del usuario que buscas',
};
