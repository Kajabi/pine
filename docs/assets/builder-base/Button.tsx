import React from 'react';
import { PdsButton } from '@pine-ds/react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'disclosure' | 'destructive' | 'unstyled';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  iconOnly?: boolean;
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  name?: string;
  value?: string;
  startIcon?: React.ReactNode; // For start slot
  endIcon?: React.ReactNode; // For end slot
  onClick?: (event: Event) => void;
  className?: string;
  componentId?: string;
  // Deprecated prop for backward compatibility
  icon?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  loading = false,
  fullWidth = false,
  iconOnly = false,
  href,
  target,
  name,
  value,
  startIcon,
  endIcon,
  onClick,
  className = '',
  componentId,
  icon // deprecated
}) => {
  // Handle click event
  const handleClick = (event: Event) => {
    if (onClick) {
      onClick(event);
    }
  };

  // Warn about deprecated icon prop
  React.useEffect(() => {
    if (icon) {
      console.warn('Button: The "icon" prop is deprecated. Use "startIcon" instead.');
    }
  }, [icon]);

  return (
    <PdsButton
      variant={variant}
      type={type}
      disabled={disabled}
      loading={loading}
      fullWidth={fullWidth}
      iconOnly={iconOnly}
      href={href}
      target={target}
      name={name}
      value={value}
      componentId={componentId}
      className={className}
      icon={icon} // deprecated but still supported
      onPdsClick={handleClick}
    >
      {startIcon && <span slot="start">{startIcon}</span>}
      {children}
      {endIcon && <span slot="end">{endIcon}</span>}
    </PdsButton>
  );
};
