import { RootState } from '../store';
import { createSlice, createAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface ProfileOrdersState {
  orders: TOrder[];
  connected: boolean;
  error: string | null;
}

const initialState: ProfileOrdersState = {
  orders: [],
  connected: false,
  error: null
};

export const wsConnectProfileOrders =
  createAction<string>('PROFILE_WS_CONNECT');
export const wsDisconnectProfileOrders = createAction('PROFILE_WS_DISCONNECT');
export const wsConnectingProfileOrders = createAction('PROFILE_WS_CONNECTING');
export const wsOpenProfileOrders = createAction('PROFILE_WS_OPEN');
export const wsCloseProfileOrders = createAction('PROFILE_WS_CLOSE');
export const wsErrorProfileOrders = createAction<string>('PROFILE_WS_ERROR');
export const wsMessageProfileOrders = createAction<any>('PROFILE_WS_MESSAGE');

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(wsConnectingProfileOrders, (state) => {
        state.connected = false;
        state.error = null;
      })
      .addCase(wsOpenProfileOrders, (state) => {
        state.connected = true;
      })
      .addCase(wsCloseProfileOrders, (state) => {
        state.connected = false;
      })
      .addCase(wsErrorProfileOrders, (state, action) => {
        state.error = action.payload;
      })
      .addCase(wsMessageProfileOrders, (state, action) => {
        state.orders = action.payload.orders;
      });
  }
});

export const profileOrdersReducer = profileOrdersSlice.reducer;
