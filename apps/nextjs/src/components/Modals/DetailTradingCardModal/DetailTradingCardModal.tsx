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
  const { isBack } = props;

  return (
    <Dialog>
      <DialogTrigger disabled={isBack}>
        <TradingCard {...props} />
      </DialogTrigger>
      <DialogContent className="rounded-lg bg-transparent border-none">
        <div className="grid items-start grid-cols-8 gap-4">
          <DetailTradingCard {...props} amount={1} hasHoverEffect={false} ref={ref} className=" col-span-6 shrink-0" />
          <div className="flex w-full items-center justify-center col-span-2 z-40">
            <div className="bg-neutral-900 border border-neutral-800 flex flex-col items-center rounded-lg overflow-hidden">
              {/* CARD NUMBER */}
              <div className="flex items-center gap-1 px-4 py-2 border-b border-neutral-800 pb-2">
                <span className="text-md font-semibold">Nº</span>
                <span className="text-white text-md">20</span>
              </div>

              {/* CARD AMOUNT */}
              <div className="flex items-center gap-2 px-4 py-2">
                {/* CARD ICON */}
                <img src="/assets/images/cards.svg" className="w-4 h-auto" alt="Foil Emblem" draggable="false" />
                <span className="flex items-center gap-0.5">
                  <span className="text-white text-md">x</span>
                  <span className="text-white text-lg">2</span>
                </span>
              </div>

              {/* FOIL AMOUNT */}
              <div className="flex items-center gap-2 px-4 py-2">
                {/* FOIL ICON */}
                <img src="/assets/images/emblems/FOIL.png" className="w-4 h-auto" alt="Foil Emblem" draggable="false" />
                <span className="flex items-center gap-0.5">
                  <span className="text-white text-md">x</span>
                  <span className="text-white text-lg">1</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
