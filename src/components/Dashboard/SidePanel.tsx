import CandidateCard from './CandidateCard';

interface Candidate {
  name: string;
  party: string | null;
  status: string;
  filedDate: string | null;
  ethicsUrl: string | null;
  reportId: string;
  source: string;
}

interface District {
  districtNumber: number;
  candidates: Candidate[];
}

interface SidePanelProps {
  chamber: 'house' | 'senate';
  district: District | null;
  onClose: () => void;
}

export default function SidePanel({ chamber, district, onClose }: SidePanelProps) {
  if (!district) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 p-6">
        <div className="text-center">
          <svg
            className="w-12 h-12 mx-auto mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          <p className="text-lg font-medium">Select a District</p>
          <p className="text-sm mt-1">Click on a district to see candidates</p>
        </div>
      </div>
    );
  }

  const chamberLabel = chamber === 'house' ? 'House' : 'Senate';
  const hasDem = district.candidates.some((c) => c.party?.toLowerCase() === 'democratic');
  const hasRep = district.candidates.some((c) => c.party?.toLowerCase() === 'republican');

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {chamberLabel} District {district.districtNumber}
            </h2>
            <p className="text-sm text-gray-600">
              {district.candidates.length} candidate
              {district.candidates.length !== 1 ? 's' : ''} filed
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            aria-label="Close panel"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Status badges */}
        <div className="flex gap-2 mt-3">
          {hasDem && (
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
              Democrat Running
            </span>
          )}
          {hasRep && (
            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
              Republican Running
            </span>
          )}
          {!hasDem && !hasRep && district.candidates.length > 0 && (
            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
              Party Unknown
            </span>
          )}
        </div>
      </div>

      {/* Candidates list */}
      <div className="flex-1 overflow-y-auto p-4">
        {district.candidates.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No candidates have filed yet</p>
            <p className="text-sm mt-1">Check back later for updates</p>
          </div>
        ) : (
          <div className="space-y-3">
            {district.candidates.map((candidate) => (
              <CandidateCard key={candidate.reportId} candidate={candidate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
