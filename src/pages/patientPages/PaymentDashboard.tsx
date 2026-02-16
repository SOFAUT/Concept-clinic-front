import { useState, useEffect, useRef } from "react";
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
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Snackbar,
  Alert,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import BusinessIcon from "@mui/icons-material/Business";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useAppSelector } from "../../core/store/hooks";

const MOCK_CLINICS_KEY = "mock_clinics";
const MOCK_PROCEDURES_KEY = "mock_procedures";
const PATIENT_CLINICAS_STORAGE_PREFIX = "patient_clinicas_escolhidas_";
const PATIENT_CARDS_STORAGE_PREFIX = "patient_cartoes_";

interface CartaoSalvo {
  id: number;
  userId: number;
  nomeTitular: string;
  ultimosQuatroDigitos: string;
  validade: string;
}

type FormaPagamento = "pix" | "cartao";

interface ClinicaItem {
  id: number;
  nomeFantasia: string;
  nomeEmpresa: string;
}

interface ProcedimentoItem {
  id: number;
  clinicaId: number;
  finalidade: string;
  invasividade: string;
  valorProcedimento: string;
  parcelasCartao: string;
}

function loadProcedimentosByClinica(clinicaId: number): ProcedimentoItem[] {
  try {
    const stored = localStorage.getItem(MOCK_PROCEDURES_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as ProcedimentoItem[];
    return (parsed || []).filter((p) => p.clinicaId === clinicaId);
  } catch {
    return [];
  }
}

function loadClinicasFromStorage(): ClinicaItem[] {
  try {
    const stored = localStorage.getItem(MOCK_CLINICS_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as Array<{ id?: number; nomeFantasia?: string; nomeEmpresa?: string }>;
    return (parsed || []).map((c, i) => ({
      id: c.id ?? i + 1,
      nomeFantasia: c.nomeFantasia || c.nomeEmpresa || "Clínica",
      nomeEmpresa: c.nomeEmpresa || "",
    }));
  } catch {
    return [];
  }
}

interface PatientClinicasState {
  clinicasEscolhidas: ClinicaItem[];
  clinicaParaPagamentoId: string;
}

function loadPatientClinicasState(userId: number): PatientClinicasState {
  try {
    const key = PATIENT_CLINICAS_STORAGE_PREFIX + userId;
    const stored = localStorage.getItem(key);
    if (!stored) return { clinicasEscolhidas: [], clinicaParaPagamentoId: "" };
    const parsed = JSON.parse(stored) as PatientClinicasState;
    return {
      clinicasEscolhidas: Array.isArray(parsed.clinicasEscolhidas) ? parsed.clinicasEscolhidas : [],
      clinicaParaPagamentoId: typeof parsed.clinicaParaPagamentoId === "string" ? parsed.clinicaParaPagamentoId : "",
    };
  } catch {
    return { clinicasEscolhidas: [], clinicaParaPagamentoId: "" };
  }
}

function savePatientClinicasState(userId: number, state: PatientClinicasState) {
  try {
    localStorage.setItem(PATIENT_CLINICAS_STORAGE_PREFIX + userId, JSON.stringify(state));
  } catch {
    // ignore
  }
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

function savePatientCards(userId: number, cards: CartaoSalvo[]) {
  try {
    localStorage.setItem(PATIENT_CARDS_STORAGE_PREFIX + userId, JSON.stringify(cards));
  } catch {
    // ignore
  }
}

export default function PaymentDashboard() {
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.id ?? 0;

  const [modalAberto, setModalAberto] = useState(false);
  const [modalClinicaAberto, setModalClinicaAberto] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>("pix");
  const [clinicas, setClinicas] = useState<ClinicaItem[]>([]);
  const [clinicaSelecionadaId, setClinicaSelecionadaId] = useState<string>("");
  const [clinicasEscolhidas, setClinicasEscolhidas] = useState<ClinicaItem[]>([]);
  const [clinicaParaPagamentoId, setClinicaParaPagamentoId] = useState<string>("");
  const [procedimentoSelecionadoId, setProcedimentoSelecionadoId] = useState<string>("");
  const [alertaClinicaAberto, setAlertaClinicaAberto] = useState(false);
  const [modalCartaoAberto, setModalCartaoAberto] = useState(false);
  const [cartaoForm, setCartaoForm] = useState({
    nomeTitular: "",
    numeroCartao: "",
    validade: "",
    cvv: "",
    cpfTitular: "",
  });
  const [cartaoSelecionadoId, setCartaoSelecionadoId] = useState<string>("");
  const [cartoesDoUsuario, setCartoesDoUsuario] = useState<CartaoSalvo[]>([]);
  const hasLoadedFromStorage = useRef(false);

  // Carregar clínicas escolhidas e seleção ao montar (paciente logado)
  useEffect(() => {
    hasLoadedFromStorage.current = false;
    if (!userId) return;
    const saved = loadPatientClinicasState(userId);
    setClinicasEscolhidas(saved.clinicasEscolhidas);
    setClinicaParaPagamentoId(saved.clinicaParaPagamentoId);
    const t = setTimeout(() => {
      hasLoadedFromStorage.current = true;
    }, 0);
    return () => clearTimeout(t);
  }, [userId]);

  // Persistir sempre que a lista ou a clínica para pagamento mudar (evita sobrescrever antes do load)
  useEffect(() => {
    if (!userId || !hasLoadedFromStorage.current) return;
    savePatientClinicasState(userId, { clinicasEscolhidas, clinicaParaPagamentoId });
  }, [userId, clinicasEscolhidas, clinicaParaPagamentoId]);

  const handleNovoPagamento = () => {
    if (!clinicaParaPagamentoId) {
      setAlertaClinicaAberto(true);
      return;
    }
    setCartoesDoUsuario(loadPatientCards(userId));
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setProcedimentoSelecionadoId("");
    setCartaoSelecionadoId("");
  };

  const handleConfirmar = () => {
    console.log("Forma de pagamento:", formaPagamento, "Procedimento selecionado:", procedimentoSelecionadoId);
    setModalAberto(false);
    setProcedimentoSelecionadoId("");
  };

  const handleEscolherClinica = () => {
    setClinicas(loadClinicasFromStorage());
    setClinicaSelecionadaId("");
    setModalClinicaAberto(true);
  };

  const handleFecharModalClinica = () => {
    setModalClinicaAberto(false);
  };

  const handleConfirmarClinica = () => {
    if (clinicaSelecionadaId) {
      const clinica = clinicas.find((c) => String(c.id) === clinicaSelecionadaId);
      if (clinica && !clinicasEscolhidas.some((c) => c.id === clinica.id)) {
        setClinicasEscolhidas((prev) => [...prev, clinica]);
      }
    }
    setModalClinicaAberto(false);
  };

  const handleRemoverClinica = (id: number) => {
    setClinicasEscolhidas((prev) => prev.filter((c) => c.id !== id));
    if (String(id) === clinicaParaPagamentoId) setClinicaParaPagamentoId("");
  };

  const handleCadastrarCartao = () => {
    setModalCartaoAberto(true);
  };

  const handleFecharModalCartao = () => {
    setModalCartaoAberto(false);
    setCartaoForm({ nomeTitular: "", numeroCartao: "", validade: "", cvv: "", cpfTitular: "" });
  };

  const handleSalvarCartao = () => {
    if (!userId) return;
    const cards = loadPatientCards(userId);
    const novoId = cards.length > 0 ? Math.max(...cards.map((c) => c.id)) + 1 : 1;
    const ultimosQuatro = cartaoForm.numeroCartao.slice(-4);
    const novo: CartaoSalvo = {
      id: novoId,
      userId,
      nomeTitular: cartaoForm.nomeTitular,
      ultimosQuatroDigitos: ultimosQuatro,
      validade: cartaoForm.validade,
    };
    cards.push(novo);
    savePatientCards(userId, cards);
    setCartoesDoUsuario(cards);
    handleFecharModalCartao();
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Pagamentos
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
        <Box flex={1}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Pendentes
            </Typography>
            <Typography variant="h3" fontWeight={700}>
              0
            </Typography>
          </Paper>
        </Box>

        <Box flex={1}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Pagos
            </Typography>
            <Typography variant="h3" fontWeight={700}>
              0
            </Typography>
          </Paper>
        </Box>
      </Stack>

      <Box sx={{ mt: 3 }}>
        <Paper sx={{ p: 2, display: "flex", justifyContent: "flex-end", gap: 2, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            startIcon={<BusinessIcon />}
            onClick={handleEscolherClinica}
          >
            Escolher clínica
          </Button>
          <Button
            variant="outlined"
            startIcon={<CreditCardIcon />}
            onClick={handleCadastrarCartao}
          >
            Cadastrar cartão
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNovoPagamento}
          >
            Novo pagamento
          </Button>
        </Paper>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Clínicas selecionadas
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Selecione a clínica em que será realizado o pagamento.
          </Typography>
          {clinicasEscolhidas.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
              Nenhuma clínica selecionada. Use o botão &quot;Escolher clínica&quot; acima para adicionar.
            </Typography>
          ) : (
            <RadioGroup
              value={clinicaParaPagamentoId}
              onChange={(_, value) => setClinicaParaPagamentoId(value)}
              name="clinica-pagamento"
            >
              <List dense disablePadding>
                {clinicasEscolhidas.map((c) => (
                  <ListItem
                    key={c.id}
                    sx={{ borderRadius: 1 }}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => handleRemoverClinica(c.id)} aria-label="Remover">
                        <DeleteOutlineIcon />
                      </IconButton>
                    }
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Radio value={String(c.id)} name="clinica-pagamento" />
                    </ListItemIcon>
                    <ListItemText primary={c.nomeFantasia} secondary={c.nomeEmpresa || undefined} />
                  </ListItem>
                ))}
              </List>
            </RadioGroup>
          )}
        </Paper>
      </Box>

      <Dialog open={modalAberto} onClose={handleFecharModal} maxWidth="sm" fullWidth>
        <DialogTitle>Novo pagamento</DialogTitle>
        <DialogContent>
          {(() => {
            const clinicaIdNum = Number(clinicaParaPagamentoId);
            const procedimentosDaClinica = clinicaIdNum ? loadProcedimentosByClinica(clinicaIdNum) : [];
            return (
              <>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>
                  Procedimentos da clínica — selecione o procedimento a ser pago
                </Typography>
                {procedimentosDaClinica.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 1, mb: 2 }}>
                    Nenhum procedimento cadastrado por esta clínica.
                  </Typography>
                ) : (
                  <RadioGroup
                    value={procedimentoSelecionadoId}
                    onChange={(_, value) => setProcedimentoSelecionadoId(value)}
                    name="procedimento-pagamento"
                  >
                    <List dense disablePadding sx={{ mb: 2, maxHeight: 200, overflow: "auto" }}>
                      {procedimentosDaClinica.map((p) => (
                        <ListItemButton
                          key={p.id}
                          selected={String(p.id) === procedimentoSelecionadoId}
                          onClick={() => setProcedimentoSelecionadoId(String(p.id))}
                          sx={{ py: 0.5 }}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <Radio
                              checked={String(p.id) === procedimentoSelecionadoId}
                              value={String(p.id)}
                              name="procedimento-pagamento"
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={p.finalidade || "(Sem finalidade)"}
                            secondary={`R$ ${p.valorProcedimento || "0,00"} · até ${p.parcelasCartao}x no cartão`}
                            primaryTypographyProps={{ variant: "body2" }}
                            secondaryTypographyProps={{ variant: "caption" }}
                          />
                        </ListItemButton>
                      ))}
                    </List>
                  </RadioGroup>
                )}
                <FormControl component="fieldset" sx={{ mt: 1, width: "100%" }}>
                  <FormLabel component="legend">Forma de pagamento</FormLabel>
                  <RadioGroup
                    value={formaPagamento}
                    onChange={(_, value) => {
                      setFormaPagamento(value as FormaPagamento);
                      if (value === "pix") setCartaoSelecionadoId("");
                    }}
                    name="forma-pagamento"
                  >
                    <FormControlLabel value="pix" control={<Radio />} label="PIX" />
                    <FormControlLabel value="cartao" control={<Radio />} label="Cartão de crédito" />
                  </RadioGroup>
                </FormControl>
                {formaPagamento === "cartao" && (
                  <FormControl component="fieldset" sx={{ mt: 2, width: "100%" }}>
                    <FormLabel component="legend">Cartões cadastrados</FormLabel>
                    {cartoesDoUsuario.length === 0 ? (
                      <Typography variant="body2" color="text.secondary" sx={{ py: 1, mb: 1 }}>
                        Nenhum cartão cadastrado.{" "}
                        <Button
                          size="small"
                          onClick={() => {
                            setModalAberto(false);
                            setModalCartaoAberto(true);
                          }}
                        >
                          Cadastrar cartão
                        </Button>
                      </Typography>
                    ) : (
                      <RadioGroup
                        value={cartaoSelecionadoId}
                        onChange={(_, value) => setCartaoSelecionadoId(value)}
                        name="cartao-pagamento"
                      >
                        <List dense disablePadding sx={{ maxHeight: 180, overflow: "auto" }}>
                          {cartoesDoUsuario.map((c) => (
                            <ListItemButton
                              key={c.id}
                              selected={String(c.id) === cartaoSelecionadoId}
                              onClick={() => setCartaoSelecionadoId(String(c.id))}
                              sx={{ py: 0.5 }}
                            >
                              <ListItemIcon sx={{ minWidth: 40 }}>
                                <Radio
                                  checked={String(c.id) === cartaoSelecionadoId}
                                  value={String(c.id)}
                                  name="cartao-pagamento"
                                />
                              </ListItemIcon>
                              <ListItemText
                                primary={`•••• •••• •••• ${c.ultimosQuatroDigitos}`}
                                secondary={`${c.nomeTitular} · Val. ${c.validade}`}
                                primaryTypographyProps={{ variant: "body2" }}
                                secondaryTypographyProps={{ variant: "caption" }}
                              />
                            </ListItemButton>
                          ))}
                        </List>
                      </RadioGroup>
                    )}
                  </FormControl>
                )}
              </>
            );
          })()}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleFecharModal}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleConfirmar}
            disabled={
              (() => {
                const clinicaIdNum = Number(clinicaParaPagamentoId);
                const procs = clinicaIdNum ? loadProcedimentosByClinica(clinicaIdNum) : [];
                const faltaProcedimento = procs.length > 0 && !procedimentoSelecionadoId;
                const faltaCartao =
                  formaPagamento === "cartao" && cartoesDoUsuario.length > 0 && !cartaoSelecionadoId;
                return faltaProcedimento || faltaCartao;
              })()
            }
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={modalClinicaAberto} onClose={handleFecharModalClinica} maxWidth="sm" fullWidth>
        <DialogTitle>Escolher clínica</DialogTitle>
        <DialogContent>
          {clinicas.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 2 }}>
              Nenhuma clínica cadastrada no sistema.
            </Typography>
          ) : (
            <FormControl component="fieldset" sx={{ mt: 1, width: "100%" }}>
              <FormLabel component="legend">Clínicas cadastradas</FormLabel>
              <RadioGroup
                value={clinicaSelecionadaId}
                onChange={(_, value) => setClinicaSelecionadaId(value)}
                name="clinica"
              >
                <List dense disablePadding>
                  {clinicas.map((c) => (
                    <ListItemButton
                      key={c.id}
                      selected={String(c.id) === clinicaSelecionadaId}
                      onClick={() => setClinicaSelecionadaId(String(c.id))}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Radio
                          checked={String(c.id) === clinicaSelecionadaId}
                          value={String(c.id)}
                          name="clinica"
                        />
                      </ListItemIcon>
                      <ListItemText primary={c.nomeFantasia} secondary={c.nomeEmpresa || undefined} />
                    </ListItemButton>
                  ))}
                </List>
              </RadioGroup>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleFecharModalClinica}>Cancelar</Button>
          <Button variant="contained" onClick={handleConfirmarClinica} disabled={!clinicaSelecionadaId}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={modalCartaoAberto} onClose={handleFecharModalCartao} maxWidth="sm" fullWidth>
        <DialogTitle>Cadastrar cartão de crédito</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Nome no cartão"
              value={cartaoForm.nomeTitular}
              onChange={(e) => setCartaoForm((p) => ({ ...p, nomeTitular: e.target.value }))}
              fullWidth
              required
              margin="normal"
              placeholder="Como está impresso no cartão"
            />
            <TextField
              label="Número do cartão"
              value={cartaoForm.numeroCartao.replace(/(\d{4})(?=\d)/g, "$1 ")}
              onChange={(e) => setCartaoForm((p) => ({ ...p, numeroCartao: e.target.value.replace(/\D/g, "").slice(0, 16) }))}
              fullWidth
              required
              margin="normal"
              placeholder="0000 0000 0000 0000"
              inputProps={{ inputMode: "numeric", maxLength: 19 }}
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Validade"
                value={cartaoForm.validade}
                onChange={(e) => {
                  let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                  if (v.length >= 2) v = v.slice(0, 2) + "/" + v.slice(2);
                  setCartaoForm((p) => ({ ...p, validade: v }));
                }}
                fullWidth
                required
                margin="normal"
                placeholder="MM/AA"
                inputProps={{ inputMode: "numeric", maxLength: 5 }}
              />
              <TextField
                label="CVV"
                value={cartaoForm.cvv}
                onChange={(e) => setCartaoForm((p) => ({ ...p, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                fullWidth
                required
                margin="normal"
                placeholder="123"
                inputProps={{ inputMode: "numeric", maxLength: 4 }}
                helperText="3 ou 4 dígitos no verso do cartão"
              />
            </Stack>
            <TextField
              label="CPF do titular"
              value={cartaoForm.cpfTitular}
              onChange={(e) => setCartaoForm((p) => ({ ...p, cpfTitular: e.target.value }))}
              fullWidth
              margin="normal"
              placeholder="000.000.000-00"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleFecharModalCartao}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSalvarCartao}
            disabled={!cartaoForm.nomeTitular || !cartaoForm.numeroCartao || !cartaoForm.validade || !cartaoForm.cvv}
          >
            Salvar cartão
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alertaClinicaAberto}
        autoHideDuration={5000}
        onClose={() => setAlertaClinicaAberto(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="warning" onClose={() => setAlertaClinicaAberto(false)}>
          Escolha uma clínica para realizar o pagamento.
        </Alert>
      </Snackbar>
    </Box>
  );
}
