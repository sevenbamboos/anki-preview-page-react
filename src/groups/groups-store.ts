import {navigateToPage, resetPage, NavigateToPageSuccessResult, ResetPageSuccessResult, ResetPageErrorResult} from '../utils/paginator-support';
import {GroupData, MessageHandler} from '../types';

export const VIEW_MODE_CARDS = 'cards';
export const VIEW_MODE_CHART = 'chart';

type ViewModeType = typeof VIEW_MODE_CARDS | typeof VIEW_MODE_CHART;

type GroupsState = {
  selectedGroup: GroupData | null,
  filteredGroups: GroupData[],
  groupsOnPage: GroupData[],
  page: number,
  totalPage: number,
  showNewOnly: boolean,
  viewMode: ViewModeType
};

export const initState: GroupsState = {
  filteredGroups: [],
  groupsOnPage: [],
  page: 1,
  showNewOnly: true, // TODO put it into local storage
  totalPage: 0,
  selectedGroup: null,
  viewMode: VIEW_MODE_CARDS
};

export const SET_GROUPS = 'SET_GROUPS';
export const NEXT_PAGE = 'NEXT_PAGE';
export const PREV_PAGE = 'PREV_PAGE';
export const GOTO_PAGE = 'GOTO_PAGE';
export const TOGGLE_SHOW_NEW = 'TOGGLE_SHOW_NEW';
export const TOGGLE_VIEW_MODE = 'TOGGLE_VIEW_MODE';

function getFilteredGroups(items: GroupData[], showNewOnly: boolean) {
  if (!showNewOnly) {
    return items;
  } else if (!items) {
    return [];
  } else {
    return items.filter(x => x.new);
  }
}

const errorHandler = (state: GroupsState, error: string, onError: MessageHandler) => {
  onError(error);
  return state;
}

const onNavigateSuccess = (state: GroupsState, onMessage: MessageHandler) => 
  ({message, page, currentItems: groupsOnPage}: NavigateToPageSuccessResult<GroupData, GroupsState>) => {
    onMessage(message);
    return {...state, page, groupsOnPage}; 
  };

const itemsSupplier = (groups: GroupData[], st: GroupsState) => () => getFilteredGroups(groups, st.showNewOnly);

const onResetError = (st: GroupsState, onError: MessageHandler) => ({error, items, currentItems: groupsOnPage, page, totalPage}: ResetPageErrorResult<GroupData, GroupsState>) => {
    onError(error);
    return {...st, filteredGroups: items, groupsOnPage, page, totalPage};
  };

const onResetSuccess = (st: GroupsState) => ({items, currentItems: groupsOnPage, page, totalPage}: ResetPageSuccessResult<GroupData, GroupsState>) => {
  return {...st, filteredGroups: items, groupsOnPage, page, totalPage};
};

type GroupsAction = {
  type: typeof NEXT_PAGE | typeof PREV_PAGE | typeof TOGGLE_SHOW_NEW | typeof TOGGLE_VIEW_MODE
} | {
  type: typeof GOTO_PAGE,
  payload: number
} | {
  type: typeof SET_GROUPS,
  payload: GroupData[]
};

export function groupsReducer(groups: GroupData[], groupsPerPage: number, onError: MessageHandler, onMessage: MessageHandler) {

  return function(state: GroupsState, action: GroupsAction) {
    switch (action.type) {

      case SET_GROUPS: {
        const newState = {...state, groups: action.payload};
        return resetPage(
          itemsSupplier(groups, newState), 
          groupsPerPage,
          onResetError(newState, (_) => {} /* do no error handling because it will trigger update to app component which causes infinite render */),
          onResetSuccess(newState)
        );
      }

      case NEXT_PAGE: {
        return navigateToPage(
          groupsPerPage,
          () => state.page,
          () => state.filteredGroups,
          (p) => p+1, 
          () => 'Next Page',
          (e) => errorHandler(state, e, onError),
          onNavigateSuccess(state, onMessage)
        );
      }

      case PREV_PAGE: {
        return navigateToPage(
          groupsPerPage,
          () => state.page,
          () => state.filteredGroups,
          (p) => p-1, 
          () => 'Previous Page',
          (e) => errorHandler(state, e, onError),
          onNavigateSuccess(state, onMessage)
        );
      }

      case GOTO_PAGE: {
        return navigateToPage(
          groupsPerPage,
          () => state.page,
          () => state.filteredGroups,
          () => action.payload, 
          (p) => `Page ${p}`,
          (e) => errorHandler(state, e, onError),
          onNavigateSuccess(state, onMessage)
        );
      }

      case TOGGLE_SHOW_NEW: {
        const newState = {...state, showNewOnly: !state.showNewOnly}
        return resetPage(
          itemsSupplier(groups, newState), 
          groupsPerPage,
          onResetError(newState, onError),
          onResetSuccess(newState)
        );
      }

      case TOGGLE_VIEW_MODE: {
        const viewMode: ViewModeType = state.viewMode === VIEW_MODE_CARDS ? VIEW_MODE_CHART : VIEW_MODE_CARDS;
        return {...state, viewMode};
      }

      default: {
        throw new Error(`Unknown action ${action}`);
      }
    }
  };
}
