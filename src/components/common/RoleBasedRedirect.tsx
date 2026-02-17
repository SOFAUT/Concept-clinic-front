import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppSelector } from "../../core/store/hooks";
import { APP_ROUTES } from "../../util/constants";
import { Box, CircularProgress } from "@mui/material";
import Home from "../../pages/Home";

export default function RoleBasedRedirect() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      switch (user.role) {
        case "admin":
          navigate(APP_ROUTES.ADMIN.DASHBOARD, { replace: true });
          break;
        case "clinic":
          navigate(APP_ROUTES.CLINIC.DASHBOARD, { replace: true });
          break;
        case "patient":
          navigate(APP_ROUTES.PATIENT.DASHBOARD, { replace: true });
          break;
        default:
          navigate(APP_ROUTES.LOGIN, { replace: true });
      }
    }
  }, [user, navigate]);

  if (user) {
    // Mostra loading rápido enquanto redireciona para o dashboard
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Se não estiver logado, mostra a Home pública
  return <Home />;
}

