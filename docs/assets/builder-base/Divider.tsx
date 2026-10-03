import React from 'react';
import { PdsDivider } from '@pine-ds/react';

interface DividerProps {
  direction?: 'horizontal' | 'vertical';
  className?: string;
  componentId?: string;
}

export const Divider: React.FC<DividerProps> = ({
  direction = 'horizontal',
  className = '',
  componentId
}) => {
  return (
    <PdsDivider
      direction={direction}
      componentId={componentId}
      className={className}
    />
  );
};
