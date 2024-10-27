import { TradingCard } from '~/components';

function CollectionPage() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-80 bg-neutral-900 text-white p-4 border-r border-neutral-800 hidden md:block">
        <h2 className="text-lg font-bold mb-4">Filtros</h2>
        <div>Filtrar por rareza</div>
      </aside>

      {/* Trading Card List */}
      <main className="flex-1 p-7">
        <div className="grid gap-9 grid-cols-1 auto-rows-auto sm:grid-cols-2 grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {[...Array(40)].map((_, index) => (
            <TradingCard key={index} imgName="Name" imgUrl="https://i.imgur.com/za1tSbw.png" amount={index + 1} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default CollectionPage;
