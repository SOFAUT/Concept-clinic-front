import React, { useState, useEffect, useRef } from 'react'
import { Box, Typography, TextField, Button, Alert, InputAdornment, IconButton } from '@mui/material'
import AuthCard from '../../components/ui/cards/AuthCard'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { APP_ROUTES } from '../../util/constants'

export default function Login() {
  const { login, loading, error, user } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const loginAttempted = useRef(false)

  // Redireciona quando o user muda após login bem-sucedido
  useEffect(() => {
    if (user && loginAttempted.current) {
      switch (user.role) {
        case 'admin':
          navigate(APP_ROUTES.ADMIN.DASHBOARD, { replace: true })
          break
        case 'clinic':
          navigate(APP_ROUTES.CLINIC.DASHBOARD, { replace: true })
          break
        case 'patient':
        default:
          navigate(APP_ROUTES.PATIENT.DASHBOARD, { replace: true })
          break
      }
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    loginAttempted.current = true
    try {
      await login({ email, password })
    } catch (err: unknown) {
      loginAttempted.current = false
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login';
      setFormError(errorMessage)
    }
  }

  return (
    <Box>
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'primary.main',
        }}
      >
       
      </Box>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <AuthCard>
          <Typography variant="h5" fontWeight={700} mb={2} align="center">
            Entrar na plataforma
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="E-mail"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
              autoFocus
            />
            <TextField
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(v => !v)} edge="end">
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
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button variant="text" color="primary" fullWidth sx={{ display: 'block', mb: 0.5 }} onClick={() => navigate(APP_ROUTES.LOGIN_CLINIC)}>
                Entrar como clínica
              </Button>
              <Button variant="text" color="primary" onClick={() => navigate(APP_ROUTES.REGISTER)}>
                Cadastre-se como paciente
              </Button>
              <Button variant="text" color="primary" onClick={() => navigate(APP_ROUTES.REGISTER_CLINIC)}>
                Cadastre-se como clínica
              </Button>
            </Box>
          </form>
        </AuthCard>
      </Box>
    </Box>
  )
}
