import { cn } from '~/utils';

export interface FloatCounterProps {
  /**
   * Additional class names to apply to the card.
   */
  className?: string;

  /**
   * The amount of cards to display.
   */
  cardAmount?: number;

  /**
   * The amount of foil cards to display.
   */
  foilAmount?: number;
}

export const FloatCounter = ({ className, cardAmount = 1, foilAmount = 1 }: FloatCounterProps) => {
  const classes = {
    container: cn('absolute flex w-full items-center justify-center z-40 bottom-1', className),
  };

  return (
    <div className={classes.container}>
      <div className="bg-neutral-900 px-4 py-2 flex items-center gap-6 rounded-lg overflow-hidden">
        {/* CARD AMOUNT */}
        <div className="flex items-center gap-2">
          {/* CARD ICON */}
          <img src="/assets/images/cards.svg" className="w-4 h-auto" alt="Foil Emblem" draggable="false" />
          <span className="flex items-center gap-0.5">
            <span className="text-white text-md">x</span>
            <span className="text-white text-lg">{cardAmount}</span>
          </span>
        </div>

        {/* FOIL AMOUNT */}
        <div className="flex items-center gap-2">
          {/* FOIL ICON */}
          <img src="/assets/images/emblems/FOIL.png" className="w-4 h-auto" alt="Foil Emblem" draggable="false" />
          <span className="flex items-center gap-0.5">
            <span className="text-white text-md">x</span>
            <span className="text-white text-lg">{foilAmount}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
