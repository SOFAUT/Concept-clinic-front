import { Box, Typography, Paper, TextField, Button, Grid } from '@mui/material';

export default function Profile() {
  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Meu Perfil
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Nome"
              fullWidth
              disabled
              defaultValue=""
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Email"
              fullWidth
              disabled
              defaultValue=""
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Telefone"
              fullWidth
              disabled
              defaultValue=""
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="CPF"
              fullWidth
              disabled
              defaultValue=""
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button variant="contained">
              Editar Perfil
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

