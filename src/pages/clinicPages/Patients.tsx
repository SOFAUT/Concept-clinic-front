import { Box, Typography, Button, Paper, Select, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router';
import { APP_ROUTES } from '../../util/constants';
import dayjs from 'dayjs';
import { useAppSelector } from '../../core/store/hooks';
import { useEffect, useState } from 'react';

const CLINIC_PATIENTS_STORAGE_PREFIX = 'clinic_patients_';
const PATIENT_APPOINTMENTS_STORAGE_PREFIX = 'patient_agendamentos_';

interface PacienteAssociado {
  userId: number;
  nome: string;
  email: string;
  telefone?: string;
  dataAssociacao: string;
}

interface AgendamentoPaciente {
  id: number;
  userId: number;
  clinicaId: number;
  clinicaNome: string;
  procedimentoId?: number;
  procedimentoNome?: string;
  dataAgendada: string;
  status: "realizado" | "em_andamento" | "nao_realizado";
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

function loadPatientAppointmentsForClinic(userId: number, clinicId: number): AgendamentoPaciente[] {
  try {
    const key = PATIENT_APPOINTMENTS_STORAGE_PREFIX + userId;
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as AgendamentoPaciente[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((a) => a.clinicaId === clinicId);
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
    const key = PATIENT_APPOINTMENTS_STORAGE_PREFIX + userId;
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    // eslint-disable-next-line no-console
    console.error('Error saving patient appointments from clinic view');
  }
}

function mapToGridRows(list: PacienteAssociado[], clinicId: number) {
  return list.map((p) => {
    const agendamentos = loadPatientAppointmentsForClinic(p.userId, clinicId);
    // pega o agendamento mais recente (maior dataAgendada)
    const ultimoAgendamento = agendamentos
      .slice()
      .sort((a, b) => dayjs(b.dataAgendada).valueOf() - dayjs(a.dataAgendada).valueOf())[0];

    return {
      id: p.userId,
      nome: p.nome?.trim() || p.email || `Paciente ${p.userId}`,
      email: p.email || '–',
      telefone: p.telefone || '–',
      dataAgendada: ultimoAgendamento?.dataAgendada ?? null,
      status: ultimoAgendamento?.status ?? "em_andamento",
      agendamentoId: ultimoAgendamento?.id ?? null,
      procedimentoId: ultimoAgendamento?.procedimentoId ?? null,
    };
  });
}

export default function Patients() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const clinicId = user?.id ?? 0;
  const [patientsRecent, setPatientsRecent] = useState<ReturnType<typeof mapToGridRows>>([]);

  useEffect(() => {
    setPatientsRecent(mapToGridRows(loadClinicPatients(clinicId), clinicId));
  }, [clinicId]);

  // Recarrega ao montar e quando a janela ganha foco (ex.: voltou da aba onde o paciente associou)
  useEffect(() => {
    const onFocus = () => setPatientsRecent(mapToGridRows(loadClinicPatients(clinicId), clinicId));
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [clinicId]);

  const columns: GridColDef[] = [
    { field: 'nome', headerName: 'Nome', flex: 1, minWidth: 180 },
    { field: 'email', headerName: 'E-mail', flex: 1, minWidth: 180 },
    { field: 'telefone', headerName: 'Telefone', flex: 0.8, minWidth: 130 },
    {
      field: 'dataAgendada',
      headerName: 'Data agendada',
      flex: 0.8,
      minWidth: 140,
      valueFormatter: (value) => (value ? dayjs(value).format('DD/MM/YYYY') : '–'),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      minWidth: 160,
      renderCell: (params) => {
        const value = params.value as AgendamentoPaciente["status"];
        const userId = params.row.id as number;
        const agendamentoId = params.row.agendamentoId as number | null;

        const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
          const newStatus = event.target.value as AgendamentoPaciente["status"];
          // Atualiza localStorage para o paciente
          const list = loadPatientAppointments(userId);
          const updated = list.map((a) =>
            agendamentoId != null && a.id === agendamentoId
              ? { ...a, status: newStatus }
              : a
          );
          savePatientAppointments(userId, updated);
          // Atualiza estado local da grid
          setPatientsRecent((prev) =>
            prev.map((row) =>
              row.id === userId ? { ...row, status: newStatus } : row
            )
          );
        };

        return (
          <Select
            value={value}
            onChange={handleChange}
            variant="outlined"
            size="small"
            sx={{
              minWidth: 140,
              '& .MuiSelect-select': {
                py: 0.5,
                fontSize: 12,
                fontWeight: 600,
              },
            }}
          >
            <MenuItem value="realizado">
              <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#2196F3' }} />
                <span>Realizado</span>
              </Box>
            </MenuItem>
            <MenuItem value="em_andamento">
              <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#FFEB3B' }} />
                <span>Em andamento</span>
              </Box>
            </MenuItem>
            <MenuItem value="nao_realizado">
              <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#F44336' }} />
                <span>Não realizado</span>
              </Box>
            </MenuItem>
          </Select>
        );
      }
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>
          Pacientes
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Novo Paciente
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography color="text.secondary">
          Nenhum paciente cadastrado ainda.
        </Typography>
      </Paper>

      {/* Pacientes recentes */}
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight={600}>
            Pacientes recentes
          </Typography>
          <Button variant="contained" onClick={() => navigate(APP_ROUTES.CLINIC.PROCEDURES)}>
            Ver procedimentos
          </Button>
        </Box>
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={patientsRecent}
            columns={columns}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
            }}
            pageSizeOptions={[5, 10, 25]}
            disableRowSelectionOnClick
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell:focus': { outline: 'none' },
              '& .MuiDataGrid-row:hover': { backgroundColor: 'action.hover' },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
}
