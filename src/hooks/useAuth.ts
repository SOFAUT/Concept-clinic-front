// src/hooks/useAuth.ts
import { useState } from 'react'
import { authService } from '../core/http/services/authService'
import { useAuthContext } from '../app/providers/AuthProvider'

export function useAuth() {
  const { setCredentials, logout, accessToken, refreshToken, user } = useAuthContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async ({ email, password }: { email: string; password: string }) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authService.login({ email, password })
      console.log('[useAuth] login response', response)
      if (response && response.data) {
        setCredentials({
          accessToken: response.data.access,
          refreshToken: response.data.refresh,
          user: response.data.user
        })
      } else {
        throw new Error('Resposta inválida do servidor')
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async ({ first_name, last_name, email, password, password2 }: { first_name: string; last_name: string; email: string; password: string; password2: string }) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authService.register({ first_name, last_name, email, password, password2 })
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar')
      throw err
    } finally {
      setLoading(false)
    }
  }
  return {
    login,
    logout,
    register,
    accessToken,
    refreshToken,
    user,
    loading,
    error
  }
}
