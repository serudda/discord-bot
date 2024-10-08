export enum CardError {
  NoCoins = 'NoCoins',
  CardsNotFoundByRarety = 'CardsNotFoundByRarety',
  NoAddCoins = 'NoAddCoins',
  NoSetCoins = 'NoSetCoins',
}

export const CardErrors: Record<CardError, string> = {
  [CardError.CardsNotFoundByRarety]: 'No logre encontrar cartas con esa rareza',
  [CardError.NoCoins]: 'No tienes suficientes monedas para poder comprar un paquete',
  [CardError.NoAddCoins]: 'No se pudieron añadir las monedas al usuario',
  [CardError.NoSetCoins]: 'No se pudieron asignar las monedas al usuario',
};
