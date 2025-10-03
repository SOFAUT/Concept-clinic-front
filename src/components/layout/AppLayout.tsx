import { useState, useMemo } from "react";
import { Box, ThemeProvider, CssBaseline } from "@mui/material";
import { Outlet } from "react-router";
import Header from "../ui/header/Header";
import LayoutSidebar from "../ui/sidebar/LayoutSidebar";
import getTheme from "../../assets/styles/theme";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  const theme = useMemo(() => getTheme(themeMode), [themeMode]);

  const handleToggleTheme = () => {
    setThemeMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const sidebarMenus = [
    { icon: <HomeIcon />, label: "Home", to: "/" },
    { icon: <PeopleIcon />, label: "Users", to: "/users" },
    { icon: <SettingsIcon />, label: "Settings", to: "/settings" },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box display="flex" height="100vh">
        <LayoutSidebar collapsed={collapsed} menus={sidebarMenus} />

        <Box flexGrow={1} display="flex" flexDirection="column">
          <Header
            onMenuClick={() => setCollapsed((p) => !p)}
            collapsed={collapsed}
            onToggleTheme={handleToggleTheme}
            themeMode={themeMode}
          />

          <Box component="main" flexGrow={1} p={2} overflow="auto">
            <Outlet />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
