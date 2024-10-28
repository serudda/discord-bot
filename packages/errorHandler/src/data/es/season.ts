export enum SeasonError {
  SeasonNotFound = 'SeasonNotFound',
  SeasonsNotFound = 'SeasonsNotFound',
  CardsNotFoundBySeason = 'CardsNotFoundBySeason',
}

export const SeasonErrors: Record<SeasonError, string> = {
  [SeasonError.SeasonsNotFound]: 'No encontramos ninguna temporada',
  [SeasonError.SeasonNotFound]: 'No encontramos la temporada que buscas',
  [SeasonError.CardsNotFoundBySeason]: 'No encontramos las cartas de esta temporada',
};
