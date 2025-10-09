# Arquitetura do Sistema de Clínicas Estéticas

## Estrutura do Projeto

```
src/
├── app/                          # Configuração da aplicação
│   ├── providers/               # Providers globais (AuthProvider)
│   └── routes/                  # Configuração de rotas
│
├── components/                  # Componentes
│   ├── common/                  # Componentes compartilhados
│   │   └── RoleBasedRedirect.tsx
│   ├── layout/                  # Layouts (AppLayout, AuthLayout)
│   └── ui/                      # Componentes de UI (Header, Sidebar, etc)
│
├── core/                        # Núcleo da aplicação
│   ├── http/                    # Cliente HTTP
│   │   ├── httpClient.ts
│   │   └── services/            # Serviços de API
│   │       ├── authService.ts
│   │       └── clinicService.ts
│   ├── middleware/              # Middlewares (AuthMiddleware)
│   └── store/                   # Redux Store
│       ├── index.ts
│       ├── hooks.ts
│       └── slices/              # Redux Slices
│           ├── authSlice.ts
│           ├── clinicSlice.ts
│           ├── patientSlice.ts
│           └── appointmentSlice.ts
│
├── pages/                       # Páginas organizadas por perfil
│   ├── authPages/              # Login, Register
│   ├── adminPages/             # Dashboard Admin, Gestão de Clínicas
│   ├── clinicPages/            # Dashboard Clínica, Agendamentos, Pacientes, Procedimentos
│   ├── patientPages/           # Dashboard Paciente, Agendamentos, Perfil
│   └── notFound/               # Página 404
│
├── hooks/                       # Hooks customizados
│   ├── useAuth.ts
│   ├── usePermissions.ts
│   └── useAppointments.ts
│
├── interfaces/                  # Tipos TypeScript
│   ├── authInterfaces.ts
│   └── appointmentInterface.ts
│
├── util/                        # Utilitários e constantes
│   └── constants.ts
│
└── assets/                      # Recursos estáticos
    ├── i18n/                    # Internacionalização
    ├── images/                  # Imagens
    └── styles/                  # Estilos e temas
```

## Arquitetura Simplificada

### **1. Camada de Apresentação** (Pages + Components)
- **Pages**: Páginas organizadas por perfil de usuário (admin, clinic, patient)
- **Components**: Componentes reutilizáveis (UI, Layout, Common)

### **2. Camada de Lógica** (Core)
- **Services**: Comunicação com a API (authService, clinicService, etc)
- **Store**: Gerenciamento de estado global com Redux Toolkit
- **Middleware**: Proteção de rotas e interceptadores

### **3. Camada de Dados** (HTTP Client)
- **httpClient**: Cliente HTTP customizado com interceptadores
- Gerenciamento automático de tokens JWT
- Refresh token automático

## Sistema de Permissões por Perfil

### **Admin**
- Acesso a todas funcionalidades administrativas
- Gestão de clínicas
- Dashboard com métricas gerais

**Rotas:**
- `/admin` - Dashboard
- `/admin/clinics` - Gestão de Clínicas

### **Clinic (Clínica)**
- Gestão completa da clínica
- Agendamentos, pacientes, procedimentos
- Controle financeiro

**Rotas:**
- `/clinic` - Dashboard
- `/clinic/appointments` - Agendamentos
- `/clinic/patients` - Pacientes
- `/clinic/procedures` - Procedimentos
- `/clinic/professionals` - Profissionais (futuro)
- `/clinic/financial` - Financeiro (futuro)

### **Patient (Paciente)**
- Visualização de dados pessoais
- Agendamentos próprios
- Histórico de procedimentos

**Rotas:**
- `/patient` - Dashboard
- `/patient/appointments` - Meus Agendamentos
- `/patient/history` - Histórico
- `/patient/profile` - Perfil

## Fluxo de Autenticação

1. **Login** → authService.login()
2. **Redux** → Armazena user + tokens (access + refresh)
3. **httpClient** → Adiciona token em todas requisições
4. **Token expirado?** → Refresh automático
5. **Refresh falhou?** → Logout automático

## Componentes Principais

### **AppLayout**
- Layout principal com sidebar e header
- Menu dinâmico baseado no role do usuário
- Suporte a tema claro/escuro

### **RoleBasedRedirect**
- Redireciona usuário para dashboard correto baseado no role
- Usado na rota `/` (home)

### **AuthMiddleware**
- Protege rotas privadas
- Verifica se usuário está autenticado
- Redireciona para login se não autenticado

## 🛠️ Tecnologias Utilizadas

- **React 19** + **TypeScript**
- **Redux Toolkit** - Gerenciamento de estado
- **Material-UI v7** - Componentes visuais
- **React Router v7** - Navegação
- **Redux Persist** - Persistência de dados
- **i18next** - Internacionalização
- **Formik + Yup** - Formulários e validação
- **Day.js** - Manipulação de datas

## 📋 Próximos Passos

### **Fase 1 - Estrutura Base** 
- [x] Criar páginas para cada perfil
- [x] Expandir rotas no constants.ts
- [x] Atualizar routes.tsx com novas rotas
- [x] Adaptar AppLayout para múltiplos perfis

### **Fase 2 - Funcionalidades Core** (Próximo)
- [ ] Criar interfaces TypeScript completas
- [ ] Implementar services para cada domínio
- [ ] Criar hooks customizados
- [ ] Implementar CRUDs básicos

### **Fase 3 - Features Específicas**
- [ ] Dashboard com dados reais
- [ ] Sistema de agendamentos completo
- [ ] Gestão de pacientes/profissionais
- [ ] Controle financeiro

### **Fase 4 - Melhorias**
- [ ] Testes automatizados
- [ ] Documentação completa
- [ ] Otimizações de performance
- [ ] Deploy

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## Notas Importantes

1. **O menu do sidebar muda automaticamente** baseado no role do usuário logado
2. **Todas as rotas privadas** estão protegidas pelo AuthMiddleware
3. **O sistema usa Redux Persist** para manter o usuário logado entre sessões
4. **Os tokens são criptografados** antes de serem salvos no localStorage
5. **O refresh token é automático** quando o access token expira

## Configuração

### Variáveis de Ambiente (.env)
```env
VITE_API_URL=http://sua-api.com
VITE_PERSIST_SECRET=sua-chave-secreta-aqui
```

## Documentação Adicional

- [Material-UI](https://mui.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Router](https://reactrouter.com/)
- [i18next](https://www.i18next.com/)

