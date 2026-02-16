import { Box, Typography, Paper, Stack, Chip, Divider } from '@mui/material';
import { List, ListItem, ListItemText } from '@mui/material';
import dayjs from 'dayjs';

interface TransacaoPendente {
  id: number;
  procedimento: string;
  clinica: string;
  valor: string;
  dataVencimento: string;
  formaPagamento: 'pix' | 'cartao';
  status: 'pendente' | 'vencido';
}

// Dados mock de transações pendentes
const mockTransacoesPendentes: TransacaoPendente[] = [
  {
    id: 1,
    procedimento: 'Botox Facial',
    clinica: 'Clínica Estética Premium',
    valor: 'R$ 450,00',
    dataVencimento: '2026-02-10',
    formaPagamento: 'pix',
    status: 'pendente',
  },
  {
    id: 2,
    procedimento: 'Preenchimento Labial',
    clinica: 'Beauty Center',
    valor: 'R$ 380,00',
    dataVencimento: '2026-02-08',
    formaPagamento: 'cartao',
    status: 'vencido',
  },
  {
    id: 3,
    procedimento: 'Limpeza de Pele',
    clinica: 'Clínica Estética Premium',
    valor: 'R$ 150,00',
    dataVencimento: '2026-02-12',
    formaPagamento: 'pix',
    status: 'pendente',
  },
];

export default function PatientDashboard() {
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

      {/* Lista de Transações Pendentes */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Transações Pendentes
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Pagamentos aguardando confirmação
        </Typography>
        
        {mockTransacoesPendentes.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
            Nenhuma transação pendente no momento.
          </Typography>
        ) : (
          <List disablePadding>
            {mockTransacoesPendentes.map((transacao, index) => (
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
                {index < mockTransacoesPendentes.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}

