import { useAppSelector } from '../core/store/hooks';

export const useAppointments = () => {
  const appointments = useAppSelector(state => state.appointment.appointments);
  const loading = useAppSelector(state => state.appointment.loading);
  const error = useAppSelector(state => state.appointment.error);
  
  return { appointments, loading, error };
};

