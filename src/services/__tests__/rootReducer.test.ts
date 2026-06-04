import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from '../slices/ingredientsSlice';
import { constructorReducer } from '../slices/constructorSlice';
import { userReducer } from '../slices/userSlice';
import { feedReducer } from '../slices/feedSlice';
import { profileOrdersReducer } from '../slices/profileOrdersSlice';
import { orderReducer } from '../slices/orderSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  user: userReducer,
  feed: feedReducer,
  profileOrders: profileOrdersReducer,
  order: orderReducer,
});

describe('rootReducer', () => {
  it('должен вернуть начальное состояние при UNKNOWN_ACTION', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual({
      ingredients: { items: [], loading: false, error: null },
      burgerConstructor: {
        bun: null,
        ingredients: [],
        orderRequest: false,
        orderModalData: null,
      },
      user: {
        user: null,
        loading: false,
        error: null,
        resetPasswordSuccess: false,
      },
      feed: { orders: [], total: 0, totalToday: 0, connected: false, error: null },
      profileOrders: { orders: [], connected: false, error: null },
      order: { orderData: null, loading: false, error: null },
    });
  });
});
