import { render, screen } from '@testing-library/react';
import Legend from '@/components/Map/Legend';

describe('Legend Component', () => {
  it('renders all legend items', () => {
    render(<Legend />);

    expect(screen.getByText('Democrat Running')).toBeInTheDocument();
    expect(screen.getByText('Republican Running')).toBeInTheDocument();
    expect(screen.getByText('Both Parties (Contested)')).toBeInTheDocument();
    expect(screen.getByText('Filed (Party Unknown)')).toBeInTheDocument();
    expect(screen.getByText('No Candidates Yet')).toBeInTheDocument();
  });

  it('displays symbol indicators for accessibility', () => {
    render(<Legend />);

    // Check that symbols are present
    expect(screen.getByText('D')).toBeInTheDocument();
    expect(screen.getByText('R')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('?')).toBeInTheDocument();
    // Em dash for no candidates
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('has proper ARIA structure', () => {
    render(<Legend />);

    const list = screen.getByRole('list', { name: 'Map legend' });
    expect(list).toBeInTheDocument();

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(5);
  });

  it('applies custom className', () => {
    const { container } = render(<Legend className="custom-class" />);

    const legendContainer = container.querySelector('.custom-class');
    expect(legendContainer).toBeInTheDocument();
  });

  it('uses glassmorphic badge classes', () => {
    const { container } = render(<Legend />);

    // Check for badge classes
    expect(container.querySelector('.badge-democrat')).toBeInTheDocument();
    expect(container.querySelector('.badge-republican')).toBeInTheDocument();
    expect(container.querySelector('.badge-both')).toBeInTheDocument();
    expect(container.querySelector('.badge-unknown')).toBeInTheDocument();
    expect(container.querySelector('.badge-empty')).toBeInTheDocument();
  });

  it('hides symbols from screen readers', () => {
    const { container } = render(<Legend />);

    // Symbol spans should have aria-hidden
    const hiddenSymbols = container.querySelectorAll('[aria-hidden="true"]');
    expect(hiddenSymbols.length).toBe(5); // One per legend item
  });
});
