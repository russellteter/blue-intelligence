'use client';

import { AnimatedCounter } from './AnimatedCounter';

export type KPIVariant = 'democrat' | 'republican' | 'unknown' | 'empty' | 'default' | 'contested';

interface KPICardProps {
  label: string;
  value: number;
  variant?: KPIVariant;
  suffix?: string;
  prefix?: string;
  subtext?: string;
  onClick?: () => void;
  className?: string;
  animationDelay?: number;
}

const variantStyles: Record<KPIVariant, {
  valueColor: string;
  accentColor: string;
}> = {
  democrat: {
    valueColor: '#1E40AF',
    accentColor: '#1E40AF',
  },
  republican: {
    valueColor: '#DC2626',
    accentColor: '#DC2626',
  },
  contested: {
    valueColor: '#059669',
    accentColor: '#059669',
  },
  unknown: {
    valueColor: '#64748B',
    accentColor: '#D97706',
  },
  empty: {
    valueColor: '#94A3B8',
    accentColor: '#CBD5E1',
  },
  default: {
    valueColor: '#0F172A',
    accentColor: '#1E40AF',
  },
};

/**
 * Clean KPI Card with animated counter - Class Dashboard Style
 */
export function KPICard({
  label,
  value,
  variant = 'default',
  suffix = '',
  prefix = '',
  subtext,
  onClick,
  className = '',
  animationDelay = 0,
}: KPICardProps) {
  const styles = variantStyles[variant];
  const isClickable = !!onClick;

  return (
    <div
      className={`kpi-card animate-entrance ${className}`}
      style={{
        animationDelay: `${animationDelay}ms`,
        cursor: isClickable ? 'pointer' : 'default',
        borderTop: `3px solid ${styles.accentColor}`,
      }}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      } : undefined}
    >
      {/* Label */}
      <div className="text-xs uppercase tracking-wide mb-1" style={{ color: '#64748B' }}>
        {label}
      </div>

      {/* Animated value */}
      <div className="font-display">
        <AnimatedCounter
          value={value}
          prefix={prefix}
          suffix={suffix}
          className="text-2xl font-bold tracking-tight"
          style={{ color: styles.valueColor }}
          duration={1500}
          formatNumber={(num) => Math.round(num).toLocaleString()}
        />
      </div>

      {/* Optional subtext */}
      {subtext && (
        <p className="text-xs mt-2 pt-2 border-t" style={{ color: '#64748B', borderColor: '#E2E8F0' }}>
          {subtext}
        </p>
      )}

      {/* Accessible value for screen readers */}
      <span className="sr-only">
        {label}: {prefix}{value}{suffix}
      </span>
    </div>
  );
}

export default KPICard;
