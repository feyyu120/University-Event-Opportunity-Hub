/**
 * Enterprise Level Design System
 * Focus on: Professionalism, High-Density, and Immersive Clarity.
 * All spacing, radius, and typography values are responsive via utility helpers.
 */

import '@/global.css';
import { Platform } from 'react-native';
import { nf, ms, vs } from '@/utils/responsive';

export const Colors = {
  light: {
    text: '#0F172A',
    textSecondary: '#475569',
    background: '#F1F5F9',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#E2E8F0',
    primary: '#4F46E5',
    secondary: '#7C3AED',
    accent: '#E11D48',
    success: '#059669',
    border: '#CBD5E1',
    glass: 'rgba(255, 255, 255, 0.8)',
    glassBorder: 'rgba(255, 255, 255, 0.5)',
    shadow: 'rgba(15, 23, 42, 0.12)',
  },
  dark: {
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    background: '#020617',
    backgroundElement: '#0F172A',
    backgroundSelected: '#1E293B',
    primary: '#6366F1',
    secondary: '#8B5CF6',
    accent: '#F43F5E',
    success: '#10B981',
    border: '#1E293B',
    glass: 'rgba(15, 23, 42, 0.8)',
    glassBorder: 'rgba(255, 255, 255, 0.08)',
    shadow: 'rgba(0, 0, 0, 0.5)',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

// Responsive Spacing — uses moderate scale so it grows gently with screen size
export const Spacing = {
  half: ms(4),
  one:  ms(8),
  two:  ms(12),
  three: ms(16),
  four: ms(24),
  five: ms(32),
  six:  ms(48),
  eight: ms(64),
} as const;

// Responsive Radius — moderate scale
export const Radius = {
  small:  ms(6),
  medium: ms(10),
  large:  ms(16),
  xl:     ms(24),
  full: 9999,
} as const;

// Responsive Typography — normalized font sizes
export const Typography = {
  xs:       nf(10),
  caption:  nf(12),
  small:    nf(13),
  body:     nf(15),
  default:  nf(16),
  label:    nf(12),
  subtitle: nf(18),
  h3:       nf(20),
  h2:       nf(24),
  title:    nf(28),
  h1:       nf(36),
  display:  nf(40),
} as const;

export const Shadows = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  premium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 12,
  },
} as const;

export const BottomTabInset = Platform.select({ ios: vs(50), android: vs(80) }) ?? 0;
export const MaxContentWidth = 800;
