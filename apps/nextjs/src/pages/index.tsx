import { api, Rarity } from '~/utils/api';
import { type NextPage } from 'next';

const Home: NextPage = () => {
  const { data, error, isLoading } = api.card.getAllCardsByRarity.useQuery({ rarity: Rarity.UNCOMMON });

  if (isLoading) {
    return (
      <div className="bg-neutral-900 h-screen w-screen grid place-items-center text-2xl text-white">Loading...</div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <main className="bg-neutral-900 ">
        <div className="container mx-auto grid grid-cols-4 gap-x-4 place-items-center  gap-y-10 p-4">
          {data?.result.cards?.map((card, index) => (
            <div
              key={card.id}
              className="card-container"
              style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}
            >
              <img src={card.image} alt={card.name} className="w-48 h-62  card-image" />
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Home;
