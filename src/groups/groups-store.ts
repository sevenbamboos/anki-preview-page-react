import {setErrorState, setMessageState, MessageErrorType} from '../utils/error-message';
import {navigateToPage, resetPage, NavigateToPageSuccessResult, ResetPageSuccessResult, ResetPageErrorResult} from '../utils/paginator-support';
import {GroupData} from '../types';

type GroupsState = MessageErrorType & {
  groups: GroupData[],
  selectedGroup: GroupData | null,
  filteredGroups: GroupData[],
  groupsOnPage: GroupData[],
  page: number,
  totalPage: number,
  showNewOnly: boolean
};

export const initState: GroupsState = {
  groups: [],
  filteredGroups: [],
  groupsOnPage: [],
  page: 1,
  showNewOnly: true, // TODO put it into local storage
  totalPage: 0,
  message: null,
  error: null,
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
  } else {
    return items.filter(x => x.new);
  }
}

const onNavigateSuccess = (state: GroupsState) => 
  ({message, page, currentItems: groupsOnPage}: NavigateToPageSuccessResult<GroupData, GroupsState>) => {
    return {...setMessageState(state, message), page, groupsOnPage}; 
  };

const itemsSupplier = (st: GroupsState) => () => getFilteredGroups(st.groups, st.showNewOnly);

const onResetError = (st: GroupsState) => ({error, items, currentItems: groupsOnPage, page, totalPage}: ResetPageErrorResult<GroupData, GroupsState>) => {
    return {...setErrorState(st, error), filteredGroups: items, groupsOnPage, page, totalPage};
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

export function groupsReducer(groupsPerPage: number) {

  return function(state: GroupsState, action: GroupsAction) {
    switch (action.type) {

      case SET_GROUPS: {
        const newState = {...state, groups: action.payload};
        return resetPage(
          itemsSupplier(newState), 
          groupsPerPage,
          onResetError(newState),
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
          (e) => setErrorState(state, e),
          onNavigateSuccess(state)
        );
      }

      case PREV_PAGE: {
        return navigateToPage(
          groupsPerPage,
          () => state.page,
          () => state.filteredGroups,
          (p) => p-1, 
          () => 'Previous Page',
          (e) => setErrorState(state, e),
          onNavigateSuccess(state)
        );
      }

      case GOTO_PAGE: {
        return navigateToPage(
          groupsPerPage,
          () => state.page,
          () => state.filteredGroups,
          () => action.payload, 
          (p) => `Page ${p}`,
          (e) => setErrorState(state, e),
          onNavigateSuccess(state)
        );
      }

      case TOGGLE_SHOW_NEW: {
        const newState = {...state, showNewOnly: !state.showNewOnly}
        return resetPage(
          itemsSupplier(newState), 
          groupsPerPage,
          onResetError(newState),
          onResetSuccess(newState)
        );
      }

      default: {
        throw new Error(`Unknown action ${action}`);
      }
    }
  };
}
