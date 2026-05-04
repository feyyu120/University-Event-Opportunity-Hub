/**
 * Environment Configuration
 * Update API_BASE_URL to match your backend deployment.
 * For local dev: use your machine's LAN IP (not localhost) since
 * the emulator/device can't reach localhost on the host machine.
 */

// Expo tunnel / ngrok / LAN IP — change this per environment
const DEV_API_URL = 'http://192.168.1.100:8000/api'; // ← Update this
const PROD_API_URL = 'https://your-domain.com/api';    // ← Update this

export const ENV = {
  API_BASE_URL: __DEV__ ? DEV_API_URL : PROD_API_URL,
  APP_VERSION: '1.0.0',
  IS_DEV: __DEV__,
} as const;
