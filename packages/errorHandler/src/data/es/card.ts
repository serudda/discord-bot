export enum CardError {
  CardsNotFoundByRarety = 'CardsNotFoundByRarety',
  NoCards = 'NoCards',
  NoCoins = 'NoCoins',
  RandomCardsNotFound = 'RandomCardsNotFound',
  NoAddCoins = 'NoAddCoins',
  NoDecreaseCoins = 'NoDecreaseCoins',
  NoSetCoins = 'NoSetCoins',
  NoAddCardToUserCollection = 'NoAddCardToUserCollection',
  NoCreateCard = 'NoCreateCard',
  NoUserCards = 'NoUserCards',
}

export const CardErrors: Record<CardError, string> = {
  [CardError.CardsNotFoundByRarety]: 'No logre encontrar cartas con esa rareza',
  [CardError.NoCards]: 'No se encontraron cartas',
  [CardError.RandomCardsNotFound]: 'No se pudo obtener cartas aleatorias por rareza',
  [CardError.NoCoins]: 'No tienes suficientes monedas para poder comprar un paquete',
  [CardError.NoAddCoins]: 'No se pudieron añadir las monedas al usuario',
  [CardError.NoDecreaseCoins]: 'No se pudieron restar las monedas al usuario',
  [CardError.NoSetCoins]: 'No se pudieron asignar las monedas al usuario',
  [CardError.NoAddCardToUserCollection]: 'No se pudieron añadir las cartas a la colección del usuario',
  [CardError.NoCreateCard]: 'No se pudo crear la carta',
  [CardError.NoUserCards]: 'El usuario aún no tiene cartas',
};
