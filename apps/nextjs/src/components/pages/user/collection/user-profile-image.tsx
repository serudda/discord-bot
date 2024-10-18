import { cn } from '~/lib/utils';

interface UserProfileImageProps {
  /**
   * The URL of the user's profile image.
   */
  userImage: string;

  /**
   * The total number of cards owned by the user.
   */
  ownedCardCount: number;
}

export const UserProfileImage = ({ userImage, ownedCardCount }: UserProfileImageProps) => {
  const classes = {
    container: cn('relative w-40 h-40 mx-auto group/profile z-50 duration-500'),
    profileImage: cn(
      'backface-hidden',
      'absolute inset-0 w-full h-full',
      'rounded-full',
      'transition-transform duration-500 ease-in-out',
      'hover:rotate-y-180',
      'group-hover/profile:rotate-y-180',
    ),
    profileBack: cn(
      'backface-hidden',
      'border border-gray-gray-300',
      'rotate-y-180',
      'group-hover/profile:rotate-y-0',
      'absolute inset-0 flex items-center justify-center',
      'bg-neutral-900 rounded-full',
      'rotate-y-180 transition-transform duration-500 ease-in-out',
      'hover:rotate-y-0',
    ),
    cardCount: cn(
      'text-4xl font-bold ',
      'bg-gradient-to-br from-amber-200 to-amber-500',
      'bg-clip-text text-transparent from-40%',
    ),
    cardCountText: cn(
      'mt-4',
      'text-sm max-w-[15ch] font-bold ',
      'bg-gradient-to-br from-gray-200 to-gray-800',
      'bg-clip-text text-transparent from-60%',
    ),
  };

  return (
    <div className={classes.container}>
      {/* Front of the Profile Image */}
      <div className={classes.profileImage}>
        <img src={userImage} alt="User Profile" className="w-full h-full rounded-full" />
      </div>

      {/* Back of the Profile Pic */}
      <div className={classes.profileBack}>
        <div className="text-center">
          <p className={classes.cardCount}>{ownedCardCount}</p>
          <p className={classes.cardCountText}>TOTAL CARDS OWNED</p>
        </div>
      </div>
    </div>
  );
};
