'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Icon to display before the label */
  leftIcon?: React.ReactNode;
  /** Icon to display after the label */
  rightIcon?: React.ReactNode;
  /** Full width button */
  fullWidth?: boolean;
  /** Loading state */
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, {
  base: string;
  hover: string;
  active: string;
}> = {
  primary: {
    base: 'bg-[var(--class-purple)] text-white border-[var(--class-purple)]',
    hover: 'hover:bg-[#3a2dd0] hover:border-[#3a2dd0] hover:shadow-[var(--shadow-md)]',
    active: 'active:bg-[#2f24a8]',
  },
  secondary: {
    base: 'bg-[var(--card-bg)] text-[var(--text-color)] border-[var(--class-purple-light)]',
    hover: 'hover:bg-[var(--class-purple-bg)] hover:border-[var(--class-purple)] hover:text-[var(--class-purple)]',
    active: 'active:bg-[var(--class-purple-light)]',
  },
  ghost: {
    base: 'bg-transparent text-[var(--text-color)] border-transparent',
    hover: 'hover:bg-[var(--highlight-purple)] hover:text-[var(--class-purple)]',
    active: 'active:bg-[var(--class-purple-light)]',
  },
  danger: {
    base: 'bg-[var(--color-at-risk)] text-white border-[var(--color-at-risk)]',
    hover: 'hover:bg-[#b91c1c] hover:border-[#b91c1c] hover:shadow-[var(--shadow-md)]',
    active: 'active:bg-[#991b1b]',
  },
};

const sizeStyles: Record<ButtonSize, {
  padding: string;
  fontSize: string;
  minHeight: string;
  iconSize: string;
  gap: string;
}> = {
  sm: {
    padding: 'px-3 py-1.5',
    fontSize: 'text-xs',
    minHeight: 'min-h-[36px]',
    iconSize: 'w-3.5 h-3.5',
    gap: 'gap-1.5',
  },
  md: {
    padding: 'px-4 py-2',
    fontSize: 'text-sm',
    minHeight: 'min-h-[44px]', // WCAG touch target
    iconSize: 'w-4 h-4',
    gap: 'gap-2',
  },
  lg: {
    padding: 'px-6 py-3',
    fontSize: 'text-base',
    minHeight: 'min-h-[52px]',
    iconSize: 'w-5 h-5',
    gap: 'gap-2.5',
  },
};

/**
 * Button primitive with consistent styling, accessibility, and touch targets.
 *
 * Variants:
 * - primary: Purple filled button for primary actions
 * - secondary: White with purple border for secondary actions
 * - ghost: Transparent background for tertiary actions
 * - danger: Red filled button for destructive actions
 *
 * Sizes:
 * - sm: Small buttons for compact UI
 * - md: Default size with 44px min-height (WCAG touch target)
 * - lg: Large buttons for prominent CTAs
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'secondary',
      size = 'md',
      leftIcon,
      rightIcon,
      fullWidth = false,
      isLoading = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const variantClasses = variantStyles[variant];
    const sizeClasses = sizeStyles[size];
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center
          ${sizeClasses.padding}
          ${sizeClasses.fontSize}
          ${sizeClasses.minHeight}
          ${sizeClasses.gap}
          font-medium
          rounded-[var(--radius-md)]
          border
          transition-all duration-[var(--transition-fast)]
          focus-visible:outline-2 focus-visible:outline-[var(--class-purple)] focus-visible:outline-offset-2
          ${variantClasses.base}
          ${!isDisabled ? variantClasses.hover : ''}
          ${!isDisabled ? variantClasses.active : ''}
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className={`${sizeClasses.iconSize} animate-spin`}
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && (
              <span className={sizeClasses.iconSize} aria-hidden="true">
                {leftIcon}
              </span>
            )}
            {children}
            {rightIcon && (
              <span className={sizeClasses.iconSize} aria-hidden="true">
                {rightIcon}
              </span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
