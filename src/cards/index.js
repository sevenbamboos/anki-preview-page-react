import React, {useReducer, useEffect} from 'react';
import * as st from './styles';
import {GroupNewIndicator} from '../groups';
import {setErrorState, setMessageState} from '../utils/error-message';
import Card from '../card';

const initState = {
  page: 1,
  message: null,
  error: null,
  card: null,
};

const NEXT_PAGE = 'NEXT_PAGE';
const PREV_PAGE = 'PREV_PAGE';
const GOTO_PAGE = 'GOTO_PAGE';

function navigateToPage(cards, state, pageFunc, messageSupplier) {
  const currentPage = state.page;
  const wantedPage = pageFunc(currentPage);
  if (wantedPage < 1 || wantedPage > cards.length) {
    return setErrorState(state, 'No More or No Less');
  } else {
    return {...setMessageState(state, messageSupplier(wantedPage)), page: wantedPage, card: cards[wantedPage-1]};
  }  
}

export default function Cards({group: {name, new: isNew, previewCards: cards}, onError, onMessage, onClose}) {

  const cardsReducer = (state, action) => {
    switch (action.type) {

      case NEXT_PAGE: {
        return navigateToPage(
          cards,
          state, 
          (p) => p+1, 
          (p) => 'Next Card');
      }

      case PREV_PAGE: {
        return navigateToPage(
          cards,
          state, 
          (p) => p-1, 
          (p) => 'Previous Card');
      }

      case GOTO_PAGE: {
        return navigateToPage(
          cards,
          state, 
          (p) => action.payload, 
          (p) => `Card ${p}`);
      }

      default: {
        throw new Error(`Unknown action type ${action.type}`);
      }      
    };
  };

  const [state, dispatcher] = useReducer(cardsReducer, {...initState, card: cards[0]});

  useEffect(() => {
    if (state.message) onMessage(state.message);
  }, [state.message, onMessage]);

  useEffect(() => {
    if (state.error) onError(state.error);
  }, [state.error, onError]);

  const pageIndex = Math.min(state.page, cards.length);

  return (
    <st.CardsContainer>
      <st.CardsHeading>
        <st.CardsHeadingText>Group {name}</st.CardsHeadingText>
        <GroupNewIndicator isNew={isNew}/>
        <st.CardsHeadingText>{ cards.length } card(s)</st.CardsHeadingText>
        <st.CardsButton 
          onClick={onClose}
          title="Close">
            <st.CloseIcon/>    
        </st.CardsButton>
      </st.CardsHeading>

      <st.CardItem>
        {state.card ? (
          <Card card={state.card} onError={onError} onMessage={onMessage}/>
        ) : (
          <span>No Cards</span>
        )}
      </st.CardItem>

      <st.CardsControl>
        <st.CardsButton 
          onClick={() => dispatcher({type: GOTO_PAGE, payload: 1})}
          title="First Card">
            <st.FirstPageIcon/>
        </st.CardsButton>
        <st.CardsButton 
          onClick={() => dispatcher({type: PREV_PAGE})}
          title="Previous Card">
            <st.PreviousPageIcon/>
        </st.CardsButton>
        <st.CardPageSpan>
          Card {pageIndex} 
          <st.CardPageProgress value={pageIndex-1} max={cards.length-1}>{pageIndex-1}</st.CardPageProgress> 
          {cards.length}
        </st.CardPageSpan>
        <st.CardsButton 
          onClick={() => dispatcher({type: NEXT_PAGE})} 
          title="Next Card">
            <st.NextPageIcon/>
        </st.CardsButton>
        <st.CardsButton 
          onClick={() => dispatcher({type: GOTO_PAGE, payload: cards.length})}
          title="Last Card">
            <st.LastPageIcon/>
        </st.CardsButton>
      </st.CardsControl>

    </st.CardsContainer>
  );  
}