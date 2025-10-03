import React, { useState } from 'react'
import { Box, Typography, TextField, Button, Alert} from '@mui/material'
import AuthCard from '../../components/ui/cards/AuthCard'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router'
import { APP_ROUTES } from '../../util/constants'

export default function Register() {
  const { register, loading, error } = useAuth()
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    if (password !== password2) {
      setFormError('As senhas não coincidem')
      return
    }
    try {
      await register({ first_name: firstName, last_name: lastName, email, password, password2 })
      navigate(APP_ROUTES.LOGIN)
    } catch (err: any) {
      setFormError(err.message || 'Erro ao cadastrar')
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
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <AuthCard>
          <Typography variant="h5" fontWeight={700} mb={2} align="center">
            Criar conta
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                label="Nome"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Sobrenome"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                fullWidth
                required
                margin="normal"
              />
            </Box>
            <TextField
              label="E-mail"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Senha"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Confirmar senha"
              type="password"
              value={password2}
              onChange={e => setPassword2(e.target.value)}
              fullWidth
              required
              margin="normal"
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
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
          </form>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Já tem uma conta? <Button variant="text" color="primary" onClick={() => navigate(APP_ROUTES.LOGIN)}>Entrar</Button>
          </Typography>
        </AuthCard>
      </Box>
    </Box>
  )
}