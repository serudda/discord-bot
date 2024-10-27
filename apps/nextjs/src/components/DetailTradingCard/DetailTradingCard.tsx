import { forwardRef } from 'react';
import { TradingCard, TradingCardProps } from '~/components';
import { cn } from '~/utils';
import Atropos from 'atropos/react';

export interface DetailTradingCardProps extends TradingCardProps {}

export const DetailTradingCard = forwardRef<HTMLDivElement, DetailTradingCardProps>(({ className, ...props }, ref) => {
  const classes = {
    container: cn('atropos-3d', className),
  };

  return (
    <Atropos className={classes.container} activeOffset={40} shadowScale={1.5}>
      <div className="w-full relative atropos-scale">
        <TradingCard {...props} ref={ref} />
      </div>
    </Atropos>
  );
});
