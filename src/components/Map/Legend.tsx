interface LegendProps {
  className?: string;
}

/**
 * Legend component with glassmorphic badge styling.
 * Uses color AND symbol indicators for accessibility (WCAG 1.4.1).
 */
export default function Legend({ className = '' }: LegendProps) {
  const items = [
    {
      badgeClass: 'badge-democrat',
      label: 'Democrat Running',
      symbol: 'D',
    },
    {
      badgeClass: 'badge-unknown',
      label: 'Filed (Party Unknown)',
      symbol: '?',
    },
    {
      badgeClass: 'badge-empty',
      label: 'No Candidates Yet',
      symbol: '—',
    },
  ];

  return (
    <div
      className={`flex flex-wrap gap-3 ${className}`}
      role="list"
      aria-label="Map legend"
    >
      {items.map((item) => (
        <div
          key={item.label}
          className={`badge ${item.badgeClass}`}
          role="listitem"
        >
          <span aria-hidden="true">{item.symbol}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
