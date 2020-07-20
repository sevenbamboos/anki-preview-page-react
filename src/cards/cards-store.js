import {setErrorState, setMessageState} from '../utils/error-message';
import {navigateToPage} from '../utils/paginator-support';

export const initState = {
  page: 1,
  message: null,
  error: null,
  card: null,
};

export const NEXT_PAGE = 'NEXT_PAGE';
export const PREV_PAGE = 'PREV_PAGE';
export const GOTO_PAGE = 'GOTO_PAGE';

const onNavigateSuccess = (state) => 
  ({message, page, currentItems: [card]}) => {
    return {...setMessageState(state, message), page, card}; 
  };

export const cardsReducer = (cards) => (state, action) => {
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
      throw new Error(`Unknown action type ${action.type}`);
    }      
  };
};