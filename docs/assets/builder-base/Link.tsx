import React from 'react';
import { PdsLink } from '@pine-ds/react';

interface LinkProps {
  href: string; // Required
  children?: React.ReactNode;
  variant?: 'inline' | 'plain';
  fontSize?: 'sm' | 'md' | 'lg';
  color?: string;
  external?: boolean;
  className?: string;
  componentId?: string;
}

export const Link: React.FC<LinkProps> = ({
  href,
  children,
  variant = 'inline',
  fontSize = 'lg',
  color,
  external = false,
  className = '',
  componentId
}) => {
  return (
    <PdsLink
      href={href}
      variant={variant}
      fontSize={fontSize}
      color={color}
      external={external}
      componentId={componentId}
      className={className}
    >
      {children}
    </PdsLink>
  );
};
