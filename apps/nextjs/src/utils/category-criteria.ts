import { ALPHABET, FilterMode, SortOrder } from '~/common';
import { Rarity } from './api';

/**
 * The function `getCategoryCriteria` returns an array of
 * strings or Rarity values based on the provided filter
 * mode and sort order.
 *
 * @param {FilterMode} filterMode - FilterMode is an enum
 *   that determines how the categories are filtered. It can
 *   have two possible values: 'Rarity' or 'Alphabetical'.
 * @param {SortOrder} sortOrder - SortOrder is an enum that
 *   represents the sorting order for the category criteria.
 *   It can have two possible values: Ascending and
 *   Descending.
 * @returns An array of strings or Rarity values based on
 *   the filterMode and sortOrder provided. The array will
 *   either be in ascending order or descending order based
 *   on the sortOrder parameter.
 */
export const getCategoryCriteria = (filterMode: FilterMode, sortOrder: SortOrder): Array<string | Rarity> => {
  const types = filterMode === FilterMode.Rarity ? Object.values(Rarity) : ALPHABET.split('');
  return sortOrder === SortOrder.Ascending ? types : [...types].reverse();
};
