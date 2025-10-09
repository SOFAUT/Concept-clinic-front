// Mock de autenticação para desenvolvimento sem backend
import type { LoginPayload, RegisterPayload, LoginResponse, RegisterResponse } from '../../interfaces/authInterfaces';

// Usuários mock para teste
const MOCK_USERS = [
  {
    id: 1,
    first_name: 'Admin',
    last_name: 'Sistema',
    email: 'admin@admin.com',
    password: '123456',
    role: 'admin'
  },
  {
    id: 2,
    first_name: 'Clínica',
    last_name: 'Teste',
    email: 'clinica@clinica.com',
    password: '123456',
    role: 'clinic'
  },
  {
    id: 3,
    first_name: 'Paciente',
    last_name: 'Teste',
    email: 'paciente@paciente.com',
    password: '123456',
    role: 'patient'
  }
];

// Simula delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Gera token fake
const generateToken = () => {
  return 'mock_token_' + Math.random().toString(36).substring(2, 15);
};

// Carrega usuários do localStorage (para persistir registros)
const loadUsers = () => {
  const stored = localStorage.getItem('mock_users');
  console.log('[loadUsers] localStorage mock_users:', stored);
  
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      console.log('[loadUsers] Usuários carregados do localStorage:', parsed.length);
      return parsed;
    } catch (error) {
      console.warn('[loadUsers] Erro ao parsear localStorage, usando padrão');
      // Salva os usuários padrão no localStorage
      saveUsers(MOCK_USERS);
      return [...MOCK_USERS];
    }
  }
  
  // Se não existe no localStorage, cria com usuários padrão
  console.log('[loadUsers] localStorage vazio, criando usuários padrão');
  saveUsers(MOCK_USERS);
  return [...MOCK_USERS];
};

// Salva usuários no localStorage
const saveUsers = (users: any[]) => {
  localStorage.setItem('mock_users', JSON.stringify(users));
};

export const mockAuth = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    console.log('[mockAuth] Tentando login com:', payload.email);
    await delay(500); // Simula delay de rede

    const users = loadUsers();
    console.log('[mockAuth] Usuários disponíveis:', users.map(u => u.email));
    
    const user = users.find(
      (u: any) => u.email === payload.email && u.password === payload.password
    );

    if (!user) {
      console.error('[mockAuth] Usuário não encontrado ou senha incorreta');
      throw new Error('Email ou senha incorretos');
    }

    // Remove a senha do retorno
    const { password, ...userWithoutPassword } = user;

    const response = {
      access: generateToken(),
      refresh: generateToken(),
      user: userWithoutPassword
    };
    
    console.log('[mockAuth] Login bem-sucedido! Retornando:', response);
    return response;
  },

  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    await delay(500);

    const users = loadUsers();
    
    // Verifica se email já existe
    if (users.find((u: any) => u.email === payload.email)) {
      throw new Error('Email já cadastrado');
    }

    // Verifica se senhas coincidem
    if (payload.password !== payload.password2) {
      throw new Error('As senhas não coincidem');
    }

    // Cria novo usuário (por padrão como paciente)
    const newUser = {
      id: users.length + 1,
      first_name: payload.first_name,
      last_name: payload.last_name,
      email: payload.email,
      password: payload.password,
      role: 'patient' // Novos usuários são pacientes por padrão
    };

    users.push(newUser);
    saveUsers(users);

    const { password, ...userWithoutPassword } = newUser;

    return {
      ...userWithoutPassword,
      access: generateToken(),
      refresh: generateToken()
    };
  },

  async refreshToken(refresh: string): Promise<{ access: string; refresh: string }> {
    await delay(300);
    
    return {
      access: generateToken(),
      refresh: generateToken()
    };
  }
};

// Função helper para limpar dados mock (útil para testes)
export const resetMockData = () => {
  localStorage.removeItem('mock_users');
  console.log('✅ Dados mock resetados. Usuários padrão restaurados.');
  // Recarrega a página para reinicializar
  setTimeout(() => window.location.reload(), 100);
};

// Função para forçar inicialização dos usuários
export const initMockUsers = () => {
  console.log('🔧 Forçando inicialização dos usuários mock...');
  saveUsers(MOCK_USERS);
  console.log('✅ Usuários mock inicializados no localStorage');
  return MOCK_USERS;
};

// Log dos usuários disponíveis para facilitar testes
console.log('🔐 Sistema de autenticação MOCK ativado!');

// Inicializa usuários no localStorage se necessário
const initUsers = loadUsers();
console.log('📝 Usuários disponíveis para teste:', initUsers.length);
console.log('   Admin: admin@admin.com / 123456');
console.log('   Clínica: clinica@clinica.com / 123456');
console.log('   Paciente: paciente@paciente.com / 123456');

