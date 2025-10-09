import { Box, Typography, Button, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function Procedures() {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>
          Procedimentos
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Novo Procedimento
        </Button>
      </Box>
      
      <Paper sx={{ p: 3 }}>
        <Typography color="text.secondary">
          Nenhum procedimento cadastrado ainda.
        </Typography>
      </Paper>
    </Box>
  );
}

