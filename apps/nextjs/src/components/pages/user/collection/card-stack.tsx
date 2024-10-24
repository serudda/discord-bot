import { useState } from 'react';
import { type Card } from '~/common';
import { Dialog, DialogClose, DialogContent, DialogTrigger, Icon, IconCatalog, IconStyle } from '~/components';
import { cn, downloadImage } from '~/utils';
import type { CardCountMap } from './category-section';
import { groupSingleCardById } from './utils/group-single-card-by-id';
import Atropos from 'atropos/react';

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
  const [isModalOpen, setModalOpen] = useState(false);
  const cardCountMap = ownedCardMap.get(card.id);
  const cardGroup = isOwned && cardCountMap ? groupSingleCardById(cardCountMap) : { foil: null, nonFoil: null };
  const primaryCard = cardGroup.foil ?? cardGroup.nonFoil ?? card;
  const stackQuantity = cardGroup.foil?.quantity ?? cardGroup.nonFoil?.quantity ?? 0;
  const stackedCardDuplicates = stackQuantity > 1 && isOwned ? Array(Math.min(stackQuantity - 1, 4)).fill(null) : [];

  const classes = {
    container: cn('relative', {
      'hover:scale-105 transition-transform ease-elastic group duration-500 hover:z-50 cursor-pointer': isOwned,
      grayscale: !isOwned,
    }),
    duplicateCards: (stackIndex: number) =>
      cn('absolute w-full h-full top-0 left-0 bg-cover transition-transform ease-elastic duration-500', {
        'group-hover:-translate-y-4 group-hover:rotate-[-4deg] group-hover:-translate-x-2 z-[10]': stackIndex === 3,
        'group-hover:translate-y-4 group-hover:rotate-[7deg] z-[15]': stackIndex === 2,
        'group-hover:-translate-x-4 group-hover:rotate-[-7deg] z-[13]': stackIndex === 1,
        'group-hover:translate-x-6 group-hover:rotate-[5deg] z-[16]': stackIndex === 0,
      }),
    dialogCloseButton: cn(
      'group',
      'w-8 h-8 rounded-full',
      'border-2 border-neutral-400',
      'grid place-content-center',
      'bg-neutral-200 hover:bg-neutral-900',
      'transition-colors',
    ),
  };

  const handleModalOpen = () => {
    if (isOwned) setModalOpen(!isModalOpen);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalOpen}>
      <DialogTrigger asChild>
        <div key={card.id} className={classes.container}>
          {isOwned &&
            stackedCardDuplicates.map((_, stackIndex) => (
              <div key={stackIndex} className={classes.duplicateCards(stackIndex)}>
                <img src={primaryCard.image} alt={`Duplicate ${stackIndex + 1}`} className="z-10" draggable="false" />
              </div>
            ))}

          <img
            src={primaryCard.image}
            alt={primaryCard.name}
            className={cn('relative z-20', { 'opacity-50': !isOwned })}
            draggable="false"
          />

          {cardGroup.foil && (
            <img
              src="/assets/images/emblems/FOIL.png"
              className="w-10 absolute top-10 left-5 h-auto z-50"
              alt="Foil Emblem"
              draggable="false"
            />
          )}
        </div>
      </DialogTrigger>

      <DialogContent className="p-4 rounded-lg bg-transparent border-none ">
        <div className="grid grid-cols-[1fr_0.1fr] gap-4">
          <Atropos className="atropos-3d" activeOffset={40} shadowScale={1.5}>
            <div className="w-full relative atropos-scale space-y-4">
              <img
                src={primaryCard.image}
                className="w-full h-auto relative "
                alt="Card Shine"
                draggable="false"
                data-atropos-offset="0"
              />

              {cardGroup.foil && (
                <img
                  src="/assets/images/emblems/FOIL.png"
                  className="w-16 absolute top-12 left-8 h-auto"
                  alt="Foil Emblem"
                  draggable="false"
                  data-atropos-offset="10"
                />
              )}
            </div>
          </Atropos>

          <div className="action-buttons flex flex-col gap-4 mt-10">
            <DialogClose>
              <button className={classes.dialogCloseButton}>
                <Icon
                  icon={IconCatalog.xMark}
                  className="w-6 h-6 text-black group-hover:text-white transition-colors"
                  iconStyle={IconStyle.bold}
                />
              </button>
            </DialogClose>

            <button
              className={classes.dialogCloseButton}
              onClick={async () => {
                await downloadImage(primaryCard.image, `${primaryCard.name}.png`);
              }}
            >
              <Icon
                icon={IconCatalog.arrowLeft}
                className="w-6 h-6 text-black group-hover:text-white transition-colors -rotate-90"
              />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
