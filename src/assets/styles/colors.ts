/**
 * Paleta de Cores do Projeto
 * Organizadas por categoria e propósito
 */

// Cores principais fornecidas pelo usuário
export const BRAND_COLORS = {
  // Cores primárias/destacadas
  PRIMARY: '#171C29',      // Azul escuro principal
  PRIMARY_LIGHT: '#323A50', // Azul escuro mais claro
  SECONDARY: '#BB00E6',    // Roxo (onboarding paciente/clínica)
  
  // Cores de destaque
  ACCENT: '#E2B957',       // Dourado/amarelo
  ACCENT_LIGHT: '#7B8EE4', // Roxo claro
  
  // Cores neutras
  WHITE: '#FFFFFF',        // Branco
  GRAY: '#9E9E9E',         // Cinza médio
  DARK: '#11151F',         // Preto/escuro
} as const;

// Cores funcionais (estados e feedback)
export const FUNCTIONAL_COLORS = {
  // Estados de sucesso/erro
  SUCCESS: '#35C52D',      // Verde
  ERROR: '#E05151',        // Vermelho
  
  // Estados de warning/info
  WARNING: '#E2B957',      // Amarelo (mesmo do accent)
  INFO: '#BB00E6',         // Roxo (mesmo do secondary)
} as const;

// Cores por contexto de uso
export const CONTEXT_COLORS = {
  // Backgrounds
  BACKGROUND: {
    PRIMARY: BRAND_COLORS.WHITE,
    SECONDARY: BRAND_COLORS.PRIMARY_LIGHT,
    DARK: BRAND_COLORS.DARK,
    CARD: BRAND_COLORS.WHITE,
    OVERLAY: 'rgba(23, 28, 41, 0.8)', // PRIMARY com transparência
  },
  
  // Textos
  TEXT: {
    PRIMARY: BRAND_COLORS.DARK,
    SECONDARY: BRAND_COLORS.GRAY,
    WHITE: BRAND_COLORS.WHITE,
    ACCENT: BRAND_COLORS.ACCENT,
    DISABLED: BRAND_COLORS.GRAY,
  },
  
  // Bordas
  BORDER: {
    PRIMARY: BRAND_COLORS.SECONDARY,
    LIGHT: BRAND_COLORS.GRAY,
    ACCENT: BRAND_COLORS.ACCENT,
  },
  
  // Botões
  BUTTON: {
    PRIMARY: BRAND_COLORS.PRIMARY,
    SECONDARY: BRAND_COLORS.SECONDARY,
    ACCENT: BRAND_COLORS.ACCENT,
    SUCCESS: FUNCTIONAL_COLORS.SUCCESS,
    ERROR: FUNCTIONAL_COLORS.ERROR,
  },
} as const;

// Cores para tema escuro (variações)
export const DARK_THEME_COLORS = {
  BACKGROUND: {
    PRIMARY: '#16191E',
    SECONDARY: '#1E232F',
    CARD: '#252D3D',
    OVERLAY: 'rgba(255, 255, 255, 0.08)',
  },
  
  TEXT: {
    PRIMARY: '#E8E8E8',
    SECONDARY: '#9FA3B5',
    WHITE: '#FFFFFF',
    ACCENT: '#D9A84B',
    DISABLED: '#6B7280',
  },
} as const;

// Cores com transparência para overlays, shadows, etc.
export const TRANSPARENT_COLORS = {
  PRIMARY_10: 'rgba(23, 28, 41, 0.1)',
  PRIMARY_20: 'rgba(23, 28, 41, 0.2)',
  PRIMARY_50: 'rgba(23, 28, 41, 0.5)',
  PRIMARY_80: 'rgba(23, 28, 41, 0.8)',
  
  ACCENT_10: 'rgba(226, 185, 87, 0.1)',
  ACCENT_20: 'rgba(226, 185, 87, 0.2)',
  ACCENT_50: 'rgba(226, 185, 87, 0.5)',
  
  WHITE_10: 'rgba(255, 255, 255, 0.1)',
  WHITE_20: 'rgba(255, 255, 255, 0.2)',
  WHITE_50: 'rgba(255, 255, 255, 0.5)',
  
  SUCCESS_10: 'rgba(53, 197, 45, 0.1)',
  ERROR_10: 'rgba(224, 81, 81, 0.1)',
} as const;

// Exportação principal com todas as cores organizadas
export const COLORS = {
  ...BRAND_COLORS,
  ...FUNCTIONAL_COLORS,
  CONTEXT: CONTEXT_COLORS,
  DARK: DARK_THEME_COLORS,
  TRANSPARENT: TRANSPARENT_COLORS,
} as const;

// Tipos TypeScript para as cores
export type BrandColor = keyof typeof BRAND_COLORS;
export type FunctionalColor = keyof typeof FUNCTIONAL_COLORS;
export type ContextColor = keyof typeof CONTEXT_COLORS;

