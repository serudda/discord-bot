export enum PackError {
  NoCreatePack = 'NoCreatePack',
  NoUserPack = 'NoUserPack',
  PackNotFound = 'PackNotFound',
  UserPackNotFound = 'UserPackNotFound',
  UserPacksNotFound = 'UserPacksNotFound',
  NoCreatePackCards = 'NoCreatePackCards',
  NoDeletePack = 'NoDeletePack',
}
export const PackErrors: Record<PackError, string> = {
  [PackError.NoCreatePack]: 'No se pudo crear el paquete',
  [PackError.NoUserPack]: 'No tienes paquetes, compra uno con tus monedas virtuales',
  [PackError.NoCreatePackCards]: 'No se pudieron añadir las cartas al paquete',
  [PackError.PackNotFound]: 'No encontramos el paquete que buscas',
  [PackError.UserPackNotFound]: 'No encontramos el paquete del usuario que buscas',
  [PackError.UserPacksNotFound]: 'No encontramos los paquetes del usuario que buscas',
  [PackError.NoDeletePack]: 'No se pudo eliminar el paquete',
};
