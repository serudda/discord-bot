import type { Card } from '~/common';
import { cn } from '~/lib/utils';
import { CardStack } from './card-stack';
import { groupSingleCardById } from './utils/cardUtils';

interface CardCountMap {
  card: Card;
  quantity: number;
  isFoil: boolean;
}

interface RaritySectionProps {
  /**
   * The rarity of the cards in this section.
   */
  rarity: string;

  /**
   * Whether to show unknown cards in this section.
   */
  showUnknown: boolean;

  /**
   * A set of card IDs that the user owns.
   */
  ownedCardIds: Set<string>;

  /**
   * A map of owned cards for quick lookup.
   */
  ownedCardMap: Map<string, CardCountMap>;

  /**
   * A function that groups cards by rarity.
   */
  groupByRarity: (rarity: string) => Array<Card>;
}

export const RaritySection = ({
  rarity,
  showUnknown,
  groupByRarity,
  ownedCardIds,
  ownedCardMap,
}: RaritySectionProps) => {
  const classes = {
    sectionContainer: cn('mb-8'),
    title: cn('text-white text-2xl font-bold mb-4'),
    cardGrid: cn('grid grid-cols-4 gap-x-4 gap-y-10'),
    cardCount: cn(
      'italic ml-4 text-lg ',
      'bg-gradient-to-b from-50% from-amber-600 to-amber-800 bg-clip-text text-transparent',
    ),
  };

  const cardsInRarity = groupByRarity(rarity);
  const ownedCardsInRarity = cardsInRarity.filter((card) => ownedCardIds.has(card.id));

  if (!showUnknown && ownedCardsInRarity.length === 0) return null;

  const cardsToDisplay = showUnknown ? cardsInRarity : ownedCardsInRarity;

  return (
    <div key={rarity} id={rarity.toLowerCase()} className={classes.sectionContainer}>
      <h2 className={classes.title}>
        {rarity.toUpperCase()}
        <span className={classes.cardCount}>
          {ownedCardsInRarity.length} / {cardsInRarity.length}
        </span>
      </h2>

      <div className={classes.cardGrid}>
        {cardsToDisplay.map((card) => {
          const ownedCard = ownedCardMap.get(card.id);
          const cardGroup = ownedCard ? groupSingleCardById(ownedCard) : { foil: null, nonFoil: null };

          return <CardStack key={card.id} cardGroup={cardGroup} card={card} isOwned={!!ownedCard} />;
        })}
      </div>
    </div>
  );
};
