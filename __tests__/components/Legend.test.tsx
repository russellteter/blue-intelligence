import { render, screen } from '@testing-library/react';
import Legend from '@/components/Map/Legend';

describe('Legend Component', () => {
  it('renders all base legend items', () => {
    render(<Legend />);

    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Emerging')).toBeInTheDocument();
    expect(screen.getByText('Build')).toBeInTheDocument();
    expect(screen.getByText('Defensive')).toBeInTheDocument();
    expect(screen.getByText('Low')).toBeInTheDocument();
    expect(screen.getByText('Empty')).toBeInTheDocument();
  });

  it('has proper ARIA structure', () => {
    render(<Legend />);

    const list = screen.getByRole('list', { name: 'Opportunity tier legend' });
    expect(list).toBeInTheDocument();

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(6);
  });

  it('applies custom className', () => {
    const { container } = render(<Legend className="custom-class" />);

    const legendContainer = container.querySelector('.custom-class');
    expect(legendContainer).toBeInTheDocument();
  });

  it('shows Republican legend item when showRepublicanData is true', () => {
    render(<Legend showRepublicanData={true} />);

    expect(screen.getByText('GOP Only')).toBeInTheDocument();

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(7); // 6 base + 1 GOP Only
  });

  it('does not show Republican legend item when showRepublicanData is false', () => {
    render(<Legend showRepublicanData={false} />);

    expect(screen.queryByText('GOP Only')).not.toBeInTheDocument();

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(6);
  });

  it('has title attributes with descriptions', () => {
    render(<Legend />);

    const highItem = screen.getByTitle('High Opportunity (Score 70+)');
    expect(highItem).toBeInTheDocument();

    const defensiveItem = screen.getByTitle('Defensive (Dem Incumbent)');
    expect(defensiveItem).toBeInTheDocument();
  });

  it('hides color indicators from screen readers', () => {
    const { container } = render(<Legend />);

    // Color spans should have aria-hidden
    const hiddenSpans = container.querySelectorAll('[aria-hidden="true"]');
    expect(hiddenSpans.length).toBe(6); // One per legend item
  });
});
