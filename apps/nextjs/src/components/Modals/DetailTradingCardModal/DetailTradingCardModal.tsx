import {
  DetailTradingCard,
  DetailTradingCardProps,
  Dialog,
  DialogContent,
  DialogTrigger,
  TradingCard,
} from '~/components';
import { cn } from '~/utils';

export interface DetailTradingCardModalProps extends DetailTradingCardProps {}

export const DetailTradingCardModal = ({ className, ...props }: DetailTradingCardModalProps) => {
  const classes = {
    container: cn(className),
  };

  return (
    <Dialog>
      <DialogTrigger>
        <TradingCard {...props} />
      </DialogTrigger>
      <DialogContent className="p-4 rounded-lg bg-transparent border-none">
        <DetailTradingCard {...props} amount={1} hasHoverEffect={false} />
      </DialogContent>
    </Dialog>
  );
};
