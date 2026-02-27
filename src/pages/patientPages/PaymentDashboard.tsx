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
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import BusinessIcon from "@mui/icons-material/Business";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { useNavigate } from "react-router";
import { useAppSelector } from "../../core/store/hooks";
import { APP_ROUTES } from "../../util/constants";

const MOCK_CLINICS_KEY = "mock_clinics";
const MOCK_PROCEDURES_KEY = "mock_procedures";
const PATIENT_CLINICAS_STORAGE_PREFIX = "patient_clinicas_escolhidas_";
const PATIENT_CARDS_STORAGE_PREFIX = "patient_cartoes_";
const PATIENT_LOCATION_STORAGE_PREFIX = "patient_location_";
const PATIENT_PAYMENTS_STORAGE_PREFIX = "patient_pagamentos_";
const CLINIC_PATIENTS_STORAGE_PREFIX = "clinic_patients_";

function hasPatientAddress(userId: number): boolean {
  try {
    const key = PATIENT_LOCATION_STORAGE_PREFIX + userId;
    const stored = localStorage.getItem(key);
    if (!stored) return false;
    const parsed = JSON.parse(stored) as { cep?: string; logradouro?: string; numero?: string; bairro?: string; cidade?: string; estado?: string };
    return !!(
      parsed?.cep?.trim() &&
      parsed?.logradouro?.trim() &&
      parsed?.numero?.trim() &&
      parsed?.bairro?.trim() &&
      parsed?.cidade?.trim() &&
      parsed?.estado?.trim()
    );
  } catch {
    return false;
  }
}

function loadPatientLocationForFilter(userId: number): { cidade: string; estado: string } | null {
  try {
    const key = PATIENT_LOCATION_STORAGE_PREFIX + userId;
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as { cidade?: string; estado?: string };
    const cidade = parsed?.cidade?.trim().toLowerCase();
    const estado = parsed?.estado?.trim().toLowerCase();
    if (!cidade || !estado) return null;
    return { cidade, estado };
  } catch {
    return null;
  }
}

interface PacienteAssociadoClinica {
  userId: number;
  nome: string;
  email: string;
  telefone?: string;
  dataAssociacao: string;
}

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
  cidade: string;
  estado: string;
}

interface ProcedimentoItem {
  id: number;
  clinicaId: number;
  finalidade: string;
  invasividade: string;
  valorProcedimento: string;
  parcelasCartao: string;
}

