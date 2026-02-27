import { t } from "i18next";

// Exporta as cores para uso em toda a aplicação
export { COLORS } from "../assets/styles/colors";

export const CACHE_CONFIG = {
  DEFAULT_TTL: 300000, // 5 minutos
  AUTH_CACHE_KEY: "auth_cache",
  USER_DATA_KEY: "user_data",
};

export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
  CNPJ: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
  CELLPHONE: /^(\d{0,2})(\d{0,5})(\d{0,4})$/,
  CEP: /^\d{5}-\d{3}$/,
  /** Telefone: (00) 00000-0000 ou (00) 0000-0000 */
  TELEFONE: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
};

export const APP_ROUTES = {
  NOTFOUND: "*",
  HOME: "/",
  LOGIN: "/login",
  LOGIN_CLINIC: "/login-clinic",
  REGISTER: "/register",
  REGISTER_CLINIC: "/register-clinic",

  ADMIN: {
    DASHBOARD: "/admin",
    CLINICS: "/admin/clinics",
  },
  
  CLINIC: {
    DASHBOARD: "/clinic",
    APPOINTMENTS: "/clinic/appointments",
    PATIENTS: "/clinic/patients",
    PROCEDURES: "/clinic/procedures",
    PROFESSIONALS: "/clinic/professionals",
    FINANCIAL: "/clinic/financial",
  },
  
  PATIENT: {
    LANDING: "/patient/welcome",
    DASHBOARD: "/patient",
    APPOINTMENTS: "/patient/appointments",
    HISTORY: "/patient/history",
    PAYMENTS: "/patient/payments",
    PROFILE: "/patient/profile",
    LOCATION: "/patient/location",
    CARDS: "/patient/cards",
  },
};

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login/",
    LOGIN_CLINIC: "/auth/login-clinic/",
    OTP_VERIFY: "/auth/otp-verify/",
    RECOVERY: "/auth/recovery/",
    REGISTER: "/auth/register/",
    REGISTER_CLINIC: "/auth/register-clinic/",
    RESET_PASSWORD: "/auth/reset-password/",
    REFRESH_TOKEN: "/auth/refresh/",
  },
  CRM: {
    CLIENTS: "/crm/clientes/",
    DOCUMENTS: "/crm/documentos/",
    ACCESS: "/crm/acessos/",
  },
  LICENSE: "/license/",
};

export const getTableConfig = () => ({
  initialState: {
    pagination: { paginationModel: { pageSize: 5 } },
  },
  pageSizeOptions: [5, 10, 25],
  localeText: {
    columnMenuSortAsc: t("table.columnMenuSortAsc"),
    columnMenuSortDesc: t("table.columnMenuSortDesc"),
    columnMenuFilter: t("table.columnMenuFilter"),
    columnMenuHideColumn: t("table.columnMenuHideColumn"),
    columnMenuShowColumns: t("table.columnMenuShowColumns"),
    columnMenuUnsort: t("table.columnMenuUnsort"),
    columnMenuManageColumns: t("table.columnMenuManageColumns"),
    filterPanelAddFilter: t("table.filterPanelAddFilter"),
    filterPanelRemoveAll: t("table.filterPanelRemoveAll"),
    filterPanelDeleteIconLabel: t("table.filterPanelDeleteIconLabel"),
    filterPanelLogicOperator: t("table.filterPanelLogicOperator"),
    filterPanelOperator: t("table.filterPanelOperator"),
    filterPanelOperatorAnd: t("table.filterPanelOperatorAnd"),
    filterPanelOperatorOr: t("table.filterPanelOperatorOr"),
    filterPanelColumns: t("table.filterPanelColumns"),
    filterPanelInputLabel: t("table.filterPanelInputLabel"),
    filterPanelInputPlaceholder: t("table.filterPanelInputPlaceholder"),
    filterOperatorContains: t("table.filterOperatorContains"),
    filterOperatorEquals: t("table.filterOperatorEquals"),
    filterOperatorStartsWith: t("table.filterOperatorStartsWith"),
    filterOperatorEndsWith: t("table.filterOperatorEndsWith"),
    filterOperatorIsEmpty: t("table.filterOperatorIsEmpty"),
    filterOperatorIsNotEmpty: t("table.filterOperatorIsNotEmpty"),
    filterOperatorIsAnyOf: t("table.filterOperatorIsAnyOf"),
    filterOperatorDoesNotContain: t("table.filterOperatorDoesNotContain"),
    filterOperatorDoesNotEqual: t("table.filterOperatorDoesNotEqual"),
  },
});
