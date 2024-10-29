import { forwardRef } from 'react';
import { BACK_IMG_URL } from '~/common';
import { cn } from '~/utils';
import { FloatCounter } from './components';

export interface TradingCardProps {
  /**
   * Additional class names to apply to the card.
   */
  className?: string;

  /**
   * The name of the image to display on the card.
   */
  imgName: string;

  /**
   * The image to display on the card.
   */
  imgUrl: string;

  /**
   * The amount of cards to display.
   */
  amount?: number;

  /**
   * Whether the card has a hover effect.
   */
  hasHoverEffect?: boolean;

  /**
   * Whether the card is a back.
   */
  isBack?: boolean;
}

export const TradingCard = forwardRef<HTMLDivElement, TradingCardProps>(
  ({ className, imgName, imgUrl, amount = 1, isBack = false, hasHoverEffect = true }, ref) => {
    const detailedCard = !isBack && hasHoverEffect;
    const classes = {
      container: cn(
        'w-full relative',
        'rounded-lg',
        'transition-transform ease-elastic group duration-500',
        {
          'hover:scale-[1.02] hover:z-30 cursor-pointer': detailedCard,
        },
        className,
      ),
      duplicates: (index: number) =>
        cn('absolute w-full h-full top-0 left-0 bg-cover transition-transform ease-elastic duration-500', {
          'group-hover:-translate-y group-hover:rotate-[-1deg] group-hover:-translate-x-2 z-[10]': index >= 4,
          'group-hover:translate-y group-hover:rotate-[3deg] z-[15]': index === 3,
          'group-hover:-translate-x-2 group-hover:rotate-[-3deg] z-[13]': index === 2,
          'group-hover:translate-x-3 group-hover:rotate-[1deg] z-[16]': index === 1,
        }),
      image: cn('w-full h-auto object-contain z-20 shadow-md'),
    };

    const displayAmount = Math.min(amount, 4);

    const image = isBack ? BACK_IMG_URL : imgUrl;

    return (
      <div ref={ref} className={classes.container}>
        {/* CARD AMOUNT */}
        {detailedCard && <FloatCounter cardAmount={amount} foilAmount={amount} />}

        {/* CARD IMAGE */}
        <img src={image} alt={imgName} className={classes.image} />

        {displayAmount > 1 &&
          !isBack &&
          [...Array(displayAmount)].map((_, index) => (
            <div key={index} className={classes.duplicates(index)}>
              <img src={imgUrl} alt={imgName} className={classes.image} />
            </div>
          ))}
      </div>
    );
  },
);
