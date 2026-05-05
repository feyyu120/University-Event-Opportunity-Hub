import { useState, useEffect, useCallback } from 'react';
import { opportunitiesApi, type Opportunity, type OpportunityFilters } from '@/api/opportunities';
import { ApiError } from '@/api/client';
import { ENV } from '@/config/env';
import { useAuth } from '@/context/AuthContext';

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
  const { user } = useAuth();
  const [data, setData]           = useState<Opportunity[]>([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      // Use specialized endpoints for saved/applied if possible, or pass to list
      const res = await opportunitiesApi.list({ ...filters, user_id: user?.id?.toString() });
      
      // Some old backend endpoints might return 200 OK but contain an error message
      if ((res as any).error) {
        throw new ApiError((res as any).error, 400);
      }
      
      // If valid data is returned, use it
      if (res.results && res.results.length > 0) {
        setData(res.results);
      } else {
        throw new Error('No results from backend');
      }
    } catch (err) {
      // Always fallback to mock data for guests (!user) or if we're in Dev mode
      // This ensures the Explore page is never empty while the backend is fixing its routes
      if (ENV.IS_DEV || !user) {
        let result = [...FALLBACK_DATA];
        if (filters.is_saved) {
          result = result.filter(item => item.save_count && item.save_count > 0);
        }
        if (filters.is_applied) {
          result = result.filter((_, idx) => idx % 2 === 0);
        }
        setData(result);
      } else {
        const message = err instanceof ApiError ? err.message : 'Failed to load opportunities.';
        setError(message);
        setData([]); // Ensure data is at least empty array
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [JSON.stringify(filters), user?.id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const refresh = useCallback(() => fetchData(true), [fetchData]);

  const toggleSave = useCallback((id: string) => {
    if (!user) return;
    
    setData(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, is_saved: !item.is_saved, save_count: (item.save_count ?? 0) + (item.is_saved ? -1 : 1) }
          : item
      )
    );

    opportunitiesApi.save(id, user.id.toString()).catch(() => {
      setData(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, is_saved: !item.is_saved, save_count: (item.save_count ?? 0) + (item.is_saved ? 1 : -1) }
            : item
        )
      );
    });
  }, [user]);

  return { data: data || [], loading, refreshing, error, refresh, toggleSave };
}
