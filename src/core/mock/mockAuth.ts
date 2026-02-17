// Mock de autenticação para desenvolvimento sem backend
import type {
  LoginPayload,
  LoginClinicPayload,
  RegisterPayload,
  RegisterClinicPayload,
  LoginResponse,
  RegisterResponse,
  User,
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
    phone: '(11) 98765-4321',
    cpf: '123.456.789-00',
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
    } catch {
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
const saveUsers = (users: unknown[]) => {
  localStorage.setItem('mock_users', JSON.stringify(users));
};

// Carrega clínicas cadastradas do localStorage
const loadClinics = (): unknown[] => {
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
const saveClinics = (clinics: unknown[]) => {
  localStorage.setItem(MOCK_CLINICS_KEY, JSON.stringify(clinics));
};

// Converte registro de clínica no formato User (para Redux/sessão)
const clinicToUser = (clinic: unknown): User => {
  const c = clinic as Record<string, unknown>;
  return {
    id: c.id as number,
    first_name: (c.nomeFantasia || c.nomeEmpresa || 'Clínica') as string,
    last_name: (c.nomeEmpresa || '') as string,
    email: /@/.test((c.contato || '') as string) ? (c.contato as string) : `${onlyDigits(c.cnpj as string)}@clinica.local`,
    role: (c.role as string) || 'clinic',
  };
};

export const mockAuth = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    console.log('[mockAuth] Tentando login com:', payload.email);
    await delay(500); // Simula delay de rede

    const users = loadUsers();
    console.log('[mockAuth] Usuários disponíveis:', (users as Array<Record<string, unknown>>).map(u => u.email));
    
    const user = users.find(
      (u: unknown) => {
        const user = u as Record<string, unknown>;
        return user.email === payload.email && user.password === payload.password;
      }
    );

    if (!user) {
      console.error('[mockAuth] Usuário não encontrado ou senha incorreta');
      throw new Error('Email ou senha incorretos');
    }

    // Remove a senha do retorno
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pwd, ...userWithoutPassword } = user;

    const response = {
      access: generateToken(),
      refresh: generateToken(),
      user: userWithoutPassword as User
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
    const clinic = clinics.find((c: unknown) => {
      const clinic = c as Record<string, unknown>;
      return onlyDigits(clinic.cnpj as string) === cnpjDigits && clinic.password === payload.password;
    });
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
    const clinicUser = users.find((u: unknown) => {
      const user = u as Record<string, unknown>;
      return user.role === 'clinic' &&
        user.password === payload.password &&
        (!user.cnpj || onlyDigits(user.cnpj as string) === cnpjDigits);
    });
    if (!clinicUser) {
      throw new Error('CNPJ ou senha incorretos');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, cnpj: _cnpj } = clinicUser as Record<string, unknown>;
    const user: User = {
      id: (clinicUser as Record<string, unknown>).id as number,
      first_name: (clinicUser as Record<string, unknown>).first_name as string,
      last_name: (clinicUser as Record<string, unknown>).last_name as string,
      email: (clinicUser as Record<string, unknown>).email as string,
      role: (clinicUser as Record<string, unknown>).role as string,
    };
    return {
      access: generateToken(),
      refresh: generateToken(),
      user
    };
  },

  async registerClinic(payload: RegisterClinicPayload): Promise<LoginResponse> {
    await delay(500);

    const clinics = loadClinics();
    const cnpjDigits = onlyDigits(payload.cnpj);

    if (clinics.some((c: unknown) => {
      const clinic = c as Record<string, unknown>;
      return onlyDigits(clinic.cnpj as string) === cnpjDigits;
    })) {
      throw new Error('Já existe uma clínica cadastrada com este CNPJ');
    }

    const clinic = {
      id: clinics.length + 1,
      ...payload,
      role: 'clinic'
    };
    clinics.push(clinic);
    saveClinics(clinics);

    const user = clinicToUser(clinic) as unknown as User;
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
    if (users.find((u: unknown) => {
      const user = u as Record<string, unknown>;
      return user.email === payload.email;
    })) {
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
      phone: '',
      cpf: '',
      role: 'patient' // Novos usuários são pacientes por padrão
    };

    users.push(newUser);
    saveUsers(users);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = newUser;

    return {
      ...userWithoutPassword,
      access: generateToken(),
      refresh: generateToken()
    } as RegisterResponse;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async refreshToken(_refresh: string): Promise<{ access: string; refresh: string }> {
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

