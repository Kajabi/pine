import React from 'react';
import { PdsAvatar } from '@pine-ds/react';

interface AvatarProps {
  image?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string;
  variant?: 'customer' | 'admin';
  badge?: boolean;
  dropdown?: boolean;
  onClick?: () => void;
  className?: string;
  componentId?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  image,
  alt,
  size = 'lg',
  variant = 'customer',
  badge = false,
  dropdown = false,
  onClick,
  className = '',
  componentId
}) => {
  // Handle click event for dropdown functionality
  const handleClick = () => {
    if (dropdown && onClick) {
      onClick();
    }
  };

  return (
    <PdsAvatar
      image={image}
      alt={alt}
      size={size}
      variant={variant}
      badge={badge}
      dropdown={dropdown}
      componentId={componentId}
      className={className}
      onClick={handleClick}
    />
  );
};
