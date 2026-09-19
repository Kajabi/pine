import React from 'react';
import { PdsProgress } from '@pine-ds/react';

interface ProgressProps {
  label: string; // Required
  percent?: number;
  animated?: boolean;
  showPercent?: boolean;
  fillColor?: string;
  className?: string;
  componentId?: string; // Optional with fallback
}

export const Progress: React.FC<ProgressProps> = ({
  label,
  percent = 0,
  animated = false,
  showPercent = false,
  fillColor,
  className = '',
  componentId
}) => {
  // Generate unique componentId if not provided
  const progressId = componentId || React.useId();
  return (
    <PdsProgress
      label={label}
      percent={percent}
      animated={animated}
      showPercent={showPercent}
      fillColor={fillColor}
      componentId={progressId}
      className={className}
    />
  );
};
