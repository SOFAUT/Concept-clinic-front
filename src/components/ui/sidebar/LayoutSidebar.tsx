import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Avatar,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { Link } from "react-router";
import { useAuth } from "../../../hooks/useAuth";

const drawerWidth = 240;
const collapsedWidth = 60;

interface SidebarMenu {
  icon: React.ReactNode;
  label: string;
  to: string;
}

interface SidebarProps {
  collapsed: boolean;
  menus: SidebarMenu[];
}

const UserBox: React.FC<{ collapsed: boolean }> = ({ collapsed }) => {
  const { user, logout } = useAuth();
  if (!user) return null;
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: collapsed ? "column" : "row",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-start",
        p: 2,
        borderTop: "1px solid",
        borderColor: "divider",
        mt: "auto",
        gap: 1,
      }}
    >
      <Avatar sx={{ width: 40, height: 40 }}>
        {user.first_name?.[0] || user.email[0]}
      </Avatar>
      {!collapsed && (
        <Box sx={{ ml: 1, flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle1" noWrap>
            {user.first_name} {user.last_name}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {user.email}
          </Typography>
          <Button
            variant="text"
            color="error"
            size="small"
            onClick={logout}
            sx={{ mt: 0.5, p: 0, minWidth: 0 }}
          >
            Sair
          </Button>
        </Box>
      )}
      {collapsed && (
        <Button
          variant="text"
          color="error"
          size="small"
          onClick={logout}
          sx={{ mt: 1, p: 0, minWidth: 0 }}
        >
          Sair
        </Button>
      )}
    </Box>
  );
};

const LayoutSidebar: React.FC<SidebarProps> = ({ collapsed, menus }) => (
  <Drawer
    variant="permanent"
    sx={{
      width: collapsed ? collapsedWidth : drawerWidth,
      flexShrink: 0,
      "& .MuiDrawer-paper": {
        width: collapsed ? collapsedWidth : drawerWidth,
        boxSizing: "border-box",
        overflowX: "hidden",
        transition: "width 0.3s",
        bgcolor: "background.paper",
        borderRight: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        alignItems: collapsed ? "center" : "flex-start",
      },
    }}
  >
    <Toolbar sx={{ minHeight: 64 }} />

    <List
      sx={{
        width: "100%",
        p: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: collapsed ? "center" : "flex-start",
      }}
    >
      {menus.map(({ icon, label, to }) => (
        <ListItemButton
          key={to}
          component={Link}
          to={to}
          sx={{
            justifyContent: collapsed ? "center" : "flex-start",
            px: collapsed ? 1 : 2,
            width: "100%",
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              justifyContent: "center",
              marginRight: collapsed ? 0 : 2,
            }}
          >
            {icon}
          </ListItemIcon>
          {!collapsed && (
            <ListItemText primary={label} sx={{ flexGrow: 1, minWidth: 0 }} />
          )}
        </ListItemButton>
      ))}
    </List>
    <UserBox collapsed={collapsed} />
  </Drawer>
);

export default LayoutSidebar;
