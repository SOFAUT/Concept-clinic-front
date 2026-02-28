import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { useNavigate } from "react-router";
import { useAppSelector } from "../../core/store/hooks";
import { APP_ROUTES } from "../../util/constants";

// ========== MOCK STORAGE ==========
const PATIENT_HIRED_PROCEDURES_PREFIX = "patient_hired_procedures_";
const PATIENT_CARDS_STORAGE_PREFIX = "patient_cartoes_";
const PATIENT_PAYMENTS_STORAGE_PREFIX = "patient_pagamentos_";
const CLINIC_PAYMENTS_STORAGE_PREFIX = "clinic_payments_";

interface HiredProcedure {
  id: number;
  userId: number;
  clinicaId: number;
  clinicaNome: string;
  procedimentoId: number;
  procedimentoNome: string;
  valor: string;
  parcelasCartao: string; // max installments
  status: "pending" | "paid" | "scheduled";
  dataContratacao: string;
  dataAgendada?: string;
}

interface CartaoSalvo {
  id: number;
  userId: number;
  nomeTitular: string;
  ultimosQuatroDigitos: string;
  validade: string;
}

interface PagamentoHistorico {
  id: number;
  userId: number;
  clinicaId: number;
  clinicaNome: string;
  procedimentoId?: number;
  procedimentoNome?: string;
  valor: string;
  formaPagamento: "pix" | "cartao";
  parcelas?: number; // added for installments
  data: string;
  status: string;
}

interface ClinicPayment {
  id: number;
  patientId: number;
  patientName: string;
  procedureId: number;
  procedureName: string;
  amount: string;
  method: "pix" | "cartao";
  installments?: number;
  date: string;
}

type FormaPagamento = "pix" | "cartao";

