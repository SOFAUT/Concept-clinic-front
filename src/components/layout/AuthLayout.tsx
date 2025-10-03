import React, { type ReactNode } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useState, useMemo } from "react";
import getTheme from "../../assets/styles/theme";
import { ThemeProvider, CssBaseline } from "@mui/material";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const theme = useMemo(() => getTheme(themeMode), [themeMode]);
  const handleToggleTheme = () =>
    setThemeMode((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          width: "100%",
          px: 2,
          py: 4,
          boxSizing: "border-box",
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Box sx={{ position: "absolute", top: 24, right: 32, zIndex: 10 }}>
          <Tooltip title={themeMode === "dark" ? "Tema claro" : "Tema escuro"}>
            <IconButton color="primary" onClick={handleToggleTheme}>
              {themeMode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
        </Box>
        {children}
      </Box>
    </ThemeProvider>
  );
};

export default AuthLayout;
