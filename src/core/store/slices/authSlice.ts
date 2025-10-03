import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { httpClient } from "../../http/httpClient";
import type { User } from "../../../interfaces/authInterfaces";

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        user: User;
      }>
    ) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      httpClient.setAuthToken(action.payload.accessToken);
    },
    clearCredentials(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      httpClient.setAuthToken(null);
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
      httpClient.setAuthToken(action.payload);
    },
  },
});

export const { setCredentials, clearCredentials, setAccessToken } =
  authSlice.actions;
export default authSlice.reducer;
