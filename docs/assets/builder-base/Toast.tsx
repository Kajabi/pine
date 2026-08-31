import React from 'react';
import { PdsToast } from '@pine-ds/react';

interface ToastProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  duration?: number;
  dismissible?: boolean;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  onDismiss?: () => void;
  className?: string;
  componentId?: string;
}

export const Toast: React.FC<ToastProps> = ({
  children,
  variant = 'default',
  duration = 5000,
  dismissible = true,
  position = 'top-right',
  onDismiss,
  className = '',
  componentId
}) => {
  // Handle dismiss event
  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <PdsToast
      variant={variant}
      duration={duration}
      dismissible={dismissible}
      position={position}
      componentId={componentId}
      className={className}
      onPdsToastDismiss={handleDismiss}
    >
      {children}
    </PdsToast>
  );
};
