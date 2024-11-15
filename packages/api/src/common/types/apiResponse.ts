import type { Account, Card, Pack, PackCard, Prisma, Season, User, UserCard } from '@prisma/client';

export enum Response {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface BaseResponse {
  status: Response;
}

export type SuccessResponse<T> = BaseResponse & {
  status: Response.SUCCESS;
} & T;

export interface ErrorDetail {
  code: string;
  domain: string;
  handler: string;
  message: string;
}

export type ErrorResponse = BaseResponse & {
  status: Response.ERROR;
  error: ErrorDetail;
};

export interface ApiResponse<T> {
  result: SuccessResponse<T> | ErrorResponse;
}

// Specific response type for each endpoint organized by domain

// Account
export type AccountResponse = ApiResponse<{ account: Account }>;
export type AccountsResponse = ApiResponse<{ accounts: Array<Account> }>;

// Card
export type CardResponse = ApiResponse<{ card: Card }>;
export type CardsResponse = ApiResponse<{ cards: Array<Card> }>;
export type CardCreateResponse = ApiResponse<{ card: Card }>;
export type UserCardResponse = ApiResponse<{ userCard: UserCard }>;
export type UserCardsResponse = ApiResponse<{ userCards: Array<UserCard> }>;
export type UserCardWithCardResponse = ApiResponse<{ userCard: UserCardWithCard }>;
export type UserCardsWithCardResponse = ApiResponse<{ userCards: Array<UserCardWithCard> }>;
export type UserSeasonProgressResponse = ApiResponse<{
  progress: {
    progressCards: {
      card: Card;
      quantity: number;
      isFoil: boolean;
      foilQuantity: number;
      isOwned: boolean;
    }[];
    stats: {
      total: number;
      owned: number;
      foils: number;
      missing: number;
      percentage: number;
    };
  };
}>;

// Pack Card
export type PackCardsResponse = ApiResponse<{ packCards: Array<PackCard> }>;

// User
export type UserCardWithCard = Prisma.UserCardGetPayload<{
  include: { card: true };
}>;
export type UserResponse = ApiResponse<{ user: User }>;
export type UserRegisterResponse = ApiResponse<{
  name: string;
  coins: number;
  gems: number;
}>;
export type UserPackResponse = ApiResponse<{ userPack: Pack }>;
export type UserPacksResponse = ApiResponse<{ userPacks: Array<Pack> }>;
export type UserInventoryResponse = ApiResponse<{
  packs: number;
  coins: number;
  gems: number;
}>;
export type UserCoinsResponse = ApiResponse<{ coins: number }>;
export type UserGemsResponse = ApiResponse<{ gems: number; userId: string }>;

// Season
export type SeasonResponse = ApiResponse<{ season: Season }>;
export type SeasonsResponse = ApiResponse<{ seasons: Array<Season> }>;

// Pack
export type AmountOfPacksResponse = ApiResponse<{ amountOfPacks: number }>;
export type PackWithCardsResponse = ApiResponse<{ pack: Pack }>;
export type BuyPackResponse = ApiResponse<{
  amountOfPacks: number;
  coins: number;
}>;
export type OpenPackResponse = ApiResponse<{
  newUserCards: Array<UserCard>;
  amountOfPacks: number;
}>;
