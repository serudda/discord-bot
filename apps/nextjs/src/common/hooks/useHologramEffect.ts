interface UseHologramEffect {
  (
    /*
     * Reference to the element.
     */
    elemRef: React.RefObject<HTMLElement>,
  ): { handleMouseMove: (event: React.MouseEvent) => void; handleMouseLeave: () => void };
}

export const useHologramEffect: UseHologramEffect = (elemRef) => {
  const handleMouseMove = (event: React.MouseEvent) => {
    const element = elemRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const absolute = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    const percent = {
      x: Number(((100 / rect.width) * absolute.x).toFixed(3)),
      y: Number(((100 / rect.height) * absolute.y).toFixed(3)),
    };

    element.style.setProperty('--mx', `${percent.x}%`);
    element.style.setProperty('--my', `${percent.y}%`);
    element.style.setProperty('--posx', `${50 + percent.x / 4 - 12.5}%`);
    element.style.setProperty('--posy', `${50 + percent.y / 3 - 16.67}%`);
    element.style.setProperty('--hyp', `${Math.sqrt((percent.y - 50) ** 2 + (percent.x - 50) ** 2) / 50}`);
  };

  // Handle Mouse Leave
  const handleMouseLeave = () => {
    const element = elemRef.current;
    if (!element) return;
    element.style.setProperty('--mx', '50%');
    element.style.setProperty('--my', '50%');
    element.style.setProperty('--posx', '50%');
    element.style.setProperty('--posy', '50%');
    element.style.setProperty('--hyp', '0');
  };

  return { handleMouseMove, handleMouseLeave };
};
