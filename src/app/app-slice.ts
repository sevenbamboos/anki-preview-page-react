import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {RootState} from './app-store';

export type GlobalState = {
  error?: string,
  message?: string
};

const initialState: GlobalState = {
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {

    onError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },

    onMessage(state, action: PayloadAction<string>) {
      state.error = undefined;
      state.message = action.payload;
    }
  }
});

export const selectError = (state: RootState) => state.global.error;
export const selectMessage = (state: RootState) => state.global.message;

export const {onError, onMessage} = globalSlice.actions;

export default globalSlice.reducer;
