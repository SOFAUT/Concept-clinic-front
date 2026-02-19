import React, { useState, useMemo, type ReactNode } from 'react';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Tooltip,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  AppBar,
  Toolbar,
} from '@mui/material';
import { ThemeProvider, CssBaseline } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import getTheme from '../../assets/styles/theme';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router';
import { APP_ROUTES } from '../../util/constants';

interface PatientLandingLayoutProps {
  children: ReactNode;
}

function PatientHeader({
  onToggleTheme,
  themeMode,
}: {
  onToggleTheme: () => void;
  themeMode: 'light' | 'dark';
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate(APP_ROUTES.LOGIN);
  };

  const handleGoToDashboard = () => {
    handleMenuClose();
    navigate(APP_ROUTES.PATIENT.DASHBOARD);
  };

  const handleGoToProfile = () => {
    handleMenuClose();
    navigate(APP_ROUTES.PATIENT.PROFILE);
  };

  const getUserInitials = () => {
    if (!user) return '?';
    return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
  };

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ cursor: 'pointer' }}
            onClick={() => navigate(APP_ROUTES.PATIENT.LANDING)}
          >
            Concept Clinic
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="text"
              color="inherit"
              onClick={() => navigate(APP_ROUTES.PATIENT.DASHBOARD)}
            >
              Meu Painel
            </Button>
            <Button
              variant="text"
              color="inherit"
              onClick={() => navigate(APP_ROUTES.PATIENT.APPOINTMENTS)}
            >
              Agendamentos
            </Button>

            <Tooltip title={themeMode === 'dark' ? 'Tema claro' : 'Tema escuro'}>
              <IconButton color="inherit" onClick={onToggleTheme}>
                {themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>

            {user && (
              <Box>
                <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? '#7B8EE4' : 'primary.main', width: 36, height: 36 }}>
                    {getUserInitials()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {user.first_name} {user.last_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Paciente
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={handleGoToDashboard}>
                    <DashboardIcon sx={{ mr: 1, fontSize: 20 }} />
                    Meu Painel
                  </MenuItem>
                  <MenuItem onClick={handleGoToProfile}>
                    <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                    Meu Perfil
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
                    Sair
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

function PatientFooter() {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: '1px solid',
        borderColor: 'divider',
        py: 3,
        mt: 'auto',
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Concept Clinic
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              A plataforma completa para cuidar da sua saúde e beleza.
            </Typography>
          </Box>

          <Box sx={{ textAlign: { xs: 'center', md: 'right' } }}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Contato: contato@conceptclinic.com.br
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.6, mt: 1 }}>
              © {new Date().getFullYear()} Concept Clinic. Todos os direitos reservados.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

const PatientLandingLayout: React.FC<PatientLandingLayoutProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const theme = useMemo(() => getTheme(themeMode), [themeMode]);

  const handleToggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
        }}
      >
        <PatientHeader onToggleTheme={handleToggleTheme} themeMode={themeMode} />

        <Box component="main" sx={{ flex: 1 }}>
          {children}
        </Box>

        <PatientFooter />
      </Box>
    </ThemeProvider>
  );
};

export default PatientLandingLayout;
