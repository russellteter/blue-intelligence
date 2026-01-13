interface LegendProps {
  className?: string;
}

export default function Legend({ className = '' }: LegendProps) {
  const items = [
    { color: 'bg-blue-500', label: 'Democrat Running' },
    { color: 'bg-red-500', label: 'Republican Running' },
    { color: 'bg-purple-500', label: 'Both Parties' },
    { color: 'bg-gray-400', label: 'Filed (Party Unknown)' },
    { color: 'bg-gray-100 border border-gray-300', label: 'No Candidates Yet' },
  ];

  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded ${item.color}`} />
          <span className="text-sm text-gray-600">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
