import type { ErrorCodes } from './codes';

type ErrorMessageType = {
  [K in keyof typeof ErrorCodes]: {
    [P in keyof (typeof ErrorCodes)[K]]: string;
  };
};

export const ErrorMessages: ErrorMessageType = {
  Account: {
    NotCreated: 'Algo ha sucedido, no pudimos crear la cuenta del usuario',
    DiscordUserNotFound: 'No logre encontrar al usuario de Discord. Algo anda mal con el ID proporcionado',
  },
  Card: {
    NoCard: 'No logre encontrar la carta que buscas',
    NoCards: 'No se encontraron cartas',
    NoCardsByRarety: 'No logre encontrar cartas con esa rareza',
    NoCardsBySeason: 'No se encontraron cartas para esta temporada',
    NoCardsByPackId: 'No se encontraron cartas para este paquete',
    InsufficientCards: 'No tienes copias suficientes de esta carta',
    NoAddCardToUserCollection: 'No se pudieron añadir las cartas a la colección del usuario',
    NoCoinsToBuy: 'No tienes suficientes monedas para poder comprar un paquete',
    NoCoinsToGive: 'No tienes suficientes monedas para poder dar a otro usuario',
    NoCreateCard: 'No se pudo crear la carta',
    RandomCardsNotFound: 'No se pudo obtener cartas aleatorias por rareza',
    NoCardsBySeasonAndUserId: 'No pudimos encontrar las cartas de esta temporada para el usuario que buscas',
  },
  Common: {
    ConfigNotFound: 'Configuración no encontrada',
    InvalidInput: 'Entrada inválida',
    Unknown: 'Error desconocido, por favor intenta de nuevo',
  },
  Pack: {
    NoCreatePack: 'No se pudo crear el paquete',
    NoCreatePackCards: 'No se pudieron añadir las cartas al paquete',
    NoDeletePack: 'No se pudo eliminar el paquete',
  },
  Season: {
    NoSeason: 'No encontramos la temporada que buscas',
    NoSeasons: 'No encontramos ninguna temporada',
    NoCardsBySeason: 'No encontramos las cartas de esta temporada',
  },
  System: {
    DatabaseError: 'Error de base de datos, por favor intenta de nuevo',
    UnexpectedError: 'Error inesperado, por favor intenta de nuevo',
    InvalidInput: 'Entrada inválida',
  },
  Subscription: {
    UserAlreadyHasSubscription: 'El usuario ya tiene una suscripción activa',
  },
  User: {
    NoGems: 'No tienes suficientes gemas',
    NoCoins: 'No tienes suficientes monedas',
    NoDecreaseCoins: 'No se pudieron restar las monedas al usuario',
    NoIncreaseCoins: 'No se pudieron aumentar las monedas al usuario',
    NoIncreaseGems: 'No se pudieron aumentar las gemas al usuario',
    NoUpdateUserGems: 'No se pudieron actualizar las gemas del usuario',
    NoDecreaseGems: 'No se pudieron restar las gemas al usuario',
    UnAuthorized: 'No estas autorizado para realizar esta acción',
    NoGiveCoins: 'No se pudieron dar las monedas al usuario',
    NoSetCoins: 'No se pudieron asignar las monedas al usuario',
    SenderNotFound: 'No logre encontrar tu usuario, verifica que coleccionas cartas',
    ReceiverNotFound: 'No logre encontrar al usuario receptor, verifica que colecciona cartas',
    NoUser: 'No logre encontrar tu usuario, verifica que coleccionas cartas con `/start-game`',
    NoUserCreated: 'Algo ha sucedido, no pudimos crear al usuario',
    AlreadyExists: 'Este usuarios ya existe',
    NoUserCard: 'No logre encontrar la carta que buscas',
    NoUserCards: 'El usuario aún no tiene cartas',
    NoUserPack: 'No tienes paquetes para abrir, compra uno con tus monedas virtuales',
    NoUserPacks: 'No encontramos los paquetes del usuario que buscas',
    GiveCoinsRecipientEqualsSender: 'No puedes darte monedas a ti mismo',
    GiveCardRecipientEqualsSender: 'No puedes darte cartas a ti mismo',
  },
};
