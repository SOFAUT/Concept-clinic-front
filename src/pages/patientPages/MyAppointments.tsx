import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Radio,
  TextField,
  Stack,
  Divider,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PaymentIcon from "@mui/icons-material/Payment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ScheduleIcon from "@mui/icons-material/Schedule";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useAppSelector } from "../../core/store/hooks";
import { useNavigate } from "react-router";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import type { PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import { loadClinicUnavailableDays, loadClinicIncludeWeekends } from "../clinicPages/Appointments";
import dayjs, { Dayjs } from "dayjs";
import { APP_ROUTES } from "../../util/constants";

// ========== MOCK STORAGE KEYS & HELPERS ==========
const MOCK_PROCEDURES_KEY = "mock_procedures";
const MOCK_CLINICS_KEY = "mock_clinics";
const PATIENT_HIRED_PROCEDURES_PREFIX = "patient_hired_procedures_";
const PATIENT_APPOINTMENTS_STORAGE_PREFIX = "patient_agendamentos_";
const PATIENT_LOCATION_STORAGE_PREFIX = "patient_location_";
const CLINIC_PATIENTS_STORAGE_PREFIX = "clinic_patients_";
const CLINIC_APPOINTMENTS_STORAGE_PREFIX = "clinic_appointments_";

interface ProcedimentoItem {
  id: number;
  clinicaId: number;
  finalidade: string;
  invasividade: string;
  valorProcedimento: string;
  parcelasCartao: string; // e.g., "6" meaning max 6 installments
}

interface ClinicaItem {
  id: number;
  nomeFantasia: string;
  nomeEmpresa: string;
  cidade: string;
  estado: string;
}

interface HiredProcedure {
  id: number;
  userId: number;
  clinicaId: number;
  clinicaNome: string;
  procedimentoId: number;
  procedimentoNome: string;
  valor: string;
  parcelasCartao: string; // max installments allowed
  installmentsTotal?: number; // total parcels (for parcelado)
  installmentsPaid?: number;  // how many parcels already paid
  status: "pending" | "paid" | "scheduled";
  dataContratacao: string; // ISO date
  dataAgendada?: string;    // ISO datetime, if scheduled
  /** Quando true, o paciente não vê mais este item na lista (oculto, não removido) */
  hiddenByPatient?: boolean;
}

interface AgendamentoPaciente {
  id: number;
  userId: number;
  clinicaId: number;
  clinicaNome: string;
  procedimentoId?: number;
  procedimentoNome?: string;
  dataAgendada: string; // ISO datetime
}

interface ClinicAppointment {
  id: number;
  patientId: number;
  patientName: string;
  procedureId: number;
  procedureName: string;
  date: string; // ISO datetime
}

interface PacienteAssociadoClinica {
  userId: number;
  nome: string;
  email: string;
  dataAssociacao: string;
}

// ========== LOAD/SAVE FUNCTIONS (to be replaced by API) ==========
function loadAllProcedimentos(): ProcedimentoItem[] {
  try {
    const stored = localStorage.getItem(MOCK_PROCEDURES_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as ProcedimentoItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadClinicasFromStorage(): ClinicaItem[] {
  try {
    const stored = localStorage.getItem(MOCK_CLINICS_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as Array<{
      id?: number;
      nomeFantasia?: string;
      nomeEmpresa?: string;
      cidade?: string;
      estado?: string;
    }>;
    return (parsed || []).map((c, i) => ({
      id: c.id ?? i + 1,
      nomeFantasia: c.nomeFantasia || c.nomeEmpresa || "Clínica",
      nomeEmpresa: c.nomeEmpresa || "",
      cidade: (c.cidade || "").toLowerCase(),
      estado: (c.estado || "").toLowerCase(),
    }));
  } catch {
    return [];
  }
}

function loadPatientLocation(userId: number): { cidade: string; estado: string } | null {
  try {
    const key = PATIENT_LOCATION_STORAGE_PREFIX + userId;
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as { cidade?: string; estado?: string };
    if (!parsed.cidade || !parsed.estado) return null;
    return { cidade: parsed.cidade.toLowerCase(), estado: parsed.estado.toLowerCase() };
  } catch {
    return null;
  }
}

function loadHiredProcedures(userId: number): HiredProcedure[] {
  try {
    const key = PATIENT_HIRED_PROCEDURES_PREFIX + userId;
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as HiredProcedure[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHiredProcedures(userId: number, list: HiredProcedure[]) {
  try {
    localStorage.setItem(PATIENT_HIRED_PROCEDURES_PREFIX + userId, JSON.stringify(list));
  } catch {
    console.error("Error saving hired procedures");
  }
}

function loadPatientAppointments(userId: number): AgendamentoPaciente[] {
  try {
    const key = PATIENT_APPOINTMENTS_STORAGE_PREFIX + userId;
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as AgendamentoPaciente[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function savePatientAppointments(userId: number, list: AgendamentoPaciente[]) {
  try {
    localStorage.setItem(PATIENT_APPOINTMENTS_STORAGE_PREFIX + userId, JSON.stringify(list));
  } catch {
    console.error("Error saving appointments");
  }
}

function loadClinicPatients(clinicId: number): PacienteAssociadoClinica[] {
  try {
    const key = CLINIC_PATIENTS_STORAGE_PREFIX + clinicId;
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as PacienteAssociadoClinica[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function addPatientToClinic(clinicId: number, patient: PacienteAssociadoClinica) {
  const list = loadClinicPatients(clinicId);
  if (list.some((p) => p.userId === patient.userId)) return;
  list.push(patient);
  try {
    localStorage.setItem(CLINIC_PATIENTS_STORAGE_PREFIX + clinicId, JSON.stringify(list));
  } catch {
    console.error("Error adding patient to clinic");
  }
}

function addClinicAppointment(clinicId: number, appointment: ClinicAppointment) {
  const key = CLINIC_APPOINTMENTS_STORAGE_PREFIX + clinicId;
  try {
    const stored = localStorage.getItem(key);
    const list = stored ? JSON.parse(stored) : [];
    list.push(appointment);
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    console.error("Error saving clinic appointment");
  }
}

/** Horários permitidos: 08:00–12:00 e 13:00–18:00 (intervalos de 1h: 8,9,10,11 e 13,14,15,16,17) */
const ALLOWED_MORNING_HOURS = [8, 9, 10, 11];
const ALLOWED_AFTERNOON_HOURS = [13, 14, 15, 16, 17];
const MIN_INTERVAL_HOURS = 2;

function isTimeInAllowedWindows(d: Dayjs): boolean {
  const hour = d.hour();
  const minute = d.minute();
  if (minute !== 0 && minute !== 30) return false;
  return ALLOWED_MORNING_HOURS.includes(hour) || ALLOWED_AFTERNOON_HOURS.includes(hour);
}

function isAtLeast2HoursFromAll(candidate: Dayjs, existing: Dayjs[]): boolean {
  return existing.every((t) => Math.abs(candidate.diff(t, "hour", true)) >= MIN_INTERVAL_HOURS);
}

/** Retorna todos os horários de agendamento da clínica em uma determinada data (qualquer paciente) */
function loadClinicAppointmentTimesOnDate(clinicId: number, date: Dayjs): Dayjs[] {
  const dateStr = date.format("YYYY-MM-DD");
  const result: Dayjs[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(PATIENT_APPOINTMENTS_STORAGE_PREFIX)) continue;
    const stored = localStorage.getItem(key);
    if (!stored) continue;
    try {
      const list = JSON.parse(stored) as AgendamentoPaciente[];
      if (!Array.isArray(list)) continue;
      list
        .filter((a) => a.clinicaId === clinicId)
        .forEach((a) => {
          const d = dayjs(a.dataAgendada);
          if (d.format("YYYY-MM-DD") === dateStr) result.push(d);
        });
    } catch {
      // ignore
    }
  }
  return result;
}

/** Dia no calendário do paciente: em vermelho quando a clínica marcou como sem atendimento ou final de semana (se opção ativa) */
function PatientCalendarDay(
  props: PickersDayProps & { unavailableDays?: string[]; includeWeekends?: boolean }
) {
  const { unavailableDays = [], includeWeekends = false, day, ...other } = props;
  const key = day.format("YYYY-MM-DD");
  const isWeekend = day.day() === 0 || day.day() === 6;
  const isUnavailable =
    unavailableDays.includes(key) || (includeWeekends && isWeekend);
  return (
    <PickersDay
      {...other}
      day={day}
      sx={
        isUnavailable
          ? {
              bgcolor: "error.main",
              color: "error.contrastText",
              "&.Mui-disabled": { bgcolor: "error.main", color: "error.contrastText", opacity: 0.9 },
            }
          : undefined
      }
    />
  );
}

// ========== COMPONENT ==========
export default function MyAppointments() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.id ?? 0;

  // Data states
  const [procedimentos, setProcedimentos] = useState<ProcedimentoItem[]>([]);
  const [clinicas, setClinicas] = useState<ClinicaItem[]>([]);
  const [hiredProcedures, setHiredProcedures] = useState<HiredProcedure[]>([]);
  const [, setAppointments] = useState<AgendamentoPaciente[]>([]);
  const [patientLocation, setPatientLocation] = useState<{ cidade: string; estado: string } | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  // UI states for hiring
  const [modalHireAberto, setModalHireAberto] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterByRegion, setFilterByRegion] = useState(false);
  const [selectedProcId, setSelectedProcId] = useState<string>("");
  const [modalParceladoAberto, setModalParceladoAberto] = useState(false);
  const [parcelasSelecionadas, setParcelasSelecionadas] = useState<number>(1);

  // UI states for scheduling
  const [modalScheduleAberto, setModalScheduleAberto] = useState(false);
  const [selectedHiredId, setSelectedHiredId] = useState<number | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<Dayjs | null>(dayjs());
  /** Horários já agendados na clínica no dia selecionado (para validar intervalo de 2h) */
  const [existingTimesOnSelectedDate, setExistingTimesOnSelectedDate] = useState<Dayjs[]>([]);

  // Cross‑sell suggestions
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<ProcedimentoItem[]>([]);

  // Load data on mount
  useEffect(() => {
    setProcedimentos(loadAllProcedimentos());
    setClinicas(loadClinicasFromStorage());
    if (userId) {
      setPatientLocation(loadPatientLocation(userId));
      setHiredProcedures(loadHiredProcedures(userId));
      setAppointments(loadPatientAppointments(userId));
    }
  }, [userId]);

  // Ao abrir o modal de agendamento ou mudar a data, carregar horários já ocupados na clínica naquele dia
  useEffect(() => {
    if (!modalScheduleAberto || !selectedHiredId || !selectedDateTime) {
      setExistingTimesOnSelectedDate([]);
      return;
    }
    const hired = hiredProcedures.find((h) => h.id === selectedHiredId);
    if (!hired) return;
    setExistingTimesOnSelectedDate(loadClinicAppointmentTimesOnDate(hired.clinicaId, selectedDateTime));
  }, [modalScheduleAberto, selectedHiredId, selectedDateTime, hiredProcedures]);

  // Merge clinic names into procedures
  const procedimentosComClinica = useMemo(() => {
    return procedimentos.map((p) => {
      const clinica = clinicas.find((c) => c.id === p.clinicaId);
      return {
        ...p,
        clinicaNome: clinica?.nomeFantasia || `Clínica ${p.clinicaId}`,
        clinicaCidade: clinica?.cidade || "",
        clinicaEstado: clinica?.estado || "",
      };
    });
  }, [procedimentos, clinicas]);

  // Filter procedures for hiring modal
  const procedimentosFiltrados = useMemo(() => {
    let filtered = procedimentosComClinica;
    if (filterByRegion && patientLocation) {
      filtered = filtered.filter(
        (p) =>
          p.clinicaCidade === patientLocation.cidade &&
          p.clinicaEstado === patientLocation.estado
      );
    }
    if (searchTerm) {
      filtered = filtered.filter((p) =>
        (p.finalidade || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [procedimentosComClinica, filterByRegion, patientLocation, searchTerm]);

  // Group hired procedures by status
  const visibleHired = hiredProcedures.filter((h) => !h.hiddenByPatient);
  const pendingProcedures = visibleHired.filter((p) => p.status === "pending");
  const paidProcedures = visibleHired.filter((p) => p.status === "paid");
  const scheduledProcedures = visibleHired.filter((p) => p.status === "scheduled");

  // Handlers
  const handleHire = () => {
    if (!selectedProcId || !userId || !user) return;
    const proc = procedimentosComClinica.find((p) => String(p.id) === selectedProcId);
    if (!proc) return;

    // Add patient to clinic (first time)
    const nomeCompleto = [user.first_name, user.last_name].filter(Boolean).join(" ").trim() || user.email || `Paciente ${user.id}`;
    addPatientToClinic(proc.clinicaId, {
      userId: user.id,
      nome: nomeCompleto,
      email: user.email ?? "",
      dataAssociacao: new Date().toISOString(),
    });

    // Create hired procedure (pending)
    const newHired: HiredProcedure = {
      id: Date.now(),
      userId,
      clinicaId: proc.clinicaId,
      clinicaNome: proc.clinicaNome,
      procedimentoId: proc.id,
      procedimentoNome: proc.finalidade,
      valor: proc.valorProcedimento,
      parcelasCartao: proc.parcelasCartao,
      status: "pending",
      dataContratacao: new Date().toISOString(),
    };
    const updated = [...hiredProcedures, newHired];
    setHiredProcedures(updated);
    saveHiredProcedures(userId, updated);
    setModalHireAberto(false);
    setSelectedProcId("");
    setSearchTerm("");
    setSnackbar({ open: true, message: "Procedimento contratado! Vá para pagamentos.", severity: "success" });
  };

  const handleOpenParcelado = () => {
    if (!selectedProcId) {
      setSnackbar({
        open: true,
        message: "Selecione um procedimento para contratar com pagamento parcelado.",
        severity: "error",
      });
      return;
    }
    const proc = procedimentosComClinica.find((p) => String(p.id) === selectedProcId);
    const maxParcelasProcedimento = proc ? parseInt(proc.parcelasCartao || "1", 10) || 1 : 1;
    const maxParcelas = Math.min(10, maxParcelasProcedimento || 1);
    setParcelasSelecionadas(maxParcelas);
    setModalParceladoAberto(true);
  };

  const handleConfirmParcelado = () => {
    if (!selectedProcId || !userId || !user) return;
    const proc = procedimentosComClinica.find((p) => String(p.id) === selectedProcId);
    if (!proc) return;

    const maxParcelasProcedimento = parseInt(proc.parcelasCartao || "1", 10) || 1;
    const maxParcelas = Math.min(10, maxParcelasProcedimento || 1);
    const nParcelas = Math.min(maxParcelas, Math.max(1, parcelasSelecionadas));

    const nomeCompleto =
      [user.first_name, user.last_name].filter(Boolean).join(" ").trim() ||
      user.email ||
      `Paciente ${user.id}`;

    addPatientToClinic(proc.clinicaId, {
      userId: user.id,
      nome: nomeCompleto,
      email: user.email ?? "",
      dataAssociacao: new Date().toISOString(),
    });

    const newHired: HiredProcedure = {
      id: Date.now(),
      userId,
      clinicaId: proc.clinicaId,
      clinicaNome: proc.clinicaNome,
      procedimentoId: proc.id,
      procedimentoNome: proc.finalidade,
      valor: proc.valorProcedimento,
      parcelasCartao: String(nParcelas),
      installmentsTotal: nParcelas,
      installmentsPaid: 0,
      status: "pending",
      dataContratacao: new Date().toISOString(),
    };

    const updated = [...hiredProcedures, newHired];
    setHiredProcedures(updated);
    saveHiredProcedures(userId, updated);

    setModalParceladoAberto(false);
    setModalHireAberto(false);
    setSelectedProcId("");
    setSearchTerm("");
    setSnackbar({
      open: true,
      message: "Procedimento contratado com pagamento parcelado. Vá para a área de pagamentos.",
      severity: "success",
    });
  };

  const hideProcedureFromPatient = (proc: HiredProcedure) => {
    const updated = hiredProcedures.map((h) =>
      h.id === proc.id ? { ...h, hiddenByPatient: true } : h
    );
    setHiredProcedures(updated);
    if (userId) saveHiredProcedures(userId, updated);
  };

  const handleSchedule = (hiredId: number) => {
    setSelectedHiredId(hiredId);
    const hired = hiredProcedures.find((h) => h.id === hiredId);
    if (hired) {
      const otherProcs = procedimentosComClinica.filter(
        (p) =>
          p.clinicaId === hired.clinicaId &&
          p.id !== hired.procedimentoId &&
          !hiredProcedures.some((h) => h.procedimentoId === p.id && h.status !== "scheduled")
      );
      setSuggestions(otherProcs);
      setShowSuggestions(otherProcs.length > 0);
    }
    setModalScheduleAberto(true);
    setSelectedDateTime(dayjs()); 
  };

  const handleAddSuggestion = (procId: number) => {
    if (!userId || !user) return;
    const proc = procedimentosComClinica.find((p) => p.id === procId);
    if (!proc) return;

    // Add to hired procedures (pending)
    const newHired: HiredProcedure = {
      id: Date.now() + Math.random(),
      userId,
      clinicaId: proc.clinicaId,
      clinicaNome: proc.clinicaNome,
      procedimentoId: proc.id,
      procedimentoNome: proc.finalidade,
      valor: proc.valorProcedimento,
      parcelasCartao: proc.parcelasCartao,
      status: "pending",
      dataContratacao: new Date().toISOString(),
    };
    const updated = [...hiredProcedures, newHired];
    setHiredProcedures(updated);
    saveHiredProcedures(userId, updated);
    // Remove from suggestions
    setSuggestions(suggestions.filter((s) => s.id !== procId));
    setSnackbar({ open: true, message: "Serviço adicional contratado!", severity: "success" });
  };

  const confirmSchedule = () => {
    if (!selectedHiredId || !selectedDateTime || !userId || !user) return;
    const hired = hiredProcedures.find((h) => h.id === selectedHiredId);
    if (!hired) return;

    if (!isTimeInAllowedWindows(selectedDateTime)) {
      setSnackbar({
        open: true,
        message: "Horário fora do expediente. Escolha entre 08:00–12:00 e 13:00–18:00.",
        severity: "error",
      });
      return;
    }
    if (!isAtLeast2HoursFromAll(selectedDateTime, existingTimesOnSelectedDate)) {
      setSnackbar({
        open: true,
        message: "Este horário está a menos de 2 horas de outro agendamento. Escolha outro horário.",
        severity: "error",
      });
      return;
    }

    // Update hired procedure status
    const updatedHired: HiredProcedure[] = hiredProcedures.map((h) =>
      h.id === selectedHiredId
        ? { ...h, status: "scheduled" as const, dataAgendada: selectedDateTime.toISOString() }
        : h
    );
    setHiredProcedures(updatedHired);
    saveHiredProcedures(userId, updatedHired);

    // Create patient appointment
    const appointmentsNow = loadPatientAppointments(userId);
    const newAppt: AgendamentoPaciente = {
      id: Date.now(),
      userId,
      clinicaId: hired.clinicaId,
      clinicaNome: hired.clinicaNome,
      procedimentoId: hired.procedimentoId,
      procedimentoNome: hired.procedimentoNome,
      dataAgendada: selectedDateTime.toISOString(),
    };
    const updatedAppts = [...appointmentsNow, newAppt];
    setAppointments(updatedAppts);
    savePatientAppointments(userId, updatedAppts);

    // Create clinic appointment
    addClinicAppointment(hired.clinicaId, {
      id: Date.now(),
      patientId: userId,
      patientName: `${user.first_name} ${user.last_name}`.trim(),
      procedureId: hired.procedimentoId,
      procedureName: hired.procedimentoNome,
      date: selectedDateTime.toISOString(),
    });

    setModalScheduleAberto(false);
    setSelectedHiredId(null);
    setShowSuggestions(false);
    setSnackbar({ open: true, message: "Agendamento confirmado!", severity: "success" });
  };

  return (
    <Box sx={{ mt: { xs: 7, sm: 8 } }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Meus Agendamentos
      </Typography>

      {/* Botão para contratar novo procedimento */}
      <Box display="flex" justifyContent="flex-end" mb={3}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setModalHireAberto(true)}
        >
          Contratar novo procedimento
        </Button>
      </Box>

      {/* Seções agrupadas */}
      <Stack spacing={3}>
        {/* Pendentes (aguardando pagamento) */}
        {pendingProcedures.length > 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Aguardando pagamento
            </Typography>
            <List>
              {pendingProcedures.map((h) => (
                <ListItem
                  key={h.id}
                  secondaryAction={
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<PaymentIcon />}
                      onClick={() => navigate(APP_ROUTES.PATIENT.PAYMENTS)}
                    >
                      Pagar
                    </Button>
                  }
                >
                  <ListItemText
                    primary={h.procedimentoNome}
                    secondary={`${h.clinicaNome} · R$ ${h.valor} · até ${h.parcelasCartao}x`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        {/* Pagos (aguardando agendamento) */}
        {paidProcedures.length > 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Pagos – agendar data
            </Typography>
            <List>
              {paidProcedures.map((h) => (
                <ListItem
                  key={h.id}
                  secondaryAction={
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => hideProcedureFromPatient(h)}
                        aria-label="Ocultar da lista"
                        title="Excluir da lista (oculta para você)"
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<ScheduleIcon />}
                        onClick={() => handleSchedule(h.id)}
                      >
                        Agendar
                      </Button>
                    </Stack>
                  }
                >
                  <ListItemText
                    primary={h.procedimentoNome}
                    secondary={h.clinicaNome}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        {/* Agendados */}
        {scheduledProcedures.length > 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Agendados
            </Typography>
            <List>
              {scheduledProcedures.map((h) => (
                <ListItem key={h.id}>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary={h.procedimentoNome}
                    secondary={`${h.clinicaNome} · Data: ${
                      h.dataAgendada ? dayjs(h.dataAgendada).format("DD/MM/YYYY [às] HH:mm") : ""
                    }`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Stack>

      {/* Modal de contratação */}
      <Dialog
        open={modalHireAberto}
        onClose={() => setModalHireAberto(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Contratar procedimento</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Buscar procedimento"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />
          {patientLocation && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={filterByRegion}
                  onChange={(e) => setFilterByRegion(e.target.checked)}
                />
              }
              label={`Mostrar apenas clínicas na minha região (${patientLocation.cidade} - ${patientLocation.estado.toUpperCase()})`}
              sx={{ mb: 2 }}
            />
          )}
          {!patientLocation && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Cadastre seu endereço para filtrar por região.
            </Typography>
          )}
          {procedimentosFiltrados.length === 0 ? (
            <Typography color="text.secondary">
              Nenhum procedimento encontrado.
            </Typography>
          ) : (
            <List dense sx={{ maxHeight: 400, overflow: "auto" }}>
              {procedimentosFiltrados.map((p) => (
                <ListItemButton
                  key={p.id}
                  selected={String(p.id) === selectedProcId}
                  onClick={() => setSelectedProcId(String(p.id))}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Radio
                      checked={String(p.id) === selectedProcId}
                      value={String(p.id)}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={p.finalidade}
                    secondary={`${p.clinicaNome} · R$ ${p.valorProcedimento} · até ${p.parcelasCartao}x`}
                  />
                </ListItemButton>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalHireAberto(false)}>Cancelar</Button>
          <Button onClick={handleOpenParcelado} disabled={!selectedProcId}>
            Pagamento parcelado
          </Button>
          <Button variant="contained" onClick={handleHire} disabled={!selectedProcId}>
            Contratar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de pagamento parcelado na contratação */}
      <Dialog
        open={modalParceladoAberto}
        onClose={() => setModalParceladoAberto(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Pagamento parcelado</DialogTitle>
        <DialogContent>
          {selectedProcId && (
            <Box sx={{ mb: 2, p: 2, bgcolor: "action.hover", borderRadius: 1 }}>
              {(() => {
                const proc = procedimentosComClinica.find((p) => String(p.id) === selectedProcId);
                if (!proc) return null;
                const maxParcelasProcedimento = parseInt(proc.parcelasCartao || "1", 10) || 1;
                const maxParcelas = Math.min(10, maxParcelasProcedimento || 1);
                return (
                  <>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {proc.finalidade}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {proc.clinicaNome} · R$ {proc.valorProcedimento} · até {maxParcelas}x no cartão
                    </Typography>
                  </>
                );
              })()}
            </Box>
          )}
          <TextField
            fullWidth
            type="number"
            label="Número de parcelas"
            value={parcelasSelecionadas}
            onChange={(e) => setParcelasSelecionadas(Number(e.target.value) || 1)}
            inputProps={{ min: 1, max: 10 }}
            helperText="Escolha em quantas vezes deseja dividir (até 10x, limitado pelo máximo do procedimento)."
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalParceladoAberto(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleConfirmParcelado}
            disabled={!selectedProcId}
          >
            Confirmar pagamento parcelado
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de agendamento */}
      <Dialog
        open={modalScheduleAberto}
        onClose={() => setModalScheduleAberto(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Escolher data e horário</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <DateCalendar
                value={selectedDateTime}
                onChange={(newDate) => setSelectedDateTime(newDate)}
                disablePast
                shouldDisableDate={(date) => {
                  const hired = selectedHiredId ? hiredProcedures.find((h) => h.id === selectedHiredId) : null;
                  if (!hired) return false;
                  const unavailable = loadClinicUnavailableDays(hired.clinicaId);
                  const includeWeekends = loadClinicIncludeWeekends(hired.clinicaId);
                  const key = dayjs(date).format("YYYY-MM-DD");
                  const d = dayjs(date);
                  const isWeekend = d.day() === 0 || d.day() === 6;
                  return unavailable.includes(key) || (includeWeekends && isWeekend);
                }}
                slots={{ day: PatientCalendarDay }}
                slotProps={{
                  day: (() => {
                    const hired = selectedHiredId
                      ? hiredProcedures.find((h) => h.id === selectedHiredId)
                      : null;
                    const clinicId = hired?.clinicaId ?? 0;
                    return {
                      unavailableDays: loadClinicUnavailableDays(clinicId),
                      includeWeekends: loadClinicIncludeWeekends(clinicId),
                    } as object;
                  })(),
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: -1 }}>
                Dias em vermelho: clínica sem atendimento (não é possível agendar).
              </Typography>
              <TimePicker
                label="Horário (08:00–12:00 e 13:00–18:00, intervalo de 2h entre agendamentos)"
                value={selectedDateTime}
                onChange={(newValue) => setSelectedDateTime(newValue)}
                minTime={dayjs().hour(8).minute(0).second(0)}
                maxTime={dayjs().hour(18).minute(0).second(0)}
                minutesStep={30}
                ampm={false}
                shouldDisableTime={(value, view) => {
                  if (!value) return false;
                  if (view === "hours") {
                    const h = value.hour();
                    return !ALLOWED_MORNING_HOURS.includes(h) && !ALLOWED_AFTERNOON_HOURS.includes(h);
                  }
                  if (view === "minutes") {
                    const m = value.minute();
                    if (m !== 0 && m !== 30) return true;
                    return !isTimeInAllowedWindows(value) || !isAtLeast2HoursFromAll(value, existingTimesOnSelectedDate);
                  }
                  return false;
                }}
              />
            </Stack>
          </LocalizationProvider>

          {/* Cross‑sell suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Outros serviços desta clínica
              </Typography>
              <List dense>
                {suggestions.map((s) => (
                  <ListItem
                    key={s.id}
                    secondaryAction={
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleAddSuggestion(s.id)}
                      >
                        Adicionar
                      </Button>
                    }
                  >
                    <ListItemText
                      primary={s.finalidade}
                      secondary={`R$ ${s.valorProcedimento} · até ${s.parcelasCartao}x`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalScheduleAberto(false)}>Cancelar</Button>
          <Button variant="contained" onClick={confirmSchedule}>
            Confirmar Agendamento
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
