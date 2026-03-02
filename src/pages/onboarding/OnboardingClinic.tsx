import { Box, Container, Typography, Button, Paper, Stack } from '@mui/material';
import { useNavigate } from 'react-router';
import { APP_ROUTES } from '../../util/constants';
import PeopleIcon from '@mui/icons-material/People';
import PaymentIcon from '@mui/icons-material/Payment';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SecurityIcon from '@mui/icons-material/Security';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const benefits = [
  {
    icon: <PeopleIcon sx={{ fontSize: 32, color: '#A3AED0' }} />,
    title: 'Gerencie Seus Pacientes',
    description: 'Organize e acompanhe todos os seus pacientes em uma plataforma centralizada.',
  },
  {
    icon: <PaymentIcon sx={{ fontSize: 32, color: '#A3AED0' }} />,
    title: 'Sistema de Pagamentos Moderno',
    description: 'Facilite os pagamentos de seus clientes com nossa nova solução segura e eficiente.',
  },
  {
    icon: <AnalyticsIcon sx={{ fontSize: 32, color: '#A3AED0' }} />,
    title: 'Relatórios e Analytics',
    description: 'Acompanhe métricas importantes e tome decisões com base em dados reais.',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 32, color: '#A3AED0' }} />,
    title: 'Conformidade Legal',
    description: 'Sistema desenvolvido em conformidade com as regulamentações de saúde.',
  },
];

export default function OnboardingClinic() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      {/* Header com botão voltar */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          p: 2,
          zIndex: 10,
        }}
      >
        <Container maxWidth="lg">
          <Button
            startIcon={<ChevronLeftIcon />}
            onClick={() => navigate('/choose-role')}
            variant="text"
          >
            Voltar
          </Button>
        </Container>
      </Box>

      {/* Hero Banner com imagem e efeito parallax */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 320, md: 420 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          color: 'white',
          textAlign: 'center',
        }}
      >
        {/* Imagem de fundo – clínica de estética / atendimento */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1920)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: { xs: 'scroll', md: 'fixed' },
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.85) 0%, rgba(13, 71, 161, 0.75) 50%, rgba(0, 0, 0, 0.6) 100%)',
            },
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 6, md: 8 } }}>
          <Typography
            variant="h2"
            fontWeight={700}
            gutterBottom
            sx={{
              fontSize: { xs: 32, md: 48 },
              textShadow: '0 2px 20px rgba(0,0,0,0.3)',
              letterSpacing: '-0.02em',
            }}
          >
            Transforme Sua Clínica
          </Typography>
          <Typography
            variant="h6"
            sx={{
              opacity: 0.95,
              mb: 0,
              maxWidth: 600,
              mx: 'auto',
              fontSize: { xs: 16, md: 20 },
              textShadow: '0 1px 10px rgba(0,0,0,0.25)',
            }}
          >
            Facilite os pagamentos de seus clientes com nossa nova solução de sistema de pagamentos integrado.
          </Typography>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            fontWeight={700}
            gutterBottom
            sx={{ mb: 4, textAlign: 'center' }}
          >
            Benefícios para Sua Clínica
          </Typography>

          <Stack
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 3,
              mb: 6,
            }}
          >
            {benefits.map((benefit, index) => (
              <Paper
                key={index}
                elevation={1}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  display: 'flex',
                  gap: 3,
                  transition: 'box-shadow 0.2s',
                  '&:hover': {
                    boxShadow: 3,
                  },
                }}
              >
                <Box sx={{ flexShrink: 0 }}>
                  {benefit.icon}
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {benefit.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {benefit.description}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Stack>

          {/* CTA Section */}
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Comece a modernizar sua clínica agora
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ justifyContent: 'center' }}
            >
              <Button
                variant="contained"
                color="secondary"
                size="large"
                sx={{ minWidth: 200 }}
                onClick={() => navigate(APP_ROUTES.REGISTER_CLINIC)}
              >
                Criar Conta de Clínica
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                sx={{ minWidth: 200 }}
                onClick={() => navigate(APP_ROUTES.LOGIN_CLINIC)}
              >
                Entrar como Clínica
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
