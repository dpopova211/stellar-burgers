import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  logoutApi,
  updateUserApi,
  getUserApi,
  forgotPasswordApi,
  resetPasswordApi,
  TRegisterData,
  TLoginData,
  TServerResponse,
  TAuthResponse,
  TUserResponse
} from '../../utils/burger-api';
import { TUser } from '@utils-types';
import { setCookie } from '../../utils/cookie';
import type { RootState } from '../store';

interface UserState {
  user: TUser | null;
  loading: boolean;
  error: string | null;
  resetPasswordSuccess: boolean;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  resetPasswordSuccess: false
};

export const fetchUser = createAsyncThunk<TUserResponse>(
  'user/fetch',
  getUserApi
);

export const register = createAsyncThunk<TAuthResponse, TRegisterData>(
  'user/register',
  registerUserApi
);

export const login = createAsyncThunk<TAuthResponse, TLoginData>(
  'user/login',
  loginUserApi
);

export const logout = createAsyncThunk<TServerResponse<{}>>(
  'user/logout',
  logoutApi
);

export const update = createAsyncThunk<TUserResponse, Partial<TRegisterData>>(
  'user/update',
  updateUserApi
);

export const forgot = createAsyncThunk<TServerResponse<{}>, { email: string }>(
  'user/forgot',
  forgotPasswordApi
);

export const reset = createAsyncThunk<
  TServerResponse<{}>,
  { password: string; token: string }
>('user/reset', resetPasswordApi);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.user = null;
        state.loading = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.error = null;
        if (action.payload.accessToken) {
          setCookie('accessToken', action.payload.accessToken);
        }
        if (action.payload.refreshToken) {
          localStorage.setItem('refreshToken', action.payload.refreshToken);
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка регистрации';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.error = null;
        if (action.payload.accessToken) {
          setCookie('accessToken', action.payload.accessToken);
        }
        if (action.payload.refreshToken) {
          localStorage.setItem('refreshToken', action.payload.refreshToken);
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.error.message || 'Неверный логин или пароль';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        localStorage.removeItem('refreshToken');
        setCookie('accessToken', '', { expires: -1 });
      })
      .addCase(update.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(update.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка обновления';
      })
      .addCase(forgot.fulfilled, (state) => {
        state.resetPasswordSuccess = true;
      })
      .addCase(forgot.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка восстановления';
      })
      .addCase(reset.fulfilled, (state) => {
        state.resetPasswordSuccess = false;
      })
      .addCase(reset.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка сброса пароля';
      });
  }
});

export const { clearError } = userSlice.actions;
export const userReducer = userSlice.reducer;

export const getUser = (state: RootState) => state.user.user;
