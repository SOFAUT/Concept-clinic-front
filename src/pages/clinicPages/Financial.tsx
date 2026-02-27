import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
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
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAppSelector } from "../../core/store/hooks";
import dayjs from "dayjs";

const CLINIC_PATIENTS_STORAGE_PREFIX = "clinic_patients_";
const PATIENT_APPOINTMENTS_STORAGE_PREFIX = "patient_agendamentos_";
const MOCK_PROCEDURES_KEY = "mock_procedures";
const CLINIC_CHARGES_STORAGE_PREFIX = "clinic_cobrancas_";

interface PacienteAssociadoClinica {
  userId: number;
  nome: string;
  email: string;
  telefone?: string;
  dataAssociacao: string;
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

interface AgendamentoElegivelCobranca {
  agendamentoId: number;
  userId: number;
  pacienteNome: string;
  dataAgendada: string;
  procedimentoNome?: string;
  procedimentoId?: number;
}

interface ProcedimentoSalvoResumo {
  id: number;
  clinicaId: number;
  valorProcedimento: string;
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

function loadPatientAppointmentsForClinic(
  userId: number,
  clinicId: number
): AgendamentoPaciente[] {
  try {
    const key = PATIENT_APPOINTMENTS_STORAGE_PREFIX + userId;
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as AgendamentoPaciente[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((a) => a.clinicaId === clinicId);
  } catch {
    return [];
  }
}

function loadProcedimentosClinica(clinicId: number): ProcedimentoSalvoResumo[] {
  try {
    const stored = localStorage.getItem(MOCK_PROCEDURES_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as Array<{
      id?: number;
      clinicaId?: number;
      valorProcedimento?: string;
    }>;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((p, index) => ({
        id: p.id ?? index + 1,
        clinicaId: p.clinicaId ?? 0,
        valorProcedimento: p.valorProcedimento || "0,00",
      }))
      .filter((p) => p.clinicaId === clinicId);
  } catch {
    return [];
  }
}

function loadClinicCharges(clinicId: number): CobrancaClinica[] {
  try {
    const key = CLINIC_CHARGES_STORAGE_PREFIX + clinicId;
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as CobrancaClinica[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveClinicCharges(clinicId: number, list: CobrancaClinica[]) {
  try {
    const key = CLINIC_CHARGES_STORAGE_PREFIX + clinicId;
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    // eslint-disable-next-line no-console
    console.error("Error saving clinic charges");
  }
}

export default function Financial() {
  const user = useAppSelector((state) => state.auth.user);
  const clinicId = user?.id ?? 0;

  const [modalAberto, setModalAberto] = useState(false);
  const [agendamentosElegiveis, setAgendamentosElegiveis] = useState<
    AgendamentoElegivelCobranca[]
  >([]);
  const [agendamentoSelecionadoId, setAgendamentoSelecionadoId] = useState<string>("");
  const [modalCobrancaAberto, setModalCobrancaAberto] = useState(false);
  const [cobrancaSelecionada, setCobrancaSelecionada] = useState<{
    pacienteNome: string;
    userId: number;
    procedimentoNome?: string;
    dataAgendada: string;
    valor: string;
  } | null>(null);
  const [parcelas, setParcelas] = useState<string>("1");
  const [cobrancas, setCobrancas] = useState<CobrancaClinica[]>(() =>
    clinicId ? loadClinicCharges(clinicId) : []
  );

  const handleAbrirModal = () => {
    if (!clinicId) return;
    const pacientes = loadClinicPatients(clinicId);
    const lista: AgendamentoElegivelCobranca[] = [];

    pacientes.forEach((p) => {
      const ags = loadPatientAppointmentsForClinic(p.userId, clinicId);
      ags
        .filter((a) => a.status === "realizado")
        .forEach((a) => {
          const pacienteNome =
            p.nome?.trim() || p.email || `Paciente ${p.userId}`;
          lista.push({
            agendamentoId: a.id,
            userId: p.userId,
            pacienteNome,
            dataAgendada: a.dataAgendada,
            procedimentoNome: a.procedimentoNome,
            procedimentoId: a.procedimentoId,
          });
        });
    });

    setAgendamentosElegiveis(lista);
    setAgendamentoSelecionadoId("");
    setModalAberto(true);
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Cobranças
      </Typography>

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
            {cobrancas.length === 0
              ? "Você ainda não possui cobranças cadastradas."
              : "Cobranças em aberto:"}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAbrirModal}
            disabled={!clinicId}
          >
            Cadastrar cobrança
          </Button>
        </Box>

        {cobrancas.length > 0 && (
          <List dense disablePadding sx={{ mt: 2 }}>
            {cobrancas.map((c) => (
              <ListItem
                key={c.id}
                sx={{ py: 0.75 }}
                secondaryAction={
                  <Button
                    color="error"
                    size="small"
                    onClick={() => {
                      const novaLista = cobrancas.filter((item) => item.id !== c.id);
                      setCobrancas(novaLista);
                      if (clinicId) saveClinicCharges(clinicId, novaLista);
                    }}
                  >
                    Excluir
                  </Button>
                }
              >
                <ListItemText
                  primary={`${c.pacienteNome} · R$ ${c.valor} · ${c.parcelas}x`}
                  secondary={`Procedimento: ${
                    c.procedimentoNome || "—"
                  } · Data: ${dayjs(c.dataAgendada).format("DD/MM/YYYY")}`}
                  secondaryTypographyProps={{ color: "text.secondary" }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      <Dialog
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Selecionar paciente para cobrança</DialogTitle>
        <DialogContent>
          {agendamentosElegiveis.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
              Nenhum agendamento com status &quot;realizado&quot; encontrado
              para esta clínica.
            </Typography>
          ) : (
            <>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Selecione o paciente (e data de procedimento) para o qual
                deseja cadastrar a cobrança.
              </Typography>
              <List dense disablePadding sx={{ maxHeight: 320, overflow: "auto" }}>
                {agendamentosElegiveis.map((a) => (
                  <ListItemButton
                    key={a.agendamentoId}
                    selected={
                      String(a.agendamentoId) === agendamentoSelecionadoId
                    }
                    onClick={() =>
                      setAgendamentoSelecionadoId(String(a.agendamentoId))
                    }
                    sx={{ py: 0.75 }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Radio
                        checked={
                          String(a.agendamentoId) === agendamentoSelecionadoId
                        }
                        value={String(a.agendamentoId)}
                        name="agendamento-cobranca"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={a.pacienteNome}
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                          >
                            {a.procedimentoNome || "Procedimento"}
                          </Typography>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                          >
                            {" · Data: "}
                            {dayjs(a.dataAgendada).format("DD/MM/YYYY")}
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
          <Button onClick={() => setModalAberto(false)}>Cancelar</Button>
          <Button
            variant="contained"
            disabled={!agendamentoSelecionadoId}
            onClick={() => {
              if (!clinicId || !agendamentoSelecionadoId) {
                setModalAberto(false);
                return;
              }
              const selecionado = agendamentosElegiveis.find(
                (a) => String(a.agendamentoId) === agendamentoSelecionadoId
              );
              if (!selecionado) {
                setModalAberto(false);
                return;
              }
              const procedimentosClinica = loadProcedimentosClinica(clinicId);
              let valor = "0,00";
              if (selecionado.procedimentoId != null) {
                const proc = procedimentosClinica.find(
                  (p) => p.id === selecionado.procedimentoId
                );
                if (proc) {
                  valor = proc.valorProcedimento || "0,00";
                }
              }
              setCobrancaSelecionada({
                pacienteNome: selecionado.pacienteNome,
                userId: selecionado.userId,
                procedimentoNome: selecionado.procedimentoNome,
                dataAgendada: selecionado.dataAgendada,
                valor,
              });
              setParcelas("1");
              setModalAberto(false);
              setModalCobrancaAberto(true);
            }}
          >
            Continuar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={modalCobrancaAberto}
        onClose={() => setModalCobrancaAberto(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Cadastrar cobrança</DialogTitle>
        <DialogContent>
          {cobrancaSelecionada && (
            <>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                {cobrancaSelecionada.pacienteNome}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {cobrancaSelecionada.procedimentoNome || "Procedimento"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Data agendada:{" "}
                {dayjs(cobrancaSelecionada.dataAgendada).format("DD/MM/YYYY")}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                Valor do procedimento: <strong>R$ {cobrancaSelecionada.valor}</strong>
              </Typography>
              <TextField
                label="Número de parcelas"
                type="number"
                value={parcelas}
                onChange={(e) => {
                  const onlyDigits = e.target.value.replace(/\D/g, "");
                  setParcelas(onlyDigits);
                }}
                fullWidth
                margin="normal"
                inputProps={{ min: 1, max: 12 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setModalCobrancaAberto(false)}>Cancelar</Button>
          <Button
            variant="contained"
            disabled={!cobrancaSelecionada || !parcelas}
            onClick={() => {
              // Futuro: salvar a cobrança em localStorage
              setModalCobrancaAberto(false);
            }}
          >
            Salvar cobrança
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

