import React from 'react';
import { PdsAccordion } from '@pine-ds/react';

interface AccordionProps {
  label?: React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  className?: string;
  componentId?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  label = 'Details',
  children,
  isOpen = false,
  onToggle,
  className = '',
  componentId
}) => {
  // Handle toggle event (if needed for controlled behavior)
  const handleToggle = React.useCallback(() => {
    if (onToggle) {
      onToggle(!isOpen);
    }
  }, [isOpen, onToggle]);

  return (
    <PdsAccordion
      isOpen={isOpen}
      componentId={componentId}
      className={className}
    >
      <span slot="label">{label}</span>
      {children}
    </PdsAccordion>
  );
};
