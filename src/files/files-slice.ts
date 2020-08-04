import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  NormalizedObjects,
  FetchStatus,
  statusIdle,
  statusLoading,
  statusSucceeded,
  statusFailed
} from '../types';

import { 
  normalizedObjectsAddAll,
  normalizedObjectsClear,
  normalizedObjectsGetAll
} from '../common';

import {
  // upload as uploadService, 
  files as filesFetchService, 
  clear as filesClearService, 
  // outputs as outputsService
} from '../service';

import {RootState} from '../app-store'; 

export type FileData = {
  id: string,
  created: string
}

export type FilesState = NormalizedObjects<FileData> & {
  status: FetchStatus,
  error: string | null
};

const initialState: FilesState = {
  status: statusIdle,
  error: null,
  ids: ['sample.md'],
  entities: {
    'sample.md': { id: 'sample.md', created: new Date().toISOString()}
  }
};

const fileDataToId = (file: FileData) => file.id;
const fileMapper = (fileName: string) => ({id: fileName, created: new Date().toISOString()});

export const fetchFiles = createAsyncThunk('files/fetchFiles', async (_, {dispatch, getState}) => {
  const {status} = getState() as FilesState;
  if (status === statusLoading) {
    Promise.reject('wait until the current file fetching finishes');
  }
  return await filesFetchService();
});

export const clearFiles = createAsyncThunk('files/clearFiles', async (_, {dispatch, getState}) => {
  const {status} = getState() as FilesState;
  if (status === statusLoading) {
    Promise.reject('wait until the current file fetching finishes');
  }
  return await filesClearService();
});

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
  },
  extraReducers: builder => {

    builder.addCase(fetchFiles.pending, (state, action) => {
      state.status = statusLoading;
    });

    builder.addCase(fetchFiles.fulfilled, (state, action) => {
      state.status = statusSucceeded;
      normalizedObjectsAddAll<string, FileData>(state, fileMapper, fileDataToId, action.payload);
    });

    builder.addCase(fetchFiles.rejected, (state, action) => {
      state.status = statusFailed;
      state.error = action.payload as string;
    });

    builder.addCase(clearFiles.pending, (state, action) => {
      state.status = statusLoading;
    });

    builder.addCase(clearFiles.fulfilled, (state, action) => {
      state.status = statusSucceeded;
      normalizedObjectsClear(state);
    });

    builder.addCase(clearFiles.rejected, (state, action) => {
      state.status = statusFailed;
      state.error = action.payload as string;
    });
  }
});

const fileSorter = (f1: FileData, f2: FileData): number => f2.created.localeCompare(f1.created);

export const selectAllFiles = (state: RootState) => normalizedObjectsGetAll(state.files, fileSorter);
export const selectAllFileIds = (state: RootState) => state.files.ids;

export default filesSlice.reducer;
