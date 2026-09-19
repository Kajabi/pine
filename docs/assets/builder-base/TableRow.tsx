import React from 'react';
import { PdsTableRow } from '@pine-ds/react';

interface TableRowProps {
  children: React.ReactNode;
  indeterminate?: boolean;
  isSelected?: boolean;
  onRowSelected?: (detail: { rowIndex: number; isSelected: boolean }) => void;
  className?: string;
}

export const TableRow: React.FC<TableRowProps> = ({
  children,
  indeterminate = false,
  isSelected = false,
  onRowSelected,
  className = ''
}) => {
  // Handle row selection event
  const handleRowSelected = (event: CustomEvent<{ rowIndex: number; isSelected: boolean }>) => {
    if (onRowSelected) {
      onRowSelected(event.detail);
    }
  };

  return (
    <PdsTableRow
      indeterminate={indeterminate}
      isSelected={isSelected}
      className={className}
      onPdsTableRowSelected={handleRowSelected}
    >
      {children}
    </PdsTableRow>
  );
};
