import React from 'react';
import { PdsImage } from '@pine-ds/react';

interface ImageProps {
  src: string; // Required
  alt: string; // Required for accessibility
  width?: string | number;
  height?: string | number;
  lazy?: boolean;
  className?: string;
  componentId?: string;
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  width,
  height,
  lazy = true,
  className = '',
  componentId
}) => {
  return (
    <PdsImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      lazy={lazy}
      componentId={componentId}
      className={className}
    />
  );
};
