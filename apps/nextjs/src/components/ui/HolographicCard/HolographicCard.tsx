import 'atropos/css';

import { useRef, useState } from 'react';
import Atropos from 'atropos/react'; // Asegúrate de que esta importación es correcta

export const HolographicCard = () => {
  const atroposInnerRef = useRef<HTMLDivElement>(null);
  const TEXTURES = {
    illusion: 'https://res.cloudinary.com/simey/image/upload/Dev/PokemonCards/illusion',
    illusion2: 'https://res.cloudinary.com/simey/image/upload/Dev/PokemonCards/illusion2',
    ancient: 'https://res.cloudinary.com/simey/image/upload/Dev/PokemonCards/ancient',
    angular: 'https://res.cloudinary.com/simey/image/upload/Dev/PokemonCards/angular',
  };

  const [params, setParams] = useState({
    width: 200,
    texture: TEXTURES.illusion2,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!atroposInnerRef.current) return;
    const rect = atroposInnerRef.current.getBoundingClientRect();
    const absolute = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    const percent = {
      x: Number(((100 / rect.width) * absolute.x).toFixed(3)),
      y: Number(((100 / rect.height) * absolute.y).toFixed(3)),
    };

    atroposInnerRef.current.style.setProperty('--mx', `${percent.x}%`);
    atroposInnerRef.current.style.setProperty('--my', `${percent.y}%`);
    atroposInnerRef.current.style.setProperty('--posx', `${50 + percent.x / 4 - 12.5}%`);
    atroposInnerRef.current.style.setProperty('--posy', `${50 + percent.y / 3 - 16.67}%`);
    atroposInnerRef.current.style.setProperty(
      '--hyp',
      `${Math.sqrt((percent.y - 50) ** 2 + (percent.x - 50) ** 2) / 50}`,
    );
  };

  return (
    <Atropos
      className="atropos-card w-[200px] h-auto bg-gray-900 rounded-lg overflow-hidden relative"
      rotateXMax={15}
      rotateYMax={15}
      shadow={true}
      style={{ '--texture': `url(${params.texture})` } as React.CSSProperties}
    >
      <div ref={atroposInnerRef} className="atropos-inner rounded-lg" onMouseMove={handleMouseMove}>
        <div className="w-full aspect-[1] relative overflow-hidden rounded-lg">
          <img
            src="https://i.imgur.com/dNtBvk0.png"
            alt="Card"
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          <div
            className="card-shine absolute inset-0 opacity-100 z-20 mix-blend-color-dodge"
            style={{
              backgroundImage: `
                url(${params.texture}),
                repeating-linear-gradient(0deg, #ff7773 5%, #ffed5f 10%, #a8ff5f 15%, #83fff7 20%, #7894ff 25%, #d875ff 30%, #ff7773 35%),
                repeating-linear-gradient(133deg, #0e152e 0%, #8fa3a3 3.8%, #8fc1c1 4.5%, #8fa3a3 5.2%, #0e152e 10%, #0e152e 12%),
                radial-gradient(farthest-corner circle at var(--mx) var(--my), rgba(0, 0, 0, 0.1) 12%, rgba(0, 0, 0, 0.15) 20%, rgba(0, 0, 0, 0.25) 120%)`,
              backgroundSize: '50%, 200% 700%, 300%, 200%',
              backgroundBlendMode: 'exclusion, hue, hard-light, exclusion',
            }}
          />
        </div>
      </div>
    </Atropos>
  );
};
