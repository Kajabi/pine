import React from 'react';
import { PdsChip } from '@pine-ds/react';

interface ChipProps {
  children: React.ReactNode;
  sentiment?: 'accent' | 'brand' | 'danger' | 'info' | 'neutral' | 'success' | 'warning';
  variant?: 'text' | 'tag' | 'dropdown';
  icon?: string;
  dot?: boolean;
  large?: boolean;
  onTagClose?: () => void;
  className?: string;
  componentId?: string;
}

export const Chip: React.FC<ChipProps> = ({
  children,
  sentiment = 'neutral',
  variant = 'text',
  icon,
  dot = false,
  large = false,
  onTagClose,
  className = '',
  componentId
}) => {
  // Handle tag close event
  const handleTagClose = () => {
    if (onTagClose) {
      onTagClose();
    }
  };

  // Validate props for brand sentiment
  const effectiveProps = React.useMemo(() => {
    if (sentiment === 'brand') {
      // Brand sentiment only supports icon and large, ignore others
      return {
        sentiment,
        variant: 'text', // Brand always uses text variant
        icon,
        large,
        dot: false, // Brand doesn't support dot
      };
    }

    return {
      sentiment,
      variant,
      icon,
      large,
      dot,
    };
  }, [sentiment, variant, icon, large, dot]);

  return (
    <PdsChip
      sentiment={effectiveProps.sentiment}
      variant={effectiveProps.variant}
      icon={effectiveProps.icon}
      dot={effectiveProps.dot}
      large={effectiveProps.large}
      componentId={componentId}
      className={className}
      onPdsTagCloseClick={handleTagClose}
    >
      {children}
    </PdsChip>
  );
};
