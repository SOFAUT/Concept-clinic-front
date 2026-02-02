import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { persistor, store } from "./core/store";
import { BrowserRouter } from "react-router";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, CircularProgress, Box } from "@mui/material";
import getTheme from "./assets/styles/theme";
import { AuthProvider } from "./app/providers/AuthProvider";
import { AppRoutes } from "./app/routes/routes";
import "@/assets/i18n/i18n";
import "./index.css";
import { PersistGate } from "redux-persist/integration/react";

// Loading component
const LoadingFallback = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
    bgcolor="background.default"
  >
    <CircularProgress />
  </Box>
);

console.log("🚀 main.tsx carregado!");
console.log("📦 Store:", store);
console.log("💾 Persistor:", persistor);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<LoadingFallback />} persistor={persistor}>
        <BrowserRouter>
          <ThemeProvider theme={getTheme("light")}>
            <CssBaseline />
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
