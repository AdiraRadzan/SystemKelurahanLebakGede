import React, { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    let variantStyles = 'bg-[#1E3A8A] text-white hover:bg-[#2563EB] shadow-sm';

    if (variant === 'outline') {
      variantStyles = 'bg-white border border-[#CBD5E1] text-[#0F172A] hover:bg-[#F8FAFC] hover:border-[#94A3B8]';
    } else if (variant === 'danger') {
      variantStyles = 'bg-[#FEE2E2] text-[#B91C1C] border border-[#FECACA] hover:bg-[#FCA5A5]/40';
    } else if (variant === 'ghost') {
      variantStyles = 'bg-transparent text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]';
    }

    let sizeStyles = 'h-9 sm:h-10 px-3.5 sm:px-4 text-xs sm:text-sm font-semibold'; // clean & proportional
    if (size === 'sm') {
      sizeStyles = 'h-8 px-2.5 text-xs font-medium';
    } else if (size === 'lg') {
      sizeStyles = 'h-10 sm:h-11 px-4 sm:px-5 text-sm sm:text-base font-semibold';
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles} ${sizeStyles} ${className}`}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