interface PagamentoHistorico {
  id: number;
  userId: number;
  clinicaId: number;
  clinicaNome: string;
  procedimentoId?: number;
  procedimentoNome?: string;
  valor: string;
  formaPagamento: FormaPagamento;
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

function savePatientPayments(userId: number, payments: PagamentoHistorico[]) {
  try {
    const key = PATIENT_PAYMENTS_STORAGE_PREFIX + userId;
    localStorage.setItem(key, JSON.stringify(payments));
  } catch {
    console.error("Error saving patient payments:");
  }
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

function loadClinicasFromStorage(): ClinicaItem[] {
  try {
    const stored = localStorage.getItem(MOCK_CLINICS_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as Array<{
      id?: number;
      nomeFantasia?: string;
      nomeEmpresa?: string;
      municipio?: string;
      uf?: string;
      cidade?: string;
      estado?: string;
    }>;
    return (parsed || []).map((c, i) => {
      const cidade = (c.cidade ?? c.municipio ?? "").toString().trim().toLowerCase();
      const estado = (c.estado ?? c.uf ?? "").toString().trim().toLowerCase();
      return {
        id: c.id ?? i + 1,
        nomeFantasia: c.nomeFantasia || c.nomeEmpresa || "Clínica",
        nomeEmpresa: c.nomeEmpresa || "",
        cidade,
        estado,
      };
    });
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
    console.error("Error saving patient clinic state:");
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
    console.error("Error saving patient cards:");
  }
}

function loadClinicPatients(clinicId: number): PacienteAssociadoClinica[] {
  try {
    const key = CLINIC_PATIENTS_STORAGE_PREFIX + clinicId;
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as PacienteAssociadoClinica[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function addPatientToClinic(clinicId: number, patient: PacienteAssociadoClinica) {
  const list = loadClinicPatients(clinicId);
  if (list.some((p) => p.userId === patient.userId)) return;
  list.push(patient);
  try {
    localStorage.setItem(CLINIC_PATIENTS_STORAGE_PREFIX + clinicId, JSON.stringify(list));
  } catch {
    console.error("Error adding patient to clinic:");
  }
}

export default function PaymentDashboard() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.id ?? 0;

  const [modalAberto, setModalAberto] = useState(false);
  const [modalClinicaAberto, setModalClinicaAberto] = useState(false);
  const [modalAlertaEnderecoAberto, setModalAlertaEnderecoAberto] = useState(false);
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
  const [procedimentos, setProcedimentos] = useState<ProcedimentoItem[]>([]);
  const [buscaProcedimento, setBuscaProcedimento] = useState("");
  const [filtroClinica, setFiltroClinica] = useState<"estado" | "cidade">("estado");
  const [modalPagamentoConcluidoAberto, setModalPagamentoConcluidoAberto] = useState(false);
  const [modalAlertaProcedimentoAberto, setModalAlertaProcedimentoAberto] = useState(false);
  const hasLoadedFromStorage = useRef(false);

  const procedimentosFiltrados = procedimentos.filter((p) =>
    (p.finalidade || "").toLowerCase().includes(buscaProcedimento.toLowerCase())
  );

  // Carregar todos os procedimentos ao montar
  useEffect(() => {
    setProcedimentos(loadAllProcedimentos());
  }, []);

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
    if (!clinicaParaPagamentoId) return;
    setCartoesDoUsuario(loadPatientCards(userId));
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setProcedimentoSelecionadoId("");
    setCartaoSelecionadoId("");
  };

  const handleConfirmar = () => {
    if (!procedimentoSelecionadoId) {
      setModalAlertaProcedimentoAberto(true);
      return;
    }
    if (!userId || !clinicaParaPagamentoId) {
      setModalAberto(false);
      setProcedimentoSelecionadoId("");
      return;
    }

    const pagamentosAnteriores = loadPatientPayments(userId);
    const novoId =
      pagamentosAnteriores.length > 0 ? Math.max(...pagamentosAnteriores.map((p) => p.id)) + 1 : 1;

    const clinicaIdNum = Number(clinicaParaPagamentoId);
    const clinica =
      clinicasEscolhidas.find((c) => c.id === clinicaIdNum) ||
      clinicas.find((c) => c.id === clinicaIdNum) ||
      null;

    const procedimento: ProcedimentoItem | null =
      procedimentoSelecionadoId
        ? procedimentos.find((p) => String(p.id) === procedimentoSelecionadoId) || null
        : null;

    const novoPagamento: PagamentoHistorico = {
      id: novoId,
      userId,
      clinicaId: clinicaIdNum,
      clinicaNome: clinica?.nomeFantasia || `Clínica #${clinicaIdNum || "-"}`,
      procedimentoId: procedimento?.id,
      procedimentoNome: procedimento?.finalidade,
      valor: procedimento?.valorProcedimento || "0,00",
      formaPagamento,
      data: new Date().toLocaleString("pt-BR"),
      status: "Concluído",
    };

    savePatientPayments(userId, [...pagamentosAnteriores, novoPagamento]);
    setModalPagamentoConcluidoAberto(true);

    setModalAberto(false);
    setProcedimentoSelecionadoId("");
  };

  const handleEscolherClinica = () => {
    if (!userId || !hasPatientAddress(userId)) {
      setModalAlertaEnderecoAberto(true);
      return;
    }
    setClinicas(loadClinicasFromStorage());
    setClinicaSelecionadaId("");
    setFiltroClinica("estado");
    setModalClinicaAberto(true);
  };

  const handleIrParaCadastroEndereco = () => {
    setModalAlertaEnderecoAberto(false);
    navigate(APP_ROUTES.PATIENT.LOCATION);
  };

  const handleFecharModalClinica = () => {
    setModalClinicaAberto(false);
  };

  const handleConfirmarClinica = () => {
    if (!clinicaSelecionadaId || !userId || !user) {
      setModalClinicaAberto(false);
      return;
    }
    const clinica = clinicas.find((c) => String(c.id) === clinicaSelecionadaId);
    const novaListaEscolhidas =
      clinica && !clinicasEscolhidas.some((c) => c.id === clinica.id)
        ? [...clinicasEscolhidas, clinica]
        : clinicasEscolhidas;

    setClinicaParaPagamentoId(clinicaSelecionadaId);
    setClinicasEscolhidas(novaListaEscolhidas);

    savePatientClinicasState(userId, {
      clinicasEscolhidas: novaListaEscolhidas,
      clinicaParaPagamentoId: clinicaSelecionadaId,
    });

    if (clinica && !clinicasEscolhidas.some((c) => c.id === clinica.id)) {
      const nomeCompleto = [user.first_name, user.last_name].filter(Boolean).join(" ").trim() || user.email || `Paciente ${user.id}`;
      addPatientToClinic(clinica.id, {
        userId: user.id,
        nome: nomeCompleto,
        email: user.email ?? "",
        telefone: user.phone ?? "",
        dataAssociacao: new Date().toISOString(),
      });
    }
    setModalClinicaAberto(false);
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
            disabled={!procedimentoSelecionadoId}
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
            disabled={
              !clinicaParaPagamentoId ||
              !clinicasEscolhidas.some((c) => String(c.id) === clinicaParaPagamentoId)
            }
          >
            Novo pagamento
          </Button>
        </Paper>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Procedimentos disponíveis
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Busque e selecione o procedimento que deseja pagar.
          </Typography>
          <TextField
            size="small"
            fullWidth
            label="Buscar procedimento por nome"
            placeholder="Ex: Limpeza, Preenchimento..."
            value={buscaProcedimento}
            onChange={(e) => setBuscaProcedimento(e.target.value)}
            sx={{ mb: 2 }}
          />
          {procedimentosFiltrados.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
              Nenhum procedimento encontrado para a busca informada.
            </Typography>
          ) : (
            <RadioGroup
              value={procedimentoSelecionadoId}
              onChange={(_, value) => setProcedimentoSelecionadoId(value)}
              name="procedimento-contratado"
            >
              <List dense disablePadding sx={{ maxHeight: 280, overflow: "auto" }}>
                {procedimentosFiltrados.map((p) => (
                  <ListItemButton
                    key={p.id}
                    selected={String(p.id) === procedimentoSelecionadoId}
                    onClick={() => setProcedimentoSelecionadoId(String(p.id))}
                    sx={{ py: 0.75 }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Radio
                        checked={String(p.id) === procedimentoSelecionadoId}
                        value={String(p.id)}
                        name="procedimento-contratado"
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
        </Paper>
      </Box>

      <Dialog open={modalAberto} onClose={handleFecharModal} maxWidth="sm" fullWidth>
        <DialogTitle>Novo pagamento</DialogTitle>
        <DialogContent>
          <>
                {(() => {
                  const clinicaEscolhida = clinicasEscolhidas.find((c) => String(c.id) === clinicaParaPagamentoId);
                  if (clinicaEscolhida) {
                    const cidadeDisplay = clinicaEscolhida.cidade ? clinicaEscolhida.cidade.charAt(0).toUpperCase() + clinicaEscolhida.cidade.slice(1) : "";
                    const estadoDisplay = clinicaEscolhida.estado ? clinicaEscolhida.estado.toUpperCase() : "";
                    const localDisplay = cidadeDisplay && estadoDisplay ? `${cidadeDisplay} - ${estadoDisplay}` : "";
                    const secondary = [clinicaEscolhida.nomeEmpresa, localDisplay].filter(Boolean).join(" · ");
                    return (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, p: 1.5, borderRadius: 1, bgcolor: "action.hover" }}>
                        <BusinessIcon color="primary" />
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {clinicaEscolhida.nomeFantasia}
                          </Typography>
                          {secondary && (
                            <Typography variant="body2" color="text.secondary">
                              {secondary}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    );
                  }
                  return null;
                })()}
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
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleFecharModal}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleConfirmar}
            disabled={
              !procedimentoSelecionadoId ||
              (formaPagamento === "cartao" && cartoesDoUsuario.length > 0 && !cartaoSelecionadoId)
            }
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={modalAlertaProcedimentoAberto}
        onClose={() => setModalAlertaProcedimentoAberto(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Procedimento obrigatório</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Para realizar o pagamento, selecione primeiro um procedimento na lista de procedimentos disponíveis.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setModalAlertaProcedimentoAberto(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={modalPagamentoConcluidoAberto}
        onClose={() => setModalPagamentoConcluidoAberto(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Pagamento concluído</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Seu pagamento foi registrado com sucesso. Você pode consultar os detalhes em Histórico de pagamentos.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setModalPagamentoConcluidoAberto(false)}>Fechar</Button>
          <Button
            variant="contained"
            onClick={() => {
              setModalPagamentoConcluidoAberto(false);
              navigate(APP_ROUTES.PATIENT.PAYMENTS);
            }}
          >
            Voltar para pagamentos
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={modalClinicaAberto} onClose={handleFecharModalClinica} maxWidth="sm" fullWidth>
        <DialogTitle>Escolher clínica</DialogTitle>
        <DialogContent>
          {(() => {
            const patientLocation = loadPatientLocationForFilter(userId);
            if (!patientLocation) {
              return (
                <Typography color="text.secondary" sx={{ py: 2 }}>
                  Cadastre seu endereço para filtrar clínicas por estado e cidade.
                </Typography>
              );
            }
            const clinicasPorEstado = clinicas.filter((c) => c.estado === patientLocation.estado);
            const clinicasPorCidade = clinicas.filter(
              (c) => c.cidade === patientLocation.cidade && c.estado === patientLocation.estado
            );
            const listaExibida = filtroClinica === "estado" ? clinicasPorEstado : clinicasPorCidade;
            const estadoDisplay = patientLocation.estado.toUpperCase();
            const cidadeDisplay = patientLocation.cidade.charAt(0).toUpperCase() + patientLocation.cidade.slice(1);

            return (
              <>
                <FormControl component="fieldset" sx={{ mt: 1, width: "100%" }}>
                  <FormLabel component="legend">Onde buscar</FormLabel>
                  <RadioGroup
                    value={filtroClinica}
                    onChange={(_, value) => {
                      setFiltroClinica(value as "estado" | "cidade");
                      setClinicaSelecionadaId("");
                    }}
                    name="filtro-clinica"
                    row
                  >
                    <FormControlLabel
                      value="estado"
                      control={<Radio />}
                      label={`Clínicas no meu estado (${estadoDisplay})`}
                    />
                    <FormControlLabel
                      value="cidade"
                      control={<Radio />}
                      label={`Clínicas na minha cidade (${cidadeDisplay})`}
                    />
                  </RadioGroup>
                </FormControl>

                <FormControl component="fieldset" sx={{ mt: 2, width: "100%" }}>
                  <FormLabel component="legend">
                    {filtroClinica === "estado"
                      ? `Clínicas no estado ${estadoDisplay}`
                      : `Clínicas em ${cidadeDisplay}`}
                  </FormLabel>
                  {listaExibida.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                      Nenhuma clínica encontrada para esta seleção.
                    </Typography>
                  ) : (
                    <RadioGroup
                      value={clinicaSelecionadaId}
                      onChange={(_, value) => setClinicaSelecionadaId(value)}
                      name="clinica"
                    >
                      <List dense disablePadding sx={{ maxHeight: 280, overflow: "auto" }}>
                        {listaExibida.map((c) => (
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
                            <ListItemText
                              primary={c.nomeFantasia}
                              secondary={
                                c.nomeEmpresa
                                  ? `${c.nomeEmpresa} · ${(c.cidade && c.cidade.charAt(0).toUpperCase() + c.cidade.slice(1)) || "—"} - ${(c.estado && c.estado.toUpperCase()) || "—"}`
                                  : `${(c.cidade && c.cidade.charAt(0).toUpperCase() + c.cidade.slice(1)) || "—"} - ${(c.estado && c.estado.toUpperCase()) || "—"}`
                              }
                            />
                          </ListItemButton>
                        ))}
                      </List>
                    </RadioGroup>
                  )}
                </FormControl>
              </>
            );
          })()}
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

      <Dialog
        open={modalAlertaEnderecoAberto}
        onClose={() => setModalAlertaEnderecoAberto(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Endereço obrigatório</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Para escolher uma clínica, é necessário cadastrar seu endereço antes. Acesse a página de cadastro de endereço para continuar.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setModalAlertaEnderecoAberto(false)}>Fechar</Button>
          <Button variant="contained" onClick={handleIrParaCadastroEndereco}>
            Cadastrar endereço
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
          Selecione um procedimento para realizar o pagamento.
        </Alert>
      </Snackbar>
    </Box>
  );
}
