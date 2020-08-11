import React, {useReducer} from 'react';
import * as st from './styles';
import {GroupNewIndicator} from '../groups';
import Card from '../card';
import * as store from './cards-store';
import Paginator from '../utils/paginator';
import {GroupData} from '../types';
import { useDispatch } from 'react-redux'
import { onError as onErrorAction, onMessage as onMessageAction } from '../app/app-slice';

type CardsProps = {
  group: GroupData,
  onClose: () => void
};

export default function Cards({group: {name, new: isNew, previewCards: cards}, onClose}: CardsProps) {

  const dispatch = useDispatch();
  const errorHandler = (s: string) => dispatch(onErrorAction(s));
  const messageHandler = (s: string) => dispatch(onMessageAction(s));

  const [state, dispatcher] = useReducer(
    store.cardsReducer(cards, errorHandler, messageHandler), 
    {...store.initState, card: cards[0]}
  );

  const paginatorProps = {
    pageIndex: Math.min(state.page, cards.length),
    totalPage: cards.length,
    onFirst: () => dispatcher({type: store.GOTO_PAGE, payload: 1}),
    onPrev: () => dispatcher({type: store.PREV_PAGE}),
    onNext: () => dispatcher({type: store.NEXT_PAGE}),
    onLast: () => dispatcher({type: store.GOTO_PAGE, payload: cards.length}),
  };

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
          <Card card={state.card} />
        ) : (
          <span>No Cards</span>
        )}
      </st.CardItem>
      
      <Paginator {...paginatorProps} />

    </st.CardsContainer>
  );  
}