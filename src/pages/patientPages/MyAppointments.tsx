import { Box, Typography, Button, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function MyAppointments() {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>
          Meus Agendamentos
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Agendar
        </Button>
      </Box>
      
      <Paper sx={{ p: 3 }}>
        <Typography color="text.secondary">
          Você não possui agendamentos.
        </Typography>
      </Paper>
    </Box>
  );
}

