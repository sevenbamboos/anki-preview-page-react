import React, {useReducer, useEffect, useContext} from 'react';
import {groups as groupsService} from '../service';
import * as ls from './styles';
import * as store from './groups-store.js';
import {useMessageAndError, MessageAndErrorContext} from '../utils/error-message';
import Paginator from '../utils/paginator';

export function GroupNewIndicator({isNew}) {
  return (
    <>
      { isNew && (
        <ls.GroupNewDiv>
          new!
        </ls.GroupNewDiv>
      )}
    </>
  );
}

export default function Groups({fileName, groupsPerPage=12, onClose, onSelectGroup}){

  const [state, dispatcher] = useReducer(store.groupsReducer(groupsPerPage), store.initState);
  const {onMessage, onError} = useContext(MessageAndErrorContext);

  useEffect(() => {
    const abortController = new AbortController();

    const getGroups = async () => {
      try {
        const groups = await groupsService(fileName);
        dispatcher({type: store.SET_GROUPS, payload: groups});
      } catch (err) {
        onError(err);
      }
    };
    getGroups();

    return () => abortController.abort();
    
  }, [fileName, onError]);

  useMessageAndError(state, onMessage, onError);

  if (!state.groupsOnPage) return null;

  let groupCount = (g) => g.previewCards && g.previewCards.length > 0 ? g.previewCards.length : 0; 

  let currentGroups = state.groupsOnPage.map(g => (
    <ls.GroupItem key={g.name} isNew={g.new} onClick={() => onSelectGroup(g)}>
      {g.name}
      <ls.GroupCount>
        {groupCount(g)} card(s)
      </ls.GroupCount>
      <GroupNewIndicator isNew={g.new}/>
    </ls.GroupItem>    
  ));
  
  const paginatorProps = {
    pageIndex: Math.min(state.page, state.totalPage),
    totalPage: state.totalPage,
    onFirst: () => dispatcher({type: store.GOTO_PAGE, payload: 1}),
    onPrev: () => dispatcher({type: store.PREV_PAGE}),
    onNext: () => dispatcher({type: store.NEXT_PAGE}),
    onLast: () => dispatcher({type: store.GOTO_PAGE, payload: state.totalPage}),
  };

  return (
    <ls.GroupsContainer>
      <ls.GroupsHeading>
        <ls.GroupsHeadingText>{fileName}</ls.GroupsHeadingText>
        <ls.GroupsHeadingText>{ state.filteredGroups.length } group(s)</ls.GroupsHeadingText>
        <ls.GroupsShowNewOnly htmlFor='toggleShowNewForGroups'>
          New Groups?
          <ls.GroupsShowNewOnlyCheckBox 
            type="checkbox" 
            id='toggleShowNewForGroups' 
            defaultChecked={state.showNewOnly}
            onClick={() => dispatcher({type: store.TOGGLE_SHOW_NEW})}/>
        </ls.GroupsShowNewOnly>
        <ls.GroupsButton 
          onClick={onClose}
          title="Close">
            <ls.CloseIcon/>    
        </ls.GroupsButton>
      </ls.GroupsHeading>

      <ls.GroupList>
        {currentGroups}
      </ls.GroupList>

      <Paginator {...paginatorProps} />

    </ls.GroupsContainer>
  );
};
