import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAppSelector } from '../../core/store/hooks';
import { APP_ROUTES } from '../../util/constants';
import { Box, CircularProgress } from '@mui/material';

export default function RoleBasedRedirect() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'admin':
          navigate(APP_ROUTES.ADMIN.DASHBOARD, { replace: true });
          break;
        case 'clinic':
          navigate(APP_ROUTES.CLINIC.DASHBOARD, { replace: true });
          break;
        case 'patient':
          navigate(APP_ROUTES.PATIENT.LANDING, { replace: true });
          break;
        default:
          navigate(APP_ROUTES.LOGIN, { replace: true });
      }
    } else {
      // Se não houver usuário, redireciona para login
      navigate(APP_ROUTES.LOGIN, { replace: true });
    }
  }, [user, navigate]);

  // Mostra loading enquanto redireciona
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

