import React, {useReducer, useEffect, useState} from 'react';
import * as st from './styles';
import {setErrorState, setMessageState} from '../utils/error-message';
import { parseBasic, parseCloze, parseTags } from './card-utils';

const EVENT_SWITCH_TAB = 'EVENT_SWITCH_TAB';

const TAB_SOURCE = 'TAB_SOURCE';
const TAB_BASIC = 'TAB_BASIC';
const TAB_CLOZE = 'TAB_CLOZE';

const TABS = {
  TAB_SOURCE: 'Source',
  TAB_BASIC: 'Basic',
  TAB_CLOZE: 'Cloze' 
};

const initState = {
  tabName: TAB_BASIC,
  message: null,
  error: null,
};

function switchTab(card, state, tabName) {
  const currentTab = state.tabName;
  if (tabName === currentTab) return state;

  if (tabName === TAB_BASIC && !card.forBasic) return setErrorState(state, 'Not For Basic');
  else if (tabName === TAB_CLOZE && !card.forCloze) return setErrorState(state, 'Not For Cloze');

  return {...setMessageState(state, `Switch To Tab ${TABS[tabName]}`), tabName};
}

function isCurrentTab(state, tabName) {
  return state.tabName === tabName;
}

function TabBtn({tabName, children, isActive, dispatcher}) {
  return (
    <st.CardButton 
      isActive={isActive}
      onClick={() => dispatcher({type: EVENT_SWITCH_TAB, payload: tabName})}
      title={TABS[tabName]}>
      {children}  
      <st.CardButtonText>{TABS[tabName]}</st.CardButtonText>
    </st.CardButton>   
  );
}

function Tab({name, shouldDisplay, children}) {
  return (
    <st.CardTab data-name={name} shouldDisplay={shouldDisplay}>
      {children}
    </st.CardTab>
  );
}

function getNextState(current) {
  if (current === 'question') {
    return 'answer';
  } else {
    return 'question';
  }
}

function SourceCard({card}) {
  if (!card) return <st.FlashCardError>No Contents</st.FlashCardError>

  return (
    <>
      <st.FlashCard show={true}>
        <st.FlashCardContent>{card}</st.FlashCardContent>
        <st.FlashCardTitle>source</st.FlashCardTitle>
      </st.FlashCard>
    </>
  );
}

function BasicCard({card}) {
  const [state, setState] = useState('question');
  const [error, result] = parseBasic(card);
  if (error) return <st.FlashCardError>{error}</st.FlashCardError>

  const [question, answer] = result;
  const handleClick = () => setState(getNextState(state));
  return (
    <>
      <st.FlashCard onClick={handleClick} show={state === 'question'}>
        <st.FlashCardContent>{question}</st.FlashCardContent>
        <st.FlashCardTitle>Question</st.FlashCardTitle>
      </st.FlashCard>
      <st.FlashCard onClick={handleClick} show={state === 'answer'}>
        <st.FlashCardContent>{answer}</st.FlashCardContent>
        <st.FlashCardTitle>Answer</st.FlashCardTitle>
      </st.FlashCard>
    </>
  );
}

function ClozeCard({card}) {
  const [state, setState] = useState('question');
  const [error, result] = parseCloze(card);
  if (error) return <st.FlashCardError>{error}</st.FlashCardError>

  const [question, answer] = result;
  const handleClick = () => setState(getNextState(state));
  return (
    <>
      <st.FlashCard onClick={handleClick} show={state === 'question'}>
        <st.FlashCardContent>{question}</st.FlashCardContent>
        <st.FlashCardTitle>Question</st.FlashCardTitle>
      </st.FlashCard>
      <st.FlashCard onClick={handleClick} show={state === 'answer'}>
        <st.FlashCardContent>{answer}</st.FlashCardContent>
        <st.FlashCardTitle>Answer</st.FlashCardTitle>
      </st.FlashCard>
    </>
  );
}
export default function Card({card, onError, onMessage}) {

  const {forCloze, forBasic, tags, cloze, basic, source} = card;

  const cardReducer = (state, action) => {
    switch (action.type) {

      case EVENT_SWITCH_TAB: {
        return switchTab(
          card,
          state, 
          action.payload);
      }

      default: {
        throw new Error(`Unknown action type ${action.type}`);
      }      
    };
  };

  const [state, dispatcher] = useReducer(cardReducer, initState);

  useEffect(() => {
    if (state.message) onMessage(state.message);
  }, [state.message, onMessage]);

  useEffect(() => {
    if (state.error) onError(state.error);
  }, [state.error, onError]);

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
          tabName={TAB_BASIC} 
          isActive={isCurrentTab(state, TAB_BASIC)} 
          dispatcher={dispatcher}>
            <st.BasicIcon/>
        </TabBtn>
        <TabBtn 
          tabName={TAB_CLOZE} 
          isActive={isCurrentTab(state, TAB_CLOZE)} 
          dispatcher={dispatcher}>
            <st.ClozeIcon/>
        </TabBtn>
        <TabBtn 
          tabName={TAB_SOURCE} 
          isActive={isCurrentTab(state, TAB_SOURCE)} 
          dispatcher={dispatcher}>
            <st.SourceIcon/>
        </TabBtn>
      </st.CardControl>

      <st.CardTab name={TAB_BASIC} shouldDisplay={isCurrentTab(state, TAB_BASIC)}>
        <BasicCard card={forBasic ? basic : null} />
      </st.CardTab>

      <st.CardTab name={TAB_CLOZE} shouldDisplay={isCurrentTab(state, TAB_CLOZE)}>
        <ClozeCard card={forCloze ? cloze : null} />
      </st.CardTab>

      <Tab name={TAB_SOURCE} shouldDisplay={isCurrentTab(state, TAB_SOURCE)}>
        <SourceCard card={source} />
      </Tab>

      <st.TagsContainer>
        <st.TagsHeading>Tags</st.TagsHeading>
        {tagsContent}
      </st.TagsContainer>

    </st.CardContainer>
  );  
}