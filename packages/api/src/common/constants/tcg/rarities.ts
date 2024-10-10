export enum Rarity {
  COMMON = 'COMMON',
  UNCOMMON = 'UNCOMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY',
}

export const rarities = [
  { rarity: Rarity.COMMON, probability: 0.5 },
  { rarity: Rarity.UNCOMMON, probability: 0.25 },
  { rarity: Rarity.RARE, probability: 0.08 },
  { rarity: Rarity.EPIC, probability: 0.05 },
  { rarity: Rarity.LEGENDARY, probability: 0.02 },
];
