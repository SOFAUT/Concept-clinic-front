# Sistema de Clínicas Estéticas

> Sistema completo para gestão de clínicas estéticas com múltiplos perfis de usuário, agendamentos, prontuários eletrônicos e controle financeiro.

---

* **Autenticação robusta** com sistema MOCK para desenvolvimento (pronto para migração para API real)
* **Múltiplos perfis de usuário**: Admin, Clínica e Paciente
* **Gestão completa**: agendamentos, pacientes, procedimentos, prontuários
* **Dashboard personalizado** por tipo de usuário
* **Interface responsiva** e moderna
* **Persistência de sessão** com criptografia
* **Internacionalização** (PT-BR)

## Funcionalidades Implementadas

#### **Sistema de Autenticação**
* **Login/Registro** funcionais com sistema MOCK
* **3 perfis de usuário**: Admin, Clínica, Paciente
* **Proteção de rotas** com AuthMiddleware
* **Persistência de sessão** com criptografia
* **Logout** com limpeza de dados

#### **Dashboards por Perfil**

**Admin:**
- Dashboard com métricas gerais
- Gestão de clínicas cadastradas

**Clínica:**
- Dashboard com indicadores da clínica
- Gestão de agendamentos
- Cadastro de pacientes
- Cadastro de procedimentos
- Controle financeiro (em desenvolvimento)

**Paciente:**
- Dashboard pessoal
- Visualização de agendamentos
- Histórico de procedimentos
- Perfil pessoal

#### **Estrutura Técnica**

1. **Autenticação MOCK** (`src/core/mock/mockAuth.ts`):
   - Sistema completo sem necessidade de backend
   - Usuários pré-cadastrados para teste
   - Simulação de delay de rede
   - Fácil migração para API real

2. **Gerenciamento de Estado** (`src/core/store`):
   - Redux Toolkit com slices organizados
   - Persistência criptografada
   - Hooks customizados

3. **Componentes Reutilizáveis**:
   - Layout responsivo com sidebar dinâmica
   - Header com avatar e logout
   - Formulários com validação
   - Cards e componentes UI

4. **Sistema de Rotas**:
   - Rotas protegidas por autenticação
   - Redirecionamento baseado em perfil
   - Estrutura escalável para novas páginas

---

## Tecnologias

* **Front-end:** React 19, TypeScript, Vite
* **UI/UX:** Material-UI v7, React Icons
* **Estado:** Redux Toolkit, Redux Persist
* **Roteamento:** React Router v7
* **Formulários:** Formik + Yup
* **Autenticação:** Sistema MOCK (pronto para API real)
* **Internacionalização:** i18next
* **Persistência:** LocalStorage criptografado

---

## Como executar

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Acesse:** `http://localhost:5100`

4. **Teste o login** com os usuários pré-cadastrados:

   | Perfil | Email | Senha | Dashboard |
   |--------|-------|-------|-----------|
   | **Admin** | admin@admin.com | 123456 | `/admin` |
   | **Clínica** | clinica@clinica.com | 123456 | `/clinic` |
   | **Paciente** | paciente@paciente.com | 123456 | `/patient` |

### 🔧 Página de Teste
Para debug e testes, acesse: `http://localhost:5100/test-login`

---

## Estrutura do Projeto

```
src/
├── app/                    # Configuração da aplicação
│   ├── providers/         # AuthProvider
│   └── routes/           # Configuração de rotas
├── components/           # Componentes reutilizáveis
│   ├── layout/          # AppLayout, AuthLayout
│   ├── ui/              # Header, Sidebar, Cards
│   └── common/          # RoleBasedRedirect
├── core/                # Núcleo da aplicação
│   ├── http/           # Cliente HTTP + Services
│   ├── middleware/     # AuthMiddleware
│   ├── mock/           # Sistema MOCK
│   └── store/          # Redux Store + Slices
├── pages/              # Páginas organizadas por perfil
│   ├── authPages/      # Login, Register
│   ├── adminPages/     # Dashboard Admin
│   ├── clinicPages/    # Dashboard Clínica
│   └── patientPages/   # Dashboard Paciente
├── hooks/              # Hooks customizados
├── interfaces/         # Tipos TypeScript
├── util/               # Constantes e utilitários
└── assets/             # Estilos, i18n, imagens
```

---

## Migração para API Real

1. **Configure a API:**
   ```env
   VITE_API_URL=https://sua-api.com
   VITE_PERSIST_SECRET=sua-chave-secreta
   ```

2. **Desative o MOCK:**
   Em `src/core/http/services/authService.ts`, mude:
   ```typescript
   const FORCE_MOCK = false; // era true
   ```

---

## Build para Produção

```bash
npm run build
```

O resultado ficará na pasta `dist/`.

---

## Status do Projeto

- **Sistema de Autenticação** - 100% funcional
- **Dashboards por Perfil** - Implementados
- **Rotas Protegidas** - Ativas
- **Interface Responsiva** - Completa
- **Sistema de Agendamentos** - Em desenvolvimento
- **Prontuário Eletrônico** - Planejado
- **Controle Financeiro** - Planejado

---

pages/
│
├── authPages/                    [Páginas de Autenticação]
│   ├── Login.tsx                    → Formulário de login
│   └── Register.tsx                 → Formulário de registro
│
├── adminPages/                   [Páginas do Administrador]
│   ├── Dashboard.tsx                → Métricas gerais
│   └── ClinicsManagement.tsx        → Gestão de clínicas
│
├── clinicPages/                  [Páginas da Clínica]
│   ├── Dashboard.tsx                → Dashboard da clínica
│   ├── Appointments.tsx             → Gestão de agendamentos
│   ├── Patients.tsx                 → Gestão de pacientes
│   └── Procedures.tsx               → Gestão de procedimentos
│
├── patientPages/                 [Páginas do Paciente]
│   ├── Dashboard.tsx                → Dashboard pessoal
│   ├── MyAppointments.tsx           → Meus agendamentos
│   └── Profile.tsx                  → Perfil do usuário
│
└── notFound/
    └── NotFound.tsx                 → Página 404

## Licença

Este projeto está licenciado sob a [MIT License](https://opensource.org/licenses/MIT).
