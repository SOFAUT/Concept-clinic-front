import { Box, Typography, Paper, Stack, Button, IconButton, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router';
import { APP_ROUTES } from '../../util/constants';
import dayjs from 'dayjs';

// Dados Mock de Procedimentos
interface ProcedureRow {
  id: number;
  tipo: string;
  paciente: string;
  data: string;
  status: 'agendado' | 'concluido' | 'cancelado';
}

const mockProcedures: ProcedureRow[] = [
  {
    id: 1,
    tipo: 'Botox',
    paciente: 'Maria Silva',
    data: '2025-10-16T10:00:00',
    status: 'agendado',
  },
  {
    id: 2,
    tipo: 'Preenchimento Labial',
    paciente: 'João Santos',
    data: '2025-10-16T14:30:00',
    status: 'agendado',
  },
  {
    id: 3,
    tipo: 'Limpeza de Pele',
    paciente: 'Ana Costa',
    data: '2025-10-15T09:00:00',
    status: 'concluido',
  },
  {
    id: 4,
    tipo: 'Peeling Químico',
    paciente: 'Carlos Oliveira',
    data: '2025-10-17T11:00:00',
    status: 'agendado',
  },
  {
    id: 5,
    tipo: 'Harmonização Facial',
    paciente: 'Beatriz Lima',
    data: '2025-10-18T15:00:00',
    status: 'agendado',
  },
  {
    id: 6,
    tipo: 'Microagulhamento',
    paciente: 'Pedro Almeida',
    data: '2025-10-14T13:00:00',
    status: 'concluido',
  },
  {
    id: 7,
    tipo: 'Depilação a Laser',
    paciente: 'Juliana Ferreira',
    data: '2025-10-16T16:00:00',
    status: 'agendado',
  },
  {
    id: 8,
    tipo: 'Drenagem Linfática',
    paciente: 'Ricardo Souza',
    data: '2025-10-13T10:30:00',
    status: 'cancelado',
  },
];

export default function ClinicDashboard() {
  const navigate = useNavigate();

  // Configuração das colunas da DataGrid
  const columns: GridColDef[] = [
    {
      field: 'tipo',
      headerName: 'Tipo de Procedimento',
      flex: 1,
      minWidth: 180,
    },
    {
      field: 'paciente',
      headerName: 'Paciente',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'data',
      headerName: 'Data',
      flex: 1,
      minWidth: 150,
      valueFormatter: (value) => {
        return dayjs(value).format('DD/MM/YYYY HH:mm');
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams) => {
        const statusColors = {
          agendado: 'primary',
          concluido: 'success',
          cancelado: 'error',
        } as const;
        
        const statusLabels = {
          agendado: 'Agendado',
          concluido: 'Concluído',
          cancelado: 'Cancelado',
        };

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
      renderCell: (params: GridRenderCellParams) => (
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

  // Calcular estatísticas
  const totalProcedimentos = mockProcedures.length;
  const agendamentosHoje = mockProcedures.filter(
    p => dayjs(p.data).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
  ).length;
  const totalPacientes = new Set(mockProcedures.map(p => p.paciente)).size;

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Dashboard - Clínica
      </Typography>
      
      {/* Cards de Estatísticas */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} mb={4}>
        <Box flex={1}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Agendamentos Hoje
            </Typography>
            <Typography variant="h3" fontWeight={700}>
              {agendamentosHoje}
            </Typography>
          </Paper>
        </Box>
        
        <Box flex={1}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Total de Pacientes
            </Typography>
            <Typography variant="h3" fontWeight={700}>
              {totalPacientes}
            </Typography>
          </Paper>
        </Box>
        
        <Box flex={1}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Procedimentos
            </Typography>
            <Typography variant="h3" fontWeight={700}>
              {totalProcedimentos}
            </Typography>
          </Paper>
        </Box>
        
        <Box flex={1}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Receita do Mês
            </Typography>
            <Typography variant="h3" fontWeight={700}>
              R$ 12.450,00
            </Typography>
          </Paper>
        </Box>
      </Stack>

      {/* DataGrid de Procedimentos */}
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight={600}>
            Procedimentos Recentes
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate(APP_ROUTES.CLINIC.PROCEDURES)}
          >
            Ver Todos
          </Button>
        </Box>

        <Box sx={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={mockProcedures}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
            disableRowSelectionOnClick
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
}

