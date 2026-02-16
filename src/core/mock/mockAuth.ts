// Mock de autenticação para desenvolvimento sem backend
import type {
  LoginPayload,
  LoginClinicPayload,
  RegisterPayload,
  RegisterClinicPayload,
  LoginResponse,
  RegisterResponse,
} from '../../interfaces/authInterfaces';

const onlyDigits = (s: string) => s.replace(/\D/g, '');

const MOCK_CLINICS_KEY = 'mock_clinics';

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
    cnpj: '12345678000190', // CNPJ para login clínica (sem formatação)
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

// Carrega clínicas cadastradas do localStorage
const loadClinics = (): any[] => {
  const stored = localStorage.getItem(MOCK_CLINICS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
};

// Salva clínicas no localStorage
const saveClinics = (clinics: any[]) => {
  localStorage.setItem(MOCK_CLINICS_KEY, JSON.stringify(clinics));
};

// Converte registro de clínica no formato User (para Redux/sessão)
const clinicToUser = (clinic: any) => ({
  id: clinic.id,
  first_name: clinic.nomeFantasia || clinic.nomeEmpresa || 'Clínica',
  last_name: clinic.nomeEmpresa || '',
  email: /@/.test(clinic.contato || '') ? clinic.contato : `${onlyDigits(clinic.cnpj)}@clinica.local`,
  role: 'clinic'
});

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

  async loginClinic(payload: LoginClinicPayload): Promise<LoginResponse> {
    console.log('[mockAuth] Tentando login clínica com CNPJ');
    await delay(500);

    const cnpjDigits = onlyDigits(payload.cnpj);

    // 1) Tenta clínicas cadastradas no localStorage (mock_clinics)
    const clinics = loadClinics();
    const clinic = clinics.find(
      (c: any) => onlyDigits(c.cnpj) === cnpjDigits && c.password === payload.password
    );
    if (clinic) {
      const user = clinicToUser(clinic);
      return {
        access: generateToken(),
        refresh: generateToken(),
        user
      };
    }

    // 2) Fallback: usuários mock (clínica de teste)
    const users = loadUsers();
    const clinicUser = users.find(
      (u: any) =>
        u.role === 'clinic' &&
        u.password === payload.password &&
        (!u.cnpj || onlyDigits(u.cnpj) === cnpjDigits)
    );
    if (!clinicUser) {
      throw new Error('CNPJ ou senha incorretos');
    }
    const { password: _p, cnpj: _c, ...userWithoutSensitive } = clinicUser;
    return {
      access: generateToken(),
      refresh: generateToken(),
      user: userWithoutSensitive
    };
  },

  async registerClinic(payload: RegisterClinicPayload): Promise<LoginResponse> {
    await delay(500);

    const clinics = loadClinics();
    const cnpjDigits = onlyDigits(payload.cnpj);

    if (clinics.some((c: any) => onlyDigits(c.cnpj) === cnpjDigits)) {
      throw new Error('Já existe uma clínica cadastrada com este CNPJ');
    }

    const clinic = {
      id: clinics.length + 1,
      ...payload,
      role: 'clinic'
    };
    clinics.push(clinic);
    saveClinics(clinics);

    const user = clinicToUser(clinic);
    return {
      access: generateToken(),
      refresh: generateToken(),
      user
    };
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
  localStorage.removeItem(MOCK_CLINICS_KEY);
  console.log('✅ Dados mock resetados. Usuários e clínicas restaurados.');
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
console.log('   Clínica (e-mail): clinica@clinica.com / 123456');
console.log('   Clínica (CNPJ): 12.345.678/0001-90 / 123456');
console.log('   Paciente: paciente@paciente.com / 123456');

