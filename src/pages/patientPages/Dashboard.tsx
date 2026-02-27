import { Box, Typography, Paper, Stack, Chip, Divider, Button } from '@mui/material';
import { List, ListItem, ListItemText } from '@mui/material';
import dayjs from 'dayjs';
import { useAppSelector } from '../../core/store/hooks';
import { useNavigate } from 'react-router';
import { APP_ROUTES } from '../../util/constants';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

const MOCK_PROCEDURES_KEY = 'mock_procedures';
const MOCK_CLINICS_KEY = 'mock_clinics';
const CLINIC_CHARGES_STORAGE_PREFIX = 'clinic_cobrancas_';

interface ProcedimentoItem {
  id: number;
  clinicaId: number;
  finalidade: string;
  invasividade: string;
  valorProcedimento: string;
  parcelasCartao: string;
}

interface ClinicaMapItem {
  id: number;
  nomeFantasia: string;
}

interface CobrancaClinica {
  id: number;
  clinicId: number;
  userId: number;
  pacienteNome: string;
  procedimentoNome?: string;
  dataAgendada: string;
  valor: string;
  parcelas: number;
  criadaEm: string;
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

function loadAllProcedimentos(): ProcedimentoItem[] {
  try {
    const stored = localStorage.getItem(MOCK_PROCEDURES_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as ProcedimentoItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadClinicasMap(): Map<number, ClinicaMapItem> {
  const map = new Map<number, ClinicaMapItem>();
  try {
    const stored = localStorage.getItem(MOCK_CLINICS_KEY);
    if (!stored) return map;
    const parsed = JSON.parse(stored) as Array<{ id?: number; nomeFantasia?: string; nomeEmpresa?: string }>;
    (parsed || []).forEach((c, i) => {
      const id = c.id ?? i + 1;
      map.set(id, { id, nomeFantasia: c.nomeFantasia || c.nomeEmpresa || 'Clínica' });
    });
  } catch {
    // ignore
  }
  return map;
}

function loadTransacoesPendentes(userId: number, clinicasMap: Map<number, ClinicaMapItem>): TransacaoPendente[] {
  if (!userId) return [];
  const result: TransacaoPendente[] = [];
  try {
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(CLINIC_CHARGES_STORAGE_PREFIX)) continue;
      const stored = localStorage.getItem(key);
      if (!stored) continue;
      const parsed = JSON.parse(stored) as CobrancaClinica[];
      if (!Array.isArray(parsed)) continue;
      parsed
        .filter((c) => c.userId === userId)
        .forEach((c) => {
          const clinicaNome =
            clinicasMap.get(c.clinicId)?.nomeFantasia || `Clínica #${c.clinicId}`;
          result.push({
            id: c.id,
            procedimento: c.procedimentoNome || 'Procedimento',
            clinica: clinicaNome,
            valor: `R$ ${c.valor}`,
            dataVencimento: c.dataAgendada,
            formaPagamento: 'cartao',
            status: 'pendente',
          });
        });
    }
  } catch {
    return [];
  }
  return result;
}

export default function PatientDashboard() {
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.id ?? 0;
  const procedimentos = loadAllProcedimentos();
  const clinicasMap = loadClinicasMap();
  const transacoesPendentes = loadTransacoesPendentes(userId, clinicasMap);
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

      {/* Procedimentos cadastrados pelas clínicas */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2 }}>
          <Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Procedimentos cadastrados pelas clínicas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Procedimentos disponíveis nas clínicas do sistema.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            startIcon={<MedicalServicesIcon />}
            onClick={() => navigate(APP_ROUTES.PATIENT.PAYMENTS)}
          >
            Ir para Pagamentos
          </Button>
        </Box>
        {procedimentos.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
            Nenhum procedimento cadastrado pelas clínicas no momento.
          </Typography>
        ) : (
          <List dense disablePadding sx={{ maxHeight: 320, overflow: 'auto' }}>
            {procedimentos.map((p) => {
              const clinica = clinicasMap.get(p.clinicaId);
              const nomeClinica = clinica?.nomeFantasia ?? `Clínica #${p.clinicaId}`;
              return (
                <ListItem key={p.id} sx={{ py: 0.75, px: 0 }}>
                  <ListItemText
                    primary={p.finalidade || '(Sem finalidade)'}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.secondary">
                          {nomeClinica}
                        </Typography>
                        <Typography component="span" variant="body2" color="text.secondary">
                          {' · R$ '}{p.valorProcedimento || '0,00'}
                          {p.parcelasCartao ? ` · até ${p.parcelasCartao}x no cartão` : ''}
                        </Typography>
                      </>
                    }
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>
              );
            })}
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

