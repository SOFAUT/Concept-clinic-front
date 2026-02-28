import { Box, Typography, Button, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router';
import { APP_ROUTES } from '../../util/constants';
import dayjs from 'dayjs';
import { useAppSelector } from '../../core/store/hooks';
import { useEffect, useState } from 'react';

const CLINIC_PATIENTS_STORAGE_PREFIX = 'clinic_patients_';

interface PacienteAssociado {
  userId: number;
  nome: string;
  email: string;
  dataAssociacao: string;
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

function mapToGridRows(list: PacienteAssociado[]) {
  return list.map((p) => ({
    id: p.userId,
    nome: p.nome?.trim() || p.email || `Paciente ${p.userId}`,
    email: p.email || '–',
    telefone: '–',
    dataCadastro: p.dataAssociacao,
  }));
}

export default function Patients() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const clinicId = user?.id ?? 0;
  const [patientsRecent, setPatientsRecent] = useState<ReturnType<typeof mapToGridRows>>([]);

  useEffect(() => {
    setPatientsRecent(mapToGridRows(loadClinicPatients(clinicId)));
  }, [clinicId]);

  // Recarrega ao montar e quando a janela ganha foco (ex.: voltou da aba onde o paciente associou)
  useEffect(() => {
    const onFocus = () => setPatientsRecent(mapToGridRows(loadClinicPatients(clinicId)));
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [clinicId]);

  const columns: GridColDef[] = [
    { field: 'nome', headerName: 'Nome', flex: 1, minWidth: 180 },
    { field: 'email', headerName: 'E-mail', flex: 1, minWidth: 180 },
    { field: 'telefone', headerName: 'Telefone', flex: 0.8, minWidth: 130 },
    {
      field: 'dataCadastro',
      headerName: 'Data de associação',
      flex: 0.8,
      minWidth: 140,
      valueFormatter: (value) => (value ? dayjs(value).format('DD/MM/YYYY HH:mm') : '–'),
    },
  ];

  return (
    <Box sx={{ mt: { xs: 7, sm: 8 } }}> {/* ← Margem superior adicionada */}
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