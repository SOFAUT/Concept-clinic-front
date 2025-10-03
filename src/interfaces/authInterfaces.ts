export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password2: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
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