import { useMemo } from 'react';
import { EMBLEMS_IMAGES_PATH, FilterMode, rarityOrder, SortOrder } from '~/common';
import type { CardCountMap } from '~/components';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components';
import { cn } from '~/utils';

interface UserSidebarProps {
  /**
   * The URL of the user's profile image.
   */
  userImage: string;

  /**
   * The user's collection of cards, including quantities
   * and foil status.
   */
  userCollection: Array<CardCountMap>;

  /**
   * A boolean indicating whether to display unowned cards
   * in the collection.
   */
  showUnownedCards: boolean;

  /**
   * A function to toggle the visibility of unowned cards.
   */
  setShowUnownedCards: (value: boolean) => void;

  /**
   * A function to set the active filter for displaying
   * cards. Can be used to filter cards by rarity or
   * alphabet.
   */
  setActiveFilter: (mode: FilterMode) => void;

  /**
   * A function to set the sorting order of cards.
   * Determines whether cards are sorted in ascending or
   * descending order.
   */
  setSortOrder: (order: SortOrder) => void;
}

export const UserSidebar = ({
  userImage,
  userCollection,
  showUnownedCards,
  setShowUnownedCards,
  setActiveFilter,
  setSortOrder,
}: UserSidebarProps) => {
  const classes = {
    container: cn('sticky top-10 h-fit text-white'),
    profileContainer: cn('relative w-40 h-40 mx-auto group/profile z-50 duration-500'),
    profileImage: cn(
      'backface-hidden',
      'absolute inset-0 w-full h-full',
      'rounded-full',
      'transition-transform duration-500 ease-in-out',
      'hover:rotate-y-180',
      'group-hover/profile:rotate-y-180',
    ),
    profileBack: cn(
      'backface-hidden',
      'border border-gray-gray-300',
      'rotate-y-180',
      'group-hover/profile:rotate-y-0',
      'absolute inset-0 flex items-center justify-center',
      'bg-neutral-900 rounded-full',
      'rotate-y-180 transition-transform duration-500 ease-in-out',
      'hover:rotate-y-0',
    ),
    cardCount: cn(
      'text-4xl font-bold',
      'bg-gradient-to-br from-amber-200 to-amber-500',
      'bg-clip-text text-transparent from-40%',
    ),
    cardCountText: cn(
      'mt-4',
      'text-sm max-w-[15ch] font-bold',
      'bg-gradient-to-br from-gray-200 to-gray-800',
      'bg-clip-text text-transparent from-60%',
    ),
  };

  const { ownedCountsPerRarity, ownedFoilCount } = useMemo(() => {
    const rarityCounts: Record<string, number> = {};
    let foilCount = 0;

    userCollection.forEach(({ card, isFoil }) => {
      if (card.rarity && !isFoil) rarityCounts[card.rarity] = (rarityCounts[card.rarity] ?? 0) + 1;

      if (isFoil) foilCount += 1;
    });

    return { ownedCountsPerRarity: rarityCounts, ownedFoilCount: foilCount };
  }, [userCollection]);

  const renderRarities = () => {
    return rarityOrder.map((rarity) => (
      <div key={rarity} className="flex flex-col items-center">
        <a href={`#${rarity.toLowerCase()}`}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <img src={`${EMBLEMS_IMAGES_PATH}/${rarity}.png`} alt={rarity} className="min-w-8 w-full h-full" />
              </TooltipTrigger>
              <TooltipContent className="w-fit font-bold">
                <p>{rarity}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </a>
        <span className="text-sm mt-2 text-gray-500 font-bold">{ownedCountsPerRarity[rarity] ?? 0}</span>
      </div>
    ));
  };

  return (
    <aside className={classes.container}>
      {/* User Profile Image */}
      <div className={classes.profileContainer}>
        <div className={classes.profileImage}>
          <img src={userImage} alt="User Profile" className="w-full h-full rounded-full" />
        </div>
        <div className={classes.profileBack}>
          <div className="text-center">
            <p className={classes.cardCount}>{userCollection.length}</p>
            <p className={classes.cardCountText}>TOTAL CARDS OWNED</p>
          </div>
        </div>
      </div>

      {/* User Card Rarities */}
      <div className="w-full min-h-72 border border-orange-400/70 rounded-xl -translate-y-16 z-10 pt-16 px-8">
        <div className="grid grid-cols-5 gap-8 px-4 place-items-center mt-10">{renderRarities()}</div>

        <div className="grid place-items-center mt-10 border-t border-orange-400/70 pt-10">
          <div className="flex flex-col items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <img src={`${EMBLEMS_IMAGES_PATH}/FOIL.png`} className="w-10 h-10" alt="FOIL" />
                </TooltipTrigger>
                <TooltipContent className="w-fit font-bold">
                  <p>FOIL</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="text-sm mt-2 text-gray-500 font-bold">{ownedFoilCount}</span>
          </div>
        </div>

        {/* Filter Mode Select */}
        <Select defaultValue={FilterMode.Rarity} onValueChange={(value) => setActiveFilter(value as FilterMode)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={FilterMode.Rarity}>Rarity</SelectItem>
              <SelectItem value={FilterMode.Alphabet}>Alphabet</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Sort Order Select */}
        <Select defaultValue={SortOrder.Descending} onValueChange={(value) => setSortOrder(value as SortOrder)}>
          <SelectTrigger className="w-full mt-4">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={SortOrder.Ascending}>Ascending</SelectItem>
              <SelectItem value={SortOrder.Descending}>Descending</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="text-white mt-8 mb-4">
          <label>
            <input
              type="checkbox"
              checked={showUnownedCards}
              onChange={() => setShowUnownedCards(!showUnownedCards)}
              className="mr-2"
            />
            Show Unowned Cards
          </label>
        </div>
      </div>
    </aside>
  );
};
