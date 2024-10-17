import { useState } from 'react';
import { api } from '~/utils/api';
import { rarityOrder } from '~/common/constants/card';
import { RaritySection } from './_components/RaritySection';
import { UserCardRarities } from './_components/UserCardRarities';
import { UserProfileImage } from './_components/UserProfileImage';
import { createCardCountMap } from './_utils/cardUtils';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

const UserProfilePage = () => {
  const pathDiscordId = useRouter().asPath.split('/')[1];
  const { data: userData } = api.user.getById.useQuery({ id: pathDiscordId as string });
  const userDiscordId = userData?.accounts.find((account) => account.provider === 'discord')?.providerAccountId;
  const { data: collectionData } = api.card.getCollection.useQuery({ discordId: userDiscordId as string });
  const { data: allCardsData } = api.card.getAllCards.useQuery({});
  const [showUnknown, setShowUnknown] = useState(false);

  const ownedCardIds = new Set(collectionData?.result?.collection?.map(({ card }) => card.id));
  const ownedCardCount = ownedCardIds.size;
  const cardCountMap = createCardCountMap(collectionData?.result.collection);

  return (
    <>
      <main className="bg-neutral-900">
        <div className="container mx-auto grid-cols-[0.3fr,1fr] grid">
          <aside className="sticky top-10 h-fit text-white">
            <UserProfileImage userImage={userData?.image as string} ownedCardCount={ownedCardCount} />
            <UserCardRarities showUnknown={showUnknown} setShowUnknown={setShowUnknown} />
          </aside>
          <div className="container mx-auto p-4">
            {rarityOrder.map((rarity) => (
              <RaritySection
                key={rarity}
                rarity={rarity}
                showUnknown={showUnknown}
                groupByRarity={(rarity) => allCardsData?.result?.cards?.filter((card) => card.rarity === rarity) ?? []}
                cardCountMap={cardCountMap}
                ownedCardIds={ownedCardIds}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default UserProfilePage;
// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps = async (context) => {
  const slug = context.params?.slug as string[];

  if (slug.length === 1) {
    const discordId = slug[0];
    return {
      redirect: {
        destination: `/${discordId}/collection`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
