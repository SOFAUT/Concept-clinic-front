import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate: string;
}

export interface PatientState {
  patients: Patient[];
  currentPatient: Patient | null;
  loading: boolean;
  error: string | null;
}

const initialState: PatientState = {
  patients: [],
  currentPatient: null,
  loading: false,
  error: null,
};

const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {
    setPatients(state, action: PayloadAction<Patient[]>) {
      state.patients = action.payload;
    },
    setCurrentPatient(state, action: PayloadAction<Patient | null>) {
      state.currentPatient = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setPatients, setCurrentPatient, setLoading, setError } =
  patientSlice.actions;
export default patientSlice.reducer;

