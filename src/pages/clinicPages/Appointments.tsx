import { Box, Typography, Button, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function Appointments() {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>
          Agendamentos
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Novo Agendamento
        </Button>
      </Box>
      
      <Paper sx={{ p: 3 }}>
        <Typography color="text.secondary">
          Nenhum agendamento cadastrado ainda.
        </Typography>
      </Paper>
    </Box>
  );
}

