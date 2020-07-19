import React, {useReducer, useEffect} from 'react';
import {groups as groupsService} from '../service';
import {GroupsContainer, GroupsHeading, GroupItem, GroupList, GroupsButton, GroupsShowNewOnly, GroupsShowNewOnlyCheckBox, GroupsHeadingText, GroupsControl, GroupCount, GroupNewDiv, GroupPageProgress, GroupPageSpan, NextPageIcon, PreviousPageIcon, FirstPageIcon, LastPageIcon, CloseIcon} from './styles';
import {setErrorState, setMessageState} from '../utils/error-message';

const initState = {
  groups: [],
  filteredGroups: [],
  groupsOnPage: [],
  page: 1,
  showNewOnly: false, // TODO put it into local storage
  totalPage: 0,
  message: null,
  error: null,
  selectedGroup: null,
};

const SET_GROUPS = 'SET_GROUPS';
const NEXT_PAGE = 'NEXT_PAGE';
const PREV_PAGE = 'PREV_PAGE';
const GOTO_PAGE = 'GOTO_PAGE';
const TOGGLE_SHOW_NEW = 'TOGGLE_SHOW_NEW';

function getTotalPage(groupCount, groupsPerPage) {
  return Math.ceil(groupCount/groupsPerPage);
}

function getPage(groupCount, groupsPerPage, currentPage, wantedPage) {
  if (wantedPage < 1) return ['No Previous Pages', currentPage];

  const totalPage = getTotalPage(groupCount, groupsPerPage);
  if (wantedPage > totalPage) return ['No More Pages', currentPage];

  return [null, wantedPage];
}

function getFilteredGroups(groups, showNewOnly) {
  if (!showNewOnly) {
    return groups;
  } else {
    return groups.filter(g => g.new);
  }
}

function getGroupsOnPage(groups, groupsPerPage, page) {
  let pageStart = groupsPerPage * (page-1);
  let pageEnd = pageStart + groupsPerPage;

  if (pageStart > groups.length-1 || pageEnd <= 0) {
    return ['No result', []];
  } else {
    pageStart = Math.max(pageStart, 0);
    pageEnd = Math.min(pageEnd, groups.length);
    return [null, groups.slice(pageStart, pageEnd)];
  }
}

function navigateToPage(groupsPerPage, state, pageFunc, messageSupplier) {
  const currentPage = state.page;
  const wantedPage = pageFunc(currentPage);
  const [error, page] = getPage(state.filteredGroups.length, groupsPerPage, currentPage, wantedPage);
  if (error) {
    return setErrorState(state, error);
  } else {
    const [errorForGroups, groupsOnPage] = getGroupsOnPage(state.filteredGroups, groupsPerPage, page);
    if (errorForGroups) {
      return setErrorState(state, errorForGroups);
    } else {
      return {...setMessageState(state, messageSupplier(page)), page, groupsOnPage};
    }
  }  
}

function resetPage(groupsProvider, state, groupsPerPage) {
  const groups = groupsProvider(state);
  const filteredGroups = getFilteredGroups(groups, state.showNewOnly);
  const page = 1 // reset to the first page;
  const totalPage = getTotalPage(filteredGroups.length, groupsPerPage);
  const [error, groupsOnPage] = getGroupsOnPage(filteredGroups, groupsPerPage, page);
  if (error) {
    return {...setErrorState(state, error), filteredGroups, groupsOnPage, page, totalPage};
  } else {
    return {...state, filteredGroups, groupsOnPage, page, totalPage};
  }  
}

export function GroupNewIndicator({isNew}) {
  return (
    <>
      { isNew && (
        <GroupNewDiv>
          new!
        </GroupNewDiv>
      )}
    </>
  );
}

