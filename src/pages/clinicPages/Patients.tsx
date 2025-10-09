import { Box, Typography, Button, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function Patients() {
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
      
      <Paper sx={{ p: 3 }}>
        <Typography color="text.secondary">
          Nenhum paciente cadastrado ainda.
        </Typography>
      </Paper>
    </Box>
  );
}

