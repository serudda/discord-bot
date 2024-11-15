import { api } from '~/utils';
import { useRouter } from 'next/router';

const UserCollectionPage = () => {
  const router = useRouter();
  const { userId } = router.query;
  const { data: userData } = api.user.getById.useQuery({ id: userId as string });
  // const { data: collectionData } = api.card.getCollection.useQuery({ userId: userId as string });
  const { data: allCardsData } = api.card.getAllCards.useQuery({});

  /*
  const allCards = allCardsData?.result?.cards ?? [];
  const userCollection = collectionData?.result?.collection ?? [];
  const [showUnownedCards, setShowUnownedCards] = useState(false);
  const [activeCategory, setActiveCategory] = useState<FilterMode>(FilterMode.Rarity);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.Ascending);
  const [isMounted, setIsMounted] = useState(false);


  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <main className="bg-neutral-900 min-h-dvh">
      <div className="container mx-auto grid-cols-[0.3fr,1fr] grid">
        <UserSidebar
          userImage={userData?.result?.user?.image as string}
          userCollection={userCollection}
          showUnownedCards={showUnownedCards}
          setShowUnownedCards={setShowUnownedCards}
          setActiveCategory={setActiveCategory}
          setSortOrder={setSortOrder}
        />

        <div className="container mx-auto p-4">
          <CategorySection
            activeCategory={activeCategory}
            sortOrder={sortOrder}
            showUnownedCards={showUnownedCards}
            allCards={allCards}
            userCollection={userCollection}
          />
        </div>
        {isMounted && <HolographicCard />}
      </div>
    </main>
  );
  */

  return null;
};

export default UserCollectionPage;
