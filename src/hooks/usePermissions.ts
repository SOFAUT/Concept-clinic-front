import { useAppSelector } from '../core/store/hooks';

export const usePermissions = () => {
  const user = useAppSelector(state => state.auth.user);
  
  const isAdmin = user?.role === 'admin';
  const isClinic = user?.role === 'clinic';
  const isPatient = user?.role === 'patient';
  
  return { isAdmin, isClinic, isPatient };
};