import {setErrorState, setMessageState} from '../utils/error-message';

export const EVENT_SWITCH_TAB = 'EVENT_SWITCH_TAB';

export const TAB_SOURCE = 'TAB_SOURCE';
export const TAB_BASIC = 'TAB_BASIC';
export const TAB_CLOZE = 'TAB_CLOZE';

export const TABS = {
  TAB_SOURCE: 'Source',
  TAB_BASIC: 'Basic',
  TAB_CLOZE: 'Cloze' 
};

export const initState = {
  tabName: TAB_BASIC,
  message: null,
  error: null,
};

export function isCurrentTab(state, tabName) {
  return state.tabName === tabName;
}

export function getNextState(current) {
  if (current === 'question') {
    return 'answer';
  } else {
    return 'question';
  }
}

function switchTab(card, state, tabName) {
  const currentTab = state.tabName;
  if (tabName === currentTab) return state;

  if (tabName === TAB_BASIC && !card.forBasic) return setErrorState(state, 'Not For Basic');
  else if (tabName === TAB_CLOZE && !card.forCloze) return setErrorState(state, 'Not For Cloze');

  return {...setMessageState(state, `Switch To Tab ${TABS[tabName]}`), tabName};
}

export const cardReducer = (card) => (state, action) => {
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