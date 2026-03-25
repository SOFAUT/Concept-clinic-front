import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useAppSelector } from "../../core/store/hooks";
import Button from "@mui/material/Button";
import {
  CreditCardModal,
  type CreditCardFormValues,
} from "../../components/patient/CreditCardModal";

const PATIENT_CARDS_STORAGE_PREFIX = "patient_cartoes_";

interface CartaoSalvo {
  id: number;
  userId: number;
  nomeTitular: string;
  ultimosQuatroDigitos: string;
  validade: string;
  bandeira?: "mastercard" | "visa";
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
    const key = PATIENT_CARDS_STORAGE_PREFIX + userId;
    localStorage.setItem(key, JSON.stringify(cards));
  } catch (e) {
    console.error("Error saving patient cards:", e);
  }
}

function formatCardDisplay(ultimosQuatro: string): string {
  return `**** **** **** ${ultimosQuatro || "****"}`;
}

export default function PatientCards() {
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.id ?? 0;
  const [cartoes, setCartoes] = useState<CartaoSalvo[]>([]);
  const [modalCadastroAberto, setModalCadastroAberto] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setCartoes(loadPatientCards(userId));
  }, [userId]);

  const handleRemoverCartao = (id: number) => {
    if (!userId) return;
    const atualizados = cartoes.filter((c) => c.id !== id);
    setCartoes(atualizados);
    savePatientCards(userId, atualizados);
  };

  const handleSalvarCartao = ({
    nomeTitular,
    numeroCartao,
    validade,
    bandeira,
  }: CreditCardFormValues) => {
    if (!userId) return;

    const numeroSomenteDigitos = numeroCartao.replace(/\D/g, "");
    const ultimosQuatro = numeroSomenteDigitos.slice(-4);

    const novoCartao: CartaoSalvo = {
      id: Date.now(),
      userId,
      nomeTitular: nomeTitular.trim(),
      ultimosQuatroDigitos: ultimosQuatro,
      validade: validade.trim(),
      bandeira,
    };

    const atualizados = [...cartoes, novoCartao];
    setCartoes(atualizados);
    savePatientCards(userId, atualizados);
    setModalCadastroAberto(false);
  };

  return (
    <Box sx={{ mt: { xs: 7, sm: 8 } }}> {/* Margem superior para evitar sobreposição com o cabeçalho */}
      <Typography variant="h4" fontWeight={700} mb={3}>
        Meus cartões
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Cartões cadastrados para pagamento. O número é exibido de forma mascarada (apenas os 4 últimos dígitos).
      </Typography>

      <Paper sx={{ p: 2 }}>
        {cartoes.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
            Nenhum cartão cadastrado. Você pode cadastrar um cartão na página de Pagamentos.
          </Typography>
        ) : (
          <List dense disablePadding>
            {cartoes.map((c) => (
              <ListItem
                key={c.id}
                sx={{
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                  mb: 1,
                  "&:last-of-type": { mb: 0 },
                }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => handleRemoverCartao(c.id)}
                    aria-label="Excluir cartão"
                    color="error"
                    size="small"
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                }
              >
                <ListItemIcon sx={{ minWidth: 48 }}>
                  <CreditCardIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={formatCardDisplay(c.ultimosQuatroDigitos)}
                  secondary={`${c.nomeTitular} · Val. ${c.validade || "—"}${c.bandeira ? ` · ${c.bandeira === "mastercard" ? "Mastercard" : "Visa"}` : ""}`}
                  primaryTypographyProps={{ variant: "body1", fontFamily: "monospace" }}
                  secondaryTypographyProps={{ variant: "body2", color: "text.secondary" }}
                />
              </ListItem>
            ))}
          </List>
        )}

        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<CreditCardIcon />}
            onClick={() => setModalCadastroAberto(true)}
          >
            Cadastrar cartão
          </Button>
        </Box>
      </Paper>
      <CreditCardModal
        open={modalCadastroAberto}
        onClose={() => setModalCadastroAberto(false)}
        onSave={handleSalvarCartao}
      />
    </Box>
  );
}