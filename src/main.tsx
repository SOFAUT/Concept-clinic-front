import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { persistor, store } from "./core/store";
import { BrowserRouter } from "react-router";
import { ThemeProvider } from "@mui/material";
import theme from "./assets/styles/theme";
import { AuthProvider } from "./app/providers/AuthProvider";
import { AppRoutes } from "./app/routes/routes";
import "@/assets/i18n/i18n";
import "./index.css";
import { PersistGate } from "redux-persist/integration/react";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <ThemeProvider theme={theme("light")}>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
