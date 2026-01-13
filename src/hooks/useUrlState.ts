'use client';

import { useCallback, useEffect, useState } from 'react';
import { FilterState, defaultFilters } from '@/components/Search/FilterPanel';

interface UrlState {
  chamber: 'house' | 'senate';
  district: number | null;
  filters: FilterState;
}

const defaultUrlState: UrlState = {
  chamber: 'house',
  district: null,
  filters: defaultFilters,
};

export function useUrlState() {
  const [state, setState] = useState<UrlState>(defaultUrlState);
  const [isInitialized, setIsInitialized] = useState(false);

  // Parse URL on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);

    const chamber = params.get('chamber');
    const district = params.get('district');
    const party = params.get('party');
    const hasCandidate = params.get('hasCandidate');
    const contested = params.get('contested');

    const parsedState: UrlState = {
      chamber: chamber === 'senate' ? 'senate' : 'house',
      district: district ? parseInt(district, 10) : null,
      filters: {
        party: party ? party.split(',').filter(Boolean) : [],
        hasCandidate: (hasCandidate === 'yes' || hasCandidate === 'no') ? hasCandidate : 'all',
        contested: (contested === 'yes' || contested === 'no') ? contested : 'all',
      },
    };

    setState(parsedState);
    setIsInitialized(true);
  }, []);

  // Update URL when state changes
  const updateUrl = useCallback((newState: Partial<UrlState>) => {
    if (typeof window === 'undefined') return;

    const updatedState = { ...state, ...newState };
    setState(updatedState);

    const params = new URLSearchParams();

    // Always include chamber
    params.set('chamber', updatedState.chamber);

    // Only include district if selected
    if (updatedState.district !== null) {
      params.set('district', String(updatedState.district));
    }

    // Only include filters if they differ from defaults
    if (updatedState.filters.party.length > 0) {
      params.set('party', updatedState.filters.party.join(','));
    }
    if (updatedState.filters.hasCandidate !== 'all') {
      params.set('hasCandidate', updatedState.filters.hasCandidate);
    }
    if (updatedState.filters.contested !== 'all') {
      params.set('contested', updatedState.filters.contested);
    }

    // Update URL without page reload
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [state]);

  const setChamber = useCallback((chamber: 'house' | 'senate') => {
    updateUrl({ chamber, district: null }); // Clear district when changing chamber
  }, [updateUrl]);

  const setDistrict = useCallback((district: number | null) => {
    updateUrl({ district });
  }, [updateUrl]);

  const setFilters = useCallback((filters: FilterState) => {
    updateUrl({ filters });
  }, [updateUrl]);

  return {
    chamber: state.chamber,
    district: state.district,
    filters: state.filters,
    setChamber,
    setDistrict,
    setFilters,
    isInitialized,
  };
}
