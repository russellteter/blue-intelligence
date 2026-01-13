interface LegendProps {
  className?: string;
}

/**
 * Legend component with opportunity tier styling.
 * Shows strategic opportunity levels for Democratic strategists.
 * Uses color AND symbol indicators for accessibility (WCAG 1.4.1).
 */
export default function Legend({ className = '' }: LegendProps) {
  const items = [
    {
      color: '#059669',
      bgColor: 'rgba(5, 150, 105, 0.1)',
      borderColor: 'rgba(5, 150, 105, 0.3)',
      label: 'High Opportunity',
      symbol: '★',
      description: 'Score 70+',
    },
    {
      color: '#0891B2',
      bgColor: 'rgba(8, 145, 178, 0.1)',
      borderColor: 'rgba(8, 145, 178, 0.3)',
      label: 'Emerging',
      symbol: '↗',
      description: 'Score 50-69',
    },
    {
      color: '#D97706',
      bgColor: 'rgba(217, 119, 6, 0.1)',
      borderColor: 'rgba(217, 119, 6, 0.3)',
      label: 'Build',
      symbol: '◆',
      description: 'Score 30-49',
    },
    {
      color: '#7C3AED',
      bgColor: 'rgba(124, 58, 237, 0.1)',
      borderColor: 'rgba(124, 58, 237, 0.3)',
      label: 'Defensive',
      symbol: '⛉',
      description: 'Dem Incumbent',
    },
    {
      color: '#9CA3AF',
      bgColor: 'rgba(156, 163, 175, 0.1)',
      borderColor: 'rgba(156, 163, 175, 0.3)',
      label: 'Non-Competitive',
      symbol: '–',
      description: 'Score <30',
    },
    {
      color: '#D1D5DB',
      bgColor: 'rgba(209, 213, 219, 0.1)',
      borderColor: 'rgba(209, 213, 219, 0.3)',
      label: 'No Candidates',
      symbol: '○',
      description: 'Empty',
    },
  ];

  return (
    <div
      className={`flex flex-wrap gap-2 justify-center ${className}`}
      role="list"
      aria-label="Opportunity tier legend"
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all hover:scale-105"
          style={{
            background: item.bgColor,
            border: `1px solid ${item.borderColor}`,
            color: item.color,
          }}
          role="listitem"
          title={item.description}
        >
          <span
            className="w-3 h-3 rounded-sm flex items-center justify-center text-[10px]"
            style={{ background: item.color, color: 'white' }}
            aria-hidden="true"
          >
            {item.symbol}
          </span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
