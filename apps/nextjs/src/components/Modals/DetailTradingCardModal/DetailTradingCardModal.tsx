import { useRef } from 'react';
import {
  DetailTradingCard,
  DetailTradingCardProps,
  Dialog,
  DialogContent,
  DialogTrigger,
  TradingCard,
} from '~/components';

export interface DetailTradingCardModalProps extends DetailTradingCardProps {}

export const DetailTradingCardModal = ({ ...props }: DetailTradingCardModalProps) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Dialog>
      <DialogTrigger>
        <TradingCard {...props} />
      </DialogTrigger>
      <DialogContent className="p-4 rounded-lg bg-transparent border-none">
        <DetailTradingCard {...props} amount={1} hasHoverEffect={false} ref={ref} />
      </DialogContent>
    </Dialog>
  );
};
