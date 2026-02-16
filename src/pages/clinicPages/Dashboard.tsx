import { Box, Typography, Paper, Stack } from '@mui/material';
import dayjs from 'dayjs';
import { FaturamentoBarChart } from '../../components/charts/FaturamentoBarChart';

// Dados Mock de Procedimentos
interface ProcedureRow {
  id: number;
  tipo: string;
  paciente: string;
  data: string;
  status: 'agendado' | 'concluido' | 'cancelado';
}

// Dados mock zerados – procedimentos
const mockProcedures: ProcedureRow[] = [];

// Faturamento por mês (mock zerado) em reais
const mockFaturamentoPorMes = [
  { mes: 'Mar', valor: 0 },
  { mes: 'Abr', valor: 0 },
  { mes: 'Mai', valor: 0 },
  { mes: 'Jun', valor: 0 },
  { mes: 'Jul', valor: 0 },
  { mes: 'Ago', valor: 0 },
  { mes: 'Set', valor: 0 },
  { mes: 'Out', valor: 0 },
  { mes: 'Nov', valor: 0 },
  { mes: 'Dez', valor: 0 },
];

export default function ClinicDashboard() {
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
              R$ 0,00
            </Typography>
          </Paper>
        </Box>
      </Stack>

      {/* Gráfico de barras – Faturamento por mês (D3.js) */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Faturamento por mês (R$)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Valores em reais – últimos meses
        </Typography>
        <Box sx={{ width: '100%', maxWidth: 700 }}>
          <FaturamentoBarChart data={mockFaturamentoPorMes} width={700} height={320} />
        </Box>
      </Paper>
    </Box>
  );
}

