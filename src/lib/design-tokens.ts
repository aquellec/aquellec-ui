/** Brand and AI palette shared by components and the Tailwind preset. */
export const aquellecColors = {
  brand: {
    50: '#f0f7ff',
    100: '#e0effe',
    500: '#0066ff',
    600: '#0052cc',
    700: '#003d99',
  },
  ai: {
    50: '#f5f3ff',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
  },
  semantic: {
    muted: '#64748b',
    subtle: '#475569',
    success: {
      fg: '#047857',
      bg: '#ecfdf5',
      border: '#a7f3d0',
      surface: '#ecfdf5',
    },
    error: {
      fg: '#be123c',
      bg: '#fff1f2',
      border: '#fecdd3',
      surface: '#fff1f2',
    },
    warning: {
      fg: '#b45309',
      bg: '#fffbeb',
      border: '#fde68a',
      surface: '#fffbeb',
    },
    info: {
      fg: '#1d4ed8',
      bg: '#eff6ff',
      border: '#bfdbfe',
      surface: '#eff6ff',
    },
  },
} as const;

export type AquellecColors = typeof aquellecColors;

/** Shared radius and elevation tokens used across card and overlay surfaces. */
export const aquellecThemeExtensions = {
  borderRadius: {
    xl: '0.75rem',
    '2xl': '1rem',
  },
  boxShadow: {
    card: '0 1px 3px 0 rgb(15 23 42 / 0.08), 0 1px 2px -1px rgb(15 23 42 / 0.08)',
    overlay: '0 20px 25px -5px rgb(15 23 42 / 0.1), 0 8px 10px -6px rgb(15 23 42 / 0.1)',
  },
} as const;
