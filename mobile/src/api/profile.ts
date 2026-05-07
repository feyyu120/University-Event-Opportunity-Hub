/**
 * Profile API
 * Typed endpoints for user profile operations.
 */

import { apiClient } from './client';
import { AuthUser } from './auth';

export interface UserProfile extends AuthUser {
  gpa?: string;
  skills?: string[];
  interests?: string[];
  portfolio_url?: string;
  bio?: string;
  avatar_url?: string;
  resume_url?: string;
  profile_completion?: number;  // 0-100
  stats?: {
    saved: number;
    applied: number;
    points: number;
  };
}

export interface UpdateProfilePayload {
  full_name?: string;
  department?: string;
  year?: string;
  gpa?: string;
  skills?: string[];
  interests?: string[];
  portfolio_url?: string;
  bio?: string;
}

export const profileApi = {
  get: () =>
    apiClient.get<UserProfile>('users/me'),

  update: (payload: UpdateProfilePayload) =>
    apiClient.put<{ success: boolean; user: UserProfile }>('users/me', payload),
};
