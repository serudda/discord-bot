import type { CardCountMap, CardGroup } from '../category-section';

/**
 * The function `groupSingleCardById` takes a `cardCountMap`
 * object and returns a `CardGroup` object with the card
 * grouped based on whether it is foil or non-foil.
 *
 * @param {CardCountMap} cardCountMap - The `cardCountMap`
 *   parameter in the `groupSingleCardById` function is an
 *   object that contains the following properties:
 * @returns The `groupSingleCardById` function returns a
 *   `CardGroup` object that contains either a foil card or
 *   a non-foil card based on the `isFoil` property in the
 *   `cardCountMap` parameter. If the card is foil, it will
 *   be stored in the `foil` property of the `CardGroup`
 *   object with the specified quantity. If the card is
 *   non-foil.
 */

export const groupSingleCardById = (cardCountMap: CardCountMap): CardGroup => {
  const { card, quantity, isFoil } = cardCountMap;
  const cardGroup: CardGroup = { foil: null, nonFoil: null };

  if (isFoil) cardGroup.foil = { ...card, quantity };
  else cardGroup.nonFoil = { ...card, quantity };

  return cardGroup;
};
