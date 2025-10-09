import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Clinic {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface ClinicState {
  clinics: Clinic[];
  currentClinic: Clinic | null;
  loading: boolean;
  error: string | null;
}

const initialState: ClinicState = {
  clinics: [],
  currentClinic: null,
  loading: false,
  error: null,
};

const clinicSlice = createSlice({
  name: "clinic",
  initialState,
  reducers: {
    setClinics(state, action: PayloadAction<Clinic[]>) {
      state.clinics = action.payload;
    },
    setCurrentClinic(state, action: PayloadAction<Clinic | null>) {
      state.currentClinic = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setClinics, setCurrentClinic, setLoading, setError } =
  clinicSlice.actions;
export default clinicSlice.reducer;

