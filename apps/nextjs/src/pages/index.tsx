import { api, Rarity } from '~/utils/api';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  const { data, error, isLoading } = api.card.getAllCardsByRarity.useQuery({ rarity: Rarity.UNCOMMON });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <main className="bg-neutral-900 grid grid-cols-3 gap-4 p-4">
        {data?.result.cards?.map((card) => (
          <div key={card.id} className="flex flex-col items-center justify-center gap-2 animate-fade-up">
            <img src={card.image} alt={card.name} className="w-48 h-48" />
            <h1 className="text-2xl font-bold">{card.name}</h1>
            <p className="text-lg">{card.description}</p>
          </div>
        ))}
      </main>
    </>
  );
};

export default Home;
