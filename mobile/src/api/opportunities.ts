/**
 * Opportunities API
 * Typed endpoints for all opportunity-related operations.
 * Backend paths assume REST-style routing via PHP router or .htaccess.
 */

import { apiClient } from './client';

// ─── Types ────────────────────────────────────────────────────────────────────

export type OpportunityType = 'Event' | 'Scholarship' | 'Internship' | 'Workshop' | 'Hackathon';

export interface Comment {
  id: string;
  opportunity_id: string;
  user_id: string;
  user_name: string;
  profile_image?: string;
  parent_id?: string | null;
  content: string;
  created_at: string;
}

export interface Opportunity {
  id: string;
  type: OpportunityType;
  title: string;
  organization: string;
  organization_name?: string;     // From backend join
  deadline: string;
  deadline_date?: string;
  is_deadline_soon?: boolean;
  description: string;
  eligibility?: string;
  location?: string;
  mode?: 'On-Site' | 'Remote' | 'Hybrid';
  contact?: string;
  departments?: string[];
  image?: string;
  match_score?: number;
  save_count?: number;
  like_count?: number;           // New
  comment_count?: number;        // New
  is_saved?: boolean;
  is_liked?: boolean;            // New
  is_applied?: boolean;
  reason?: string;
  created_at?: string;
}

export interface OpportunityListResponse {
  page: number;
  results: Opportunity[];
}

export interface OpportunityFilters {
  type?: OpportunityType[];
  department?: string;
  mode?: string;
  deadline_within_days?: number;
  search?: string;
  page?: number;
  per_page?: number;
  is_saved?: boolean;
  is_applied?: boolean;
  user_id?: string;
}

export interface ApplicationStatus {
  opportunity_id: string;
  status: 'discovered' | 'applied' | 'in_review' | 'interview' | 'offer' | 'rejected';
  applied_at?: string;
  notes?: string;
}

export interface OpportunityDetailResponse {
  success: boolean;
  data: Opportunity;
  comments: Comment[];
}

// ─── Endpoints ────────────────────────────────────────────────────────────────

export const opportunitiesApi = {
  /** Fetch paginated feed with optional filters */
  list: (filters: OpportunityFilters = {}) => {
    return apiClient.post<OpportunityListResponse>('opportunities/feed', {
      user_id: filters.user_id,
      page: filters.page || 1,
      limit: filters.per_page || 10,
      search: filters.search,
      type: filters.type,
      is_saved: filters.is_saved,
      is_applied: filters.is_applied
    });
  },

  /** Fetch single opportunity detail */
  detail: (id: string, userId?: string) =>
    apiClient.get<OpportunityDetailResponse>(`opportunities/detail?id=${id}${userId ? `&user_id=${userId}` : ''}`),

  /** Toggle bookmark */
  save: (opportunityId: string, userId: string) =>
    apiClient.post<any>('users/saved', { user_id: userId, opportunity_id: opportunityId }),

  /** Toggle like */
  like: (opportunityId: string, userId: string) =>
    apiClient.post<{ liked: boolean; like_count: number }>(
      'opportunities/like',
      { opportunity_id: opportunityId, user_id: userId }
    ),

  /** Post comment or reply */
  comment: (opportunityId: string, userId: string, content: string, parentId?: string) =>
    apiClient.post<{ success: boolean; data: Comment }>(
      'opportunities/comment',
      { opportunity_id: opportunityId, user_id: userId, content, parent_id: parentId }
    ),

  /** Report opportunity */
  report: (opportunityId: string, userId: string, reason: string) =>
    apiClient.post<{ success: boolean; message: string }>(
      'opportunities/report',
      { opportunity_id: opportunityId, user_id: userId, reason }
    ),

  /** Mark as applied + update tracker */
  apply: (opportunityId: string, userId: string, notes?: string) =>
    apiClient.post<any>(
      'users/applications',
      { user_id: userId, opportunity_id: opportunityId, notes }
    ),

  /** Get user's saved list */
  saved: (userId: string) =>
    apiClient.get<any>(`users/saved?user_id=${userId}`),

  /** Get user's applications */
  applications: (userId: string) =>
    apiClient.get<any>(`users/applications?user_id=${userId}`),
};
