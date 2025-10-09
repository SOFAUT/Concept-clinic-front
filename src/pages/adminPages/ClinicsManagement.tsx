import { Box, Typography, Button, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function ClinicsManagement() {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>
          Gestão de Clínicas
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Nova Clínica
        </Button>
      </Box>
      
      <Paper sx={{ p: 3 }}>
        <Typography color="text.secondary">
          Nenhuma clínica cadastrada ainda.
        </Typography>
      </Paper>
    </Box>
  );
}
