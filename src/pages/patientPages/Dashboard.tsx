import { Box, Typography, Paper, Stack, Chip, Divider, Button } from '@mui/material';
import { List, ListItem, ListItemText } from '@mui/material';
import dayjs from 'dayjs';
import { useAppSelector } from '../../core/store/hooks';
import { useNavigate } from 'react-router';
import { APP_ROUTES } from '../../util/constants';
import BusinessIcon from '@mui/icons-material/Business';

const PATIENT_CLINICAS_STORAGE_PREFIX = 'patient_clinicas_escolhidas_';

interface ClinicaItem {
  id: number;
  nomeFantasia: string;
  nomeEmpresa: string;
}

function loadClinicasEscolhidas(userId: number): ClinicaItem[] {
  try {
    const key = PATIENT_CLINICAS_STORAGE_PREFIX + userId;
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as { clinicasEscolhidas?: ClinicaItem[] };
    return Array.isArray(parsed?.clinicasEscolhidas) ? parsed.clinicasEscolhidas : [];
  } catch {
    return [];
  }
}

interface TransacaoPendente {
  id: number;
  procedimento: string;
  clinica: string;
  valor: string;
  dataVencimento: string;
  formaPagamento: 'pix' | 'cartao';
  status: 'pendente' | 'vencido';
}

// Lista de transações pendentes – dados virão da API
const transacoesPendentes: TransacaoPendente[] = [];

export default function PatientDashboard() {
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.id ?? 0;
  const clinicasEscolhidas = loadClinicasEscolhidas(userId);
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Meu Painel
      </Typography>
      
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} mb={3}>
        <Box flex={1}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Próximos Agendamentos
            </Typography>
            <Typography variant="h3" fontWeight={700}>
              0
            </Typography>
          </Paper>
        </Box>
        
        <Box flex={1}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Procedimentos Realizados
            </Typography>
            <Typography variant="h3" fontWeight={700}>
              0
            </Typography>
          </Paper>
        </Box>
      </Stack>

      {/* Clínicas selecionadas (área de pagamentos) */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2 }}>
          <Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Clínicas selecionadas para pagamento
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Clínicas que você escolheu na área de pagamentos (Escolher clínica).
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            startIcon={<BusinessIcon />}
            onClick={() => navigate(APP_ROUTES.PATIENT.PAYMENTS)}
          >
            Ir para Pagamentos
          </Button>
        </Box>
        {clinicasEscolhidas.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
            Nenhuma clínica selecionada. Acesse a área de Pagamentos e use &quot;Escolher clínica&quot; para adicionar.
          </Typography>
        ) : (
          <List dense disablePadding>
            {clinicasEscolhidas.map((c) => (
              <ListItem key={c.id} sx={{ py: 0.75, px: 0 }}>
                <ListItemText
                  primary={c.nomeFantasia}
                  secondary={c.nomeEmpresa || undefined}
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {/* Lista de Transações Pendentes */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Transações Pendentes
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Pagamentos aguardando confirmação
        </Typography>
        
        {transacoesPendentes.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
            Nenhuma transação pendente no momento.
          </Typography>
        ) : (
          <List disablePadding>
            {transacoesPendentes.map((transacao, index) => (
              <Box key={transacao.id}>
                <ListItem
                  sx={{
                    py: 2,
                    px: 0,
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {transacao.procedimento}
                        </Typography>
                        <Chip
                          label={transacao.status === 'pendente' ? 'Pendente' : 'Vencido'}
                          color={transacao.status === 'pendente' ? 'warning' : 'error'}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {transacao.clinica}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          <Typography variant="body2" color="text.secondary">
                            Valor: <strong>{transacao.valor}</strong>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Vencimento: {dayjs(transacao.dataVencimento).format('DD/MM/YYYY')}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Forma: {transacao.formaPagamento === 'pix' ? 'PIX' : 'Cartão de Crédito'}
                          </Typography>
                        </Box>
                      </Stack>
                    }
                    sx={{ flex: 1 }}
                  />
                </ListItem>
                {index < transacoesPendentes.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}

