import {setErrorState, setMessageState, MessageErrorType} from '../utils/error-message';
import {navigateToPage, NavigateToPageSuccessResult} from '../utils/paginator-support';
import {CardData} from '../types';

type CardsState = MessageErrorType & {
  page: number,
  card: CardData | null,
  currentItems: CardData[]
};

export const initState: CardsState = {
  page: 1,
  message: null,
  error: null,
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

const onNavigateSuccess = (state: CardsState) => 
  ({message, page, currentItems: [card]}: NavigateToPageSuccessResult<CardData, CardsState>): CardsState => {
    return {...setMessageState(state, message), page, card}; 
  };

export const cardsReducer = (cards: CardData[]) => (state: CardsState, action: CardsAction): CardsState => {
  switch (action.type) {

    case NEXT_PAGE: {
      return navigateToPage(
        1,
        () => state.page,
        () => cards,
        (p) => p+1, 
        () => 'Next Card',
        (e) => setErrorState(state, e),
        onNavigateSuccess(state)
      );

    }

    case PREV_PAGE: {
      return navigateToPage(
        1,
        () => state.page,
        () => cards,
        (p) => p-1, 
        () => 'Previous Card',
        (e) => setErrorState(state, e),
        onNavigateSuccess(state)
      );
    }

    case GOTO_PAGE: {
      return navigateToPage(
        1,
        () => state.page,
        () => cards,
        (p) => action.payload, 
        (p) => `Card ${p}`,
        (e) => setErrorState(state, e),
        onNavigateSuccess(state)
      );
    }

    default: {
      throw new Error(`Unknown action ${action}`);
    }      
  };
};