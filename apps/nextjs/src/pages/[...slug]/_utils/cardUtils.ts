import type { Card } from '@discord-bot/db';

interface CardCountMap {
  /**
   * The card information.
   */
  card: Card;

  /**
   * The quantity of the card owned by the user.
   */
  quantity: number;
}

/**
 * Creates a map of card IDs to the quantity of cards owned
 * by the user.
 *
 * @param collectionData - The user's collection data which
 *   contains card information and quantities.
 * @returns A map where the key is the card ID and the value
 *   is the total quantity of that card.
 */
export const createCardCountMap = (collectionData: Array<CardCountMap> | undefined) => {
  if (!collectionData) return {};

  return collectionData.reduce(
    (acc, { card, quantity }) => {
      acc[card.id] = (acc[card.id] ?? 0) + quantity;
      return acc;
    },
    {} as Record<string, number>,
  );
};
