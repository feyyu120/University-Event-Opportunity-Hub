/**
 * API Client — Typed, centralized fetch wrapper.
 * - Attaches Authorization header from stored token automatically
 * - Normalizes errors into a single ApiError shape
 * - Returns typed responses via generic parameter
 */

import * as SecureStore from 'expo-secure-store';
import { ENV } from '@/config/env';

export const TOKEN_KEY = 'steam_auth_token';
export const USER_KEY  = 'steam_user_data';

// ─── Error Shape ──────────────────────────────────────────────────────────────

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// ─── Core Fetch Wrapper ───────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${ENV.API_BASE_URL}/${path}`, {
      ...options,
      headers,
    });
  } catch (networkError) {
    throw new ApiError('Network error — check your connection.', 0);
  }

  // Parse body regardless of status for error messages
  let body: any;
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    body = await response.json();
  } else {
    body = await response.text();
  }

  if (!response.ok) {
    const message =
      (typeof body === 'object' && body?.error) ||
      (typeof body === 'string' && body) ||
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status);
  }

  return body as T;
}

// ─── Convenience Methods ──────────────────────────────────────────────────────

export const apiClient = {
  get: <T>(path: string) =>
    request<T>(path, { method: 'GET' }),

  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),

  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),

  delete: <T>(path: string) =>
    request<T>(path, { method: 'DELETE' }),
};
