import React from 'react';
import { PdsAlert } from '@pine-ds/react';

interface AlertProps {
  variant?: 'default' | 'danger' | 'info' | 'success' | 'warning';
  heading?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
  dismissible?: boolean;
  small?: boolean;
  componentId?: string;
  actions?: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'default',
  heading,
  children,
  onDismiss,
  className = '',
  dismissible = false,
  small = false,
  componentId,
  actions
}) => {
  // Handle dismiss event
  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <PdsAlert
      heading={heading}
      variant={variant}
      dismissible={dismissible}
      small={small}
      componentId={componentId}
      className={className}
      onPdsAlertDismissClick={handleDismiss}
    >
      {children}
      {actions && <div slot="actions">{actions}</div>}
    </PdsAlert>
  );
};
