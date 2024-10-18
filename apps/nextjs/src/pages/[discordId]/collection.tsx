import { useState } from 'react';
import { api } from '~/utils/api';
import { rarityOrder } from '~/common';
import { RaritySection, UserSidebar, type CardCountMap } from '~/components';
import { useRouter } from 'next/router';

const UserCollectionPage = () => {
  const router = useRouter();
  const { discordId } = router.query;
  const { data: userData } = api.user.getById.useQuery({ id: discordId as string });
  const userDiscordId = userData?.accounts.find((account) => account.provider === 'discord')?.providerAccountId;
  const { data: collectionData } = api.card.getCollection.useQuery({ discordId: userDiscordId as string });
  const { data: allCardsData } = api.card.getAllCards.useQuery({});
  const [showUnownedCards, setShowUnownedCards] = useState(false);

  const ownedCardMap = new Map<string, CardCountMap>();
  collectionData?.result?.collection?.forEach((cardCountMap) => {
    ownedCardMap.set(cardCountMap.card.id, cardCountMap);
  });

  const ownedCardIds = new Set(collectionData?.result?.collection?.map(({ card }) => card.id));
  const ownedCardCount = ownedCardIds.size;

  const ownedCountsPerRarity: Record<string, number> = {};
  let ownedFoilCount = 0;

  rarityOrder.forEach((rarity) => {
    ownedCountsPerRarity[rarity] = 0;
  });

  collectionData?.result?.collection?.forEach(({ card, isFoil }) => {
    const rarity = card.rarity;
    if (rarity && !isFoil) ownedCountsPerRarity[rarity] = (ownedCountsPerRarity[rarity] ?? 0) + 1;

    if (isFoil) ownedFoilCount += 1;
  });

  return (
    <>
      <main className="bg-neutral-900">
        <div className="container mx-auto grid-cols-[0.3fr,1fr] grid">
          <UserSidebar
            userImage={userData?.image as string}
            ownedCardCount={ownedCardCount}
            showUnownedCards={showUnownedCards}
            setShowUnownedCards={setShowUnownedCards}
            ownedCountsPerRarity={ownedCountsPerRarity}
            ownedFoilCount={ownedFoilCount}
          />

          <div className="container mx-auto p-4">
            {rarityOrder.map((rarity) => (
              <RaritySection
                key={rarity}
                rarity={rarity}
                shownUnownedCards={showUnownedCards}
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
