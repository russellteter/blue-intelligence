'use client';

import { useState } from 'react';

export interface FilterState {
  party: string[];
  hasCandidate: 'all' | 'yes' | 'no';
  contested: 'all' | 'yes' | 'no';
}

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  className?: string;
}

export const defaultFilters: FilterState = {
  party: [],
  hasCandidate: 'all',
  contested: 'all',
};

export default function FilterPanel({
  filters,
  onFilterChange,
  className = '',
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const partyOptions = [
    { value: 'Democratic', label: 'Democrats', color: 'var(--class-purple, #4739E7)' },
    { value: 'unknown', label: 'Unknown Party', color: 'var(--color-attention, #FFBA00)' },
  ];

  const toggleParty = (party: string) => {
    const newParties = filters.party.includes(party)
      ? filters.party.filter((p) => p !== party)
      : [...filters.party, party];
    onFilterChange({ ...filters, party: newParties });
  };

  const activeFilterCount =
    filters.party.length +
    (filters.hasCandidate !== 'all' ? 1 : 0) +
    (filters.contested !== 'all' ? 1 : 0);

  const clearFilters = () => {
    onFilterChange(defaultFilters);
  };

  return (
    <div className={className}>
      {/* Filter toggle button */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm font-medium"
        style={{
          background: isExpanded ? 'var(--class-purple, #4739E7)' : 'var(--card-bg, #FFFFFF)',
          borderColor: 'var(--class-purple-light, #DAD7FA)',
          color: isExpanded ? 'white' : 'var(--text-color, #0A1849)',
        }}
        aria-expanded={isExpanded}
        aria-controls="filter-panel"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span
            className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full"
            style={{
              background: isExpanded ? 'white' : 'var(--class-purple, #4739E7)',
              color: isExpanded ? 'var(--class-purple, #4739E7)' : 'white',
            }}
          >
            {activeFilterCount}
          </span>
        )}
        <svg
          className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Filter panel */}
      {isExpanded && (
        <div
          id="filter-panel"
          className="mt-2 p-4 rounded-lg border"
          style={{
            background: 'var(--card-bg, #FFFFFF)',
            borderColor: 'var(--class-purple-light, #DAD7FA)',
          }}
        >
          {/* Party filter */}
          <fieldset className="mb-4">
            <legend
              className="text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: 'var(--color-text-muted, #4A5568)' }}
            >
              Party
            </legend>
            <div className="flex flex-wrap gap-2">
              {partyOptions.map((option) => {
                const isSelected = filters.party.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleParty(option.value)}
                    className="px-3 py-1.5 text-xs font-medium rounded-full border transition-all"
                    style={{
                      background: isSelected ? option.color : 'transparent',
                      borderColor: option.color,
                      color: isSelected ? 'white' : option.color,
                    }}
                    aria-pressed={isSelected}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Has candidate filter */}
          <fieldset className="mb-4">
            <legend
              className="text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: 'var(--color-text-muted, #4A5568)' }}
            >
              Candidate Status
            </legend>
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'All Districts' },
                { value: 'yes', label: 'Has Candidates' },
                { value: 'no', label: 'No Candidates' },
              ].map((option) => {
                const isSelected = filters.hasCandidate === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      onFilterChange({
                        ...filters,
                        hasCandidate: option.value as 'all' | 'yes' | 'no',
                      })
                    }
                    className="px-3 py-1.5 text-xs font-medium rounded-full border transition-all"
                    style={{
                      background: isSelected ? 'var(--class-purple, #4739E7)' : 'transparent',
                      borderColor: 'var(--class-purple-light, #DAD7FA)',
                      color: isSelected ? 'white' : 'var(--text-color, #0A1849)',
                    }}
                    aria-pressed={isSelected}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Contested filter */}
          <fieldset className="mb-4">
            <legend
              className="text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: 'var(--color-text-muted, #4A5568)' }}
            >
              Race Type
            </legend>
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'All Races' },
                { value: 'yes', label: 'Contested' },
                { value: 'no', label: 'Uncontested' },
              ].map((option) => {
                const isSelected = filters.contested === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      onFilterChange({
                        ...filters,
                        contested: option.value as 'all' | 'yes' | 'no',
                      })
                    }
                    className="px-3 py-1.5 text-xs font-medium rounded-full border transition-all"
                    style={{
                      background: isSelected ? 'var(--class-purple, #4739E7)' : 'transparent',
                      borderColor: 'var(--class-purple-light, #DAD7FA)',
                      color: isSelected ? 'white' : 'var(--text-color, #0A1849)',
                    }}
                    aria-pressed={isSelected}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Clear filters */}
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="w-full px-3 py-2 text-sm font-medium rounded-lg transition-all hover:opacity-80"
              style={{
                background: 'var(--class-purple-bg, #F6F6FE)',
                color: 'var(--class-purple, #4739E7)',
              }}
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
