import { cn, EMBLEMS_IMAGES_PATH, rarityOrder } from '~/common';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components';

interface UserSidebarProps {
  /**
   * The URL of the user's profile image.
   */
  userImage: string;

  /**
   * The total number of cards the user owns.
   */
  ownedCardCount: number;

  /**
   * Whether to show unowned cards.
   */
  showUnownedCards: boolean;

  /**
   * A function to toggle the visibility of unowned cards.
   */
  setShowUnownedCards: (value: boolean) => void;

  /**
   * The number of owned cards per rarity.
   */
  ownedCountsPerRarity: Record<string, number>;

  /**
   * The number of owned foil cards.
   */
  ownedFoilCount: number;
}

export const UserSidebar = ({
  userImage,
  ownedCardCount,
  showUnownedCards,
  setShowUnownedCards,
  ownedCountsPerRarity,
  ownedFoilCount,
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
      'text-4xl font-bold ',
      'bg-gradient-to-br from-amber-200 to-amber-500',
      'bg-clip-text text-transparent from-40%',
    ),
    cardCountText: cn(
      'mt-4',
      'text-sm max-w-[15ch] font-bold ',
      'bg-gradient-to-br from-gray-200 to-gray-800',
      'bg-clip-text text-transparent from-60%',
    ),
    rarityGrid: cn('grid grid-cols-5 gap-8 px-4 place-items-center mt-10'),
    foilContainer: cn('grid place-items-center mt-10 border-t border-orange-400/70 pt-10'),
    showUnownedLabel: cn('text-white mt-8 mb-4'),
    setShowUnownedCheckbox: cn('mr-2'),
    foilImage: cn('w-10 h-10'),
    hoverCardImage: cn('min-w-8 w-full h-full'),
    tooltipContent: cn('w-fit font-bold'),
    sideBarContainer: cn('w-full min-h-72 border border-orange-400/70', 'rounded-xl -translate-y-16 z-10 pt-16 px-8'),
    rarityCount: cn('text-sm mt-2 text-gray-500 font-bold'),
  };

  const renderRarities = () => {
    return rarityOrder.map((rarity) => (
      <div key={rarity} className="flex flex-col items-center">
        <a href={`#${rarity.toLowerCase()}`}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <img src={`${EMBLEMS_IMAGES_PATH}/${rarity}.png`} alt={rarity} className={classes.hoverCardImage} />
              </TooltipTrigger>
              <TooltipContent className={classes.tooltipContent}>
                <p>{rarity}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </a>
        <span className={classes.rarityCount}>{ownedCountsPerRarity[rarity] ?? 0}</span>
      </div>
    ));
  };

  return (
    <aside className={classes.container}>
      {/* User Profile Image */}
      <div className={classes.profileContainer}>
        {/* Front of the Profile Image */}
        <div className={classes.profileImage}>
          <img src={userImage} alt="User Profile" className="w-full h-full rounded-full" />
        </div>

        {/* Back of the Profile Pic */}
        <div className={classes.profileBack}>
          <div className="text-center">
            <p className={classes.cardCount}>{ownedCardCount}</p>
            <p className={classes.cardCountText}>TOTAL CARDS OWNED</p>
          </div>
        </div>
      </div>

      {/* User Card Rarities */}
      <div className={classes.sideBarContainer}>
        <div className={classes.rarityGrid}>{renderRarities()}</div>

        <div className={classes.foilContainer}>
          <div className="flex flex-col items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <img src={`${EMBLEMS_IMAGES_PATH}/FOIL.png`} className={classes.foilImage} alt="FOIL" />
                </TooltipTrigger>
                <TooltipContent className={classes.tooltipContent}>
                  <p>FOIL</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className={classes.rarityCount}>{ownedFoilCount}</span>
          </div>
        </div>

        <div className={classes.showUnownedLabel}>
          <label>
            <input
              type="checkbox"
              checked={showUnownedCards}
              onChange={() => setShowUnownedCards(!showUnownedCards)}
              className={classes.setShowUnownedCheckbox}
            />
            Show Unowned Cards
          </label>
        </div>
      </div>
    </aside>
  );
};
