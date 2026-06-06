import { createSlice, createAction, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

interface FeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  connected: boolean;
  error: string | null;
}

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  connected: false,
  error: null
};

export const wsConnectFeed = createAction<string>('FEED_WS_CONNECT');
export const wsDisconnectFeed = createAction('FEED_WS_DISCONNECT');
export const wsConnectingFeed = createAction('FEED_WS_CONNECTING');
export const wsOpenFeed = createAction('FEED_WS_OPEN');
export const wsCloseFeed = createAction('FEED_WS_CLOSE');
export const wsErrorFeed = createAction<string>('FEED_WS_ERROR');
export const wsMessageFeed = createAction<any>('FEED_WS_MESSAGE');

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(wsConnectingFeed, (state) => {
        state.connected = false;
        state.error = null;
      })
      .addCase(wsOpenFeed, (state) => {
        state.connected = true;
      })
      .addCase(wsCloseFeed, (state) => {
        state.connected = false;
      })
      .addCase(wsErrorFeed, (state, action) => {
        state.error = action.payload;
      })
      .addCase(wsMessageFeed, (state, action) => {
        const { orders, total, totalToday } = action.payload;
        state.orders = orders;
        state.total = total;
        state.totalToday = totalToday;
      });
  }
});

export const feedReducer = feedSlice.reducer;
