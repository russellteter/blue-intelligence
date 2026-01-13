interface ChamberToggleProps {
  chamber: 'house' | 'senate';
  onChange: (chamber: 'house' | 'senate') => void;
}

export default function ChamberToggle({ chamber, onChange }: ChamberToggleProps) {
  return (
    <div className="chamber-toggle" role="tablist" aria-label="Chamber selection">
      <button
        onClick={() => onChange('house')}
        className={`chamber-toggle-btn ${chamber === 'house' ? 'active' : ''}`}
        role="tab"
        aria-selected={chamber === 'house'}
        aria-controls="map-container"
      >
        House (124)
      </button>
      <button
        onClick={() => onChange('senate')}
        className={`chamber-toggle-btn ${chamber === 'senate' ? 'active' : ''}`}
        role="tab"
        aria-selected={chamber === 'senate'}
        aria-controls="map-container"
      >
        Senate (46)
      </button>
    </div>
  );
}
