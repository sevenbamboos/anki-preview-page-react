import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { parseBasic, parseCloze, isCardParseError } from '../card/card-utils';
import { GroupData, CardData, CardDTO, EQA } from '../types';
import { 
  NormalizedObjects,
  FetchStatus,
  statusIdle,
  statusLoading,
  statusSucceeded,
  statusFailed
} from '../types';

import { 
  normalizedObjectsAdd,
  normalizedObjectsFindAll,
  normalizedObjectsContains,
  normalizedObjectsGet
} from '../common';

import {groups as groupsService} from '../service';
import {RootState} from '../app/app-store';
import { History } from 'history';

export type GroupsData = {
  id: string,
  groups: GroupData[]
}

export type GroupsState = NormalizedObjects<GroupsData> & {
  status: FetchStatus,
  error: string | null,
  selectedGroups?: string,
};

const initialState: GroupsState = {
  status: statusIdle,
  error: null,
  ids: [],
  entities: {
  }
};

type FileNameWithHistory = {
  fileName: string,
  history: History
}

export const fetchGroups = createAsyncThunk('files/fetchGroups', async ({fileName, history}: FileNameWithHistory, {getState, rejectWithValue}) => {
  const groupsState = (getState() as RootState).groups;

  if (normalizedObjectsContains(groupsState, fileName)) {
    history.push('/groups');
    return rejectWithValue({...normalizedObjectsGet(groupsState, fileName)});
  }

  const groups = await groupsService(fileName);
  history.push('/groups');
  return {id: fileName, groups};
});

export function convertGroup(group: GroupData) {
  if (!group || !group.previewCards) return group;

  group.previewCards = group.previewCards.map(c => convertCard(c));
  return group;
}

function isCardData(card: any): card is CardData {
  return card.clozeData && card.basicData;
}

function convertCard(card: CardDTO | CardData): CardData {

  if (!card) return card;

  if (card.error) return {...card, clozeData: null, basicData: null};

  if (isCardData(card)) return card;

  let clozeData: EQA | null = null;
  if (card.forCloze && card.cloze) {
    const result = parseCloze(card.cloze);
    if (isCardParseError(result)) {
      clozeData = {error: result[0]};
    } else {
      const [question, answer] = result[1];
      clozeData = {question, answer};
    }
  }

  let basicData: EQA | null = null;
  if (card.forBasic && card.basic) {
    const result = parseBasic(card.basic);
    if (isCardParseError(result)) {
      basicData = {error: result[0]};
    } else {
      const [question, answer] = result[1];
      basicData = {question, answer};
    }
  }

  return {...card, clozeData, basicData};
}

const groupsDataToId = (groups: GroupsData) => groups.id;
const groupsMapper = (groups: GroupsData) => (groups);
const groupsPostProcessor = (groups: GroupsData) => {
  groups.groups.forEach(group => convertGroup(group));
  return groups;
};

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
  },
  extraReducers: builder => {

    builder.addCase(fetchGroups.pending, (state) => {
      state.status = statusLoading;
    });

    builder.addCase(fetchGroups.fulfilled, (state, action) => {
      state.status = statusSucceeded;
      const {id, groups} = action.payload;
      normalizedObjectsAdd<GroupsData, GroupsData>(state, groupsMapper, groupsDataToId, groupsPostProcessor, {id, groups});
      state.selectedGroups = id;
      
    });

    builder.addCase(fetchGroups.rejected, (state, action) => {
      if (action.payload) {
        const {id} = action.payload as GroupsData; 
        state.selectedGroups = id;
      } else {
        state.status = statusFailed;
      }
    });
  }
});

const findByFile = (fileName: string) => (g: GroupsData): boolean => g.id === fileName;

export const selectGroupsByFile = (fileName: string) => (state: RootState) => normalizedObjectsFindAll(state.groups, findByFile(fileName));
export const selectSelectedGroups = (state: RootState) => state.groups.selectedGroups;

export default groupsSlice.reducer;
