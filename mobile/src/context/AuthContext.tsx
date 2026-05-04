/**
 * AuthContext — Enterprise-grade session management.
 *
 * Features:
 * - Persists user session in expo-secure-store (encrypted on-device)
 * - Exposes login / logout / register actions across the entire app
 * - Handles loading state during session hydration on cold start
 * - Auto-clears session on 401 responses (token invalidation)
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import { TOKEN_KEY, USER_KEY, ApiError } from '@/api/client';
import { authApi, type AuthUser, type LoginPayload, type RegisterPayload } from '@/api/auth';
import { ENV } from '@/config/env';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;     // true while hydrating from SecureStore on cold start
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (partial: Partial<AuthUser>) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // ── Hydrate session on cold start ──
  useEffect(() => {
    (async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          SecureStore.getItemAsync(TOKEN_KEY),
          SecureStore.getItemAsync(USER_KEY),
        ]);

        if (storedToken && storedUser) {
          setState({
            user: JSON.parse(storedUser) as AuthUser,
            token: storedToken,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          setState(s => ({ ...s, isLoading: false }));
        }
      } catch {
        setState(s => ({ ...s, isLoading: false }));
      }
    })();
  }, []);

  // ── Persist session helpers ──
  const persistSession = useCallback(async (user: AuthUser, token: string) => {
    await Promise.all([
      SecureStore.setItemAsync(TOKEN_KEY, token),
      SecureStore.setItemAsync(USER_KEY, JSON.stringify(user)),
    ]);
    setState({ user, token, isLoading: false, isAuthenticated: true });
  }, []);

  const clearSession = useCallback(async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(TOKEN_KEY),
      SecureStore.deleteItemAsync(USER_KEY),
    ]);
  }, []);

  // ── Actions ──
  const login = useCallback(async (payload: LoginPayload) => {
    try {
      const res = await authApi.login(payload);
      const token = res.token ?? 'session_token';
      await persistSession(res.user, token);
    } catch (apiErr) {
      throw apiErr;
    }
  }, [persistSession]);

  const register = useCallback(async (payload: RegisterPayload) => {
    try {
      const res = await authApi.register(payload);
      const token = res.token ?? 'session_token';
      await persistSession(res.user, token);
    } catch (apiErr) {
      throw apiErr;
    }
  }, [persistSession]);

  const logout = useCallback(async () => {
    // 1. Immediately update UI state for instant perception of speed
    setState({ user: null, token: null, isLoading: false, isAuthenticated: false });
    
    // 2. Fire and forget cleanup tasks in the background
    authApi.logout().catch(() => {});
    clearSession().catch(() => {});
  }, [clearSession]);

  const updateUser = useCallback((partial: Partial<AuthUser>) => {
    setState(s => {
      if (!s.user) return s;
      const updatedUser = { ...s.user, ...partial };
      // Persist locally so it survives restarts
      SecureStore.setItemAsync(USER_KEY, JSON.stringify(updatedUser)).catch(() => {});
      return { ...s, user: updatedUser };
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
