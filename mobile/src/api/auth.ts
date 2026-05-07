/**
 * Auth API — backend2 (Express) endpoints:
 *   POST /auth/login        { email, password }                  → { success, token, user }
 *   POST /auth/register     { email, password, full_name, role } → { success, token, user }
 *   POST /auth/logout                                           → { success, message }
 */

import { apiClient } from './client';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  full_name: string;
  email: string;
  role: string;
  university?: string;
  department?: string;
  year?: string;
  bio?: string;
  profile_image?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: AuthUser;
  token: string;
}

// ─── Endpoints ────────────────────────────────────────────────────────────────

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<AuthResponse>('auth/login', payload),

  register: (payload: RegisterPayload) =>
    apiClient.post<AuthResponse>('auth/register', payload),

  logout: () =>
    apiClient.post<{ success: boolean; message: string }>('auth/logout', {}),
};
