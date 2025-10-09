import { Box, Typography, Paper, TextField, Button, Stack } from '@mui/material';

export default function Profile() {
  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Meu Perfil
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <TextField
              label="Nome"
              fullWidth
              disabled
              defaultValue=""
            />
            <TextField
              label="Email"
              fullWidth
              disabled
              defaultValue=""
            />
          </Stack>
          
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <TextField
              label="Telefone"
              fullWidth
              disabled
              defaultValue=""
            />
            <TextField
              label="CPF"
              fullWidth
              disabled
              defaultValue=""
            />
          </Stack>
          
          <Box>
            <Button variant="contained">
              Editar Perfil
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}

