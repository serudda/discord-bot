import { useState } from 'react';
import type { CardCountMap } from '~/components/pages/user/collection';
import { RaritySection, UserCardRarities, UserProfileImage } from '~/components/pages/user/collection';
import { api } from '~/utils/api';
import { rarityOrder } from '~/common/constants/card';
import { useRouter } from 'next/router';

const UserCollectionPage = () => {
  const router = useRouter();
  const { discordId } = router.query;
  const { data: userData } = api.user.getById.useQuery({ id: discordId as string });
  const userDiscordId = userData?.accounts.find((account) => account.provider === 'discord')?.providerAccountId;
  const { data: collectionData } = api.card.getCollection.useQuery({ discordId: userDiscordId as string });
  const { data: allCardsData } = api.card.getAllCards.useQuery({});
  const [showUnknown, setShowUnknown] = useState(false);

  const ownedCardMap = new Map<string, CardCountMap>();
  collectionData?.result?.collection?.forEach((cardCountMap) => {
    ownedCardMap.set(cardCountMap.card.id, cardCountMap);
  });

  const ownedCardIds = new Set(collectionData?.result?.collection?.map(({ card }) => card.id));
  const ownedCardCount = ownedCardIds.size;

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
                ownedCardIds={ownedCardIds}
                ownedCardMap={ownedCardMap}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default UserCollectionPage;
