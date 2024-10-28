import { DetailTradingCardModal } from '~/components';
import { api, Response } from '~/utils';
import { useRouter } from 'next/router';

const CollectionPage = () => {
  const router = useRouter();
  const { username } = router.query;

  // Get user data
  const { data: userData } = api.user.getByUsername.useQuery({ username: username as string }, { enabled: !!username });

  // Get current season
  const { data: seasonData } = api.season.getCurrentSeason.useQuery({});

  // Get user season progress
  const { data: seasonProgressData } = api.user.getUserSeasonProgress.useQuery(
    { seasonId: seasonData?.result?.season?.id as string, userId: userData?.result?.user?.id as string },
    { enabled: userData?.result?.status === Response.SUCCESS && seasonData?.result?.status === Response.SUCCESS },
  );

  if (!userData || !seasonProgressData || seasonProgressData.result.status === Response.ERROR) return null;

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
          {seasonProgressData.result.progress?.cards?.map((item, index) => (
            <DetailTradingCardModal
              key={index}
              imgName={item.card.name}
              imgUrl={item.card.image}
              amount={item.quantity}
              isFoil={item.isFoil}
              isBack={!item.isOwned}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default CollectionPage;
