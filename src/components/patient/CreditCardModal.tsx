import { useEffect, useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

export interface CreditCardFormValues {
  nomeTitular: string;
  numeroCartao: string;
  validade: string;
  bandeira: "mastercard" | "visa";
}

interface CreditCardModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (values: CreditCardFormValues) => void;
}

export function CreditCardModal({
  open,
  onClose,
  onSave,
}: CreditCardModalProps) {
  const [nomeTitular, setNomeTitular] = useState("");
  const [numeroCartao, setNumeroCartao] = useState("");
  const [validade, setValidade] = useState("");
  const [bandeira, setBandeira] = useState<"mastercard" | "visa">("mastercard");

  useEffect(() => {
    if (open) {
      setNomeTitular("");
      setNumeroCartao("");
      setValidade("");
      setBandeira("mastercard");
    }
  }, [open]);

  const numeroSomenteDigitos = numeroCartao.replace(/\D/g, "");
  const isValid =
    nomeTitular.trim() !== "" &&
    numeroSomenteDigitos.length >= 4 &&
    validade.trim() !== "";

  const handleSaveClick = () => {
    if (!isValid) return;

    onSave({
      nomeTitular: nomeTitular.trim(),
      numeroCartao,
      validade: validade.trim(),
      bandeira,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Cadastrar cartão de crédito</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Nome do titular"
            fullWidth
            value={nomeTitular}
            onChange={(event) => setNomeTitular(event.target.value)}
          />
          <TextField
            label="Número do cartão"
            fullWidth
            value={numeroCartao}
            onChange={(event) => setNumeroCartao(event.target.value)}
            helperText="Apenas os 4 últimos dígitos serão armazenados."
          />
          <TextField
            label="Validade (MM/AA)"
            fullWidth
            value={validade}
            onChange={(event) => setValidade(event.target.value)}
          />
          <FormControl component="fieldset">
            <FormLabel component="legend">Bandeira do cartão</FormLabel>
            <RadioGroup
              row
              value={bandeira}
              onChange={(_, value) =>
                setBandeira(value as "mastercard" | "visa")
              }
            >
              <FormControlLabel
                value="mastercard"
                control={<Radio />}
                label="Mastercard"
              />
              <FormControlLabel value="visa" control={<Radio />} label="Visa" />
            </RadioGroup>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSaveClick} disabled={!isValid}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

