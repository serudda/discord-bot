export enum SeasonError {
  SeasonNotFound = 'SeasonNotFound',
  SeasonsNotFound = 'SeasonsNotFound',
}

export const SeasonErrors: Record<SeasonError, string> = {
  [SeasonError.SeasonsNotFound]: 'No se encontramos ninguna temporada',
  [SeasonError.SeasonNotFound]: 'No se encontramos la temporada que buscas',
};
