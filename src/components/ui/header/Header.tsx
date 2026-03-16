import React from "react";
import { AppBar, Toolbar, IconButton, Typography, Box, Avatar, Menu, MenuItem, Divider } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import LogoutIcon from "@mui/icons-material/Logout";
import LanguageSwitcher from "../../generalComponents/languageSwitch/LanguageSwitcher";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router";
import { APP_ROUTES } from "../../../util/constants";

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
  title = "Clínica Estética X",
  onToggleTheme,
  themeMode,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate(APP_ROUTES.LOGIN);
  };

  const getUserInitials = () => {
    if (!user) return '?';
    return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
  };

  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      admin: 'Administrador',
      clinic: 'Clínica',
      patient: 'Paciente'
    };
    return roles[role] || role;
  };

  return (
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

        {user && (
          <Box sx={{ ml: 2 }}>
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              <Avatar sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? '#7B8EE4' : 'primary.main' }}>
                {getUserInitials()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {user.first_name} {user.last_name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {getRoleLabel(user.role)}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
                Sair
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
