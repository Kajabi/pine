import React from 'react';
import { PdsCopytext } from '@pine-ds/react';

interface CopytextProps {
  children: React.ReactNode;
  copyable?: boolean;
  value?: string;
  onCopy?: (value: string) => void;
  className?: string;
  componentId?: string;
}

export const Copytext: React.FC<CopytextProps> = ({
  children,
  copyable = true,
  value,
  onCopy,
  className = '',
  componentId
}) => {
  // Handle copy event
  const handleCopy = (event: CustomEvent<string>) => {
    if (onCopy) {
      onCopy(event.detail);
    }
  };

  return (
    <PdsCopytext
      copyable={copyable}
      value={value}
      componentId={componentId}
      className={className}
      onPdsCopy={handleCopy}
    >
      {children}
    </PdsCopytext>
  );
};
