import {
  persistStore,
  persistReducer,
  type PersistConfig,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { encryptTransform } from "redux-persist-transform-encrypt";
import authReducer, {
  clearCredentials,
  setAccessToken,
} from "./slices/authSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { httpClient } from "../http/httpClient";
import { authService } from "../http/services/authService";
import clinicReducer from "./slices/clinicSlice";
import patientReducer from "./slices/patientSlice";
import appointmentReducer from "./slices/appointmentSlice";

const rootReducer = combineReducers({ 
  auth: authReducer,
  clinic: clinicReducer,      
  patient: patientReducer,    
  appointment: appointmentReducer, 
});

export type RootState = ReturnType<typeof rootReducer>;

const persistSecret = import.meta.env.VITE_PERSIST_SECRET as string | undefined;
const persistConfig: PersistConfig<RootState> = {
  key: "root",
  storage,
  whitelist: ["auth"],
  transforms: persistSecret
    ? [
        encryptTransform({
          secretKey: persistSecret,
          onError: () => {},
        }),
      ]
    : [],
};

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});
console.log("[store] store criado");
export const persistor = persistStore(store);
console.log("[store] persistor criado");

httpClient.setOnUnauthorized(async () => {
  const { refreshToken } = store.getState().auth;
  console.log("[store] onUnauthorized chamado, refreshToken:", refreshToken);
  if (!refreshToken) {
    console.warn("[store] refreshToken ausente, limpando credenciais");
    return store.dispatch(clearCredentials());
  }
  try {
    const res = await authService.refreshToken({ refresh: refreshToken });
    console.log("[store] refreshToken resposta", res);
    if (res.status === 200 && res.data) {
      store.dispatch(setAccessToken(res.data.access));
      console.log("[store] Novo accessToken definido");
    } else {
      console.warn("[store] refreshToken falhou, limpando credenciais");
      store.dispatch(clearCredentials());
    }
  } catch (err) {
    console.error("[store] Erro ao tentar refreshToken", err);
    store.dispatch(clearCredentials());
  }
});

export type AppDispatch = typeof store.dispatch;
