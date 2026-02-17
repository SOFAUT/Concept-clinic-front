import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import AuthCard from "../../components/ui/cards/AuthCard";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { APP_ROUTES, VALIDATION_PATTERNS } from "../../util/constants";
import { maskCnpj } from "../../util/masks";

export default function LoginClinic() {
  const { loginClinic, loading, error, user } = useAuth();
  const navigate = useNavigate();
  const [cnpj, setCnpj] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const loginAttempted = useRef(false);

  // Redireciona quando o user muda após login bem-sucedido
  useEffect(() => {
    if (user && loginAttempted.current) {
      if (user.role === 'clinic') {
        navigate(APP_ROUTES.CLINIC.DASHBOARD, { replace: true });
      } else if (user.role === 'admin') {
        navigate(APP_ROUTES.ADMIN.DASHBOARD, { replace: true });
      } else {
        navigate(APP_ROUTES.PATIENT.DASHBOARD, { replace: true });
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!VALIDATION_PATTERNS.CNPJ.test(cnpj)) {
      setFormError("CNPJ inválido. Use o formato 00.000.000/0001-00");
      return;
    }
    loginAttempted.current = true;
    try {
      await loginClinic({ cnpj, password });
      // A navegação acontece via useEffect quando o user é atualizado
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Erro ao fazer login");
    }
  };

  return (
    <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
      <AuthCard>
        <Typography variant="h5" fontWeight={700} mb={2} align="center">
          Entrar como clínica
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="CNPJ"
            value={cnpj}
            onChange={(e) => setCnpj(maskCnpj(e.target.value))}
            fullWidth
            required
            margin="normal"
            placeholder="00.000.000/0001-00"
            inputProps={{ inputMode: "numeric", maxLength: 18 }}
            autoFocus
          />
          <TextField
            label="Senha"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          {(formError || error) && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {formError || error}
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
            {loading ? "Entrando..." : "Entrar"}
          </Button>
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Button variant="text" color="primary" onClick={() => navigate(APP_ROUTES.LOGIN)}>
              Entrar com e-mail 
            </Button>
            <Button variant="text" color="primary" onClick={() => navigate(APP_ROUTES.REGISTER_CLINIC)}>
              Cadastrar clínica
            </Button>
          </Box>
        </form>
      </AuthCard>
    </Box>
  );
}
