import { useRef } from 'react';
import { useHologramEffect } from '~/common';
import { cn } from '~/utils';

export interface HolographicCardProps {
  className?: string;
  children: React.ReactNode;
}

export const HolographicCard = ({ className, children }: HolographicCardProps) => {
  const classes = {
    container: cn('rounded-lg', className),
  };

  const ref = useRef<HTMLDivElement>(null);

  const { handleMouseMove, handleMouseLeave } = useHologramEffect(ref as React.RefObject<HTMLDivElement>);

  return (
    <div ref={ref} className={classes.container} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {children}
      <div className="card-shine absolute inset-0z-20 rounded-lg overflow-hidden" />
    </div>
  );
};
