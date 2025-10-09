export interface Appointment {
  id: number;
  patientId: number;
  professionalId: number;
  procedureId: number;
  scheduledAt: string;
  duration: number;
  status: "scheduled" | "confirmed" | "cancelled" | "completed";
}

export interface CreateAppointmentDTO {
  patientId: number;
  professionalId: number;
  procedureId: number;
  scheduledAt: string;
  duration: number;
}

export interface UpdateAppointmentDTO extends Partial<CreateAppointmentDTO> {
  status?: "scheduled" | "confirmed" | "cancelled" | "completed";
}

