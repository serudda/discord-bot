import { cn } from '~/utils';

export interface TradingCardProps {
  /**
   * Additional class names to apply to the card.
   */
  className?: string;
}

export const TradingCard = ({ className }: TradingCardProps) => {
  const classes = {
    container: cn('rounded-lg shadow-md w-full overflow-hidden', className),
    image: cn('w-full h-auto object-contain'),
  };

  return (
    <div className={classes.container}>
      <img src="https://i.imgur.com/BtviSjC.png" alt="Name" className={classes.image} />
    </div>
  );
};
