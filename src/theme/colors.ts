/**
 * IoPet Color System
 * Dark tech theme — purple/violet primary, near-black backgrounds
 */

export const Colors = {
  // --- Backgrounds ---
  background: {
    primary: '#0D0D14',    // Main app background (near black)
    secondary: '#12121C',  // Card backgrounds
    tertiary: '#1A1A2E',   // Elevated surfaces
    overlay: 'rgba(13, 13, 20, 0.85)',
  },

  // --- Surface (cards, inputs, panels) ---
  surface: {
    default: '#1C1C2E',
    elevated: '#22223A',
    glass: 'rgba(28, 28, 46, 0.6)',
    glassBorder: 'rgba(122, 63, 255, 0.2)',
  },

  // --- Primary — Roxo Vibrante ---
  primary: {
    default: '#7A3FFF',    // #7A3FFF — main purple
    light: '#9B6BFF',      // Lighter purple
    dark: '#5A20E0',       // Darker purple
    subtle: 'rgba(122, 63, 255, 0.15)',
    gradient: ['#7A3FFF', '#5A20E0'] as [string, string],
  },

  // --- Secondary — Lilás / Violeta ---
  secondary: {
    default: '#B57CFF',
    light: '#D4ADFF',
    dark: '#8B55DD',
  },

  // --- Accent — Ciano ---
  accent: {
    cyan: '#22D3EE',
    cyanSubtle: 'rgba(34, 211, 238, 0.15)',
    lilac: '#B57CFF',
  },

  // --- Text ---
  text: {
    primary: '#F0EEFF',    // Main white text
    secondary: '#A89DC0',  // Muted text
    tertiary: '#6B5F88',   // Very muted text
    inverse: '#0D0D14',
    link: '#9B6BFF',
  },

  // --- States ---
  state: {
    success: '#22C55E',
    successSubtle: 'rgba(34, 197, 94, 0.15)',
    warning: '#F59E0B',
    warningSubtle: 'rgba(245, 158, 11, 0.15)',
    error: '#EF4444',
    errorSubtle: 'rgba(239, 68, 68, 0.15)',
    offline: '#6B7280',
    offlineSubtle: 'rgba(107, 114, 128, 0.15)',
    info: '#3B82F6',
    infoSubtle: 'rgba(59, 130, 246, 0.15)',
  },

  // --- Device Battery ---
  battery: {
    high: '#22C55E',      // >50%
    medium: '#F59E0B',    // 20-50%
    low: '#EF4444',       // <20%
  },

  // --- Borders ---
  border: {
    default: 'rgba(255, 255, 255, 0.06)',
    subtle: 'rgba(255, 255, 255, 0.03)',
    primary: 'rgba(122, 63, 255, 0.35)',
    bright: 'rgba(122, 63, 255, 0.6)',
  },

  // --- Utility ---
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ColorKey = keyof typeof Colors;
