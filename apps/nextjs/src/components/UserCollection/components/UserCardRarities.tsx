/* _components/UserCardRarities.tsx */

import { HoverCard, HoverCardContent, HoverCardTrigger } from '~/components/ui/hover-card';
import { EMBLEMS_IMAGES_PATH, Rarity } from '~/common';
import { cn } from '~/lib/utils';

interface UserCardRaritiesProps {
  showUnknown: boolean;
  setShowUnknown: (value: boolean) => void;
}

export const UserCardRarities = ({ showUnknown, setShowUnknown }: UserCardRaritiesProps) => {
  const classes = {
    container: cn('w-full min-h-72 border border-orange-400/70', 'rounded-xl -translate-y-16 z-10 pt-16 px-8'),
    rarityGrid: cn('grid grid-cols-5 gap-8 px-4 place-items-center mt-10'),
    foilContainer: cn('grid place-items-center mt-10 border-t border-orange-400/70 pt-10'),
    showUnknownLabel: cn('text-white mt-8 mb-4'),
    showUnknownCheckbox: cn('mr-2'),
    foilImage: cn('w-10 h-10'),
    hoverCardImage: cn('w-full h-full'),
    hoverCardContent: cn('w-fit font-bold'),
  };

  const renderRarities = () => {
    const rarityOrder = [Rarity.LEGENDARY, Rarity.EPIC, Rarity.RARE, Rarity.UNCOMMON, Rarity.COMMON];

    return rarityOrder.map((rarity) => (
      <a href={`#${rarity.toLowerCase()}`} key={rarity}>
        <HoverCard>
          <HoverCardTrigger asChild>
            <img src={`${EMBLEMS_IMAGES_PATH}/${rarity}.png`} alt={rarity} className={classes.hoverCardImage} />
          </HoverCardTrigger>
          <HoverCardContent className={classes.hoverCardContent}>
            <p>{rarity}</p>
          </HoverCardContent>
        </HoverCard>
      </a>
    ));
  };

  return (
    <div className={classes.container}>
      <div className={classes.rarityGrid}>{renderRarities()}</div>

      <div className={classes.foilContainer}>
        <HoverCard>
          <HoverCardTrigger asChild>
            <img src={`${EMBLEMS_IMAGES_PATH}/FOIL.png`} className={classes.foilImage} />
          </HoverCardTrigger>
          <HoverCardContent className={classes.hoverCardContent}>
            <p>FOIL</p>
          </HoverCardContent>
        </HoverCard>
      </div>

      <div className={classes.showUnknownLabel}>
        <label>
          <input
            type="checkbox"
            checked={showUnknown}
            onChange={() => setShowUnknown(!showUnknown)}
            className={classes.showUnknownCheckbox}
          />
          Show Unknown
        </label>
      </div>
    </div>
  );
};
