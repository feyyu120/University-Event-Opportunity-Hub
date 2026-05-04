/**
 * Auth API — Matches the existing PHP backend endpoints:
 *   POST /auth/login.php    { email, password }  → { message, user }
 *   POST /auth/register.php { ... }              → { message, user }
 *   POST /auth/logout.php                        → { message }
 */

import { apiClient } from './client';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number;
  full_name: string;
  email: string;
  role: string;
  university: string;
  department: string;
  year: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  university_id?: number;
  department?: string;
  year?: string;
}

export interface AuthResponse {
  message: string;
  user: AuthUser;
  token?: string; // Include if backend adds JWT later
}

// ─── Endpoints ────────────────────────────────────────────────────────────────

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<AuthResponse>('auth/login.php', payload),

  register: (payload: RegisterPayload) =>
    apiClient.post<AuthResponse>('auth/register.php', payload),

  logout: () =>
    apiClient.post<{ message: string }>('auth/logout.php', {}),

  checkAuthorization: () =>
    apiClient.get<{ authorized: boolean; user?: AuthUser }>('auth/check_autorization.php'),
};
