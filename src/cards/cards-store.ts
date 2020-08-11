import {navigateToPage, NavigateToPageSuccessResult} from '../utils/paginator-support';
import {CardData, MessageHandler} from '../types';

type CardsState = {
  page: number,
  card: CardData | null,
  currentItems: CardData[]
};

export const initState: CardsState = {
  page: 1,
  card: null,
  currentItems: []
};

export const NEXT_PAGE = 'NEXT_PAGE';
export const PREV_PAGE = 'PREV_PAGE';
export const GOTO_PAGE = 'GOTO_PAGE';

type CardsAction = {
  type: typeof NEXT_PAGE | typeof PREV_PAGE
} | {
  type: typeof GOTO_PAGE
  payload: number
};

const onNavigateSuccess = (state: CardsState, onMessage: MessageHandler) => 
  ({message, page, currentItems: [card]}: NavigateToPageSuccessResult<CardData, CardsState>): CardsState => {
    onMessage(message);
    return {...state, page, card}; 
  };

const errorHandler = (state: CardsState, error: string, onError: MessageHandler) => {
  onError(error);
  return state;
}

export const cardsReducer = (cards: CardData[], onError: MessageHandler, onMessage: MessageHandler) => (state: CardsState, action: CardsAction): CardsState => {
  switch (action.type) {

    case NEXT_PAGE: {
      return navigateToPage(
        1,
        () => state.page,
        () => cards,
        (p) => p+1, 
        () => 'Next Card',
        (e) => errorHandler(state, e, onError),
        onNavigateSuccess(state, onMessage)
      );

    }

    case PREV_PAGE: {
      return navigateToPage(
        1,
        () => state.page,
        () => cards,
        (p) => p-1, 
        () => 'Previous Card',
        (e) => errorHandler(state, e, onError),
        onNavigateSuccess(state, onMessage)
      );
    }

    case GOTO_PAGE: {
      return navigateToPage(
        1,
        () => state.page,
        () => cards,
        (p) => action.payload, 
        (p) => `Card ${p}`,
        (e) => errorHandler(state, e, onError),
        onNavigateSuccess(state, onMessage)
      );
    }

    default: {
      throw new Error(`Unknown action ${action}`);
    }      
  };
};