import React from 'react';
import { PdsLoader } from '@pine-ds/react';

interface LoaderProps {
  children?: React.ReactNode;
  isLoading?: boolean;
  variant?: 'spinner' | 'ellipsis';
  size?: string;
  className?: string;
  componentId?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  children,
  isLoading = true,
  variant = 'spinner',
  size,
  className = '',
  componentId
}) => {
  return (
    <PdsLoader
      isLoading={isLoading}
      variant={variant}
      size={size}
      componentId={componentId}
      className={className}
    >
      {children}
    </PdsLoader>
  );
};
