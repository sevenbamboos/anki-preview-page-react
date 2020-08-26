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

import { addAllKeywords, ItemResultWithFileName, searchKeyword, countItemResult } from '../service/keyword-index';
import {RootState} from '../app/app-store';

import BlackList from '../service/keywords-black-list.json';

export type SearchData = {
  fileName: string,
  index: any 
};

export type SearchResult = {
  fileName: string,
  groupName: string,
  cardIndex: number,
  score: number,
  key: string
};

export type SearchTerm = {
  keyword: string,
  results: ItemResultWithFileName[],
  count: number,
  cost: number
};

export type SearchState = NormalizedObjects<SearchData> & {
  status: FetchStatus,
  error: string | null,
  latestTerms: SearchTerm[],
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

const filterKeywords = (k:string) => k.length > 1 && !BlackList.includes(k.toLocaleLowerCase())

export const searchIndex = createAsyncThunk('search/searchIndex', async ({keywords}: Keywords, {getState, rejectWithValue}) => {
  const searchState = (getState() as RootState).search;

  const searchJobs = keywords.filter(filterKeywords).flatMap(keyword => {
    return normalizedObjectsGetAll(searchState).map(({index, fileName}: SearchData) => searchKeyword(keyword, index, fileName));
  });

  const result = await Promise.all(searchJobs);

  const searchTerms: {[key:string]:ItemResultWithFileName[]} = {};

  const searchResults: SearchResult[] = [];

  result.forEach(itemResultWithFileName => {

    const {keyword, fileName, results} = itemResultWithFileName;
    if (!searchTerms[keyword]) {
      searchTerms[keyword] = []
    }
    searchTerms[keyword].push(itemResultWithFileName);

    searchResults.push(...results.flatMap(({item, score}) => {
      const key = item.key;
      return item.value.map((groupWithCard:string) => {
        const [groupName, cardIndexInString] = groupWithCard.split(':');
        const cardIndex = Number.parseInt(cardIndexInString);
        return {fileName, groupName, cardIndex, score, key} as SearchResult; 
      });
    }));
  });

  const terms = Object.keys(searchTerms).map((key: string) => {
    const itemResults = searchTerms[key];
    const {count, cost} = countItemResult(itemResults);
    return {
      keyword: key, 
      results: itemResults,
      count,
      cost
    }
  });
  return {terms, results: searchResults };
});

const searchDataToId = (search: SearchData) => search.fileName;
const searchMapper = (search: SearchData) => (search);
const searchPostProcessor = (search: SearchData) => search;

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    reset(state) {
      normalizedObjectsClear(state);
      state.results = [];
      state.latestTerms = [];
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
      const {terms, results} = action.payload;
      
      const notExisting = (t:{keyword:string}) => state.latestTerms.every(term => term.keyword !== t.keyword);
      state.latestTerms.push(...terms.filter(t => t.count> 0 && notExisting(t)));
      if (state.latestTerms.length > 5) {
        state.latestTerms.splice(0, state.latestTerms.length - 5);
      }

      results.sort((r1, r2) => r2.score - r1.score);
      state.results = results;
    });

    builder.addCase(searchIndex.rejected, (state, action) => {
      state.status = statusFailed;
    });
  }
});

export const selectResults = (state: RootState): SearchResult[] => state.search.results;
export const selectTerms = (state: RootState): SearchTerm[] => state.search.latestTerms;
export const selectSearchStatus = (state: RootState): string => state.search.status;

export const { reset }  = searchSlice.actions;

export default searchSlice.reducer;
