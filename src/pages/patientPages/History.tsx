import { Box, Typography, Paper, Stack, List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const MOCK_PAGAMENTOS = [
  { id: 1, data: "05/02/2025", clinica: "Clínica Exemplo", procedimento: "Consulta", valor: "R$ 150,00", status: "Pago" },
  { id: 2, data: "28/01/2025", clinica: "Clínica Exemplo", procedimento: "Procedimento X", valor: "R$ 320,00", status: "Pago" },
  { id: 3, data: "15/01/2025", clinica: "Outra Clínica", procedimento: "Avaliação", valor: "R$ 200,00", status: "Pago" },
];

export default function PatientHistory() {
  const totalPagamentos = 0; // Futuramente retorna a quantidade real de pagamentos

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Histórico
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ mb: 3 }}>
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
        <Box flex={1}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Pagamentos realizados
            </Typography>
            <Typography variant="h3" fontWeight={700}>
              {totalPagamentos}
            </Typography>
          </Paper>
        </Box>
      </Stack>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Histórico de pagamentos
        </Typography>
        <List dense disablePadding>
          {MOCK_PAGAMENTOS.map((p) => (
            <ListItem key={p.id} divider>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={`${p.procedimento} · ${p.clinica}`}
                secondary={`${p.data} · ${p.valor}`}
                secondaryTypographyProps={{ color: "text.secondary" }}
              />
              <Typography variant="body2" color="success.main" fontWeight={600}>
                {p.status}
              </Typography>
            </ListItem>
          ))}
        </List>
        {MOCK_PAGAMENTOS.length === 0 && (
          <Typography color="text.secondary" sx={{ py: 2 }}>
            Nenhum pagamento realizado ainda.
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
