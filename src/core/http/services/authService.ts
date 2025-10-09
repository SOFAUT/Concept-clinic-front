import {
  type LoginPayload,
  type RegisterPayload,
  type LoginResponse,
  type RegisterResponse,
  type RefreshTokenPayload,
  type RefreshTokenResponse,
} from "../../../interfaces/authInterfaces";
import { ENDPOINTS } from "../../../util/constants";
import { httpClient } from "../httpClient";
import { mockAuth } from "../../mock/mockAuth";

const API_URL = import.meta.env.VITE_API_URL as string;

// FORÇA o uso do MOCK para desenvolvimento
// Para usar API real, comente a linha abaixo e configure VITE_API_URL
const FORCE_MOCK = true;

const USE_MOCK = FORCE_MOCK || !API_URL || API_URL === '' || API_URL === 'undefined' || API_URL === 'http://localhost:8000' || API_URL === 'https://localhost:8000';

console.log('🔧 Configuração do authService:');
console.log('  API_URL:', API_URL);
console.log('  FORCE_MOCK:', FORCE_MOCK);
console.log('  USE_MOCK:', USE_MOCK);

export const authService = {
  login: async (payload: LoginPayload) => {
    if (USE_MOCK) {
      console.log('🔧 Usando autenticação MOCK para login');
      const data = await mockAuth.login(payload);
      return { status: 200, message: 'Login realizado com sucesso', data };
    }
    console.log('🔧 Usando API real para login');
    return httpClient.post<LoginResponse>(API_URL, ENDPOINTS.AUTH.LOGIN, payload);
  },

  register: async (payload: RegisterPayload) => {
    if (USE_MOCK) {
      console.log('🔧 Usando registro MOCK');
      const data = await mockAuth.register(payload);
      return { status: 201, message: 'Cadastro realizado com sucesso', data };
    }
    console.log('🔧 Usando API real para registro');
    return httpClient.post<RegisterResponse>(
      API_URL,
      ENDPOINTS.AUTH.REGISTER,
      payload
    );
  },

  refreshToken: async (payload: RefreshTokenPayload) => {
    if (USE_MOCK) {
      console.log('🔧 Usando refresh token MOCK');
      const data = await mockAuth.refreshToken(payload.refresh);
      return { status: 200, message: 'Token atualizado', data };
    }
    console.log('🔧 Usando API real para refresh token');
    return httpClient.post<RefreshTokenResponse>(
      API_URL,
      ENDPOINTS.AUTH.REFRESH_TOKEN,
      payload
    );
  },
};
