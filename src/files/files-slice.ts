import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

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
  files as filesFetchService, 
  clear as filesClearService, 
} from '../service';

import {RootState} from '../app/app-store'; 

export type FileData = {
  id: string,
  created: string
}

export type FilesState = NormalizedObjects<FileData> & {
  status: FetchStatus,
  error: string | null,
  selectedFile?: string,
  checkedFiles: string[],
};

const initialState: FilesState = {
  status: statusIdle,
  error: null,
  checkedFiles: [],
  ids: [],
  entities: {
  }
};

const fileDataToId = (file: FileData) => file.id;
const fileMapper = (fileName: string) => ({id: fileName, created: new Date().toISOString()});

export const fetchFiles = createAsyncThunk('files/fetchFiles', async (_, {dispatch, getState}) => {
  return await filesFetchService();
});

export const clearFiles = createAsyncThunk('files/clearFiles', async (_, {dispatch, getState}) => {
  return await filesClearService();
});

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    fileSelected(state, action: PayloadAction<string>) {
      const selectedFile = action.payload;
      if (state.ids.findIndex(x => x === selectedFile) !== -1) {
        state.selectedFile = selectedFile;
      }
    },
    fileChecked(state, action: PayloadAction<string>) {
      const checkedFile = action.payload;
      if (state.checkedFiles.findIndex(x => x === checkedFile) === -1) {
        state.checkedFiles.push(checkedFile);
      }
    },
    fileUnchecked(state, action: PayloadAction<string>) {
      const uncheckedFile = action.payload;
      const foundIndex = state.checkedFiles.findIndex(x => x === uncheckedFile);
      if (foundIndex !== -1) {
        state.checkedFiles.splice(foundIndex, 1);
      }
    },
    fileAllUnchecked(state) {
      state.checkedFiles = [];
    }
  },
  extraReducers: builder => {

    builder.addCase(fetchFiles.pending, (state) => {
      state.status = statusLoading;
    });

    builder.addCase(fetchFiles.fulfilled, (state, action) => {
      state.status = statusSucceeded;
      const fetchedFiles = action.payload;
      normalizedObjectsAddAll<string, FileData>(state, fileMapper, fileDataToId, (x) => x, fetchedFiles);
      fetchedFiles.forEach(x => {
        if (state.checkedFiles.findIndex(y => y === x) === -1) {
          state.checkedFiles.push(x);
        }
      });
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
      state.checkedFiles = [];
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
export const selectAllCheckedFiles = (state: RootState) => state.files.checkedFiles;
export const selectSelectedFile = (state: RootState) => state.files.selectedFile;

export const {fileChecked, fileUnchecked, fileAllUnchecked} = filesSlice.actions;

export default filesSlice.reducer;
