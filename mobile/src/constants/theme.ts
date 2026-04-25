/**
 * Enterprise Level Design System
 * Focus on: Professionalism, High-Density, and Immersive Clarity.
 */

import '@/global.css';
import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0F172A',        // Slate 900
    textSecondary: '#475569', // Slate 600
    background: '#F1F5F9',    // Slate 100
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#E2E8F0', // Slate 200
    primary: '#4F46E5',       // Indigo 600
    secondary: '#7C3AED',     // Violet 600
    accent: '#E11D48',        // Rose 600
    success: '#059669',       // Emerald 600
    border: '#CBD5E1',        // Slate 300
    glass: 'rgba(255, 255, 255, 0.8)',
    glassBorder: 'rgba(255, 255, 255, 0.5)',
    shadow: 'rgba(15, 23, 42, 0.12)',
  },
  dark: {
    text: '#F8FAFC',        // Slate 50
    textSecondary: '#94A3B8', // Slate 400
    background: '#020617',    // Slate 950 (Deeper for better contrast)
    backgroundElement: '#0F172A', // Slate 900
    backgroundSelected: '#1E293B', // Slate 800
    primary: '#6366F1',       // Indigo 500
    secondary: '#8B5CF6',     // Violet 500
    accent: '#F43F5E',        // Rose 500
    success: '#10B981',       // Emerald 500
    border: '#1E293B',        // Slate 800
    glass: 'rgba(15, 23, 42, 0.8)',
    glassBorder: 'rgba(255, 255, 255, 0.08)',
    shadow: 'rgba(0, 0, 0, 0.5)',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Spacing = {
  half: 4,
  one: 8,
  two: 12,
  three: 16,
  four: 24,
  five: 32,
  six: 48,
  eight: 64,
} as const;

export const Radius = {
  small: 6,
  medium: 10,
  large: 16,
  xl: 24,
  full: 9999,
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

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
