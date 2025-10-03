import React from "react";
import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import LanguageSwitcher from "../../generalComponents/languageSwitch/LanguageSwitcher";

interface HeaderProps {
  onMenuClick: () => void;
  collapsed: boolean;
  title?: string;
  onToggleTheme: () => void;
  themeMode: "light" | "dark";
}

const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  collapsed,
  title = "Clínica Estética",
  onToggleTheme,
  themeMode,
}) => (
  <AppBar
    position="fixed"
    elevation={1}
    sx={{
      zIndex: (theme) => theme.zIndex.drawer + 1,
      bgcolor: "background.paper",
      color: "text.primary",
    }}
  >
    <Toolbar>
      <IconButton
        edge="start"
        color="inherit"
        onClick={onMenuClick}
        sx={{ mr: 2 }}
      >
        {collapsed ? <MenuOpenIcon /> : <MenuIcon />}
      </IconButton>

      <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
        {title}
      </Typography>

      <LanguageSwitcher />

      <IconButton color="inherit" sx={{ ml: 1 }} onClick={onToggleTheme}>
        {themeMode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Toolbar>
  </AppBar>
);

export default Header;
