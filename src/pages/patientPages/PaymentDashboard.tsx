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
  LinearProgress,
  IconButton,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
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
  installmentsTotal?: number; // total parcels (for parcelado)
  installmentsPaid?: number;  // how many parcels already paid
  status: "pending" | "paid" | "scheduled";
  dataContratacao: string;
  dataAgendada?: string;
  /** Quando true, o paciente não vê mais este item na lista (oculto, não removido) */
  hiddenByPatient?: boolean;
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
    setPendingProcedures(hired);
    setCartoes(loadPatientCards(userId));
  }, [userId]);

  const hideProcedureFromPatient = (proc: HiredProcedure) => {
    const allHired = loadHiredProcedures(userId);
    const updated = allHired.map((h) =>
      h.id === proc.id ? { ...h, hiddenByPatient: true } : h
    );
    saveHiredProcedures(userId, updated);
    setPendingProcedures(updated);
  };

  const openPaymentModal = (proc: HiredProcedure) => {
    setSelectedProcedure(proc);
    setModalPagamentoAberto(true);
    setFormaPagamento("pix");
    setSelectedCardId("");
    setInstallments(1);
  };

  const handlePay = () => {
    if (!selectedProcedure || !userId || !user) return;

    // Quantidade total de parcelas e já pagas antes deste pagamento
    const totalInstallments = selectedProcedure.installmentsTotal != null
      ? selectedProcedure.installmentsTotal
      : (parseInt(selectedProcedure.parcelasCartao || "1", 10) || 1);
    const alreadyPaidBefore = selectedProcedure.installmentsPaid != null
      ? selectedProcedure.installmentsPaid
      : (selectedProcedure.status === "paid" ? totalInstallments : 0);
    const clampedAlreadyPaidBefore = Math.min(totalInstallments, Math.max(0, alreadyPaidBefore));
    const remainingBefore = Math.max(0, totalInstallments - clampedAlreadyPaidBefore);

    // Se não há parcelas restantes, não deve permitir novo pagamento
    if (remainingBefore <= 0) {
      setSnackbar({
        open: true,
        message: "Nenhuma parcela restante para pagar.",
        severity: "error",
      });
      setModalPagamentoAberto(false);
      return;
    }

    // Quantas parcelas o usuário está tentando pagar agora
    const requestedInstallments = formaPagamento === "cartao" ? installments : 1;
    const installmentsToPay = Math.min(remainingBefore, requestedInstallments);

    // Atualiza o procedimento contratado respeitando o limite de parcelas restantes
    const allHired = loadHiredProcedures(userId);
    const updatedHired = allHired.map((h) => {
      if (h.id !== selectedProcedure.id) return h;
      const hTotalInstallments = h.installmentsTotal != null
        ? h.installmentsTotal
        : (parseInt(h.parcelasCartao || "1", 10) || 1);
      const hAlreadyPaid = h.installmentsPaid != null
        ? h.installmentsPaid
        : (h.status === "paid" ? hTotalInstallments : 0);
      const hClampedAlreadyPaid = Math.min(hTotalInstallments, Math.max(0, hAlreadyPaid));
      const hRemaining = Math.max(0, hTotalInstallments - hClampedAlreadyPaid);
      const hToPay = Math.min(hRemaining, installmentsToPay);
      const nextPaid = hClampedAlreadyPaid + hToPay;
      const fullyPaid = nextPaid >= hTotalInstallments;
      return {
        ...h,
        installmentsTotal: hTotalInstallments,
        installmentsPaid: nextPaid,
        status: fullyPaid ? ("paid" as const) : ("pending" as const),
      };
    });
    saveHiredProcedures(userId, updatedHired);
    setPendingProcedures(updatedHired);

    // Dados atualizados do procedimento após o pagamento
    const selectedAfterUpdate = updatedHired.find((h) => h.id === selectedProcedure.id)!;
    const updatedTotalInstallments = selectedAfterUpdate.installmentsTotal != null
      ? selectedAfterUpdate.installmentsTotal
      : (parseInt(selectedAfterUpdate.parcelasCartao || "1", 10) || 1);
    const updatedAlreadyPaid = selectedAfterUpdate.installmentsPaid != null
      ? selectedAfterUpdate.installmentsPaid
      : (selectedAfterUpdate.status === "paid" ? updatedTotalInstallments : 0);

    // Quantas parcelas foram efetivamente pagas nesta operação
    const installmentsPaidNow = Math.max(
      0,
      updatedAlreadyPaid - clampedAlreadyPaidBefore
    );

    // Valor por parcela e valor total deste pagamento
    const totalValue =
      parseFloat(
        selectedAfterUpdate.valor.replace(".", "").replace(",", ".")
      ) || 0;
    const perInstallmentValue =
      updatedTotalInstallments > 0
        ? totalValue / updatedTotalInstallments
        : totalValue;
    const amountPaid = installmentsPaidNow * perInstallmentValue;

    // Histórico de pagamento do paciente
    const payments = loadPatientPayments(userId);
    const newPayment: PagamentoHistorico = {
      id: Date.now(),
      userId,
      clinicaId: selectedAfterUpdate.clinicaId,
      clinicaNome: selectedAfterUpdate.clinicaNome,
      procedimentoId: selectedAfterUpdate.procedimentoId,
      procedimentoNome: selectedAfterUpdate.procedimentoNome,
      valor: amountPaid.toFixed(2).replace(".", ","),
      formaPagamento,
      parcelas: updatedTotalInstallments,
      data: new Date().toLocaleString("pt-BR"),
      status:
        updatedAlreadyPaid >= updatedTotalInstallments
          ? "Concluído"
          : installmentsPaidNow > 1
          ? `${installmentsPaidNow} parcelas pagas (${updatedAlreadyPaid}/${updatedTotalInstallments})`
          : `Parcela ${updatedAlreadyPaid}/${updatedTotalInstallments}`,
    };
    savePatientPayments(userId, [...payments, newPayment]);

    // Registro de pagamento para a clínica
    const nomeCompleto =
      [user.first_name, user.last_name].filter(Boolean).join(" ").trim() ||
      user.email ||
      `Paciente ${user.id}`;
    addClinicPayment(selectedProcedure.clinicaId, {
      id: Date.now(),
      patientId: userId,
      patientName: nomeCompleto,
      procedureId: selectedProcedure.procedimentoId,
      procedureName: selectedProcedure.procedimentoNome,
      amount: amountPaid.toFixed(2).replace(".", ","),
      method: formaPagamento,
      installments:
        formaPagamento === "cartao" ? installmentsPaidNow : undefined,
      date: new Date().toISOString(),
    });

    setSnackbar({
      open: true,
      message: "Pagamento realizado com sucesso!",
      severity: "success",
    });
    setModalPagamentoAberto(false);
  };

  // Opções de parcelas respeitando o que já foi pago
  const maxInstallments = selectedProcedure
    ? (selectedProcedure.installmentsTotal != null
        ? selectedProcedure.installmentsTotal
        : (parseInt(selectedProcedure.parcelasCartao || "1", 10) || 1))
    : 1;

  const alreadyPaidForSelected = selectedProcedure
    ? (selectedProcedure.installmentsPaid != null
        ? selectedProcedure.installmentsPaid
        : (selectedProcedure.status === "paid" ? maxInstallments : 0))
    : 0;

  const clampedAlreadyPaidForSelected = Math.min(
    maxInstallments,
    Math.max(0, alreadyPaidForSelected)
  );

  const remainingInstallmentsForSelected = Math.max(
    0,
    maxInstallments - clampedAlreadyPaidForSelected
  );

  const installmentOptions =
    remainingInstallmentsForSelected > 0
      ? Array.from(
          { length: remainingInstallmentsForSelected },
          (_, i) => i + 1
        )
      : [];

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
          {pendingProcedures.filter((p) => !p.hiddenByPatient && p.status !== "scheduled").length === 0 ? (
            <Typography color="text.secondary">
              Nenhum pagamento pendente.
            </Typography>
          ) : (
            <List>
              {pendingProcedures
                .filter(
                  (proc) =>
                    !proc.hiddenByPatient &&
                    (proc.status === "pending" || proc.status === "paid")
                )
                .map((proc) => {
                  const totalInstallments = proc.installmentsTotal != null
                    ? proc.installmentsTotal
                    : (parseInt(proc.parcelasCartao || "1", 10) || 1);
                  const paidInstallments = proc.installmentsPaid != null
                    ? proc.installmentsPaid
                    : (proc.status === "paid" ? totalInstallments : 0);
                  const clampedPaid = Math.min(totalInstallments, Math.max(0, paidInstallments));
                  const isPaid = clampedPaid >= totalInstallments;
                  const progress =
                    totalInstallments > 0
                      ? (clampedPaid / totalInstallments) * 100
                      : isPaid
                      ? 100
                      : 0;
                  return (
                    <ListItem
                      key={proc.id}
                      secondaryAction={
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          {isPaid && (
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => hideProcedureFromPatient(proc)}
                              aria-label="Ocultar da lista"
                              title="Excluir da lista (oculta para você)"
                            >
                              <DeleteOutlineIcon />
                            </IconButton>
                          )}
                          <Button
                            variant="contained"
                            onClick={() => openPaymentModal(proc)}
                            disabled={isPaid}
                          >
                            {isPaid ? "Pago" : "Pagar"}
                          </Button>
                        </Stack>
                      }
                    >
                      <ListItemText
                        primary={proc.procedimentoNome}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.secondary">
                              {proc.clinicaNome} · R$ {proc.valor}
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{
                                  height: 8,
                                  borderRadius: 999,
                                  bgcolor: "action.hover",
                                  maxWidth: "70%",
                                }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ mt: 0.5, display: "block" }}
                              >
                                {isPaid
                                  ? "Pagamento concluído (100%)"
                                  : totalInstallments > 1
                                  ? `Pago ${clampedPaid}/${totalInstallments} parcelas`
                                  : "Aguardando pagamento"}
                              </Typography>
                            </Box>
                          </>
                        }
                      />
                    </ListItem>
                  );
                })}
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
              (formaPagamento === "cartao" && cartoes.length > 0 && !selectedCardId) ||
              (formaPagamento === "cartao" && installmentOptions.length === 0)
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