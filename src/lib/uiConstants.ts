// Constantes centralizadas para la UI de Digitadist
// Evita repetición y garantiza consistencia

export const UI_COLORS = {
  primary: '#DC2626', // red-600
  primaryHover: '#B91C1C', // red-700
  secondary: '#171717', // neutral-900
  background: '#F9FAFB', // neutral-50
  surface: '#FFFFFF', // white
  borderColor: '#E5E7EB', // neutral-200
  textPrimary: '#171717', // neutral-900
  textSecondary: '#4B5563', // neutral-600
  textTertiary: '#6B7280', // neutral-500
  success: '#10B981', // emerald-500
  warning: '#F59E0B', // amber-500
  error: '#EF4444', // red-500
  disabled: '#9CA3AF', // neutral-400
};

export const TYPOGRAPHY = {
  heading1: {
    size: '32px', // 2xl
    weight: 700,
    lineHeight: '1.2',
  },
  heading2: {
    size: '24px', // xl
    weight: 700,
    lineHeight: '1.25',
  },
  heading3: {
    size: '20px', // lg
    weight: 600,
    lineHeight: '1.3',
  },
  body: {
    size: '14px', // base
    weight: 400,
    lineHeight: '1.5',
  },
  bodySmall: {
    size: '12px', // sm
    weight: 400,
    lineHeight: '1.4',
  },
  label: {
    size: '14px',
    weight: 500,
    lineHeight: '1.4',
  },
};

export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  xxl: '24px',
  xxxl: '32px',
};

export const TRANSITIONS = {
  duration: '150ms',
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)', // ease-in-out
  fast: '100ms',
  slow: '300ms',
};

export const BORDER_RADIUS = {
  none: '0px',
  sm: '4px',
  md: '6px',
  lg: '8px',
  full: '9999px',
};

export const SHADOWS = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
};

// Breakpoints
export const BREAKPOINTS = {
  mobile: '640px',
  tablet: '768px',
  desktop: '1024px',
  widescreen: '1280px',
};

// Z-index scale
export const Z_INDEX = {
  dropdown: '50',
  sticky: '40',
  fixed: '30',
  modal: '50',
  popover: '40',
  tooltip: '30',
};

// Clase CSS comunes para reutilizar
export const COMMON_CLASSES = {
  // Contenedores
  pageContainer: 'w-full h-full px-6 py-6 md:px-8 md:py-8',
  section: 'space-y-4 md:space-y-6',
  
  // Tipografía
  headingPage: 'text-3xl font-bold text-neutral-900 tracking-tight',
  headingSection: 'text-xl font-semibold text-neutral-900',
  bodyText: 'text-sm text-neutral-700 leading-relaxed',
  
  // Transiciones estándar
  transition: 'transition-all duration-150 ease-in-out',
  hoverScale: 'hover:scale-105 transition-transform duration-150 ease-in-out',
  
  // Tabla
  tableHeader: 'bg-red-600 text-white font-semibold',
  tableRow: 'h-11 border-b border-neutral-200 hover:bg-neutral-50 transition-colors duration-150',
  tableCell: 'px-4 py-2 text-sm text-neutral-900',
};
