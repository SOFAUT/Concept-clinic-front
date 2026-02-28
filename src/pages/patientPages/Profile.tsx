import { Box, Typography, Paper, TextField, Button, Stack, Alert, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router';
import { APP_ROUTES } from '../../util/constants';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cpf: string;
}

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cpf: '',
  });

  // Carrega dados do usuário ao montar o componente
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        cpf: user.cpf || '',
      });
    }
  }, [user]);

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setSaveMessage(null);
  };

  const handleCancelClick = () => {
    // Restaura dados originais
    if (user) {
      setFormData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        cpf: user.cpf || '',
      });
    }
    setIsEditing(false);
    setSaveMessage(null);
  };

  const handleSaveClick = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      // TODO: Integrar com API para salvar as mudanças
      // Por enquanto, apenas simula o salvamento
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setSaveMessage({
        type: 'success',
        text: 'Perfil atualizado com sucesso!',
      });
      setIsEditing(false);
    } catch {
      setSaveMessage({
        type: 'error',
        text: 'Erro ao salvar o perfil. Tente novamente.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleNameClick = () => {
    navigate(APP_ROUTES.PATIENT.DASHBOARD);
  };

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: { xs: 7, sm: 8 } }}> {/* Margem superior para evitar sobreposição com o cabeçalho */}
      {/* Header com título clicável */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.7,
            },
          }}
          onClick={handleNameClick}
        >
          <ChevronLeftIcon sx={{ fontSize: 28 }} />
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Meu Perfil
          </Typography>
        </Box>
      </Box>

      {/* Mensagem de sucesso/erro */}
      {saveMessage && (
        <Alert severity={saveMessage.type} sx={{ mb: 3 }}>
          {saveMessage.text}
        </Alert>
      )}

      {/* Card do Perfil */}
      <Paper sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Nome e Sobrenome */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <TextField
              label="Nome"
              fullWidth
              disabled={!isEditing}
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              variant={isEditing ? 'outlined' : 'filled'}
            />
            <TextField
              label="Sobrenome"
              fullWidth
              disabled={!isEditing}
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              variant={isEditing ? 'outlined' : 'filled'}
            />
          </Stack>

          {/* Email e Telefone */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <TextField
              label="E-mail"
              fullWidth
              disabled={!isEditing}
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              variant={isEditing ? 'outlined' : 'filled'}
              type="email"
            />
            <TextField
              label="Telefone"
              fullWidth
              disabled={!isEditing}
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              variant={isEditing ? 'outlined' : 'filled'}
              placeholder="(00) 00000-0000"
            />
          </Stack>

          {/* CPF */}
          <TextField
            label="CPF"
            fullWidth
            disabled={!isEditing}
            value={formData.cpf}
            onChange={(e) => handleInputChange('cpf', e.target.value)}
            variant={isEditing ? 'outlined' : 'filled'}
            placeholder="000.000.000-00"
          />

          {/* Botões de ação */}
          <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
            {!isEditing ? (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEditClick}
              >
                Editar Perfil
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveClick}
                  disabled={isSaving}
                >
                  {isSaving ? 'Salvando...' : 'Salvar'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancelClick}
                  disabled={isSaving}
                >
                  Cancelar
                </Button>
              </>
            )}
          </Box>

          {/* Informações adicionais de conta */}
          <Box
            sx={{
              mt: 3,
              pt: 3,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Informações da Conta
            </Typography>
            <Stack spacing={1} sx={{ fontSize: '0.875rem' }}>
              <Typography variant="body2" color="text.secondary">
                <strong>ID:</strong> {user.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Tipo de Usuário:</strong> {user.role === 'patient' ? 'Paciente' : user.role}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}