import { Box, Container, Typography, Button, Paper, Stack, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router';
import { APP_ROUTES } from '../../util/constants';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: (theme) => theme.palette.mode === 'dark' ? '#1E232F' : 'secondary.main',
          color: (theme) => theme.palette.mode === 'dark' ? 'text.primary' : 'white',
          py: { xs: 6, md: 8 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            fontWeight={700}
            gutterBottom
            sx={{ fontSize: { xs: 32, md: 48 } }}
          >
            Transforme Sua Clínica
          </Typography>
          <Typography
            variant="h6"
            sx={{
              opacity: 0.95,
              mb: 4,
              maxWidth: 600,
              mx: 'auto',
              fontSize: { xs: 16, md: 20 },
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

          {/* Checklist */}
          <Paper
            elevation={2}
            sx={{
              p: 4,
              borderRadius: 3,
              mb: 6,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
              Recursos Inclusos:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: 'success.main' }} />
                </ListItemIcon>
                <ListItemText primary="Dashboard administrativo completo" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: 'success.main' }} />
                </ListItemIcon>
                <ListItemText primary="Agendamento automático de consultas" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: 'success.main' }} />
                </ListItemIcon>
                <ListItemText primary="Processamento de pagamentos integrado" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: 'success.main' }} />
                </ListItemIcon>
                <ListItemText primary="Relatórios de faturamento detalhados" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: 'success.main' }} />
                </ListItemIcon>
                <ListItemText primary="Suporte técnico prioritário" />
              </ListItem>
            </List>
          </Paper>

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
