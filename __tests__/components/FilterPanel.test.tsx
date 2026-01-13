import { render, screen, fireEvent } from '@testing-library/react';
import FilterPanel, { defaultFilters, FilterState } from '@/components/Search/FilterPanel';

describe('FilterPanel Component', () => {
  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  it('renders filter toggle button', () => {
    render(
      <FilterPanel
        filters={defaultFilters}
        onFilterChange={mockOnFilterChange}
      />
    );

    expect(screen.getByRole('button', { name: /filters/i })).toBeInTheDocument();
  });

  it('expands panel when toggle button is clicked', () => {
    render(
      <FilterPanel
        filters={defaultFilters}
        onFilterChange={mockOnFilterChange}
      />
    );

    const toggleBtn = screen.getByRole('button', { name: /filters/i });
    expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(toggleBtn);

    expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Party')).toBeInTheDocument();
  });

  it('shows party filter options when expanded', () => {
    render(
      <FilterPanel
        filters={defaultFilters}
        onFilterChange={mockOnFilterChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /filters/i }));

    expect(screen.getByRole('button', { name: 'Democrats' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Republicans' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Unknown Party' })).toBeInTheDocument();
  });

  it('shows candidate status filter options when expanded', () => {
    render(
      <FilterPanel
        filters={defaultFilters}
        onFilterChange={mockOnFilterChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /filters/i }));

    expect(screen.getByRole('button', { name: 'All Districts' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Has Candidates' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'No Candidates' })).toBeInTheDocument();
  });

  it('shows race type filter options when expanded', () => {
    render(
      <FilterPanel
        filters={defaultFilters}
        onFilterChange={mockOnFilterChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /filters/i }));

    expect(screen.getByRole('button', { name: 'All Races' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Contested' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Uncontested' })).toBeInTheDocument();
  });

  it('calls onFilterChange when party filter is toggled', () => {
    render(
      <FilterPanel
        filters={defaultFilters}
        onFilterChange={mockOnFilterChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /filters/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Democrats' }));

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...defaultFilters,
      party: ['Democratic'],
    });
  });

  it('removes party from filter when clicked again', () => {
    const filtersWithParty: FilterState = {
      ...defaultFilters,
      party: ['Democratic'],
    };

    render(
      <FilterPanel
        filters={filtersWithParty}
        onFilterChange={mockOnFilterChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /filters/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Democrats' }));

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...defaultFilters,
      party: [],
    });
  });

  it('calls onFilterChange when candidate status filter is changed', () => {
    render(
      <FilterPanel
        filters={defaultFilters}
        onFilterChange={mockOnFilterChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /filters/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Has Candidates' }));

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...defaultFilters,
      hasCandidate: 'yes',
    });
  });

  it('calls onFilterChange when race type filter is changed', () => {
    render(
      <FilterPanel
        filters={defaultFilters}
        onFilterChange={mockOnFilterChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /filters/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Contested' }));

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...defaultFilters,
      contested: 'yes',
    });
  });

  it('shows active filter count badge when filters are applied', () => {
    const activeFilters: FilterState = {
      party: ['Democratic', 'Republican'],
      hasCandidate: 'yes',
      contested: 'all',
      opportunity: [],
      showRepublicanData: false,
      republicanDataMode: 'none',
    };

    render(
      <FilterPanel
        filters={activeFilters}
        onFilterChange={mockOnFilterChange}
      />
    );

    // Count should be 3: 2 parties + 1 hasCandidate
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('shows clear all button when filters are active', () => {
    const activeFilters: FilterState = {
      party: ['Democratic'],
      hasCandidate: 'all',
      contested: 'all',
      opportunity: [],
      showRepublicanData: false,
      republicanDataMode: 'none',
    };

    render(
      <FilterPanel
        filters={activeFilters}
        onFilterChange={mockOnFilterChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /filters/i }));

    expect(screen.getByRole('button', { name: 'Clear all filters' })).toBeInTheDocument();
  });

  it('clears all filters when clear button is clicked', () => {
    const activeFilters: FilterState = {
      party: ['Democratic', 'Republican'],
      hasCandidate: 'yes',
      contested: 'yes',
      opportunity: [],
      showRepublicanData: false,
      republicanDataMode: 'none',
    };

    render(
      <FilterPanel
        filters={activeFilters}
        onFilterChange={mockOnFilterChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /filters/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Clear all filters' }));

    expect(mockOnFilterChange).toHaveBeenCalledWith(defaultFilters);
  });

  it('does not show clear button when no filters are active', () => {
    render(
      <FilterPanel
        filters={defaultFilters}
        onFilterChange={mockOnFilterChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /filters/i }));

    expect(screen.queryByRole('button', { name: 'Clear all filters' })).not.toBeInTheDocument();
  });

  it('has proper aria-pressed attributes on filter buttons', () => {
    const activeFilters: FilterState = {
      party: ['Democratic'],
      hasCandidate: 'yes',
      contested: 'all',
      opportunity: [],
      showRepublicanData: false,
      republicanDataMode: 'none',
    };

    render(
      <FilterPanel
        filters={activeFilters}
        onFilterChange={mockOnFilterChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /filters/i }));

    expect(screen.getByRole('button', { name: 'Democrats' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Republicans' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Has Candidates' })).toHaveAttribute('aria-pressed', 'true');
  });
});
