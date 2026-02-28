import { Box, Typography, Paper, Stack, List, ListItem, ListItemText, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../core/store/hooks";
import { useNavigate } from "react-router";
import { APP_ROUTES } from "../../util/constants";
import dayjs from "dayjs";

const PATIENT_HIRED_PROCEDURES_PREFIX = "patient_hired_procedures_";
const PATIENT_APPOINTMENTS_STORAGE_PREFIX = "patient_agendamentos_";

interface HiredProcedure {
  id: number;
  status: "pending" | "paid" | "scheduled";
}

interface AgendamentoPaciente {
  id: number;
  clinicaNome: string;
  procedimentoNome?: string;
  dataAgendada: string; // ISO datetime
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

export default function PatientDashboard() {
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.id ?? 0;
  const [stats, setStats] = useState({
    pendingPayments: 0,
    paidProcedures: 0,
    upcomingAppointments: [] as AgendamentoPaciente[],
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;
    const hired = loadHiredProcedures(userId);
    const appointments = loadPatientAppointments(userId);

    const pending = hired.filter((h) => h.status === "pending").length;
    const paid = hired.filter((h) => h.status === "paid").length;

    const now = dayjs();
    const upcoming = appointments
      .filter((a) => dayjs(a.dataAgendada).isAfter(now))
      .sort((a, b) => dayjs(a.dataAgendada).diff(dayjs(b.dataAgendada)));

    setStats({ pendingPayments: pending, paidProcedures: paid, upcomingAppointments: upcoming });
  }, [userId]);

  return (
    <Box sx={{ mt: { xs: 7, sm: 8 } }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Meu Painel
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={3} mb={4}>
        <Box flex={1} onClick={() => navigate(APP_ROUTES.PATIENT.PAYMENTS)} sx={{ cursor: "pointer" }}>
          <Paper sx={{ p: 3, textAlign: "center", "&:hover": { boxShadow: 6 } }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Pagamentos pendentes
            </Typography>
            <Typography variant="h3" fontWeight={700}>
              {stats.pendingPayments}
            </Typography>
          </Paper>
        </Box>

        <Box flex={1} onClick={() => navigate(APP_ROUTES.PATIENT.APPOINTMENTS)} sx={{ cursor: "pointer" }}>
          <Paper sx={{ p: 3, textAlign: "center", "&:hover": { boxShadow: 6 } }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Procedimentos pagos
            </Typography>
            <Typography variant="h3" fontWeight={700}>
              {stats.paidProcedures}
            </Typography>
          </Paper>
        </Box>

        <Box flex={1}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Próximos agendamentos
            </Typography>
            <Typography variant="h3" fontWeight={700}>
              {stats.upcomingAppointments.length}
            </Typography>
          </Paper>
        </Box>
      </Stack>

      {/* Lista de próximos agendamentos */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Seus próximos agendamentos
        </Typography>
        {stats.upcomingAppointments.length === 0 ? (
          <Typography color="text.secondary">Nenhum agendamento futuro.</Typography>
        ) : (
          <List>
            {stats.upcomingAppointments.slice(0, 5).map((appt) => (
              <Box key={appt.id}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary={appt.procedimentoNome || "Procedimento"}
                    secondary={`${appt.clinicaNome} · ${dayjs(appt.dataAgendada).format("DD/MM/YYYY [às] HH:mm")}`}
                  />
                </ListItem>
                <Divider />
              </Box>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}