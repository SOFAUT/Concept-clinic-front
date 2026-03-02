import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ScheduleIcon from "@mui/icons-material/Schedule";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import { useAppSelector } from "../../core/store/hooks";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import type { PickersDayProps } from "@mui/x-date-pickers/PickersDay";

const PATIENT_APPOINTMENTS_STORAGE_PREFIX = "patient_agendamentos_";
const CLINIC_PATIENTS_STORAGE_PREFIX = "clinic_patients_";
export const CLINIC_UNAVAILABLE_DAYS_STORAGE_PREFIX = "clinic_unavailable_days_";
const CLINIC_INCLUDE_WEEKENDS_STORAGE_PREFIX = "clinic_include_weekends_";

interface AgendamentoPaciente {
  id: number;
  userId: number;
  clinicaId: number;
  clinicaNome: string;
  procedimentoId?: number;
  procedimentoNome?: string;
  dataAgendada: string;
}

interface PacienteAssociado {
  userId: number;
  nome: string;
  email: string;
  dataAssociacao: string;
}

/** Agendamento exibido na lista (com nome do paciente) */
interface AgendamentoExibicao extends AgendamentoPaciente {
  pacienteNome: string;
}

function loadClinicPatients(clinicId: number): PacienteAssociado[] {
  try {
    const key = CLINIC_PATIENTS_STORAGE_PREFIX + clinicId;
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as PacienteAssociado[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
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
    console.error("Error saving patient appointments");
  }
}

export function loadClinicUnavailableDays(clinicId: number): string[] {
  try {
    const key = CLINIC_UNAVAILABLE_DAYS_STORAGE_PREFIX + clinicId;
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveClinicUnavailableDays(clinicId: number, days: string[]) {
  try {
    const key = CLINIC_UNAVAILABLE_DAYS_STORAGE_PREFIX + clinicId;
    localStorage.setItem(key, JSON.stringify(days));
  } catch {
    console.error("Error saving clinic unavailable days");
  }
}

export function loadClinicIncludeWeekends(clinicId: number): boolean {
  try {
    const key = CLINIC_INCLUDE_WEEKENDS_STORAGE_PREFIX + clinicId;
    const stored = localStorage.getItem(key);
    return stored === "true";
  } catch {
    return false;
  }
}

function saveClinicIncludeWeekends(clinicId: number, value: boolean) {
  try {
    const key = CLINIC_INCLUDE_WEEKENDS_STORAGE_PREFIX + clinicId;
    localStorage.setItem(key, value ? "true" : "false");
  } catch {
    console.error("Error saving clinic include weekends");
  }
}

/** Retorna todos os agendamentos cujo clinicaId é o da clínica logada */
function loadAppointmentsForClinic(clinicId: number): AgendamentoExibicao[] {
  if (!clinicId) return [];
  const clinicPatients = loadClinicPatients(clinicId);
  const byUserId = new Map(clinicPatients.map((p) => [p.userId, p.nome?.trim() || p.email || `Paciente ${p.userId}`]));
  const result: AgendamentoExibicao[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(PATIENT_APPOINTMENTS_STORAGE_PREFIX)) continue;
    const stored = localStorage.getItem(key);
    if (!stored) continue;
    let list: AgendamentoPaciente[];
    try {
      list = JSON.parse(stored) as AgendamentoPaciente[];
      if (!Array.isArray(list)) continue;
    } catch {
      continue;
    }
    const userId = parseInt(key.replace(PATIENT_APPOINTMENTS_STORAGE_PREFIX, ""), 10);
    if (Number.isNaN(userId)) continue;
    const pacienteNome = byUserId.get(userId) ?? `Paciente #${userId}`;
    list
      .filter((a) => a.clinicaId === clinicId)
      .forEach((a) => result.push({ ...a, pacienteNome }));
  }

  result.sort((a, b) => dayjs(b.dataAgendada).valueOf() - dayjs(a.dataAgendada).valueOf());
  return result;
}

/** Dia do calendário: em vermelho quando está na lista ou é final de semana (se opção ativa) */
function ClinicUnavailableDay(
  props: PickersDayProps & { unavailableDays?: string[]; includeWeekends?: boolean }
) {
  const { unavailableDays = [], includeWeekends = false, day, ...other } = props;
  const key = day.format("YYYY-MM-DD");
  const isWeekend = day.day() === 0 || day.day() === 6; // 0 domingo, 6 sábado
  const isUnavailable = unavailableDays.includes(key) || (includeWeekends && isWeekend);
  return (
    <PickersDay
      {...other}
      day={day}
      sx={
        isUnavailable
          ? {
              bgcolor: "error.main",
              color: "error.contrastText",
              "&:hover": { bgcolor: "error.dark" },
              "&.Mui-selected": { bgcolor: "error.dark" },
            }
          : undefined
      }
    />
  );
}

export default function Appointments() {
  const user = useAppSelector((state) => state.auth.user);
  const clinicId = user?.id ?? 0;
  const [agendamentos, setAgendamentos] = useState<AgendamentoExibicao[]>([]);
  const [unavailableDays, setUnavailableDays] = useState<string[]>([]);
  const [includeWeekends, setIncludeWeekends] = useState(false);

  const refresh = () => {
    setAgendamentos(loadAppointmentsForClinic(clinicId));
    setUnavailableDays(loadClinicUnavailableDays(clinicId));
    setIncludeWeekends(loadClinicIncludeWeekends(clinicId));
  };

  useEffect(() => {
    refresh();
  }, [clinicId]);

  const handleToggleUnavailableDay = (date: Dayjs | null) => {
    if (!date || !clinicId) return;
    const key = date.format("YYYY-MM-DD");
    setUnavailableDays((prev) => {
      const next = prev.includes(key) ? prev.filter((d) => d !== key) : [...prev, key].sort();
      saveClinicUnavailableDays(clinicId, next);
      return next;
    });
  };

  const handleIncludeWeekendsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setIncludeWeekends(checked);
    if (clinicId) saveClinicIncludeWeekends(clinicId, checked);
  };

  useEffect(() => {
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [clinicId]);

  const handleDelete = (item: AgendamentoExibicao) => {
    const list = loadPatientAppointments(item.userId);
    const updated = list.filter((a) => a.id !== item.id);
    savePatientAppointments(item.userId, updated);
    setAgendamentos((prev) => prev.filter((a) => a.id !== item.id || a.userId !== item.userId));
  };

  return (
    <Box sx={{ mt: { xs: 7, sm: 8 } }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>
          Agendamentos
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} disabled>
          Novo Agendamento
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <ScheduleIcon color="action" />
          <Typography variant="h6" fontWeight={600}>
            Agendamentos realizados pelos pacientes
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Procedimentos agendados nesta clínica. É possível excluir um agendamento da lista.
        </Typography>

        {agendamentos.length === 0 ? (
          <Typography color="text.secondary">
            Nenhum agendamento realizado pelos pacientes nesta clínica.
          </Typography>
        ) : (
          <List dense disablePadding>
            {agendamentos.map((ag) => (
              <ListItem
                key={`${ag.userId}-${ag.id}`}
                divider
                sx={{
                  py: 1.5,
                  px: 0,
                  "&:last-of-type": { borderBottom: "none" },
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight={600}>
                      {ag.pacienteNome}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.secondary">
                        {ag.procedimentoNome || "Procedimento"} ·{" "}
                        {dayjs(ag.dataAgendada).format("DD/MM/YYYY [às] HH:mm")}
                      </Typography>
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="Excluir agendamento"
                    onClick={() => handleDelete(ag)}
                    color="error"
                    size="small"
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {/* Calendário: dias sem atendimento (clique para marcar/desmarcar em vermelho) */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <EventBusyIcon color="error" />
          <Typography variant="h6" fontWeight={600}>
            Dias sem atendimento
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Clique em um dia para marcar ou desmarcar como indisponível. Os pacientes não poderão agendar nesses dias (aparecerão em vermelho para eles).
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={includeWeekends}
              onChange={handleIncludeWeekendsChange}
              color="primary"
            />
          }
          label="Marcar finais de semana automaticamente (por mês)"
          sx={{ mb: 2, display: "block" }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ width: "100%", "& .MuiDateCalendar-root": { width: "100%", maxWidth: "100%" } }}>
            <DateCalendar
              value={null}
              onChange={handleToggleUnavailableDay}
              slots={{ day: ClinicUnavailableDay }}
              slotProps={{ day: { unavailableDays, includeWeekends } as object }}
            />
          </Box>
        </LocalizationProvider>
      </Paper>
    </Box>
  );
}