export default function Groups({fileName, groupsPerPage=12, onError, onMessage, onClose, onSelectGroup}){

  const groupsReducer = (state, action) => {
    switch (action.type) {

      case SET_GROUPS: {
        const newState = {...state, groups: action.payload};
        return resetPage((st) => action.payload, newState, groupsPerPage);
      }

      case NEXT_PAGE: {
        return navigateToPage(
          groupsPerPage,
          state, 
          (p) => p+1, 
          (p) => 'Next Page');
      }

      case PREV_PAGE: {
        return navigateToPage(
          groupsPerPage,
          state, 
          (p) => p-1, 
          (p) => 'Previous Page');
      }

      case GOTO_PAGE: {
        return navigateToPage(
          groupsPerPage,
          state, 
          (p) => action.payload, 
          (p) => `Page ${p}`);
      }

      case TOGGLE_SHOW_NEW: {
        const newState = {...state, showNewOnly: !state.showNewOnly}
        return resetPage((st) => st.groups, newState, groupsPerPage);
      }

      default: {
        throw new Error(`Unknown action type ${action.type}`);
      }      
    };
  };

  const [state, dispatcher] = useReducer(groupsReducer, initState);

  useEffect(() => {
    const getGroups = async () => {
      try {
        const groups = await groupsService(fileName);
        dispatcher({type: SET_GROUPS, payload: groups});
      } catch (err) {
        onError(err);
      }
    };
    getGroups();
  }, [fileName, onError]);

  useEffect(() => {
    if (state.message) onMessage(state.message);
  }, [state.message, onMessage]);

  useEffect(() => {
    if (state.error) onError(state.error);
  }, [state.error, onError]);

  if (!state.groupsOnPage) return null;

  let groupCount = (g) => g.previewCards && g.previewCards.length > 0 ? g.previewCards.length : 0; 

  let currentGroups = state.groupsOnPage.map(g => (
    <GroupItem key={g.name} isNew={g.new} onClick={() => onSelectGroup(g)}>
      {g.name}
      <GroupCount>
        {groupCount(g)} card(s)
      </GroupCount>
      <GroupNewIndicator isNew={g.new}/>
    </GroupItem>    
  ));
  
  const pageIndex = Math.min(state.page, state.totalPage);

  return (
    <GroupsContainer>
      <GroupsHeading>
        <GroupsHeadingText>{fileName}</GroupsHeadingText>
        <GroupsHeadingText>{ state.filteredGroups.length } group(s)</GroupsHeadingText>
        <GroupsShowNewOnly htmlFor='toggleShowNewForGroups'>
          New Groups?
          <GroupsShowNewOnlyCheckBox 
            type="checkbox" 
            id='toggleShowNewForGroups' 
            defaultChecked={state.showNewOnly}
            onClick={() => dispatcher({type: TOGGLE_SHOW_NEW})}/>
        </GroupsShowNewOnly>
        <GroupsButton 
          onClick={onClose}
          title="Close">
            <CloseIcon/>    
        </GroupsButton>
      </GroupsHeading>

      <GroupList>
        {currentGroups}
      </GroupList>

      <GroupsControl>
        <GroupsButton 
          onClick={() => dispatcher({type: GOTO_PAGE, payload: 1})}
          title="First Page">
            <FirstPageIcon/>
        </GroupsButton>
        <GroupsButton 
          onClick={() => dispatcher({type: PREV_PAGE})}
          title="Previous Page">
            <PreviousPageIcon/>
        </GroupsButton>
        <GroupPageSpan>
          Page {pageIndex} 
          <GroupPageProgress value={pageIndex-1} max={state.totalPage-1}>{pageIndex-1}</GroupPageProgress> 
          {state.totalPage}
        </GroupPageSpan>
        <GroupsButton 
          onClick={() => dispatcher({type: NEXT_PAGE})} 
          title="Next Page">
            <NextPageIcon/>
        </GroupsButton>
        <GroupsButton 
          onClick={() => dispatcher({type: GOTO_PAGE, payload: state.totalPage})}
          title="Last Page">
            <LastPageIcon/>
        </GroupsButton>
      </GroupsControl>

    </GroupsContainer>
  );
};