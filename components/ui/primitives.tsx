/**
 * GridPlay UI Primitives
 * 
 * Base UI components built on design tokens for consistency.
 */

import React from 'react';
import { vars } from '@/lib/css-variables';

// ===========================================
// Button
// ===========================================

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = '',
      disabled,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const baseStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: vars.spacing[2],
      fontFamily: vars.font.sans,
      fontWeight: vars.fontWeight.semibold,
      borderRadius: vars.radius.lg,
      transition: `all ${vars.transition.normal}`,
      whiteSpace: 'nowrap',
      width: fullWidth ? '100%' : 'auto',
    } as React.CSSProperties;

    const sizeStyles = {
      sm: { padding: `${vars.spacing[2]} ${vars.spacing[3]}`, fontSize: vars.fontSize.sm, gap: vars.spacing[1] },
      md: { padding: `${vars.spacing[3]} ${vars.spacing[5]}`, fontSize: vars.fontSize.base, gap: vars.spacing[2] },
      lg: { padding: `${vars.spacing[4]} ${vars.spacing[6]}`, fontSize: vars.fontSize.lg, gap: vars.spacing[2] },
      xl: { padding: `${vars.spacing[5]} ${vars.spacing[8]}`, fontSize: vars.fontSize.xl, gap: vars.spacing[3] },
    } as const;

    const variantStyles = {
      primary: {
        background: `linear-gradient(135deg, ${vars.color.primary} 0%, ${vars.color.primaryHover} 100%)`,
        color: vars.color.textInverse,
        border: 'none',
        boxShadow: vars.shadow.primary,
      },
      secondary: {
        background: vars.color.surface,
        color: vars.color.textPrimary,
        border: `1px solid ${vars.color.border}`,
        boxShadow: vars.shadow.sm,
      },
      accent: {
        background: `linear-gradient(135deg, ${vars.color.accent} 0%, ${vars.color.accentHover} 100%)`,
        color: vars.color.textInverse,
        border: 'none',
        boxShadow: vars.shadow.accent,
      },
      ghost: {
        background: 'transparent',
        color: vars.color.textSecondary,
        border: 'none',
        boxShadow: 'none',
      },
      danger: {
        background: `linear-gradient(135deg, ${vars.color.error} 0%, ${vars.color.errorBorder} 100%)`,
        color: vars.color.textInverse,
        border: 'none',
        boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)',
      },
    } as const;

    const hoverStyles = {
      primary: { background: `linear-gradient(135deg, ${vars.color.primaryHover} 0%, ${vars.color.primary} 100%)`, transform: 'translateY(-1px)', boxShadow: vars.shadow.primary },
      secondary: { background: vars.color.surfaceElevated, borderColor: vars.color.borderHover, transform: 'translateY(-1px)' },
      accent: { background: `linear-gradient(135deg, ${vars.color.accentHover} 0%, ${vars.color.accent} 100%)`, transform: 'translateY(-1px)', boxShadow: vars.shadow.accent },
      ghost: { background: vars.color.surface, color: vars.color.textPrimary },
      danger: { transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(239, 68, 68, 0.4)' },
    } as const;

    const disabledStyles = {
      opacity: 0.5,
      cursor: 'not-allowed',
      transform: 'none',
    } as React.CSSProperties;

    const combinedStyle: React.CSSProperties = {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(isLoading || disabled ? disabledStyles : {}),
      ...style,
    };

    return (
      <button
        ref={ref}
        className={className}
        style={combinedStyle}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="31.4 31.4"
            />
          </svg>
        )}
        {!isLoading && leftIcon && <span aria-hidden="true">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span aria-hidden="true">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

// ===========================================
// Card
// ===========================================

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      hoverable = false,
      className = '',
      style,
      children,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      default: {
        background: vars.color.card,
        border: `1px solid ${vars.color.border}`,
      },
      elevated: {
        background: vars.color.card,
        border: `1px solid ${vars.color.border}`,
        boxShadow: vars.shadow.lg,
      },
      glass: {
        background: 'rgba(26, 26, 26, 0.8)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${vars.color.border}`,
      },
      outlined: {
        background: 'transparent',
        border: `1px solid ${vars.color.border}`,
      },
    } as const;

    const paddingStyles = {
      none: {},
      sm: { padding: vars.spacing[3] },
      md: { padding: vars.spacing[5] },
      lg: { padding: vars.spacing[6] },
    } as const;

    const combinedStyle: React.CSSProperties = {
      borderRadius: vars.radius.xl,
      transition: `all ${vars.transition.normal}`,
      ...variantStyles[variant],
      ...paddingStyles[padding],
      ...style,
    };

    return (
      <div
        ref={ref}
        className={className}
        style={combinedStyle}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// ===========================================
// Input
// ===========================================

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className = '',
      style,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || `input-${generatedId}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    const wrapperStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: vars.spacing[1],
      width: '100%',
      ...style,
    };

    const labelStyle: React.CSSProperties = {
      fontSize: vars.fontSize.sm,
      fontWeight: vars.fontWeight.medium,
      color: vars.color.textPrimary,
    };

    const inputWrapperStyle: React.CSSProperties = {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    };

    const inputStyle: React.CSSProperties = {
      width: '100%',
      paddingLeft: leftIcon ? vars.spacing[10] : vars.spacing[4],
      paddingRight: rightIcon ? vars.spacing[10] : vars.spacing[4],
      backgroundColor: vars.color.surface,
      border: `1px solid ${error ? vars.color.error : vars.color.border}`,
      borderRadius: vars.radius.md,
      color: vars.color.textPrimary,
      fontSize: vars.fontSize.base,
      transition: `all ${vars.transition.fast}`,
      outline: 'none',
    };

    const iconStyle: React.CSSProperties = {
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: vars.color.textTertiary,
      pointerEvents: 'none',
      left: leftIcon ? vars.spacing[3] : undefined,
      right: rightIcon ? vars.spacing[3] : undefined,
    };

    const messageStyle: React.CSSProperties = {
      fontSize: vars.fontSize.xs,
      color: error ? vars.color.error : vars.color.textTertiary,
    };

    return (
      <div style={wrapperStyle} className={className}>
        {label && <label htmlFor={inputId} style={labelStyle}>{label}</label>}
        <div style={inputWrapperStyle}>
          {leftIcon && <span style={iconStyle} aria-hidden="true">{leftIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            style={inputStyle}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={errorId || helperId}
            {...props}
          />
          {rightIcon && <span style={iconStyle} aria-hidden="true">{rightIcon}</span>}
        </div>
        {error && <p id={errorId} style={messageStyle} role="alert">{error}</p>}
        {helperText && !error && <p id={helperId} style={messageStyle}>{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

// ===========================================
// Badge
// ===========================================

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'default',
      size = 'md',
      dot = false,
      className = '',
      style,
      children,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      default: { background: vars.color.surface, color: vars.color.textSecondary, border: `1px solid ${vars.color.border}` },
      primary: { background: 'rgba(16, 185, 129, 0.15)', color: vars.color.primary, border: `1px solid rgba(16, 185, 129, 0.3)` },
      success: { background: vars.color.successBg, color: vars.color.success, border: `1px solid ${vars.color.successBorder}` },
      warning: { background: vars.color.warningBg, color: vars.color.warning, border: `1px solid ${vars.color.warningBorder}` },
      error: { background: vars.color.errorBg, color: vars.color.error, border: `1px solid ${vars.color.errorBorder}` },
      info: { background: vars.color.infoBg, color: vars.color.info, border: `1px solid ${vars.color.infoBorder}` },
      accent: { background: vars.color.warningBg, color: vars.color.warning, border: `1px solid ${vars.color.warningBorder}` },
    } as const;

    const sizeStyles = {
      sm: { padding: `${vars.spacing[1]} ${vars.spacing[2]}`, fontSize: vars.fontSize.xs, gap: vars.spacing[1] },
      md: { padding: `${vars.spacing[1]} ${vars.spacing[3]}`, fontSize: vars.fontSize.sm, gap: vars.spacing[1] },
      lg: { padding: `${vars.spacing[2]} ${vars.spacing[4]}`, fontSize: vars.fontSize.base, gap: vars.spacing[2] },
    } as const;

    const dotColors = {
      default: vars.color.textTertiary,
      primary: vars.color.primary,
      success: vars.color.success,
      warning: vars.color.warning,
      error: vars.color.error,
      info: vars.color.info,
      accent: vars.color.accent,
    } as const;

    const combinedStyle: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      fontFamily: vars.font.sans,
      fontWeight: vars.fontWeight.semibold,
      borderRadius: vars.radius.full,
      whiteSpace: 'nowrap',
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...style,
    };

    return (
      <span ref={ref} className={className} style={combinedStyle} {...props}>
        {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: dotColors[variant] }} aria-hidden="true" />}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// ===========================================
// Avatar
// ===========================================

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt,
      name,
      size = 'md',
      shape = 'circle',
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      xs: { width: 24, height: 24, fontSize: vars.fontSize.xs },
      sm: { width: 32, height: 32, fontSize: vars.fontSize.sm },
      md: { width: 40, height: 40, fontSize: vars.fontSize.base },
      lg: { width: 56, height: 56, fontSize: vars.fontSize.lg },
      xl: { width: 80, height: 80, fontSize: vars.fontSize.xl },
    } as const;

    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    const getColorFromName = (name: string) => {
      const colors = [
        vars.color.primary,
        vars.color.accent,
        vars.color.info,
        vars.color.warning,
        vars.color.error,
        '#8B5CF6',
        '#EC4899',
        '#06B6D4',
      ];
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      return colors[Math.abs(hash) % colors.length];
    };

    const sizeValue = sizeStyles[size];
    const borderRadius = shape === 'circle' ? '50%' : vars.radius.lg;

    const containerStyle: React.CSSProperties = {
      width: sizeValue.width,
      height: sizeValue.height,
      borderRadius,
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: vars.fontWeight.semibold,
      fontSize: sizeValue.fontSize,
      ...style,
    };

    if (src) {
      return (
        <div ref={ref} className={className} style={containerStyle} {...props}>
          <img src={src} alt={alt || name || 'Avatar'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      );
    }

    const bgColor = name ? getColorFromName(name) : vars.color.border;
    const textColor = name ? vars.color.textInverse : vars.color.textTertiary;

    return (
      <div
        ref={ref}
        className={className}
        style={{ ...containerStyle, background: bgColor, color: textColor }}
        {...props}
      >
        {name ? getInitials(name) : '?'}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

// ===========================================
// Tooltip
// ===========================================

export interface TooltipProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export const Tooltip = ({ content, children, position = 'top', delay = 200, ...props }: TooltipProps) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [timeoutId, setTimeoutId] = React.useState<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const positions = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: vars.spacing[2] },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: vars.spacing[2] },
    left: { right: '100%', top: '50%', transform: 'translateY(50%)', marginRight: vars.spacing[2] },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: vars.spacing[2] },
  } as const;

  const arrowPositions = {
    top: { bottom: '-4px', left: '50%', transform: 'translateX(-50%) rotate(45deg)' },
    bottom: { top: '-4px', left: '50%', transform: 'translateX(-50%) rotate(45deg)' },
    left: { right: '-4px', top: '50%', transform: 'translateY(-50%) rotate(45deg)' },
    right: { left: '-4px', top: '50%', transform: 'translateY(-50%) rotate(45deg)' },
  } as const;

  return (
    <div
      {...props}
      style={{
        position: 'relative',
        display: 'inline-flex',
        ...props.style,
      }}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {React.cloneElement(children, {
        onMouseEnter: showTooltip,
        onMouseLeave: hideTooltip,
        onFocus: showTooltip,
        onBlur: hideTooltip,
      })}
      {isVisible && (
        <div
          style={{
            position: 'absolute',
            zIndex: vars.zIndex.tooltip,
            padding: `${vars.spacing[2]} ${vars.spacing[3]}`,
            background: vars.color.surfaceElevated,
            border: `1px solid ${vars.color.border}`,
            borderRadius: vars.radius.md,
            fontSize: vars.fontSize.sm,
            color: vars.color.textPrimary,
            whiteSpace: 'nowrap',
            boxShadow: vars.shadow.lg,
            ...positions[position],
            animation: `fadeIn ${vars.transition.fast}`,
          }}
          role="tooltip"
        >
          {content}
          <div
            style={{
              position: 'absolute',
              width: 8,
              height: 8,
              background: vars.color.surfaceElevated,
              borderLeft: `1px solid ${vars.color.border}`,
              borderBottom: `1px solid ${vars.color.border}`,
              ...arrowPositions[position],
            }}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
};

// ===========================================
// Separator
// ===========================================

export interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
}

export const Separator = React.forwardRef<HTMLHRElement, SeparatorProps>(
  ({ orientation = 'horizontal', decorative = true, className = '', style, ...props }, ref) => {
    const baseStyle: React.CSSProperties = {
      border: 'none',
      background: vars.color.border,
      ...(orientation === 'horizontal'
        ? { width: '100%', height: 1 }
        : { width: 1, height: '100%', minHeight: vars.spacing[16] }),
    };

    return (
      <hr
        ref={ref}
        className={className}
        style={{ ...baseStyle, ...style }}
        role={decorative ? 'none' : 'separator'}
        aria-orientation={orientation}
        {...props}
      />
    );
  }
);

Separator.displayName = 'Separator';