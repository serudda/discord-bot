import { type Card } from '~/common';
import { cn } from '~/utils';
import type { CardCountMap } from './category-section';
import { groupSingleCardById } from './utils/group-single-card-by-id';

interface CardStackProps {
  /**
   * The card information that needs to be displayed.
   */
  card: Card;

  /**
   * A boolean indicating whether the card is owned by the
   * user.
   */
  isOwned: boolean;

  /**
   * A map of owned cards that allows quick lookup of card
   * quantities and foil status.
   */
  ownedCardMap: Map<string, CardCountMap>;
}

export const CardStack = ({ card, isOwned, ownedCardMap }: CardStackProps) => {
  const cardCountMap = ownedCardMap.get(card.id);
  const cardGroup = isOwned && cardCountMap ? groupSingleCardById(cardCountMap) : { foil: null, nonFoil: null };
  const primaryCard = cardGroup.foil ?? cardGroup.nonFoil ?? card;
  const stackQuantity = cardGroup.foil?.quantity ?? cardGroup.nonFoil?.quantity ?? 0;
  const stackedCardDuplicates = stackQuantity > 1 && isOwned ? Array(Math.min(stackQuantity - 1, 4)).fill(null) : [];

  const classes = {
    container: cn('relative', {
      'hover:scale-105 transition-transform ease-elastic group duration-500 hover:z-50': isOwned,
      grayscale: !isOwned,
    }),
    duplicateCards: (stackIndex: number) =>
      cn('absolute w-full h-full top-0 left-0 bg-cover transition-transform ease-elastic duration-500', {
        'group-hover:-translate-y-4 group-hover:rotate-[-4deg] group-hover:-translate-x-2 z-[10]': stackIndex === 3,
        'group-hover:translate-y-4 group-hover:rotate-[7deg] z-[15]': stackIndex === 2,
        'group-hover:-translate-x-4 group-hover:rotate-[-7deg] z-[13]': stackIndex === 1,
        'group-hover:translate-x-6 group-hover:rotate-[5deg] z-[16]': stackIndex === 0,
      }),
  };

  return (
    <div key={card.id} className={classes.container}>
      {isOwned &&
        stackedCardDuplicates.map((_, stackIndex) => (
          <div key={stackIndex} className={classes.duplicateCards(stackIndex)}>
            <img src={primaryCard.image} alt={`Duplicate ${stackIndex + 1}`} className="w-60 h-82 z-10" />
          </div>
        ))}

      <img
        src={primaryCard.image}
        alt={primaryCard.name}
        className={cn('w-60 h-82 relative z-20', { 'opacity-50': !isOwned })}
      />
    </div>
  );
};
