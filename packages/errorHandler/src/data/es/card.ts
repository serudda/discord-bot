export enum CardError {
  NoCoins = 'NoCoins',
  CardsNotFoundByRarety = 'CardsNotFoundByRarety',
}

export const CardErrors: Record<CardError, string> = {
  [CardError.CardsNotFoundByRarety]: 'No logre encontrar cartas con esa rareza',
  [CardError.NoCoins]: 'No tienes suficientes monedas para poder comprar un paquete',
};
