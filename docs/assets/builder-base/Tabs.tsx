import React from 'react';
import { PdsTabs } from '@pine-ds/react';

interface TabsProps {
  children: React.ReactNode;
  tablistLabel: string; // Required
  variant: 'primary' | 'availability' | 'filter' | 'pill'; // Required
  activeTabName: string; // Required
  onTabClick?: (detail: [number, string]) => void;
  className?: string;
  componentId?: string; // Optional with fallback
}

export const Tabs: React.FC<TabsProps> = ({
  children,
  tablistLabel,
  variant,
  activeTabName,
  onTabClick,
  className = '',
  componentId
}) => {
  // Generate unique componentId if not provided
  const tabsId = componentId || React.useId();
  // Handle tab click event
  const handleTabClick = (event: CustomEvent<[number, string]>) => {
    if (onTabClick) {
      onTabClick(event.detail);
    }
  };

  return (
    <PdsTabs
      tablistLabel={tablistLabel}
      variant={variant}
      activeTabName={activeTabName}
      componentId={tabsId}
      className={className}
      onPdsTabClick={handleTabClick}
    >
      {children}
    </PdsTabs>
  );
};
