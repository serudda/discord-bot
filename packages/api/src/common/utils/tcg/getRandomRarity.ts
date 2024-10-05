import { rarities, Rarity } from '../../constants';

export const getRandomRarity = (): Rarity => {
  const randomNum = Math.random();
  let cumulativeProbability = 0;
  let selectedRarity = Rarity.COMMON;

  for (const rarity of rarities) {
    cumulativeProbability += rarity.probability;
    if (randomNum <= cumulativeProbability) {
      selectedRarity = rarity.rarity;
      break;
    }
  }

  return selectedRarity;
};
