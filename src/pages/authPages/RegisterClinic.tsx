import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
  Grid,
  MenuItem,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router";
import { APP_ROUTES, VALIDATION_PATTERNS } from "../../util/constants";
import { useAuth } from "../../hooks/useAuth";
import { maskCnpj, maskCep, maskTelefone } from "../../util/masks";

const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
  "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC",
  "SP", "SE", "TO",
];

const TIPOS = [
  { value: "MEI", label: "MEI" },
  { value: "ME", label: "ME" },
  { value: "EPP", label: "EPP" },
  { value: "LTDA", label: "LTDA" },
  { value: "SA", label: "S.A." },
  { value: "OUTRO", label: "Outro" },
];

const SITUACOES = [
  { value: "ATIVA", label: "Ativa" },
  { value: "INATIVA", label: "Inativa" },
  { value: "BAIXADA", label: "Baixada" },
  { value: "OUTRO", label: "Outro" },
];

export default function RegisterClinic() {
  const navigate = useNavigate();
  const { registerClinic } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    cnpj: "",
    dataAbertura: "",
    tipo: "",
    nomeFantasia: "",
    nomeEmpresa: "",
    atividadePrincipal: "",
    atividadeSecundaria: "",
    endereco: "",
    numero: "",
    complemento: "",
    cep: "",
    bairro: "",
    municipio: "",
    uf: "",
    situacao: "",
    contato: "",
    telefone: "",
    password: "",
    password2: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let value = e.target.value;
    if (field === "cnpj") value = maskCnpj(value);
    if (field === "cep") value = maskCep(value);
    if (field === "telefone") value = maskTelefone(value);
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!VALIDATION_PATTERNS.CNPJ.test(form.cnpj)) {
      setFormError("CNPJ inválido. Use o formato 00.000.000/0001-00");
      return;
    }
    if (!VALIDATION_PATTERNS.CEP.test(form.cep)) {
      setFormError("CEP inválido. Use o formato 00000-000");
      return;
    }
    if (!VALIDATION_PATTERNS.TELEFONE.test(form.telefone)) {
      setFormError("Telefone inválido. Use o formato (00) 00000-0000 ou (00) 0000-0000");
      return;
    }
    if (form.password !== form.password2) {
      setFormError("As senhas não coincidem");
      return;
    }
    if (!VALIDATION_PATTERNS.PASSWORD.test(form.password)) {
      setFormError("Senha deve ter no mínimo 8 caracteres, com letras e números");
      return;
    }

    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password2: _password2, ...payload } = form;
      await registerClinic(payload);
      navigate(APP_ROUTES.CLINIC.DASHBOARD);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Erro ao cadastrar clínica");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
      <Box sx={{ width: "100%", maxWidth: 720 }}>
        <Card elevation={6} sx={{ borderRadius: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight={700} mb={2} align="center">
              Cadastrar clínica
            </Typography>

            <form onSubmit={handleSubmit}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
                Dados da empresa
              </Typography>
              <Grid container spacing={2}>
                                <Grid sx={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="CNPJ"
                    value={form.cnpj}
                    onChange={handleChange("cnpj")}
                    fullWidth
                    required
                    margin="normal"
                    placeholder="00.000.000/0001-00"
                    inputProps={{ inputMode: "numeric", maxLength: 18 }}
                  />
                </Grid>
                                <Grid sx={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Data abertura"
                    type="date"
                    value={form.dataAbertura}
                    onChange={handleChange("dataAbertura")}
                    fullWidth
                    required
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                                <Grid sx={{ xs: 12, sm: 6 }}>
                  <TextField
                    select
                    label="Tipo"
                    value={form.tipo}
                    onChange={(e) => setForm((p) => ({ ...p, tipo: e.target.value }))}
                    fullWidth
                    required
                    margin="normal"
                  >
                    {TIPOS.map((op) => (
                      <MenuItem key={op.value} value={op.value}>
                        {op.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                                <Grid sx={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Nome fantasia"
                    value={form.nomeFantasia}
                    onChange={handleChange("nomeFantasia")}
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                                <Grid sx={{ xs: 12 }}>
                  <TextField
                    label="Razão social (nome empresa)"
                    value={form.nomeEmpresa}
                    onChange={handleChange("nomeEmpresa")}
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                                <Grid sx={{ xs: 12 }}>
                  <TextField
                    label="Atividade principal"
                    value={form.atividadePrincipal}
                    onChange={handleChange("atividadePrincipal")}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                                <Grid sx={{ xs: 12 }}>
                  <TextField
                    label="Atividade secundária"
                    value={form.atividadeSecundaria}
                    onChange={handleChange("atividadeSecundaria")}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
              </Grid>

              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 3, mb: 1 }}>
                Endereço
              </Typography>
              <Grid container spacing={2}>
                                <Grid sx={{ xs: 12 }}>
                  <TextField
                    label="Endereço"
                    value={form.endereco}
                    onChange={handleChange("endereco")}
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                                <Grid sx={{ xs: 12, sm: 4 }}>
                  <TextField
                    label="Número"
                    value={form.numero}
                    onChange={handleChange("numero")}
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                                <Grid sx={{ xs: 12, sm: 4 }}>
                  <TextField
                    label="Complemento"
                    value={form.complemento}
                    onChange={handleChange("complemento")}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                                <Grid sx={{ xs: 12, sm: 4 }}>
                  <TextField
                    label="CEP"
                    value={form.cep}
                    onChange={handleChange("cep")}
                    fullWidth
                    required
                    margin="normal"
                    placeholder="00000-000"
                    inputProps={{ inputMode: "numeric", maxLength: 9 }}
                  />
                </Grid>
                                <Grid sx={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Bairro"
                    value={form.bairro}
                    onChange={handleChange("bairro")}
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                                <Grid sx={{ xs: 12, sm: 4 }}>
                  <TextField
                    label="Município"
                    value={form.municipio}
                    onChange={handleChange("municipio")}
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                                <Grid sx={{ xs: 12, sm: 2 }}>
                  <TextField
                    select
                    label="UF"
                    value={form.uf}
                    onChange={(e) => setForm((p) => ({ ...p, uf: e.target.value }))}
                    fullWidth
                    required
                    margin="normal"
                  >
                    {UFS.map((uf) => (
                      <MenuItem key={uf} value={uf}>
                        {uf}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>

              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 3, mb: 1 }}>
                Situação e contato
              </Typography>
              <Grid container spacing={2}>
                                <Grid sx={{ xs: 12, sm: 6 }}>
                  <TextField
                    select
                    label="Situação"
                    value={form.situacao}
                    onChange={(e) => setForm((p) => ({ ...p, situacao: e.target.value }))}
                    fullWidth
                    required
                    margin="normal"
                  >
                    {SITUACOES.map((op) => (
                      <MenuItem key={op.value} value={op.value}>
                        {op.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                                <Grid sx={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Contato"
                    value={form.contato}
                    onChange={handleChange("contato")}
                    fullWidth
                    required
                    margin="normal"
                    placeholder="Nome ou e-mail do responsável"
                  />
                </Grid>
                                <Grid sx={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Telefone"
                    value={form.telefone}
                    onChange={handleChange("telefone")}
                    fullWidth
                    required
                    margin="normal"
                    placeholder="(00) 00000-0000 ou (00) 0000-0000"
                    inputProps={{ inputMode: "tel", maxLength: 15 }}
                  />
                </Grid>
                                <Grid sx={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Senha"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange("password")}
                    fullWidth
                    required
                    margin="normal"
                    helperText="Mín. 8 caracteres, letras e números"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword((v) => !v)} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                                <Grid sx={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Confirmar senha"
                    type={showPassword ? "text" : "password"}
                    value={form.password2}
                    onChange={handleChange("password2")}
                    fullWidth
                    required
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword((v) => !v)} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              {formError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {formError}
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3, mb: 1, py: 1.5, fontWeight: 600 }}
                disabled={loading}
              >
                {loading ? "Cadastrando..." : "Cadastrar clínica"}
              </Button>
            </form>

            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2, flexWrap: "wrap" }}>
              <Button variant="text" color="primary" onClick={() => navigate(APP_ROUTES.LOGIN)}>
                Já tenho conta
              </Button>
              <Button variant="text" color="primary" onClick={() => navigate(APP_ROUTES.REGISTER)}>
                Criar conta de usuário
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

