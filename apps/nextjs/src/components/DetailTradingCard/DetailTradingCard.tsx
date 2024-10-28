import { forwardRef } from 'react';
import { HolographicCard, TradingCard, TradingCardProps } from '~/components';
import { cn } from '~/utils';
import Atropos from 'atropos/react';

export interface DetailTradingCardProps extends TradingCardProps {
  isFoil?: boolean;
}

export const DetailTradingCard = forwardRef<HTMLDivElement, DetailTradingCardProps>(
  ({ className, isFoil, ...props }, ref) => {
    const classes = {
      container: cn('atropos-3d', className),
    };

    const renderCard = () => {
      if (isFoil) {
        return (
          <HolographicCard>
            <TradingCard {...props} ref={ref} />
          </HolographicCard>
        );
      }

      return <TradingCard {...props} ref={ref} />;
    };

    return (
      <Atropos className={classes.container} activeOffset={40} shadowScale={1.5}>
        <div className="w-full relative atropos-scale">{renderCard()}</div>
      </Atropos>
    );
  },
);
