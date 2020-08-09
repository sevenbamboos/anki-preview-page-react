import {navigateToPage, resetPage, NavigateToPageSuccessResult, ResetPageSuccessResult, ResetPageErrorResult} from '../utils/paginator-support';
import {GroupData, MessageHandler} from '../types';

type GroupsState = {
  selectedGroup: GroupData | null,
  filteredGroups: GroupData[],
  groupsOnPage: GroupData[],
  page: number,
  totalPage: number,
  showNewOnly: boolean
};

export const initState: GroupsState = {
  filteredGroups: [],
  groupsOnPage: [],
  page: 1,
  showNewOnly: true, // TODO put it into local storage
  totalPage: 0,
  selectedGroup: null,
};

export const SET_GROUPS = 'SET_GROUPS';
export const NEXT_PAGE = 'NEXT_PAGE';
export const PREV_PAGE = 'PREV_PAGE';
export const GOTO_PAGE = 'GOTO_PAGE';
export const TOGGLE_SHOW_NEW = 'TOGGLE_SHOW_NEW';

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

const itemsSupplier = (groupsProvider: GroupsProvider, st: GroupsState) => () => getFilteredGroups(groupsProvider(), st.showNewOnly);

const onResetError = (st: GroupsState, onError: MessageHandler) => ({error, items, currentItems: groupsOnPage, page, totalPage}: ResetPageErrorResult<GroupData, GroupsState>) => {
    onError(error);
    return {...st, filteredGroups: items, groupsOnPage, page, totalPage};
  };

const onResetSuccess = (st: GroupsState) => ({items, currentItems: groupsOnPage, page, totalPage}: ResetPageSuccessResult<GroupData, GroupsState>) => {
  return {...st, filteredGroups: items, groupsOnPage, page, totalPage};
};

type GroupsAction = {
  type: typeof NEXT_PAGE | typeof PREV_PAGE | typeof TOGGLE_SHOW_NEW
} | {
  type: typeof GOTO_PAGE,
  payload: number
} | {
  type: typeof SET_GROUPS,
  payload: GroupData[]
};

type GroupsProvider = () => GroupData[];

export const initStateAction = (state: GroupsState, groupsProvider: GroupsProvider, groupsPerPage: number, onError: MessageHandler) => {
  return resetPage(itemsSupplier(groupsProvider, state), groupsPerPage, onResetError(state, onError), onResetSuccess(state));
};

export function groupsReducer(groupsProvider: GroupsProvider, groupsPerPage: number, onError: MessageHandler, onMessage: MessageHandler) {

  return function(state: GroupsState, action: GroupsAction) {
    switch (action.type) {

      case SET_GROUPS: {
        const newState = {...state, groups: action.payload};
        return resetPage(
          itemsSupplier(groupsProvider, newState), 
          groupsPerPage,
          onResetError(newState, onError),
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
          itemsSupplier(groupsProvider, newState), 
          groupsPerPage,
          onResetError(newState, onError),
          onResetSuccess(newState)
        );
      }

      default: {
        throw new Error(`Unknown action ${action}`);
      }
    }
  };
}
