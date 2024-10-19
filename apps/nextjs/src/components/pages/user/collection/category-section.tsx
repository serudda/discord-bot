import { useMemo } from 'react';
import type { SortOrder } from '~/common';
import { FilterMode, type Card } from '~/common';
import { getCategoryCriteria } from '~/utils';
import { CardStack } from './card-stack';

export interface CardGroup {
  foil: (Card & { quantity: number }) | null;
  nonFoil: (Card & { quantity: number }) | null;
}

export interface CardCountMap {
  card: Card;
  quantity: number;
  isFoil: boolean;
}

interface CategorySectionProps {
  /**
   * The current filter mode selected by the user.
   * Determines whether cards are filtered.
   */
  activeFilter: FilterMode;

  /**
   * The current sort order selected by the user. Determines
   * if the cards are sorted in ascending or descending
   * order.
   */
  sortOrder: SortOrder;

  /**
   * An array of all available cards that can be displayed
   * in the collection.
   */
  allCards: Array<Card>;

  /**
   * An array representing the user's collection of cards,
   * with quantities and foil status.
   */
  userCollection: Array<CardCountMap>;

  /**
   * A boolean indicating whether to show unowned cards in
   * the section.
   */
  showUnownedCards: boolean;
}

export const CategorySection = ({
  activeFilter,
  sortOrder,
  allCards,
  userCollection,
  showUnownedCards,
}: CategorySectionProps) => {
  const categoryCriteria = useMemo(() => getCategoryCriteria(activeFilter, sortOrder), [activeFilter, sortOrder]);

  const { ownedCardMap, ownedCardIds } = useMemo(() => {
    const cardMap = new Map<string, CardCountMap>();
    const cardIdSet = new Set<string>();

    userCollection.forEach((cardCountMap) => {
      cardMap.set(cardCountMap.card.id, cardCountMap);
      cardIdSet.add(cardCountMap.card.id);
    });

    return { ownedCardMap: cardMap, ownedCardIds: cardIdSet };
  }, [userCollection]);

  const filteredCategories = categoryCriteria.map((criteria) => {
    const filteredCards =
      activeFilter === FilterMode.Alphabet
        ? allCards.filter((card) => card.name?.toUpperCase().startsWith(criteria))
        : allCards.filter((card) => card.rarity === criteria);

    const ownedCardsInCategory = filteredCards.filter((card) => ownedCardIds.has(card.id));

    const shouldRender = !(
      (!showUnownedCards && ownedCardsInCategory.length === 0) ||
      (showUnownedCards && filteredCards.length === 0)
    );

    if (!shouldRender) return null;

    const cardsToDisplay = showUnownedCards ? filteredCards : ownedCardsInCategory;

    return {
      criteria,
      ownedCardsInCategory,
      filteredCards,
      cardsToDisplay,
    };
  });

  return filteredCategories.map(
    (category) =>
      category && (
        <div key={category.criteria} id={category.criteria.toLowerCase()} className="mb-8">
          <h2 className="text-white text-2xl font-bold mb-4">
            {category.criteria.toUpperCase()}
            <span className="italic ml-4 text-lg bg-gradient-to-b from-50% from-amber-600 to-amber-800 bg-clip-text text-transparent">
              {category.ownedCardsInCategory.length} / {category.filteredCards.length}
            </span>
          </h2>
          <div className="grid grid-cols-4 gap-x-4 gap-y-10">
            {category.cardsToDisplay.map((card) => (
              <CardStack key={card.id} card={card} isOwned={ownedCardIds.has(card.id)} ownedCardMap={ownedCardMap} />
            ))}
          </div>
        </div>
      ),
  );
};
