/**
 * Responsive Utility
 * Normalizes font sizes, spacing, and layout values across all screen sizes.
 * Uses React Native's built-in PixelRatio + Dimensions (no extra packages needed).
 *
 * Design baseline: iPhone 14 / Pixel 6 = 390 × 844 dp
 */

import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Design baseline dimensions
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

/**
 * nf(size) — Normalize Font size
 * Scales fontSize relative to the 390px design baseline using PixelRatio.
 * Caps the scale factor to prevent text becoming too large on big screens.
 */
export function nf(size: number): number {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  // Allow slight upscale on tablets, prevent runaway growth
  const clamped = Math.min(newSize, size * 1.25);
  return Math.round(PixelRatio.roundToNearestPixel(clamped));
}

/**
 * wp(percent) — Width Percentage to DP
 * Returns dp value for a given percentage of screen width.
 */
export function wp(percent: number): number {
  return (SCREEN_WIDTH * percent) / 100;
}

/**
 * hp(percent) — Height Percentage to DP
 * Returns dp value for a given percentage of screen height.
 */
export function hp(percent: number): number {
  return (SCREEN_HEIGHT * percent) / 100;
}

/**
 * vs(size) — Vertical Scale
 * Scales spacing/height values relative to the 844px baseline height.
 */
export function vs(size: number): number {
  const scale = SCREEN_HEIGHT / BASE_HEIGHT;
  const clamped = Math.min(scale, 1.2); // never scale up more than 20%
  return Math.round(size * clamped);
}

/**
 * hs(size) — Horizontal Scale
 * Scales horizontal spacing relative to 390px baseline width.
 */
export function hs(size: number): number {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const clamped = Math.min(scale, 1.2);
  return Math.round(size * clamped);
}

/**
 * ms(size, factor?) — Moderate Scale
 * Scales with a dampening factor (default 0.5) to avoid excessive growth.
 * Best for padding and margin values.
 */
export function ms(size: number, factor = 0.5): number {
  return Math.round(size + (hs(size) - size) * factor);
}

// Export screen dimensions for convenience
export const SCREEN = {
  WIDTH: SCREEN_WIDTH,
  HEIGHT: SCREEN_HEIGHT,
  IS_SMALL: SCREEN_WIDTH < 375,   // iPhone SE etc.
  IS_LARGE: SCREEN_WIDTH >= 414,  // Pro Max, Plus, large Android
  IS_TABLET: SCREEN_WIDTH >= 768,
};
