import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAppSelector } from '../../core/store/hooks';
import { APP_ROUTES } from '../../util/constants';

export default function RoleBasedRedirect() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'admin':
          navigate(APP_ROUTES.ADMIN.DASHBOARD);
          break;
        case 'clinic':
          navigate(APP_ROUTES.CLINIC.DASHBOARD);
          break;
        case 'patient':
          navigate(APP_ROUTES.PATIENT.DASHBOARD);
          break;
        default:
          navigate(APP_ROUTES.LOGIN);
      }
    }
  }, [user, navigate]);

  return null;
}

