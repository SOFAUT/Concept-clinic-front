// src/hooks/useAuth.ts
import { useState } from 'react'
import { authService } from '../core/http/services/authService'
import { useAuthContext } from '../app/providers/AuthProvider'
import type { RegisterClinicPayload } from '../interfaces/authInterfaces'

export function useAuth() {
  const { setCredentials, logout, accessToken, refreshToken, user } = useAuthContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async ({ email, password }: { email: string; password: string }) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authService.login({ email, password })
      
      if (response?.data?.access && response?.data?.refresh && response?.data?.user) {

        setCredentials({
          accessToken: response.data.access,
          refreshToken: response.data.refresh,
          user: response.data.user
        })
        return response.data.user
      } else {
        console.error('[useAuth] Resposta inválida:', response)
        throw new Error('Resposta inválida do servidor')
      }
    } catch (err: unknown) {
      console.error('[useAuth] Erro no login:', err)
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login';
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const loginClinic = async ({ cnpj, password }: { cnpj: string; password: string }) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authService.loginClinic({ cnpj, password })
      if (response?.data?.access && response?.data?.refresh && response?.data?.user) {
        setCredentials({
          accessToken: response.data.access,
          refreshToken: response.data.refresh,
          user: response.data.user
        })
        return response.data.user
      } else {
        throw new Error('Resposta inválida do servidor')
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login';
      setError(errorMessage)
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
      
      // Após registrar com sucesso, faz login automático
      if (response && response.data) {
        const userData = {
          id: response.data.id,
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          email: response.data.email,
          role: response.data.role
        }
        setCredentials({
          accessToken: response.data.access,
          refreshToken: response.data.refresh,
          user: userData
        })
        return userData
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao cadastrar';
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const registerClinic = async (payload: RegisterClinicPayload) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authService.registerClinic(payload)
      if (response?.data?.access && response?.data?.refresh && response?.data?.user) {
        setCredentials({
          accessToken: response.data.access,
          refreshToken: response.data.refresh,
          user: response.data.user
        })
        return response.data.user
      } else {
        throw new Error('Respos inválida do servidor')
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao cadastrar clínica';
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    login,
    loginClinic,
    logout,
    register,
    registerClinic,
    accessToken,
    refreshToken,
    user,
    loading,
    error
  }
}
