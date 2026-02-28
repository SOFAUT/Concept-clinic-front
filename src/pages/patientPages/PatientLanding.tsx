import { Box, Container, Typography, Button, Paper, Stack } from '@mui/material';
import { useNavigate } from 'react-router';
import { APP_ROUTES } from '../../util/constants';
import { useAuth } from '../../hooks/useAuth';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HistoryIcon from '@mui/icons-material/History';
import PaymentIcon from '@mui/icons-material/Payment';
import PatientLandingLayout from '../../components/layout/PatientLandingLayout';

// Caminhos das imagens - adicione os arquivos na pasta src/assets/images/patient/
const PATIENT_IMAGES = {
  banner: new URL('../../assets/images/patient/banner.png', import.meta.url).href,
  servico1: new URL('../../assets/images/patient/servico-1.png', import.meta.url).href,
  servico2: new URL('../../assets/images/patient/servico-2.png', import.meta.url).href,
  servico3: new URL('../../assets/images/patient/servico-3.png', import.meta.url).href,
};

interface ServiceCardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

function ServiceCard({ title, description, imageSrc, imageAlt }: ServiceCardProps) {
  return (
    <Paper
      elevation={2}
      sx={{
        flex: 1,
        minWidth: 260,
        overflow: 'hidden',
        borderRadius: 3,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: 200,
          bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.paper' : 'grey.200',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={imageSrc}
          alt={imageAlt}
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.style.display = 'none';
          }}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </Paper>
  );
}

export default function PatientLanding() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <PatientLandingLayout>
      {/* Margem superior para evitar sobreposição com o cabeçalho */}
      <Box sx={{ mt: { xs: 7, sm: 8 } }}>
        {/* Banner principal com imagem */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            minHeight: { xs: 300, md: 420 },
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* Imagem de fundo do banner */}
          <Box
            component="img"
            src={PATIENT_IMAGES.banner}
            alt="Banner de boas-vindas"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.style.display = 'none';
            }}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
            }}
          />

          {/* Overlay escuro */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              bgcolor: (theme) => theme.palette.mode === 'dark' 
                ? 'rgba(22, 25, 30, 0.6)' 
                : 'rgba(23, 28, 41, 0.65)',
              zIndex: 1,
            }}
          />

          {/* Conteúdo do banner */}
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: 6 }}>
            <Typography
              variant="h3"
              fontWeight={700}
              color="white"
              gutterBottom
              sx={{ fontSize: { xs: 28, md: 42 } }}
            >
              Bem-vindo(a), {user?.first_name || 'Paciente'}!
            </Typography>
            <Typography
              variant="h6"
              color="white"
              sx={{ opacity: 0.9, mb: 3, maxWidth: 600, fontSize: { xs: 16, md: 20 } }}
            >
              Aqui você acompanha seus agendamentos, histórico de procedimentos e
              muito mais. Cuide da sua saúde e beleza com a Concept Clinic.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'secondary.main',
                  color: 'white',
                  fontWeight: 600,
                  px: 4,
                  '&:hover': { bgcolor: 'secondary.dark' },
                }}
                onClick={() => navigate(APP_ROUTES.PATIENT.APPOINTMENTS)}
              >
                Agendar Consulta
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  fontWeight: 600,
                  px: 4,
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                }}
                onClick={() => navigate(APP_ROUTES.PATIENT.DASHBOARD)}
              >
                Ir para o Painel
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Atalhos rápidos */}
        <Container maxWidth="lg" sx={{ py: 5 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
            Acesso Rápido
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
            <Paper
              elevation={1}
              sx={{
                flex: 1,
                p: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: 4 },
              }}
              onClick={() => navigate(APP_ROUTES.PATIENT.APPOINTMENTS)}
            >
              <CalendarMonthIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  Meus Agendamentos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Veja e gerencie suas consultas
                </Typography>
              </Box>
            </Paper>

            <Paper
              elevation={1}
              sx={{
                flex: 1,
                p: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: 4 },
              }}
              onClick={() => navigate(APP_ROUTES.PATIENT.HISTORY)}
            >
              <HistoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  Histórico
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Procedimentos realizados
                </Typography>
              </Box>
            </Paper>

            <Paper
              elevation={1}
              sx={{
                flex: 1,
                p: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: 4 },
              }}
              onClick={() => navigate(APP_ROUTES.PATIENT.PAYMENTS)}
            >
              <PaymentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  Pagamentos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Acompanhe suas transações
                </Typography>
              </Box>
            </Paper>
          </Stack>
        </Container>

        {/* Cards de serviços com imagens */}
        <Box sx={{ bgcolor: 'background.paper', py: 5 }}>
          <Container maxWidth="lg">
            <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
              Nossos Serviços
            </Typography>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={3}
              sx={{ flexWrap: 'wrap' }}
            >
              <ServiceCard
                title="Tratamentos Faciais"
                description="Botox, preenchimentos, limpeza de pele e outros procedimentos para realçar a sua beleza natural."
                imageSrc={PATIENT_IMAGES.servico1}
                imageAlt="Tratamentos faciais"
              />
              <ServiceCard
                title="Procedimentos Corporais"
                description="Tratamentos corporais avançados para modelar, hidratar e rejuvenescer a pele do corpo."
                imageSrc={PATIENT_IMAGES.servico2}
                imageAlt="Procedimentos corporais"
              />
              <ServiceCard
                title="Bem-estar & Saúde"
                description="Acompanhamento integrado da sua saúde com profissionais especializados em bem-estar."
                imageSrc={PATIENT_IMAGES.servico3}
                imageAlt="Bem-estar e saúde"
              />
            </Stack>
          </Container>
        </Box>
      </Box>
    </PatientLandingLayout>
  );
}