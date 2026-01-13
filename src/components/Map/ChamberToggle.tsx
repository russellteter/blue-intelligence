interface ChamberToggleProps {
  chamber: 'house' | 'senate';
  onChange: (chamber: 'house' | 'senate') => void;
}

export default function ChamberToggle({ chamber, onChange }: ChamberToggleProps) {
  return (
    <div className="inline-flex rounded-lg bg-gray-100 p-1">
      <button
        onClick={() => onChange('house')}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          chamber === 'house'
            ? 'bg-white text-gray-900 shadow'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        House (124)
      </button>
      <button
        onClick={() => onChange('senate')}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          chamber === 'senate'
            ? 'bg-white text-gray-900 shadow'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Senate (46)
      </button>
    </div>
  );
}
