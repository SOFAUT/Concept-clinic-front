import { Box, Container, Typography, Button, Paper, Stack } from '@mui/material';
import { useNavigate } from 'react-router';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';

export default function ChooseRole() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h3"
            fontWeight={700}
            gutterBottom
            sx={{ fontSize: { xs: 28, md: 42 } }}
          >
            Bem-vindo à Concept Clinic
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ fontSize: { xs: 16, md: 20 } }}
          >
            Escolha como você gostaria de prosseguir
          </Typography>
        </Box>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={4}
          sx={{ justifyContent: 'center' }}
        >
          {/* Card do Paciente */}
          <Paper
            elevation={3}
            sx={{
              p: 4,
              flex: 1,
              maxWidth: 350,
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: 6,
              },
            }}
            onClick={() => navigate('/onboarding/patient')}
          >
            <PersonIcon
              sx={{
                fontSize: 80,
                color: (theme) => theme.palette.mode === 'dark' ? '#7B8EE4' : 'primary.main',
                mb: 2,
              }}
            />
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Sou Paciente
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3, flexGrow: 1 }}
            >
              Agende suas consultas e realize seus pagamentos de forma segura e prática.
            </Typography>
            <Button
              variant="contained"
              size="large"
              fullWidth
            >
              Continuar como Paciente
            </Button>
          </Paper>

          {/* Card da Clínica */}
          <Paper
            elevation={3}
            sx={{
              p: 4,
              flex: 1,
              maxWidth: 350,
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: 6,
              },
            }}
            onClick={() => navigate('/onboarding/clinic')}
          >
            <BusinessIcon
              sx={{
                fontSize: 80,
                color: (theme) => theme.palette.mode === 'dark' ? '#7B8EE4' : 'secondary.main',
                mb: 2,
              }}
            />
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Sou uma Clínica
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3, flexGrow: 1 }}
            >
              Facilite os pagamentos de seus clientes com nossa solução moderna e segura.
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              fullWidth
            >
              Continuar como Clínica
            </Button>
          </Paper>
        </Stack>

        {/* Voltar para home */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="text"
            onClick={() => navigate('/')}
          >
            Voltar para a página inicial
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
