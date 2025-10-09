import { Box, Typography, Paper, Stack } from '@mui/material';

export default function PatientDashboard() {
  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Meu Painel
      </Typography>
      
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Box flex={1}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Próximos Agendamentos
            </Typography>
            <Typography variant="h3" fontWeight={700}>
              0
            </Typography>
          </Paper>
        </Box>
        
        <Box flex={1}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Procedimentos Realizados
            </Typography>
            <Typography variant="h3" fontWeight={700}>
              0
            </Typography>
          </Paper>
        </Box>
      </Stack>
    </Box>
  );
}

