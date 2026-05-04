/**
 * Environment Configuration
 * Update API_BASE_URL to match your backend deployment.
 * For local dev: use your machine's LAN IP (not localhost) since
 * the emulator/device can't reach localhost on the host machine.
 */

// Expo tunnel / ngrok / LAN IP — change this per environment
const DEV_API_URL = 'https://astu-event-center-backend.onrender.com';
const PROD_API_URL = 'https://astu-event-center-backend.onrender.com';

export const ENV = {
  API_BASE_URL: __DEV__ ? DEV_API_URL : PROD_API_URL,
  APP_VERSION: '1.0.0',
  IS_DEV: __DEV__,
} as const;
