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
  normalizedObjectsGet,
  normalizedObjectsClear
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

type FileName = {
  fileName: string,
}

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

export const parseGroups = createAsyncThunk('files/parseGroups', async ({fileName}: FileName, {getState, rejectWithValue}) => {
  const groupsState = (getState() as RootState).groups;

  if (normalizedObjectsContains(groupsState, fileName)) {
    return rejectWithValue({...normalizedObjectsGet(groupsState, fileName)});
  }

  const groups = await groupsService(fileName);
  return {id: fileName, groups};
});

export function convertGroup(group: GroupData) {
  if (!group || !group.previewCards) return group;

  group.previewCards = group.previewCards.map((c, index) => convertCard(c, index));
  return group;
}

function isCardData(card: any): card is CardData {
  return card.clozeData && card.basicData;
}

function convertCard(card: CardDTO | CardData, index: number): CardData {

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

  return {...card, index, clozeData, basicData};
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
    reset(state) {
      normalizedObjectsClear(state);
    }
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

    builder.addCase(parseGroups.pending, (state) => {
      state.status = statusLoading;
    });

    builder.addCase(parseGroups.fulfilled, (state, action) => {
      state.status = statusSucceeded;
      const {id, groups} = action.payload;
      normalizedObjectsAdd<GroupsData, GroupsData>(state, groupsMapper, groupsDataToId, groupsPostProcessor, {id, groups});
    });

    builder.addCase(parseGroups.rejected, (state, action) => {
      if (!action.payload) {
        state.status = statusFailed;
      }
    });
  }
});

const findByFile = (fileName: string) => (g: GroupsData): boolean => g.id === fileName;

export const selectCard = (state: RootState) => (fileName: string, groupName: string, cardIndex: number) : CardData | null => {
  const groupsData = normalizedObjectsGet(state.groups, fileName);
  if (!groupsData) return null;
  
  const group = groupsData.groups.find(g => g.name === groupName);
  if (!group) return null;

  const cards = group.previewCards;
  return cards.length > cardIndex ? cards[cardIndex] : null;
}

export const selectGroupsByFile = (fileName: string) => (state: RootState): GroupData[] => {
  const groupsSet = normalizedObjectsFindAll(state.groups, findByFile(fileName));
  return groupsSet && groupsSet.length ? groupsSet[0].groups : [];
}
export const selectSelectedGroups = (state: RootState) => state.groups.selectedGroups;

export const { reset } = groupsSlice.actions;

export default groupsSlice.reducer;
