import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
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
  normalizedObjectsGetAll,
  normalizedObjectsClear
} from '../common';

import { addAllKeywords, searchKeyword } from '../service/keyword-index';
import {RootState} from '../app/app-store';

export type SearchData = {
  fileName: string,
  index: any 
};

export type SearchResult = {
  fileName: string,
  groupName: string,
  cardIndex: number
}

export type SearchState = NormalizedObjects<SearchData> & {
  status: FetchStatus,
  error: string | null,
  latestTerms: string[],
  results: SearchResult[]
};

const initialState: SearchState = {
  status: statusIdle,
  error: null,
  ids: [],
  entities: {
  },
  latestTerms: [],
  results: []
};

export const buildIndex = createAsyncThunk('search/buildIndex', async (_, {getState}) => {
  
  const groupsState = (getState() as RootState).groups;

  const indexes = [];
  for (const fileName in groupsState.entities) {
    const {groups} = groupsState.entities[fileName];
    const index = await addAllKeywords(groups);
    indexes.push({fileName, index});
  }

  return indexes;
});

type Keywords = {
  keywords: string[],
}

export const searchIndex = createAsyncThunk('search/searchIndex', async ({keywords}: Keywords, {getState, rejectWithValue}) => {
  const searchState = (getState() as RootState).search;

  const searchJobs = normalizedObjectsGetAll(searchState).map(
    ({index, fileName}: SearchData) => searchKeyword(keywords, index, fileName) as Promise<any[]>);

  const result = await Promise.all(searchJobs);

  return result.flatMap(fileNameWithGroupWithCards => {

    const [fileName, groupWithCards] = fileNameWithGroupWithCards;
    return groupWithCards.map((groupWithCard:string) => {
      const [groupName, cardIndexInString] = groupWithCard.split(':');
      const cardIndex = Number.parseInt(cardIndexInString);
      return {fileName, groupName, cardIndex} as SearchResult; 
    });
  }) as SearchResult[];

});

const searchDataToId = (search: SearchData) => search.fileName;
const searchMapper = (search: SearchData) => (search);
const searchPostProcessor = (search: SearchData) => search;

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    keepTerms(state, action) {
      state.latestTerms.push(...(action.payload as string[]));
    },
    reset(state) {
      normalizedObjectsClear(state);
    }
  },
  extraReducers: builder => {

    builder.addCase(buildIndex.pending, (state) => {
      state.status = statusLoading;
    });

    builder.addCase(buildIndex.fulfilled, (state, action) => {
      state.status = statusSucceeded;
      const indexes = action.payload as SearchData[];

      indexes.forEach(({fileName, index}: SearchData) => {
        normalizedObjectsAdd<SearchData, SearchData>(
          state, 
          searchMapper, 
          searchDataToId, 
          searchPostProcessor, 
          {fileName, index}
        );
      });
    });

    builder.addCase(buildIndex.rejected, (state) => {
      state.status = statusFailed;
    });

    builder.addCase(searchIndex.pending, (state) => {
      state.status = statusLoading;
      state.results = [];
    });

    builder.addCase(searchIndex.fulfilled, (state, action) => {
      state.status = statusSucceeded;
      const results = action.payload;
      state.results = results;
    });

    builder.addCase(searchIndex.rejected, (state, action) => {
      state.status = statusFailed;
    });
  }
});

export const selectResults = (state: RootState): SearchResult[] => state.search.results;
export const selectSearchStatus = (state: RootState): string => state.search.status;

export const { reset, keepTerms } = searchSlice.actions;

export default searchSlice.reducer;
