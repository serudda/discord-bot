import type { Card } from '~/common';
import { cn } from '~/lib/utils';
import type { CardGroup } from './utils/cardUtils';

interface CardStackProps {
  /**
   * The card group containing the card information.
   */
  cardGroup: CardGroup;

  /**
   * The card information.
   */
  card: Card;

  /**
   * Whether the card is owned by the user.
   */
  isOwned: boolean;
}

export const CardStack = ({ cardGroup, card, isOwned }: CardStackProps) => {
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

  const cardContainerClasses = cn('relative ', {
    'hover:scale-105 transition-transform ease-elastic group duration-500 hover:z-50': isOwned,
    grayscale: !isOwned,
  });

  return (
    <div className={cardContainerClasses}>
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
