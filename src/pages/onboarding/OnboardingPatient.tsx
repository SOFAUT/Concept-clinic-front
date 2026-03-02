import { Box, Container, Typography, Button, Paper, Stack, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router';
import { APP_ROUTES } from '../../util/constants';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PaymentIcon from '@mui/icons-material/Payment';
import HistoryIcon from '@mui/icons-material/History';
import SecurityIcon from '@mui/icons-material/Security';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const benefits = [
  {
    icon: <CalendarMonthIcon sx={{ fontSize: 32, color: '#A3AED0' }} />,
    title: 'Agendamentos Fáceis',
    description: 'Reserve suas consultas com apenas alguns cliques, em qualquer hora e lugar.',
  },
  {
    icon: <PaymentIcon sx={{ fontSize: 32, color: '#A3AED0' }} />,
    title: 'Pagamentos Seguros',
    description: 'Realize seus pagamentos de forma segura com apoio de sistemas modernos.',
  },
  {
    icon: <HistoryIcon sx={{ fontSize: 32, color: '#A3AED0' }} />,
    title: 'Histórico Completo',
    description: 'Acompanhe todo o seu histórico de procedimentos e tratamentos em um único lugar.',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 32, color: '#A3AED0' }} />,
    title: 'Dados Protegidos',
    description: 'Seus dados pessoais são protegidos com as mais altas medidas de segurança.',
  },
];

export default function OnboardingPatient() {
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
        {/* Imagem de fundo – atendimento ao paciente / estética */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1920)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: { xs: 'scroll', md: 'fixed' },
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.82) 0%, rgba(2, 136, 209, 0.78) 50%, rgba(0, 0, 0, 0.55) 100%)',
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
            Sua Saúde, Nossa Prioridade
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
            Realize seus pagamentos e agendamentos com nosso sistema de pagamentos moderno e seguro.
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
            Benefícios para Você
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
              Tudo O Que Você Precisa:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: 'success.main' }} />
                </ListItemIcon>
                <ListItemText primary="Acesso 24/7 às suas informações" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: 'success.main' }} />
                </ListItemIcon>
                <ListItemText primary="Suporte ao cliente dedicado" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: 'success.main' }} />
                </ListItemIcon>
                <ListItemText primary="Múltiplas formas de pagamento" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: 'success.main' }} />
                </ListItemIcon>
                <ListItemText primary="Histórico e recibos digitais" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: 'success.main' }} />
                </ListItemIcon>
                <ListItemText primary="Notificações em tempo real" />
              </ListItem>
            </List>
          </Paper>

          {/* CTA Section */}
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Pronto para começar sua jornada de saúde?
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ justifyContent: 'center' }}
            >
              <Button
                variant="contained"
                size="large"
                sx={{ minWidth: 200 }}
                onClick={() => navigate(APP_ROUTES.REGISTER)}
              >
                Criar Conta
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{ minWidth: 200 }}
                onClick={() => navigate(APP_ROUTES.LOGIN)}
              >
                Entrar na Plataforma
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
