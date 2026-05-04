/**
 * Opportunities API
 * Typed endpoints for all opportunity-related operations.
 * Backend paths assume REST-style routing via PHP router or .htaccess.
 */

import { apiClient } from './client';

// ─── Types ────────────────────────────────────────────────────────────────────

export type OpportunityType = 'Event' | 'Scholarship' | 'Internship' | 'Workshop' | 'Hackathon';

export interface Opportunity {
  id: string;
  type: OpportunityType;
  title: string;
  organization: string;
  deadline: string;
  deadline_date?: string;        // ISO 8601 for date calculations
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
  is_saved?: boolean;
  is_applied?: boolean;
  reason?: string;
  created_at?: string;
}

export interface OpportunityListResponse {
  data: Opportunity[];
  total: number;
  page: number;
  per_page: number;
}

export interface OpportunityFilters {
  type?: OpportunityType[];
  department?: string;
  mode?: string;
  deadline_within_days?: number;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface ApplicationStatus {
  opportunity_id: string;
  status: 'discovered' | 'applied' | 'in_review' | 'interview' | 'offer' | 'rejected';
  applied_at?: string;
  notes?: string;
}

// ─── Endpoints ────────────────────────────────────────────────────────────────

export const opportunitiesApi = {
  /** Fetch paginated feed with optional filters */
  list: (filters: OpportunityFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.search)             params.set('search', filters.search);
    if (filters.type?.length)       params.set('type', filters.type.join(','));
    if (filters.department)         params.set('department', filters.department);
    if (filters.mode)               params.set('mode', filters.mode);
    if (filters.deadline_within_days) params.set('deadline_within_days', String(filters.deadline_within_days));
    if (filters.page)               params.set('page', String(filters.page));
    if (filters.per_page)           params.set('per_page', String(filters.per_page));

    const query = params.toString();
    return apiClient.get<OpportunityListResponse>(
      `opportunities/list.php${query ? `?${query}` : ''}`
    );
  },

  /** Fetch single opportunity detail */
  detail: (id: string) =>
    apiClient.get<Opportunity>(`opportunities/detail.php?id=${id}`),

  /** Toggle save/bookmark */
  save: (opportunityId: string) =>
    apiClient.post<{ saved: boolean; save_count: number }>(
      'opportunities/save.php',
      { opportunity_id: opportunityId }
    ),

  /** Mark as applied + update tracker */
  apply: (opportunityId: string, notes?: string) =>
    apiClient.post<{ status: ApplicationStatus }>(
      'opportunities/apply.php',
      { opportunity_id: opportunityId, notes }
    ),

  /** Get user's saved list */
  saved: () =>
    apiClient.get<OpportunityListResponse>('opportunities/saved.php'),

  /** Get user's applications */
  applications: () =>
    apiClient.get<ApplicationStatus[]>('opportunities/applications.php'),

  /** Update application status */
  updateApplicationStatus: (opportunityId: string, status: ApplicationStatus['status']) =>
    apiClient.put<{ status: ApplicationStatus }>(
      'opportunities/applications.php',
      { opportunity_id: opportunityId, status }
    ),
};
