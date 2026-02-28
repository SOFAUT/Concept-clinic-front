import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useAppSelector } from '../../core/store/hooks';

const STORAGE_KEY = 'mock_procedures';

const INVASIVIDADE_OPCOES = [
  { value: 'nao_invasivo', label: 'Não Invasivo' },
  { value: 'minimamente_invasivo', label: 'Minimamente invasivo' },
  { value: 'invasivo', label: 'Invasivo' },
];

const PARCELAS_OPCOES = [1, 2, 3, 4, 5, 6].map((n) => ({ value: String(n), label: `${n}x` }));

export interface ProcedimentoSalvo {
  id: number;
  clinicaId: number;
  finalidade: string;
  invasividade: string;
  dadosTecnicos: string;
  valorProcedimento: string;
  parcelasCartao: string;
}

function loadProcedimentos(): ProcedimentoSalvo[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

function saveProcedimentos(procedimentos: ProcedimentoSalvo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(procedimentos));
}

export default function Procedures() {
  const user = useAppSelector((state) => state.auth.user);
  const clinicaId = user?.id ?? 0;

  const [modalAberto, setModalAberto] = useState(false);
  const [finalidade, setFinalidade] = useState('');
  const [invasividade, setInvasividade] = useState('');
  const [dadosTecnicos, setDadosTecnicos] = useState('');
  const [valorProcedimento, setValorProcedimento] = useState('');
  const [parcelasCartao, setParcelasCartao] = useState('6');
  const [procedimentos, setProcedimentos] = useState<ProcedimentoSalvo[]>([]);

  const recarregarProcedimentos = useCallback(() => {
    setProcedimentos(loadProcedimentos().filter((p) => p.clinicaId === clinicaId));
  }, [clinicaId]);

  useEffect(() => {
    recarregarProcedimentos();
  }, [clinicaId, recarregarProcedimentos]);

  const handleCadastrarProcedimento = () => {
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setFinalidade('');
    setInvasividade('');
    setDadosTecnicos('');
    setValorProcedimento('');
    setParcelasCartao('6');
  };

  const handleSubmit = () => {
    const todos = loadProcedimentos();
    const novoId = todos.length > 0 ? Math.max(...todos.map((p) => p.id)) + 1 : 1;
    const novo: ProcedimentoSalvo = {
      id: novoId,
      clinicaId,
      finalidade,
      invasividade,
      dadosTecnicos,
      valorProcedimento,
      parcelasCartao,
    };
    todos.push(novo);
    saveProcedimentos(todos);
    recarregarProcedimentos();
    handleFecharModal();
  };

  const handleExcluirProcedimento = (id: number) => {
    const todos = loadProcedimentos().filter((p) => p.id !== id);
    saveProcedimentos(todos);
    recarregarProcedimentos();
  };

  return (
    <Box sx={{ mt: { xs: 7, sm: 8 } }}> {/* Margem superior para evitar sobreposição com o cabeçalho */}
      <Typography variant="h4" fontWeight={700} mb={3}>
        Procedimentos
      </Typography>

      {/* Lista de procedimentos */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Procedimentos cadastrados
        </Typography>
        {procedimentos.length === 0 ? (
          <Typography color="text.secondary">
            Nenhum procedimento cadastrado ainda.
          </Typography>
        ) : (
          <List dense disablePadding>
            {procedimentos.map((p) => (
              <ListItem
                key={p.id}
                divider
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="Excluir procedimento"
                    onClick={() => handleExcluirProcedimento(p.id)}
                    color="error"
                    size="small"
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={p.finalidade || '(Sem finalidade)'}
                  secondary={
                    <>
                      {INVASIVIDADE_OPCOES.find((o) => o.value === p.invasividade)?.label ?? p.invasividade}
                      {' · '}
                      R$ {p.valorProcedimento || '0,00'} · até {p.parcelasCartao}x no cartão
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {/* Botão posicionado no canto inferior direito */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCadastrarProcedimento}
        >
          Cadastrar procedimento
        </Button>
      </Box>

      <Dialog open={modalAberto} onClose={handleFecharModal} maxWidth="sm" fullWidth>
        <DialogTitle>Cadastrar procedimento</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Finalidade"
              value={finalidade}
              onChange={(e) => setFinalidade(e.target.value)}
              fullWidth
              margin="normal"
              placeholder="Descreva a finalidade do procedimento"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="invasividade-label">Invasividade</InputLabel>
              <Select
                labelId="invasividade-label"
                label="Invasividade"
                value={invasividade}
                onChange={(e) => setInvasividade(e.target.value)}
              >
                {INVASIVIDADE_OPCOES.map((op) => (
                  <MenuItem key={op.value} value={op.value}>
                    {op.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Valor do procedimento"
              value={valorProcedimento}
              onChange={(e) => setValorProcedimento(e.target.value)}
              fullWidth
              type="number"
              margin="normal"
              placeholder="0,00"
              inputProps={{ min: 0, step: 0.01 }}
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
              }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="parcelas-label">Parcelas no cartão</InputLabel>
              <Select
                labelId="parcelas-label"
                label="Parcelas no cartão"
                value={parcelasCartao}
                onChange={(e) => setParcelasCartao(e.target.value)}
              >
                {PARCELAS_OPCOES.map((op) => (
                  <MenuItem key={op.value} value={op.value}>
                    {op.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Dados técnicos do procedimento"
              value={dadosTecnicos}
              onChange={(e) => setDadosTecnicos(e.target.value)}
              fullWidth
              multiline
              minRows={5}
              maxRows={12}
              margin="normal"
              placeholder="Descreva os dados técnicos do procedimento"
              sx={{ mt: 1 }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleFecharModal}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Cadastrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}