import React from 'react';
import { PdsTable } from '@pine-ds/react';

interface TableProps {
  children: React.ReactNode;
  compact?: boolean;
  responsive?: boolean;
  fixedColumn?: boolean;
  selectable?: boolean;
  onRowSelect?: (detail: { rowIndex: number; selected: boolean }) => void;
  className?: string;
  componentId: string; // Required
}

export const Table: React.FC<TableProps> = ({
  children,
  compact = false,
  responsive = false,
  fixedColumn = false,
  selectable = false,
  onRowSelect,
  className = '',
  componentId
}) => {
  // Handle row selection event
  const handleRowSelect = (event: CustomEvent<{ rowIndex: number; selected: boolean }>) => {
    if (onRowSelect) {
      onRowSelect(event.detail);
    }
  };

  return (
    <PdsTable
      compact={compact}
      responsive={responsive}
      fixedColumn={fixedColumn}
      selectable={selectable}
      componentId={componentId}
      className={className}
      onPdsTableRowSelectionChanged={handleRowSelect}
    >
      {children}
    </PdsTable>
  );
};
