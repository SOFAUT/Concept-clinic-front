import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Appointment {
  id: number;
  patientId: number;
  professionalId: number;
  procedureId: number;
  scheduledAt: string;
  duration: number;
  status: "scheduled" | "confirmed" | "cancelled" | "completed";
}

export interface AppointmentState {
  appointments: Appointment[];
  currentAppointment: Appointment | null;
  loading: boolean;
  error: string | null;
}

const initialState: AppointmentState = {
  appointments: [],
  currentAppointment: null,
  loading: false,
  error: null,
};

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    setAppointments(state, action: PayloadAction<Appointment[]>) {
      state.appointments = action.payload;
    },
    setCurrentAppointment(state, action: PayloadAction<Appointment | null>) {
      state.currentAppointment = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setAppointments, setCurrentAppointment, setLoading, setError } =
  appointmentSlice.actions;
export default appointmentSlice.reducer;

