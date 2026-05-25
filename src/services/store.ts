import { configureStore } from '@reduxjs/toolkit';
import { ingredientsReducer } from './slices/ingredientsSlice';
import { constructorReducer } from './slices/constructorSlice';
import { userReducer } from './slices/userSlice';
import { feedReducer } from './slices/feedSlice';
import { profileOrdersReducer } from './slices/profileOrdersSlice';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import { socketMiddleware } from './middleware/socketMiddleware';
import {
  wsConnectFeed,
  wsDisconnectFeed,
  wsConnectingFeed,
  wsOpenFeed,
  wsCloseFeed,
  wsErrorFeed,
  wsMessageFeed
} from './slices/feedSlice';
import {
  wsConnectProfileOrders,
  wsDisconnectProfileOrders,
  wsConnectingProfileOrders,
  wsOpenProfileOrders,
  wsCloseProfileOrders,
  wsErrorProfileOrders,
  wsMessageProfileOrders
} from './slices/profileOrdersSlice';

const feedMiddleware = socketMiddleware({
  wsConnect: wsConnectFeed,
  wsDisconnect: wsDisconnectFeed,
  wsConnecting: wsConnectingFeed,
  wsOpen: wsOpenFeed,
  wsClose: wsCloseFeed,
  wsError: wsErrorFeed,
  wsMessage: wsMessageFeed
});

const profileOrdersMiddleware = socketMiddleware({
  wsConnect: wsConnectProfileOrders,
  wsDisconnect: wsDisconnectProfileOrders,
  wsConnecting: wsConnectingProfileOrders,
  wsOpen: wsOpenProfileOrders,
  wsClose: wsCloseProfileOrders,
  wsError: wsErrorProfileOrders,
  wsMessage: wsMessageProfileOrders
});

const rootReducer = {
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  user: userReducer,
  feed: feedReducer,
  profileOrders: profileOrdersReducer
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(feedMiddleware, profileOrdersMiddleware),
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useDispatch = () => dispatchHook<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;
export default store;
