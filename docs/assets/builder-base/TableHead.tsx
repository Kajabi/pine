import React from 'react';
import { PdsTableHead } from '@pine-ds/react';

interface TableHeadProps {
  children: React.ReactNode;
  indeterminate?: boolean;
  isSelected?: boolean;
  onSelectAll?: (detail: { isSelected: boolean }) => void;
  className?: string;
}

export const TableHead: React.FC<TableHeadProps> = ({
  children,
  indeterminate = false,
  isSelected = false,
  onSelectAll,
  className = ''
}) => {
  // Handle select all event
  const handleSelectAll = (event: CustomEvent<{ isSelected: boolean }>) => {
    if (onSelectAll) {
      onSelectAll(event.detail);
    }
  };

  return (
    <PdsTableHead
      indeterminate={indeterminate}
      isSelected={isSelected}
      className={className}
      onPdsTableSelectAll={handleSelectAll}
    >
      {children}
    </PdsTableHead>
  );
};
