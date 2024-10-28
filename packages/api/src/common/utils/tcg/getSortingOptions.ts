import type { OrderBy} from '../../constants';
import { SortField } from '../../constants';

export const getSortingOptions = (sortBy?: SortField, orderBy?: OrderBy) => {
  if (!sortBy || !orderBy) return [];
  switch (sortBy) {
    case SortField.ALPHABETICAL:
      return [{ card: { name: orderBy } }];
    case SortField.RARITY:
      return [{ card: { rarity: orderBy } }];
    case SortField.NUMBER:
    default:
      return [{ card: { cardNumber: orderBy } }];
  }
};
