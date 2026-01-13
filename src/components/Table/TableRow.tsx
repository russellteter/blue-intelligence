'use client';

import type { StrategicTableRow } from '@/lib/exportCSV';

interface TableRowProps {
  row: StrategicTableRow;
  index: number;
  onClick: (row: StrategicTableRow) => void;
}

/**
 * Get tier badge styles based on opportunity tier
 */
function getTierStyles(tier: string): { bg: string; color: string; border: string } {
  switch (tier) {
    case 'HIGH_OPPORTUNITY':
      return {
        bg: 'rgba(5, 150, 105, 0.1)',
        color: '#059669',
        border: 'rgba(5, 150, 105, 0.3)',
      };
    case 'EMERGING':
      return {
        bg: 'rgba(8, 145, 178, 0.1)',
        color: '#0891B2',
        border: 'rgba(8, 145, 178, 0.3)',
      };
    case 'BUILD':
      return {
        bg: 'rgba(245, 158, 11, 0.1)',
        color: '#D97706',
        border: 'rgba(245, 158, 11, 0.3)',
      };
    case 'DEFENSIVE':
      return {
        bg: 'rgba(54, 118, 235, 0.1)',
        color: '#3676eb',
        border: 'rgba(54, 118, 235, 0.3)',
      };
    case 'NON_COMPETITIVE':
    default:
      return {
        bg: 'rgba(156, 163, 175, 0.1)',
        color: '#6B7280',
        border: 'rgba(156, 163, 175, 0.3)',
      };
  }
}

/**
 * Get score color based on opportunity score value
 */
function getScoreColor(score: number): string {
  if (score >= 70) return '#059669'; // High opportunity - green
  if (score >= 50) return '#0891B2'; // Emerging - cyan
  if (score >= 30) return '#D97706'; // Build - amber
  return '#6B7280'; // Non-competitive - gray
}

/**
 * Get margin display color based on party advantage
 */
function getMarginColor(marginDisplay: string): string {
  if (marginDisplay === 'N/A') return '#64748B';
  // + means Republican advantage (red), - means Democrat (blue)
  if (marginDisplay.startsWith('+')) return '#DC2626';
  return '#1E40AF';
}

export default function TableRow({ row, index, onClick }: TableRowProps) {
  const tierStyles = getTierStyles(row.tier);
  const scoreColor = getScoreColor(row.opportunityScore);
  const marginColor = getMarginColor(row.marginDisplay);
  const isHighOpportunity = row.tier === 'HIGH_OPPORTUNITY';
  const isDefensive = row.tier === 'DEFENSIVE';

  return (
    <tr
      className={`strategic-table-row ${
        isHighOpportunity ? 'tier-highlight' : ''
      } ${isDefensive ? 'tier-defensive' : ''} ${
        index % 2 === 0 ? 'even' : 'odd'
      }`}
      onClick={() => onClick(row)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(row);
        }
      }}
      aria-label={`${row.districtId}: ${row.tierLabel}, Score ${row.opportunityScore}`}
    >
      {/* District */}
      <td className="strategic-table-td text-left">
        <div className="flex items-center gap-2">
          <span className="font-medium hover:underline" style={{ color: '#2563EB' }}>
            {row.districtId}
          </span>
          {row.needsCandidate && (
            <span
              className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase"
              style={{
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#D97706',
              }}
              title="Needs Democratic candidate"
            >
              Recruit
            </span>
          )}
          {row.openSeat && (
            <span
              className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium"
              style={{
                background: 'rgba(168, 85, 247, 0.1)',
                color: '#7C3AED',
              }}
              title="Open seat"
            >
              Open
            </span>
          )}
        </div>
      </td>

      {/* Incumbent */}
      <td className="strategic-table-td text-left hidden md:table-cell">
        <div className="flex flex-col">
          <span className="font-medium truncate max-w-[140px]" style={{ color: 'var(--text-color)' }}>
            {row.incumbent}
          </span>
          <span
            className="text-xs"
            style={{
              color:
                row.incumbentParty === 'Republican'
                  ? '#DC2626'
                  : row.incumbentParty === 'Democratic'
                  ? '#1E40AF'
                  : '#64748B',
            }}
          >
            {row.incumbentParty}
          </span>
        </div>
      </td>

      {/* Challenger */}
      <td className="strategic-table-td text-left hidden md:table-cell">
        {row.challenger ? (
          <div className="flex flex-col">
            <span className="font-medium truncate max-w-[140px]" style={{ color: 'var(--text-color)' }}>
              {row.challenger}
            </span>
            <span
              className="text-xs"
              style={{
                color:
                  row.challengerParty === 'Democratic'
                    ? '#1E40AF'
                    : row.challengerParty === 'Republican'
                    ? '#DC2626'
                    : '#64748B',
              }}
            >
              {row.challengerParty}
            </span>
          </div>
        ) : (
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
            None filed
          </span>
        )}
      </td>

      {/* Tier */}
      <td className="strategic-table-td text-left">
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          style={{
            background: tierStyles.bg,
            color: tierStyles.color,
          }}
        >
          {row.tierLabel}
        </span>
      </td>

      {/* Score */}
      <td className="strategic-table-td text-center">
        <span
          className="text-sm font-semibold tabular-nums"
          style={{ color: scoreColor }}
        >
          {row.opportunityScore}
        </span>
      </td>

      {/* 2024 Margin */}
      <td className="strategic-table-td text-right">
        <span
          className="font-mono text-sm font-semibold"
          style={{ color: marginColor }}
        >
          {row.marginDisplay}
        </span>
      </td>
    </tr>
  );
}
