interface LegendProps {
  className?: string;
}

/**
 * Compact legend component for opportunity tiers.
 * Minimal chart-style legend with small color indicators.
 */
export default function Legend({ className = '' }: LegendProps) {
  const items = [
    { color: '#059669', label: 'High', description: 'High Opportunity (Score 70+)' },
    { color: '#0891B2', label: 'Emerging', description: 'Emerging (Score 50-69)' },
    { color: '#D97706', label: 'Build', description: 'Build (Score 30-49)' },
    { color: '#3676eb', label: 'Defensive', description: 'Defensive (Dem Incumbent)' },
    { color: '#9CA3AF', label: 'Low', description: 'Non-Competitive (Score <30)' },
    { color: '#D1D5DB', label: 'Empty', description: 'No Candidates' },
  ];

  return (
    <div
      className={`inline-flex items-center gap-3 ${className}`}
      role="list"
      aria-label="Opportunity tier legend"
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="inline-flex items-center gap-1 cursor-default"
          role="listitem"
          title={item.description}
        >
          <span
            className="w-2 h-2 rounded-sm flex-shrink-0"
            style={{ backgroundColor: item.color }}
            aria-hidden="true"
          />
          <span className="text-[10px] text-gray-500 leading-none">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
