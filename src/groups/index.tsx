import React, {useReducer} from 'react';
import * as ls from './styles';
import * as store from './groups-store';
import Paginator from '../utils/paginator';
import { GroupData } from '../types';
import { useSelector, useDispatch} from 'react-redux';
import { 
  selectGroupsByFile
} from './groups-slice';
import { onError as onErrorAction, onMessage as onMessageAction } from '../app/app-slice';

type GroupNewIndicatorProps = {
  isNew: boolean
};

export function GroupNewIndicator({isNew}: GroupNewIndicatorProps) {
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

type GroupsProp = {
  fileName: string,
  groupsPerPage?: number,
  onClose: () => void,
  onSelectGroup: (g: GroupData) => void
};

export default function Groups({fileName, groupsPerPage=12, onClose, onSelectGroup}: GroupsProp){

  const dispatch = useDispatch();
  const errorHandler = (s: string) => dispatch(onErrorAction(s));
  const messageHandler = (s: string) => dispatch(onMessageAction(s))

  const groupsFromReduxStore = useSelector(selectGroupsByFile(fileName));

  const groupProvider = () => groupsFromReduxStore ? groupsFromReduxStore[0].groups : [];
  const [state, dispatcher] = useReducer(
    store.groupsReducer(groupProvider, groupsPerPage, errorHandler, messageHandler), 
    // store.initStateAction(store.initState, groupProvider, groupsPerPage, errorHandler)
    store.initState
  );

  if (!state.groupsOnPage) return null;

  let groupCount = (g: GroupData) => g.previewCards && g.previewCards.length > 0 ? g.previewCards.length : 0; 

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