function loadHiredProcedures(userId: number): HiredProcedure[] {
  try {
    const key = PATIENT_HIRED_PROCEDURES_PREFIX + userId;
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as HiredProcedure[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHiredProcedures(userId: number, list: HiredProcedure[]) {
  try {
    localStorage.setItem(PATIENT_HIRED_PROCEDURES_PREFIX + userId, JSON.stringify(list));
  } catch {}
}

function loadPatientCards(userId: number): CartaoSalvo[] {
  try {
    const key = PATIENT_CARDS_STORAGE_PREFIX + userId;
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as CartaoSalvo[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
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

function savePatientPayments(userId: number, list: PagamentoHistorico[]) {
  try {
    localStorage.setItem(PATIENT_PAYMENTS_STORAGE_PREFIX + userId, JSON.stringify(list));
  } catch {}
}

function addClinicPayment(clinicId: number, payment: ClinicPayment) {
  const key = CLINIC_PAYMENTS_STORAGE_PREFIX + clinicId;
  try {
    const stored = localStorage.getItem(key);
    const list = stored ? JSON.parse(stored) : [];
    list.push(payment);
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    console.error("Error saving clinic payment");
  }
}

// ========== COMPONENT ==========
export default function PaymentDashboard() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.id ?? 0;

  const [pendingProcedures, setPendingProcedures] = useState<HiredProcedure[]>([]);
  const [cartoes, setCartoes] = useState<CartaoSalvo[]>([]);
  const [modalPagamentoAberto, setModalPagamentoAberto] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState<HiredProcedure | null>(null);
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>("pix");
  const [selectedCardId, setSelectedCardId] = useState<string>("");
  const [installments, setInstallments] = useState<number>(1);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (!userId) return;
    const hired = loadHiredProcedures(userId);
    setPendingProcedures(hired.filter((p) => p.status === "pending"));
    setCartoes(loadPatientCards(userId));
  }, [userId]);

  const openPaymentModal = (proc: HiredProcedure) => {
    setSelectedProcedure(proc);
    setModalPagamentoAberto(true);
    setFormaPagamento("pix");
    setSelectedCardId("");
    setInstallments(1);
  };

  const handlePay = () => {
    if (!selectedProcedure || !userId || !user) return;

    // Update hired procedure status to paid
    const allHired = loadHiredProcedures(userId);
    const updatedHired = allHired.map((h) =>
      h.id === selectedProcedure.id ? { ...h, status: "paid" as const } : h
    );
    saveHiredProcedures(userId, updatedHired);
    setPendingProcedures(updatedHired.filter((p) => p.status === "pending"));

    // Create patient payment history
    const payments = loadPatientPayments(userId);
    const newPayment: PagamentoHistorico = {
      id: Date.now(),
      userId,
      clinicaId: selectedProcedure.clinicaId,
      clinicaNome: selectedProcedure.clinicaNome,
      procedimentoId: selectedProcedure.procedimentoId,
      procedimentoNome: selectedProcedure.procedimentoNome,
      valor: selectedProcedure.valor,
      formaPagamento,
      parcelas: formaPagamento === "cartao" ? installments : undefined,
      data: new Date().toLocaleString("pt-BR"),
      status: "Concluído",
    };
    savePatientPayments(userId, [...payments, newPayment]);

    // Create clinic payment record
    const nomeCompleto = [user.first_name, user.last_name].filter(Boolean).join(" ").trim() || user.email || `Paciente ${user.id}`;
    addClinicPayment(selectedProcedure.clinicaId, {
      id: Date.now(),
      patientId: userId,
      patientName: nomeCompleto,
      procedureId: selectedProcedure.procedimentoId,
      procedureName: selectedProcedure.procedimentoNome,
      amount: selectedProcedure.valor,
      method: formaPagamento,
      installments: formaPagamento === "cartao" ? installments : undefined,
      date: new Date().toISOString(),
    });

    setSnackbar({
      open: true,
      message: "Pagamento realizado com sucesso!",
      severity: "success",
    });
    setModalPagamentoAberto(false);
  };

  // Generate installments options based on selected procedure's max
  const maxInstallments = selectedProcedure ? parseInt(selectedProcedure.parcelasCartao) || 1 : 1;
  const installmentOptions = Array.from({ length: maxInstallments }, (_, i) => i + 1);

  return (
    <Box sx={{ mt: { xs: 7, sm: 8 } }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Pagamentos
      </Typography>

      <Stack spacing={3}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Procedimentos pendentes
          </Typography>
          {pendingProcedures.length === 0 ? (
            <Typography color="text.secondary">
              Nenhum pagamento pendente.
            </Typography>
          ) : (
            <List>
              {pendingProcedures.map((proc) => (
                <ListItem
                  key={proc.id}
                  secondaryAction={
                    <Button
                      variant="contained"
                      onClick={() => openPaymentModal(proc)}
                    >
                      Pagar
                    </Button>
                  }
                >
                  <ListItemText
                    primary={proc.procedimentoNome}
                    secondary={`${proc.clinicaNome} · R$ ${proc.valor}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Meus cartões
          </Typography>
          {cartoes.length === 0 ? (
            <Typography color="text.secondary">
              Nenhum cartão cadastrado.{" "}
              <Button
                size="small"
                onClick={() => navigate(APP_ROUTES.PATIENT.CARDS)}
              >
                Cadastrar cartão
              </Button>
            </Typography>
          ) : (
            <List dense>
              {cartoes.map((c) => (
                <ListItem key={c.id}>
                  <ListItemIcon>
                    <CreditCardIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={`**** **** **** ${c.ultimosQuatroDigitos}`}
                    secondary={`${c.nomeTitular} · Val. ${c.validade}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Stack>

      {/* Modal de pagamento */}
      <Dialog
        open={modalPagamentoAberto}
        onClose={() => setModalPagamentoAberto(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Realizar pagamento</DialogTitle>
        <DialogContent>
          {selectedProcedure && (
            <Box sx={{ mb: 2, p: 2, bgcolor: "action.hover", borderRadius: 1 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {selectedProcedure.procedimentoNome}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedProcedure.clinicaNome} · R$ {selectedProcedure.valor}
              </Typography>
            </Box>
          )}

          <FormControl component="fieldset" sx={{ mt: 1, width: "100%" }}>
            <FormLabel component="legend">Forma de pagamento</FormLabel>
            <RadioGroup
              value={formaPagamento}
              onChange={(_, v) => setFormaPagamento(v as FormaPagamento)}
            >
              <FormControlLabel value="pix" control={<Radio />} label="PIX" />
              <FormControlLabel value="cartao" control={<Radio />} label="Cartão de crédito" />
            </RadioGroup>
          </FormControl>

          {formaPagamento === "cartao" && (
            <>
              <FormControl component="fieldset" sx={{ mt: 2, width: "100%" }}>
                <FormLabel component="legend">Cartões cadastrados</FormLabel>
                {cartoes.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Nenhum cartão.{" "}
                    <Button
                      size="small"
                      onClick={() => {
                        setModalPagamentoAberto(false);
                        navigate(APP_ROUTES.PATIENT.CARDS);
                      }}
                    >
                      Cadastrar
                    </Button>
                  </Typography>
                ) : (
                  <RadioGroup
                    value={selectedCardId}
                    onChange={(_, v) => setSelectedCardId(v)}
                  >
                    {cartoes.map((c) => (
                      <FormControlLabel
                        key={c.id}
                        value={String(c.id)}
                        control={<Radio />}
                        label={`**** **** **** ${c.ultimosQuatroDigitos} · ${c.nomeTitular}`}
                      />
                    ))}
                  </RadioGroup>
                )}
              </FormControl>

              {selectedProcedure && (
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel id="installments-label">Parcelas</InputLabel>
                  <Select
                    labelId="installments-label"
                    value={installments}
                    label="Parcelas"
                    onChange={(e) => setInstallments(Number(e.target.value))}
                  >
                    {installmentOptions.map((num) => (
                      <MenuItem key={num} value={num}>
                        {num}x {num > 1 ? `(R$ ${(parseFloat(selectedProcedure.valor.replace(',', '.')) / num).toFixed(2)})` : ""}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalPagamentoAberto(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handlePay}
            disabled={
              !selectedProcedure ||
              (formaPagamento === "cartao" && cartoes.length > 0 && !selectedCardId)
            }
          >
            Pagar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}