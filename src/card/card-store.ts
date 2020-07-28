import {setErrorState, setMessageState, MessageErrorType} from '../utils/error-message';
import {CardData, HasError, QA} from '../types';

export const EVENT_SWITCH_TAB = 'EVENT_SWITCH_TAB';

export const TAB_SOURCE = 'TAB_SOURCE';
export const TAB_BASIC = 'TAB_BASIC';
export const TAB_CLOZE = 'TAB_CLOZE';

export type TAB_NAMES = typeof TAB_SOURCE | typeof TAB_BASIC | typeof TAB_CLOZE;

export const TABS = {
  TAB_SOURCE: 'Source',
  TAB_BASIC: 'Basic',
  TAB_CLOZE: 'Cloze' 
};

type CardState = MessageErrorType & {
  tabName: string
};

export const initState: CardState = {
  tabName: TAB_BASIC,
  message: null,
  error: null,
};

export function isCurrentTab(state: CardState, tabName: string) {
  return state.tabName === tabName;
}

export function cardHasError(card: any) : card is HasError {
  return card.error != null;
};

export function cardHasQA(card: any) : card is QA {
  return card.question != null && card.answer != null;
};

export function getNextCardStatus(current: string) {
  if (current === 'question') {
    return 'answer';
  } else {
    return 'question';
  }
}

export function initTab(card: CardData): TAB_NAMES {
  if (card.forBasic) return TAB_BASIC;
  else if (card.forCloze) return TAB_CLOZE;
  else return TAB_SOURCE;
}

function switchTab(card: CardData, state: CardState, tabName: TAB_NAMES) {
  const currentTab = state.tabName;
  if (tabName === currentTab) return state;

  if (tabName === TAB_BASIC && !card.forBasic) return setErrorState(state, 'Not For Basic');
  else if (tabName === TAB_CLOZE && !card.forCloze) return setErrorState(state, 'Not For Cloze');

  return {...setMessageState(state, `Switch To Tab ${TABS[tabName]}`), tabName};
}

export type CardAction = {
  type: typeof EVENT_SWITCH_TAB,
  payload: TAB_NAMES
};

export const cardReducer = (card: CardData) => (state: CardState, action: CardAction) => {
  switch (action.type) {

    case EVENT_SWITCH_TAB: {
      return switchTab(
        card,
        state, 
        action.payload);
    }

    default: {
      throw new Error(`Unknown action ${action}`);
    }      
  };
};