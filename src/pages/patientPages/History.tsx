import { Box, Typography, Paper, Stack, List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Lista de histórico de pagamentos – dados virão da API
const historicoPagamentos: Array<{ id: number; data: string; clinica: string; procedimento: string; valor: string; status: string }> = [];

export default function PatientHistory() {
  const totalPagamentos = historicoPagamentos.length;

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
          {historicoPagamentos.map((p) => (
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
        {historicoPagamentos.length === 0 && (
          <Typography color="text.secondary" sx={{ py: 2 }}>
            Nenhum pagamento realizado ainda.
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
