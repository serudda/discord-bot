export enum SeasonError {
  SeasonNotFound = 'SeasonNotFound',
  SeasonsNotFound = 'SeasonsNotFound',
}

export const SeasonErrors: Record<SeasonError, string> = {
  [SeasonError.SeasonsNotFound]: 'No encontramos ninguna temporada',
  [SeasonError.SeasonNotFound]: 'No encontramos la temporada que buscas',
};
