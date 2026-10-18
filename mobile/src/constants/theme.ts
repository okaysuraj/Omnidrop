/**
 * Neo-Brutalist Theme Tokens for Omnidrop Mobile
 */

export const BrutalColors = {
  bg: '#FAFAF8',
  canvas: '#FAFAF8',
  black: '#0A0A0A',
  white: '#FFFFFF',
  yellow: '#FFE600',
  green: '#00E599',
  terminalGreen: '#00E599',
  red: '#FF4800',
  urgentRed: '#FF4800',
  card: '#FFFFFF',
  subtle: '#F4F4F0',
  border: '#0A0A0A',
  muted: '#71717A',
  blue: '#0055FF',
} as const;

export const BrutalShadow = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
} as const;
