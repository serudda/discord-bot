import type { Card } from '~/common';
import { cn } from '~/lib/utils';

interface CardStackProps {
  /**
   * The card to render in the stack.
   */
  card: Card;

  /**
   * A map of card IDs to the number of duplicates owned.
   */
  cardCountMap: Record<string, number>;

  /**
   * A set of card IDs that the user owns.
   */
  ownedCardIds: Set<string>;
}

export const CardStack = ({ card, cardCountMap, ownedCardIds }: CardStackProps) => {
  const cardCount = cardCountMap[card.id] ?? 0;
  const limitedDuplicates = cardCount > 1 ? Array(Math.min(cardCount - 1, 4)).fill(null) : [];

  const getCardStackClasses = (stackIndex: number) =>
    cn('absolute w-full h-full top-0 left-0 bg-cover transition-transform ease-elastic duration-500', {
      // Conditional stacking positions
      'group-hover:-translate-y-4 group-hover:rotate-[-4deg] group-hover:-translate-x-2 z-[10]': stackIndex === 3,
      'group-hover:translate-y-4 group-hover:rotate-[7deg] z-[15]': stackIndex === 2,
      'group-hover:-translate-x-4 group-hover:rotate-[-7deg] z-[13]': stackIndex === 1,
      'group-hover:translate-x-6 group-hover:rotate-[5deg] z-[16]': stackIndex === 0,
    });

  const cardContainerClasses = cn('relative ', {
    'hover:scale-105 transition-transform ease-elastic group duration-500 hover:z-50': ownedCardIds.has(card.id),
    grayscale: !ownedCardIds.has(card.id),
  });

  return (
    <div className={cardContainerClasses}>
      {/* Render stacked duplicates behind the main card */}
      {limitedDuplicates.map((_, stackIndex) => (
        <div key={stackIndex} className={getCardStackClasses(stackIndex)}>
          <img src={card.image} alt={`Duplicate ${stackIndex + 1}`} className="w-60 h-82 card-image z-10" />
        </div>
      ))}

      {/* Main card image */}
      <img
        src={card.image}
        alt={card.name}
        className={cn('w-60 h-82 card-image relative z-20', { 'opacity-50': !ownedCardIds.has(card.id) })}
      />
    </div>
  );
};
