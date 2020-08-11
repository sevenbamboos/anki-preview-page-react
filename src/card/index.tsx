import React, {useReducer, useState, ReactNode, Dispatch} from 'react';
import * as st from './styles';
import { parseTags } from './card-utils';
import * as store from './card-store';
import { CardData, EQA } from '../types';
import { useDispatch } from 'react-redux'
import { onError as onErrorAction, onMessage as onMessageAction } from '../app/app-slice';

type TabBtnProps = {
  tabName: store.TAB_NAMES,
  children: ReactNode,
  isActive: boolean,
  disabled: boolean,
  dispatcher: Dispatch<store.CardAction>
};

function TabBtn({tabName, children, isActive, disabled, dispatcher}: TabBtnProps) {
  return (
    <st.CardButton
      disabled={disabled} 
      isActive={isActive}
      onClick={() => dispatcher({type: store.EVENT_SWITCH_TAB, payload: tabName})}
      title={store.TABS[tabName]}>
      {children}  
      <st.CardButtonText>{store.TABS[tabName]}</st.CardButtonText>
    </st.CardButton>   
  );
}

type TabProps = {
  name: store.TAB_NAMES,
  shouldDisplay: boolean,
  children: ReactNode
};

function Tab({name, shouldDisplay, children}: TabProps) {
  return (
    <st.CardTab data-name={name} shouldDisplay={shouldDisplay}>
      {children}
    </st.CardTab>
  );
}

type CardProps = {
  card: CardData
};

type SourceCardProps = {
  card: string
};

function SourceCard({card}: SourceCardProps) {
  if (!card) return <st.FlashCardError>No Contents</st.FlashCardError>

  return (
    <>
      <st.FlashCard show={true}>
        <st.FlashCardContent>{card}</st.FlashCardContent>
        <st.FlashCardPlain>Source</st.FlashCardPlain>
      </st.FlashCard>
    </>
  );
}

const isSameCard = (props1: EQACardProps, props2: EQACardProps) => {

  const card1 = props1.card,
        card2 = props2.card;

  if (!card1 && !card2) return true;
  else if (!card1 || !card2) return false;

  if (store.cardHasError(card1) && store.cardHasError(card2)) {
    return card1.error === card2.error;
  } else if (store.cardHasQA(card1) && store.cardHasQA(card2)) {
    return card1.question === card2.question && 
      card1.answer === card2.answer;
  } else {
    return false;
  }
}

type EQACardProps = {
  card: EQA | null
};

const BasicCard = React.memo(({card}: EQACardProps) => {
  const [status, setStatus] = useState('question');

  if (!card) return null;

  if (store.cardHasError(card)) {
    return <st.FlashCardError>{card.error}</st.FlashCardError>
  }

  const {question, answer} = card;

  const handleClick = () => setStatus(store.getNextCardStatus(status));
  return (
    <>
      <st.FlashCard onClick={handleClick} show={status === 'question'}>
        <st.FlashCardContent>{question}</st.FlashCardContent>
        <st.FlashCardTitle>Question</st.FlashCardTitle>
      </st.FlashCard>
      <st.FlashCard onClick={handleClick} show={status === 'answer'}>
        <st.FlashCardContent>{answer}</st.FlashCardContent>
        <st.FlashCardTitle>Answer</st.FlashCardTitle>
      </st.FlashCard>
    </>
  );
}, isSameCard);

const ClozeCard = React.memo(({card}: EQACardProps) => {
  const [status, setStatus] = useState('question');

  if (!card) return null;

  if (store.cardHasError(card)) {
    return <st.FlashCardError>{card.error}</st.FlashCardError>
  }

  const {question, answer} = card;

  const handleClick = () => setStatus(store.getNextCardStatus(status));
  return (
    <>
      <st.FlashCard onClick={handleClick} show={status === 'question'}>
        <st.FlashCardContent>{question}</st.FlashCardContent>
        <st.FlashCardTitle>Question</st.FlashCardTitle>
      </st.FlashCard>
      <st.FlashCard onClick={handleClick} show={status === 'answer'}>
        <st.FlashCardContent>{answer}</st.FlashCardContent>
        <st.FlashCardTitle>Answer</st.FlashCardTitle>
      </st.FlashCard>
    </>
  );
}, isSameCard);

export default function Card({card}: CardProps) {

  const {forCloze, forBasic, tags, clozeData: cloze, basicData: basic, source} = card;

  const dispatch = useDispatch();
  const errorHandler = (s: string) => dispatch(onErrorAction(s));
  const messageHandler = (s: string) => dispatch(onMessageAction(s));
  const [state, dispatcher] = useReducer(
    store.cardReducer(card, errorHandler, messageHandler), 
    {...store.initState, tabName: store.initTab(card)}
  );

  let tagsContent = null;
  if (tags) {
    const tagsArr = parseTags(tags);
    tagsContent = tagsArr.map(t => (
      <st.TagItem key={t}><st.TagIcon/>{t}</st.TagItem>
    ));
  }

  return (
    <st.CardContainer>

      <st.CardControl>
        <TabBtn 
          tabName={store.TAB_BASIC} 
          isActive={store.isCurrentTab(state, store.TAB_BASIC)} 
          disabled={!forBasic}
          dispatcher={dispatcher}>
            <st.BasicIcon/>
        </TabBtn>
        <TabBtn 
          tabName={store.TAB_CLOZE} 
          isActive={store.isCurrentTab(state, store.TAB_CLOZE)} 
          disabled={!forCloze}
          dispatcher={dispatcher}>
            <st.ClozeIcon/>
        </TabBtn>
        <TabBtn 
          tabName={store.TAB_SOURCE} 
          isActive={store.isCurrentTab(state, store.TAB_SOURCE)} 
          disabled={false}
          dispatcher={dispatcher}>
            <st.SourceIcon/>
        </TabBtn>
      </st.CardControl>

      <st.CardTab name={store.TAB_BASIC} shouldDisplay={store.isCurrentTab(state, store.TAB_BASIC)}>
        <BasicCard card={forBasic ? basic : null} />
      </st.CardTab>

      <st.CardTab name={store.TAB_CLOZE} shouldDisplay={store.isCurrentTab(state, store.TAB_CLOZE)}>
        <ClozeCard card={forCloze ? cloze : null} />
      </st.CardTab>

      <Tab name={store.TAB_SOURCE} shouldDisplay={store.isCurrentTab(state, store.TAB_SOURCE)}>
        <SourceCard card={source} />
      </Tab>

      <st.TagsContainer>
        <st.TagsHeading>Tags</st.TagsHeading>
        {tagsContent}
      </st.TagsContainer>

    </st.CardContainer>
  );  
}