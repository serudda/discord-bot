import type { Card } from '~/common';
import { FilterMode, SortOrder } from '~/common';
import { Rarity } from './api';

/**
 * The function `getCategoryCriteria` returns an array of
 * either rarities or unique first letters of card names
 * based on the filter mode and sort order provided.
 *
 * @param {FilterMode} filterMode - The `filterMode`
 *   parameter is used to determine how the cards should be
 *   filtered. It can have two possible values:
 *   `FilterMode.Rarity` or any other value. If
 *   `FilterMode.Rarity` is selected, the function will
 *   return an array of rarities sorted either in ascending
 *   or descending.
 * @param {SortOrder} sortOrder - The `sortOrder` parameter
 *   determines the order in which the category criteria
 *   will be sorted. If `sortOrder` is
 *   `SortOrder.Ascending`, the criteria will be sorted in
 *   ascending order. If `sortOrder` is
 *   `SortOrder.Descending`, the criteria will be sorted in
 *   descending order.
 * @param allCards - The `allCards` parameter is an array
 *   containing all the card objects. Each card object
 *   likely has properties such as `name`, `rarity`, and
 *   other attributes that can be used for filtering and
 *   sorting.
 * @returns An array of strings or Rarity values based on
 *   the filterMode and sortOrder provided. If the
 *   filterMode is set to FilterMode.Rarity, the function
 *   will return an array of Rarity values sorted either in
 *   ascending or descending order based on the sortOrder.
 *   If the filterMode is not set to FilterMode.Rarity, the
 *   function will return an array of unique letters
 *   extracted from the first character of each card's.
 */
export const getCategoryCriteria = (
  filterMode: FilterMode,
  sortOrder: SortOrder,
  allCards: Array<Card>,
): Array<string | Rarity> => {
  if (filterMode === FilterMode.Rarity) {
    const rarities = Object.values(Rarity);
    return sortOrder === SortOrder.Ascending ? [...rarities].reverse() : rarities;
  } else {
    const uniqueLetters = Array.from(new Set(allCards.map((card) => card.name?.charAt(0).toUpperCase())));
    uniqueLetters.sort();
    return sortOrder === SortOrder.Ascending ? uniqueLetters : uniqueLetters.reverse();
  }
};
