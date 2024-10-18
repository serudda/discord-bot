import * as React from 'react';
import { cn } from '~/common';
import * as HoverCardPrimitive from '@radix-ui/react-hover-card';

const HoverCard = HoverCardPrimitive.Root;

const HoverCardTrigger = HoverCardPrimitive.Trigger;

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => {
  const classes = {
    hoverCardContent: cn(
      'z-50 w-64 rounded-md border px-4 py-1 text-sm bg-neutral-900 text-gray-300 shadow-md',
      'outline-none data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 ',
      'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
      'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
      'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className,
    ),
  };
  return (
    <HoverCardPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={classes.hoverCardContent}
      {...props}
    />
  );
});
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

export { HoverCard, HoverCardContent, HoverCardTrigger };
