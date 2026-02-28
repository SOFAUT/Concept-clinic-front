import { useEffect, useState } from "react";
import { Box, Typography, Paper, Stack, List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useAppSelector } from "../../core/store/hooks";

const PATIENT_PAYMENTS_STORAGE_PREFIX = "patient_pagamentos_";

interface PagamentoHistorico {
  id: number;
  userId: number;
  clinicaId: number;
  clinicaNome: string;
  procedimentoId?: number;
  procedimentoNome?: string;
  valor: string;
  formaPagamento: "pix" | "cartao";
  data: string;
  status: string;
}

function loadPatientPayments(userId: number): PagamentoHistorico[] {
  try {
    const key = PATIENT_PAYMENTS_STORAGE_PREFIX + userId;
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as PagamentoHistorico[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function PatientHistory() {
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.id ?? 0;
  const [historicoPagamentos, setHistoricoPagamentos] = useState<PagamentoHistorico[]>([]);

  useEffect(() => {
    if (!userId) {
      setHistoricoPagamentos([]);
      return;
    }
    setHistoricoPagamentos(loadPatientPayments(userId));
  }, [userId]);

  const totalPagamentos = historicoPagamentos.length;

  return (
    <Box sx={{ mt: { xs: 7, sm: 8 } }}> {/* Margem superior para evitar sobreposição com o cabeçalho */}
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
                primary={`${p.procedimentoNome || "Pagamento"} · ${p.clinicaNome}`}
                secondary={`${p.data} · R$ ${p.valor}`}
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