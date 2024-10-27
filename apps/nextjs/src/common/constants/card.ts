import { Rarity } from '~/utils/api';

export enum FilterMode {
  Rarity = 'rarity',
  Alphabet = 'alphabet',
}

export enum SortOrder {
  Ascending = 'asc',
  Descending = 'desc',
}

export const rarityOrder: Array<Rarity> = [Rarity.LEGENDARY, Rarity.EPIC, Rarity.RARE, Rarity.UNCOMMON, Rarity.COMMON];

export const BACK_IMG_URL = 'https://i.imgur.com/6WQjAKP.png';
