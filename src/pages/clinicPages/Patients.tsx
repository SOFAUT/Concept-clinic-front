import { Box, Typography, Button, Paper, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router';
import { APP_ROUTES } from '../../util/constants';
import dayjs from 'dayjs';

// Dados Mock de Procedimentos Recentes (vinculado à listagem por paciente)
interface ProcedureRow {
  id: number;
  tipo: string;
  paciente: string;
  data: string;
  status: 'agendado' | 'concluido' | 'cancelado';
}

const mockProcedures: ProcedureRow[] = [
  { id: 1, tipo: 'Botox', paciente: 'Maria Silva', data: '2025-10-16T10:00:00', status: 'agendado' },
  { id: 2, tipo: 'Preenchimento Labial', paciente: 'João Santos', data: '2025-10-16T14:30:00', status: 'agendado' },
  { id: 3, tipo: 'Limpeza de Pele', paciente: 'Ana Costa', data: '2025-10-15T09:00:00', status: 'concluido' },
  { id: 4, tipo: 'Peeling Químico', paciente: 'Carlos Oliveira', data: '2025-10-17T11:00:00', status: 'agendado' },
  { id: 5, tipo: 'Harmonização Facial', paciente: 'Beatriz Lima', data: '2025-10-18T15:00:00', status: 'agendado' },
  { id: 6, tipo: 'Microagulhamento', paciente: 'Pedro Almeida', data: '2025-10-14T13:00:00', status: 'concluido' },
  { id: 7, tipo: 'Depilação a Laser', paciente: 'Juliana Ferreira', data: '2025-10-16T16:00:00', status: 'agendado' },
  { id: 8, tipo: 'Drenagem Linfática', paciente: 'Ricardo Souza', data: '2025-10-13T10:30:00', status: 'cancelado' },
];

export default function Patients() {
  const navigate = useNavigate();

  const columns: GridColDef[] = [
    { field: 'tipo', headerName: 'Tipo de Procedimento', flex: 1, minWidth: 180 },
    { field: 'paciente', headerName: 'Paciente', flex: 1, minWidth: 150 },
    {
      field: 'data',
      headerName: 'Data',
      flex: 1,
      minWidth: 150,
      valueFormatter: (value) => dayjs(value).format('DD/MM/YYYY HH:mm'),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams) => {
        const statusColors = { agendado: 'primary', concluido: 'success', cancelado: 'error' } as const;
        const statusLabels = { agendado: 'Agendado', concluido: 'Concluído', cancelado: 'Cancelado' };
        return (
          <Chip
            label={statusLabels[params.value as keyof typeof statusLabels]}
            color={statusColors[params.value as keyof typeof statusColors]}
            size="small"
          />
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Ações',
      flex: 0.5,
      minWidth: 100,
      sortable: false,
      filterable: false,
      renderCell: () => (
        <IconButton
          color="primary"
          onClick={() => navigate(APP_ROUTES.CLINIC.PROCEDURES)}
          title="Ver Procedimento"
        >
          <VisibilityIcon />
        </IconButton>
      ),
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

      {/* Procedimentos Recentes (vinculado à página de Pacientes) */}
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight={600}>
            Procedimentos Recentes
          </Typography>
          <Button variant="contained" onClick={() => navigate(APP_ROUTES.CLINIC.PROCEDURES)}>
            Ver Todos
          </Button>
        </Box>
        <Box sx={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={mockProcedures}
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
