import {setErrorState, setMessageState} from '../utils/error-message';
import {navigateToPage, resetPage} from '../utils/paginator-support';

export const initState = {
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

function getFilteredGroups(items, showNewOnly) {
  if (!showNewOnly) {
    return items;
  } else {
    return items.filter(x => x.new);
  }
}

const onNavigateSuccess = (state) => 
  ({message, page, currentItems: groupsOnPage}) => {
    return {...setMessageState(state, message), page, groupsOnPage}; 
  };

const itemsSupplier = (st) => () => getFilteredGroups(st.groups, st.showNewOnly);

const onResetError = (st) => ({error, items, currentItems: groupsOnPage, page, totalPage}) => {
    return {...setErrorState(st, error), filteredGroups: items, groupsOnPage, page, totalPage};
  };

const onResetSuccess = (st) => ({items, currentItems: groupsOnPage, page, totalPage}) => {
  return {...st, filteredGroups: items, groupsOnPage, page, totalPage};
};

export function groupsReducer(groupsPerPage) {

  return function(state, action) {
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
        throw new Error(`Unknown action type ${action.type}`);
      }
    }
  };
}
