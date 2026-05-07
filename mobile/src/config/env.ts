/**
 * Environment Configuration
 * Update API_BASE_URL to match your backend deployment.
 * For local dev: use your machine's LAN IP (not localhost) since
 * the emulator/device can't reach localhost on the host machine.
 */

// You can override at runtime with EXPO_PUBLIC_API_BASE_URL
// Examples:
// - Android emulator: http://10.0.2.2:5000
// - iOS simulator:   http://localhost:5000
// - Physical device: http://<YOUR_LAN_IP>:5000
const OVERRIDE = process.env.EXPO_PUBLIC_API_BASE_URL;

// Default to the deployed backend so Expo Go (physical phone) works out of the box.
// If you want local dev, set EXPO_PUBLIC_API_BASE_URL as described above.
const DEV_API_URL = OVERRIDE || 'https://university-event-opportunity-hub.onrender.com';
const PROD_API_URL = OVERRIDE || 'https://university-event-opportunity-hub.onrender.com';

export const ENV = {
  API_BASE_URL: __DEV__ ? DEV_API_URL : PROD_API_URL,
  APP_VERSION: '1.0.0',
  IS_DEV: __DEV__,
} as const;
