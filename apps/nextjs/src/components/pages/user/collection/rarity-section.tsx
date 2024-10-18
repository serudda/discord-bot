import type { Card } from '~/common';
import { cn } from '~/lib/utils';
import { groupSingleCardById, type CardCountMap } from './utils/cardUtils';

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

  const renderCardStack = (card: Card) => {
    const ownedCard = ownedCardMap.get(card.id);
    const isOwned = !!ownedCard;
    const cardGroup = ownedCard ? groupSingleCardById(ownedCard) : { foil: null, nonFoil: null };

    const mainCard = cardGroup.foil ?? cardGroup.nonFoil ?? card;
    const mainCardCount = cardGroup.foil?.quantity ?? cardGroup.nonFoil?.quantity ?? 0;

    const limitedDuplicates = mainCardCount > 1 && isOwned ? Array(Math.min(mainCardCount - 1, 4)).fill(null) : [];

    const getCardStackClasses = (stackIndex: number) =>
      cn('absolute w-full h-full top-0 left-0 bg-cover transition-transform ease-elastic duration-500', {
        'group-hover:-translate-y-4 group-hover:rotate-[-4deg] group-hover:-translate-x-2 z-[10]': stackIndex === 3,
        'group-hover:translate-y-4 group-hover:rotate-[7deg] z-[15]': stackIndex === 2,
        'group-hover:-translate-x-4 group-hover:rotate-[-7deg] z-[13]': stackIndex === 1,
        'group-hover:translate-x-6 group-hover:rotate-[5deg] z-[16]': stackIndex === 0,
      });

    const cardContainerClasses = cn('relative', {
      'hover:scale-105 transition-transform ease-elastic group duration-500 hover:z-50': isOwned,
      grayscale: !isOwned,
    });

    return (
      <div key={card.id} className={cardContainerClasses}>
        {/* Render stacked duplicates behind the main card */}
        {isOwned &&
          limitedDuplicates.map((_, stackIndex) => (
            <div key={stackIndex} className={getCardStackClasses(stackIndex)}>
              <img src={mainCard.image} alt={`Duplicate ${stackIndex + 1}`} className="w-60 h-82 card-image z-10" />
            </div>
          ))}

        {/* Main Card */}
        <img
          src={mainCard.image}
          alt={mainCard.name}
          className={cn('w-60 h-82 card-image relative z-20', { 'opacity-50': !isOwned })}
        />
      </div>
    );
  };

  return (
    <div key={rarity} id={rarity.toLowerCase()} className={classes.sectionContainer}>
      <h2 className={classes.title}>
        {rarity.toUpperCase()}
        <span className={classes.cardCount}>
          {ownedCardsInRarity.length} / {cardsInRarity.length}
        </span>
      </h2>

      <div className={classes.cardGrid}>{cardsToDisplay.map((card) => renderCardStack(card))}</div>
    </div>
  );
};
