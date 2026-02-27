import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Radio,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useAppSelector } from "../../core/store/hooks";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

const PATIENT_PAYMENTS_STORAGE_PREFIX = "patient_pagamentos_";
const PATIENT_APPOINTMENTS_STORAGE_PREFIX = "patient_agendamentos_";

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

interface AgendamentoPaciente {
  id: number;
  userId: number;
  clinicaId: number;
  clinicaNome: string;
  procedimentoId?: number;
  procedimentoNome?: string;
  dataAgendada: string;
  status: "realizado" | "em_andamento" | "nao_realizado";
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

function loadPatientAppointments(userId: number): AgendamentoPaciente[] {
  try {
    const key = PATIENT_APPOINTMENTS_STORAGE_PREFIX + userId;
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as AgendamentoPaciente[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function savePatientAppointments(userId: number, list: AgendamentoPaciente[]) {
  try {
    const key = PATIENT_APPOINTMENTS_STORAGE_PREFIX + userId;
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    console.error("Error saving patient appointments:");
  }
}

export default function MyAppointments() {
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.id ?? 0;

  const [modalAgendamentoAberto, setModalAgendamentoAberto] = useState(false);
  const [pagamentos, setPagamentos] = useState<PagamentoHistorico[]>([]);
  const [agendamentos, setAgendamentos] = useState<AgendamentoPaciente[]>([]);
  const [procedimentoSelecionadoId, setProcedimentoSelecionadoId] = useState<string>("");
  const [dataAgendamento, setDataAgendamento] = useState<Dayjs | null>(dayjs());

  useEffect(() => {
    if (!userId) {
      setPagamentos([]);
      setAgendamentos([]);
      return;
    }
    setPagamentos(loadPatientPayments(userId));
    setAgendamentos(loadPatientAppointments(userId));
  }, [userId]);

  const procedimentosUnicos = useMemo(() => {
    const map = new Map<number, PagamentoHistorico>();
    pagamentos.forEach((p) => {
      if (!p.procedimentoId) return;
      if (!map.has(p.procedimentoId)) {
        map.set(p.procedimentoId, p);
      }
    });
    const base = Array.from(map.values());
    // Impede mais de um agendamento para o mesmo procedimento:
    // remove procedimentos que já possuem agendamento salvo.
    return base.filter(
      (p) => !agendamentos.some((a) => a.procedimentoId === p.procedimentoId)
    );
  }, [pagamentos, agendamentos]);

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h4" fontWeight={700}>
          Meus Agendamentos
        </Typography>
      </Box>
      
      <Paper sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography color="text.secondary">
            {agendamentos.length === 0
              ? "Você não possui agendamentos."
              : "Seus agendamentos:"}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setModalAgendamentoAberto(true)}
            disabled={procedimentosUnicos.length === 0}
          >
            Realizar agendamento
          </Button>
        </Box>

        {agendamentos.length > 0 && (
          <List dense disablePadding sx={{ mt: 2 }}>
            {agendamentos.map((a) => (
              <ListItem
                key={a.id}
                sx={{ py: 0.75 }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="Excluir agendamento"
                    onClick={() => {
                      if (!userId) return;
                      const novaLista = agendamentos.filter((item) => item.id !== a.id);
                      setAgendamentos(novaLista);
                      savePatientAppointments(userId, novaLista);
                    }}
                    size="small"
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={(a.procedimentoNome || "Procedimento") + (a.clinicaNome ? ` · ${a.clinicaNome}` : "")}
                  secondary={`Data: ${dayjs(a.dataAgendada).format("DD/MM/YYYY")}`}
                  secondaryTypographyProps={{ color: "text.secondary" }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      <Dialog
        open={modalAgendamentoAberto}
        onClose={() => setModalAgendamentoAberto(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Escolher procedimento para agendamento</DialogTitle>
        <DialogContent>
          {procedimentosUnicos.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
              Nenhum procedimento pago encontrado. Realize um pagamento primeiro para poder agendar.
            </Typography>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Selecione um dos procedimentos que você já pagou e escolha a data para realizar o agendamento.
              </Typography>
              <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateCalendar
                    value={dataAgendamento}
                    onChange={(newValue: Dayjs | null) => setDataAgendamento(newValue)}
                  />
                </LocalizationProvider>
              </Box>
              <List dense disablePadding sx={{ maxHeight: 320, overflow: "auto" }}>
                {procedimentosUnicos.map((p) => (
                  <ListItemButton
                    key={p.procedimentoId}
                    selected={String(p.procedimentoId) === procedimentoSelecionadoId}
                    onClick={() => setProcedimentoSelecionadoId(String(p.procedimentoId))}
                    sx={{ py: 0.75 }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Radio
                        checked={String(p.procedimentoId) === procedimentoSelecionadoId}
                        value={String(p.procedimentoId)}
                        name="procedimento-agendamento"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={p.procedimentoNome || "Procedimento"}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.secondary">
                            {p.clinicaNome}
                          </Typography>
                          <Typography component="span" variant="body2" color="text.secondary">
                            {" · R$ "}{p.valor}
                          </Typography>
                        </>
                      }
                      primaryTypographyProps={{ variant: "body2" }}
                      secondaryTypographyProps={{ component: "div" }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setModalAgendamentoAberto(false)}>Cancelar</Button>
          <Button
            variant="contained"
            disabled={!procedimentoSelecionadoId || !dataAgendamento}
            onClick={() => {
              if (!userId || !procedimentoSelecionadoId || !dataAgendamento) {
                setModalAgendamentoAberto(false);
                return;
              }
              // Defesa extra: impede mais de um agendamento para o mesmo procedimento.
              const procedimentoIdNum = Number(procedimentoSelecionadoId);
              if (agendamentos.some((a) => a.procedimentoId === procedimentoIdNum)) {
                setModalAgendamentoAberto(false);
                return;
              }
              const dataAgendadaStr = dataAgendamento.format("YYYY-MM-DD");
              const listaAtual = loadPatientAppointments(userId);
              const novoId =
                listaAtual.length > 0
                  ? Math.max(...listaAtual.map((a) => a.id)) + 1
                  : 1;
              const pagamentoBase = procedimentosUnicos.find(
                (p) => String(p.procedimentoId) === procedimentoSelecionadoId
              );
              const novoAgendamento: AgendamentoPaciente = {
                id: novoId,
                userId,
                clinicaId: pagamentoBase?.clinicaId ?? 0,
                clinicaNome: pagamentoBase?.clinicaNome ?? "",
                procedimentoId: pagamentoBase?.procedimentoId,
                procedimentoNome: pagamentoBase?.procedimentoNome,
                dataAgendada: dataAgendadaStr,
                status: "em_andamento",
              };
              const novaLista = [...listaAtual, novoAgendamento];
              savePatientAppointments(userId, novaLista);
              setAgendamentos(novaLista);
              setModalAgendamentoAberto(false);
              setProcedimentoSelecionadoId("");
              setDataAgendamento(dayjs());
            }}
          >
            Continuar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

