import React, {useReducer, useState, useContext} from 'react';
import * as st from './styles';
import { parseBasic, parseCloze, parseTags } from './card-utils';
import * as store from './card-store';
import {useMessageAndError, MessageAndErrorContext} from '../utils/error-message';

function TabBtn({tabName, children, isActive, dispatcher}) {
  return (
    <st.CardButton 
      isActive={isActive}
      onClick={() => dispatcher({type: store.EVENT_SWITCH_TAB, payload: tabName})}
      title={store.TABS[tabName]}>
      {children}  
      <st.CardButtonText>{store.TABS[tabName]}</st.CardButtonText>
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
  const handleClick = () => setState(store.getNextState(state));
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
  const handleClick = () => setState(store.getNextState(state));
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

export default function Card({card}) {

  const {forCloze, forBasic, tags, cloze, basic, source} = card;

  const [state, dispatcher] = useReducer(store.cardReducer(card), store.initState);

  const {onMessage, onError} = useContext(MessageAndErrorContext);

  useMessageAndError(state, onMessage, onError);

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
          dispatcher={dispatcher}>
            <st.BasicIcon/>
        </TabBtn>
        <TabBtn 
          tabName={store.TAB_CLOZE} 
          isActive={store.isCurrentTab(state, store.TAB_CLOZE)} 
          dispatcher={dispatcher}>
            <st.ClozeIcon/>
        </TabBtn>
        <TabBtn 
          tabName={store.TAB_SOURCE} 
          isActive={store.isCurrentTab(state, store.TAB_SOURCE)} 
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