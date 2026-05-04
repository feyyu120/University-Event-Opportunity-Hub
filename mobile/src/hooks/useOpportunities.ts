/**
 * useOpportunities — Data fetching hook for the home feed.
 *
 * Features:
 * - Fetch with loading / error / empty states
 * - Optimistic bookmark toggle
 * - Pull-to-refresh
 * - Falls back to mock data when API is unreachable (dev mode)
 */

import { useState, useEffect, useCallback } from 'react';
import { opportunitiesApi, type Opportunity, type OpportunityFilters } from '@/api/opportunities';
import { ApiError } from '@/api/client';
import { ENV } from '@/config/env';

// ── Dev-mode fallback data (used when backend is offline) ──
const FALLBACK_DATA: Opportunity[] = [
  {
    id: '1',
    type: 'Internship',
    title: 'Software Engineer Intern',
    organization: 'Google',
    deadline: 'Oct 30',
    deadline_date: '2026-10-30',
    is_deadline_soon: true,
    description: 'Working on core search algorithms.',
    match_score: 98,
    save_count: 1240,
    reason: 'Recommended because you liked AI and Web Dev.',
    image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: '2',
    type: 'Scholarship',
    title: 'Academic Excellence Grant',
    organization: 'University Foundation',
    deadline: 'Tomorrow',
    deadline_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    is_deadline_soon: true,
    description: 'Merit-based scholarship for CS students.',
    save_count: 450,
  },
  {
    id: '3',
    type: 'Event',
    title: 'Tech Talk: Future of AI',
    organization: 'ACM Student Chapter',
    deadline: 'Oct 25',
    deadline_date: '2026-10-25',
    description: 'Guest speaker from OpenAI.',
    match_score: 92,
    save_count: 89,
    reason: 'Popular among 3rd year students.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: '4',
    type: 'Hackathon',
    title: 'BuildSpace Hackathon 2026',
    organization: 'Computer Society',
    deadline: 'Nov 5',
    deadline_date: '2026-11-05',
    description: '48-hour hackathon with $10,000 in prizes.',
    match_score: 87,
    save_count: 2100,
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: '5',
    type: 'Workshop',
    title: 'UI/UX Design Masterclass',
    organization: 'Design Club',
    deadline: 'Oct 28',
    deadline_date: '2026-10-28',
    description: 'Learn Figma, prototyping and user research.',
    match_score: 75,
    save_count: 340,
  },
];

interface UseOpportunitiesResult {
  data: Opportunity[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  refresh: () => void;
  toggleSave: (id: string) => void;
}

export function useOpportunities(filters: OpportunityFilters = {}): UseOpportunitiesResult {
  const [data, setData]           = useState<Opportunity[]>([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await opportunitiesApi.list(filters);
      setData(res.data);
    } catch (err) {
      if (ENV.IS_DEV) {
        // Show mock data in dev when backend is not running
        setData(FALLBACK_DATA);
      } else {
        const message = err instanceof ApiError ? err.message : 'Failed to load opportunities.';
        setError(message);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const refresh = useCallback(() => fetchData(true), [fetchData]);

  // Optimistic toggle — updates UI immediately, no extra API call needed
  const toggleSave = useCallback((id: string) => {
    setData(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, is_saved: !item.is_saved, save_count: (item.save_count ?? 0) + (item.is_saved ? -1 : 1) }
          : item
      )
    );
    // Fire-and-forget background API call
    opportunitiesApi.save(id).catch(() => {
      // Revert on failure
      setData(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, is_saved: !item.is_saved, save_count: (item.save_count ?? 0) + (item.is_saved ? 1 : -1) }
            : item
        )
      );
    });
  }, []);

  return { data, loading, refreshing, error, refresh, toggleSave };
}
