import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  Grid,
  InputAdornment,
  Alert,
  Snackbar,
} from "@mui/material";

// Grid with item/xs/sm accepted (MUI Grid2-style props compatibility)
const GridItem = Grid as React.ComponentType<React.ComponentProps<typeof Grid> & { item?: boolean; xs?: number; sm?: number }>;
import SaveIcon from "@mui/icons-material/Save";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useAppSelector } from "../../core/store/hooks";

export interface LocationFormData {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  referencia: string;
}

const PATIENT_LOCATION_STORAGE_PREFIX = "patient_location_";

const initialValues: LocationFormData = {
  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: "",
  referencia: "",
};

function loadPatientLocation(userId: number): LocationFormData | null {
  try {
    const key = PATIENT_LOCATION_STORAGE_PREFIX + userId;
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as LocationFormData;
    return {
      ...initialValues,
      ...parsed,
    };
  } catch {
    return null;
  }
}

function savePatientLocation(userId: number, data: LocationFormData) {
  try {
    const key = PATIENT_LOCATION_STORAGE_PREFIX + userId;
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving patient location:", e);
  }
}

const ESTADOS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
  "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC",
  "SP", "SE", "TO",
];

function formatCep(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function formatAddressPreview(data: LocationFormData): string {
  const partes: string[] = [];
  if (data.logradouro) partes.push(data.logradouro);
  if (data.numero) partes.push(data.numero);
  if (data.complemento) partes.push(data.complemento);
  const linha1 = partes.join(", ") || "—";
  const partes2: string[] = [];
  if (data.bairro) partes2.push(data.bairro);
  if (data.cep) partes2.push(data.cep);
  const linha2 = [data.cidade, data.estado].filter(Boolean).join(" - ");
  const linha3 = partes2.length ? `${partes2.join(" · ")}${linha2 ? ` · ${linha2}` : ""}` : linha2;
  const ref = data.referencia?.trim() ? ` (Ref.: ${data.referencia})` : "";
  return [linha1, linha3].filter(Boolean).join(" — ") + ref;
}

export default function LocationForm() {
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.id ?? 0;

  const [formData, setFormData] = useState<LocationFormData>(initialValues);
  const [savedAddress, setSavedAddress] = useState<LocationFormData | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (!userId) return;
    const saved = loadPatientLocation(userId);
    if (saved) {
      setFormData(saved);
      setSavedAddress(saved);
    } else {
      setSavedAddress(null);
    }
  }, [userId]);

  const handleChange = (field: keyof LocationFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: field === "cep" ? formatCep(value) : value,
    }));
  };

  const handleCepBlur = () => {
    const cep = formData.cep.replace(/\D/g, "");
    if (cep.length !== 8) return;
    // Placeholder: integração com ViaCEP pode ser feita aqui
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((r) => r.json())
      .then((data) => {
        if (data.erro) return;
        setFormData((prev) => ({
          ...prev,
          logradouro: data.logradouro || prev.logradouro,
          bairro: data.bairro || prev.bairro,
          cidade: data.localidade || prev.cidade,
          estado: data.uf || prev.estado,
        }));
      })
      .catch(() => {});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setSnackbar({ open: true, message: "Faça login para salvar o endereço.", severity: "error" });
      return;
    }
    if (savedAddress) {
      setSnackbar({ open: true, message: "Exclua o endereço atual para cadastrar um novo. Apenas um endereço por vez.", severity: "error" });
      return;
    }
    const toSave: LocationFormData = {
      ...formData,
      cidade: formData.cidade.trim().toLowerCase(),
      estado: formData.estado.trim().toLowerCase(),
    };
    savePatientLocation(userId, toSave);
    setSavedAddress(toSave);
    setSnackbar({ open: true, message: "Endereço salvo com sucesso.", severity: "success" });
  };

  const handleExcluirEndereco = () => {
    if (!userId) return;
    try {
      const key = PATIENT_LOCATION_STORAGE_PREFIX + userId;
      localStorage.removeItem(key);
    } catch (e) {
      console.error("Error removing patient location:", e);
    }
    setSavedAddress(null);
    setFormData(initialValues);
    setSnackbar({ open: true, message: "Endereço excluído. Você pode cadastrar um novo endereço.", severity: "success" });
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ mt: { xs: 7, sm: 8 } }}> {/* Margem superior para evitar sobreposição com o cabeçalho */}
      <Typography variant="h4" fontWeight={700} mb={3}>
        Meu endereço
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Cadastre ou atualize seu endereço para agendamentos e correspondências.
      </Typography>

      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <LocationOnIcon color="primary" />
            <Typography variant="h6" color="text.secondary">
              Localização
            </Typography>
          </Box>

          <GridItem container spacing={2}>
            <GridItem item xs={12} sm={4}>
              <TextField
                fullWidth
                label="CEP"
                placeholder="00000-000"
                value={formData.cep}
                onChange={handleChange("cep")}
                onBlur={handleCepBlur}
                inputProps={{ maxLength: 9 }}
              />
            </GridItem>
            <GridItem item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Logradouro"
                placeholder="Rua, avenida, etc."
                value={formData.logradouro}
                onChange={handleChange("logradouro")}
              />
            </GridItem>
            <GridItem item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Número"
                placeholder="Nº"
                value={formData.numero}
                onChange={handleChange("numero")}
              />
            </GridItem>
            <GridItem item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Complemento"
                placeholder="Apto, bloco, sala..."
                value={formData.complemento}
                onChange={handleChange("complemento")}
              />
            </GridItem>
            <GridItem item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Bairro"
                value={formData.bairro}
                onChange={handleChange("bairro")}
              />
            </GridItem>
            <GridItem item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Cidade"
                value={formData.cidade}
                onChange={handleChange("cidade")}
              />
            </GridItem>
            <GridItem item xs={12} sm={2}>
              <TextField
                fullWidth
                select
                SelectProps={{ native: true }}
                label="Estado"
                value={formData.estado}
                onChange={(e) => setFormData((p) => ({ ...p, estado: e.target.value }))}
              >
                <option value="" />
                {ESTADOS.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </TextField>
            </GridItem>
            <GridItem item xs={12}>
              <TextField
                fullWidth
                label="Ponto de referência"
                placeholder="Ex: próximo ao mercado, prédio azul..."
                value={formData.referencia}
                onChange={handleChange("referencia")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </GridItem>
          </GridItem>

          <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 1 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={
                !!savedAddress ||
                !formData.cep ||
                !formData.logradouro ||
                !formData.numero ||
                !formData.bairro ||
                !formData.cidade ||
                !formData.estado
              }
            >
              Salvar endereço
            </Button>
          </Box>
        </Stack>
      </Paper>

      {savedAddress && (
        <Paper sx={{ p: 2, mt: 3 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocationOnIcon color="primary" fontSize="small" />
            Endereço cadastrado
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }} component="pre" style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
            {formatAddressPreview(savedAddress)}
          </Typography>
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<DeleteOutlineIcon />}
            onClick={handleExcluirEndereco}
          >
            Excluir endereço
          </Button>
          <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
            Apenas um endereço por vez. Exclua este para cadastrar outro.
          </Typography>
        </Paper>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}