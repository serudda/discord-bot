export enum SortField {
  NUMBER = 'number',
  ALPHABETICAL = 'alphabetical',
  RARITY = 'rarity',
}

export enum OrderBy {
  ASC = 'asc',
  DESC = 'desc',
}

export const SORT_FIELD_LABELS = {
  [SortField.NUMBER]: 'Número',
  [SortField.ALPHABETICAL]: 'Alfabético',
  [SortField.RARITY]: 'Rareza',
} as const;

export const SORT_ORDER_LABELS = {
  [OrderBy.ASC]: 'Ascendente',
  [OrderBy.DESC]: 'Descendente',
} as const;
