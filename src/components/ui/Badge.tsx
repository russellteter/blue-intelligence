'use client';

import { HTMLAttributes } from 'react';

export type BadgeVariant =
  | 'excellent'    // Green - success/positive states
  | 'healthy'      // Purple - Democrat/normal states
  | 'attention'    // Amber - needs attention (WCAG compliant)
  | 'at-risk'      // Red - critical/negative states
  | 'neutral'      // Gray - neutral/inactive states
  | 'info';        // Blue - informational states

export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** Shows animated pulse indicator */
  showPulse?: boolean;
  /** Custom dot color (overrides variant color) */
  dotColor?: string;
  /** Icon to display before the label */
  leftIcon?: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, {
  bg: string;
  text: string;
  border: string;
  dot: string;
}> = {
  excellent: {
    bg: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
    text: '#059669',
    border: 'rgba(5, 150, 105, 0.3)',
    dot: '#059669',
  },
  healthy: {
    bg: 'linear-gradient(135deg, #F6F6FE 0%, #EDE9FE 100%)',
    text: 'var(--class-purple)',
    border: 'rgba(71, 57, 231, 0.3)',
    dot: 'var(--class-purple)',
  },
  attention: {
    // Using #D97706 instead of #FFBA00 for WCAG AA compliance (4.6:1 contrast)
    bg: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
    text: '#B45309',
    border: 'rgba(217, 119, 6, 0.3)',
    dot: '#D97706',
  },
  'at-risk': {
    bg: 'linear-gradient(135deg, #FEF2F2 0%, #FECACA 100%)',
    text: '#DC2626',
    border: 'rgba(220, 38, 38, 0.3)',
    dot: '#DC2626',
  },
  neutral: {
    bg: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
    text: '#6B7280',
    border: 'rgba(107, 114, 128, 0.3)',
    dot: '#9CA3AF',
  },
  info: {
    bg: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
    text: '#2563EB',
    border: 'rgba(37, 99, 235, 0.3)',
    dot: '#3B82F6',
  },
};

const sizeStyles: Record<BadgeSize, {
  padding: string;
  fontSize: string;
  gap: string;
  dotSize: string;
  minHeight: string;
}> = {
  sm: {
    padding: 'px-2 py-0.5',
    fontSize: 'text-[10px]',
    gap: 'gap-1',
    dotSize: 'w-1.5 h-1.5',
    minHeight: 'min-h-[20px]',
  },
  md: {
    padding: 'px-3 py-1',
    fontSize: 'text-xs',
    gap: 'gap-1.5',
    dotSize: 'w-2 h-2',
    minHeight: 'min-h-[24px]',
  },
  lg: {
    padding: 'px-4 py-1.5',
    fontSize: 'text-sm',
    gap: 'gap-2',
    dotSize: 'w-2.5 h-2.5',
    minHeight: 'min-h-[32px]',
  },
};

/**
 * Badge primitive for status indicators with consistent styling and optional pulse animation.
 *
 * Variants:
 * - excellent: Green for success/positive states (e.g., "Both parties running")
 * - healthy: Purple for Democrat/normal states (e.g., "Democrat filed")
 * - attention: Amber for states needing attention - WCAG AA compliant
 * - at-risk: Red for critical/negative states (e.g., "At risk")
 * - neutral: Gray for neutral/inactive states (e.g., "Unknown")
 * - info: Blue for informational states (e.g., "Defensive")
 *
 * Features:
 * - Optional animated pulse indicator (great for "live" status)
 * - Three sizes for different contexts
 * - Gradient backgrounds for depth
 * - Accessible contrast ratios
 */
export function Badge({
  variant = 'neutral',
  size = 'md',
  showPulse = false,
  dotColor,
  leftIcon,
  className = '',
  children,
  ...props
}: BadgeProps) {
  const styles = variantStyles[variant];
  const sizeClasses = sizeStyles[size];
  const effectiveDotColor = dotColor || styles.dot;

  return (
    <span
      className={`
        inline-flex items-center justify-center
        ${sizeClasses.padding}
        ${sizeClasses.fontSize}
        ${sizeClasses.gap}
        ${sizeClasses.minHeight}
        font-semibold
        rounded-full
        whitespace-nowrap
        uppercase
        tracking-wide
        ${className}
      `}
      style={{
        background: styles.bg,
        color: styles.text,
        border: `1px solid ${styles.border}`,
        boxShadow: `0 2px 8px -2px ${styles.border}`,
      }}
      {...props}
    >
      {showPulse && (
        <span
          className={`relative ${sizeClasses.dotSize} rounded-full flex-shrink-0`}
          style={{ background: effectiveDotColor }}
          aria-hidden="true"
        >
          {/* Pulse ring animation */}
          <span
            className={`absolute inset-[-3px] rounded-full animate-pulse-ring`}
            style={{ background: effectiveDotColor }}
          />
        </span>
      )}
      {leftIcon && !showPulse && (
        <span className={sizeClasses.dotSize} aria-hidden="true">
          {leftIcon}
        </span>
      )}
      {children}
    </span>
  );
}

export default Badge;
