import { useState, useMemo } from "react";
import { Box, ThemeProvider, CssBaseline } from "@mui/material";
import { Outlet } from "react-router";
import Header from "../ui/header/Header";
import LayoutSidebar from "../ui/sidebar/LayoutSidebar";
import getTheme from "../../assets/styles/theme";
import PeopleIcon from "@mui/icons-material/People";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MedicalIcon from "@mui/icons-material/MedicalServices";
import HistoryIcon from "@mui/icons-material/History";
import PaymentIcon from "@mui/icons-material/Payment";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { APP_ROUTES } from "../../util/constants";
import { useAppSelector } from "../../core/store/hooks";

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const user = useAppSelector((state) => state.auth.user);

  const theme = useMemo(() => getTheme(themeMode), [themeMode]);

  const handleToggleTheme = () => {
    setThemeMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const getMenuByRole = (role: string) => {
    const menus = {
      admin: [
        { icon: <DashboardIcon />, label: "Dashboard", to: APP_ROUTES.ADMIN.DASHBOARD },
        { icon: <BusinessIcon />, label: "Clínicas", to: APP_ROUTES.ADMIN.CLINICS },
      ],
      clinic: [
        { icon: <DashboardIcon />, label: "Dashboard", to: APP_ROUTES.CLINIC.DASHBOARD },
        { icon: <CalendarMonthIcon />, label: "Agendamentos", to: APP_ROUTES.CLINIC.APPOINTMENTS },
        { icon: <PeopleIcon />, label: "Pacientes", to: APP_ROUTES.CLINIC.PATIENTS },
        { icon: <MedicalIcon />, label: "Procedimentos", to: APP_ROUTES.CLINIC.PROCEDURES },
      ],
      patient: [
        { icon: <DashboardIcon />, label: "Início", to: APP_ROUTES.PATIENT.DASHBOARD },
        { icon: <CalendarMonthIcon />, label: "Agendamentos", to: APP_ROUTES.PATIENT.APPOINTMENTS },
        { icon: <HistoryIcon />, label: "Histórico", to: APP_ROUTES.PATIENT.HISTORY },
        { icon: <PaymentIcon />, label: "Pagamentos", to: APP_ROUTES.PATIENT.PAYMENTS },
        { icon: <CreditCardIcon />, label: "Meus cartões", to: APP_ROUTES.PATIENT.CARDS },
        { icon: <LocationOnIcon />, label: "Meu endereço", to: APP_ROUTES.PATIENT.LOCATION },
      ],
    };
    return menus[role as keyof typeof menus] || [];
  };

  const sidebarMenus = getMenuByRole(user?.role || '');

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
