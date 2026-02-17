export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginClinicPayload {
  cnpj: string;
  password: string;
}

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password2: string;
}

/** Payload do cadastro de clínica (formulário RegisterClinic) */
export interface RegisterClinicPayload {
  cnpj: string;
  dataAbertura: string;
  tipo: string;
  nomeFantasia: string;
  nomeEmpresa: string;
  atividadePrincipal: string;
  atividadeSecundaria: string;
  endereco: string;
  numero: string;
  complemento: string;
  cep: string;
  bairro: string;
  municipio: string;
  uf: string;
  situacao: string;
  contato: string;
  telefone: string;
  password: string;
}

/** Resposta do cadastro de clínica (login automático após cadastro) */
export interface RegisterClinicResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  phone?: string;
  cpf?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RegisterResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  access: string;
  refresh: string;
}

export interface RefreshTokenPayload {
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
  refresh: string;
}
