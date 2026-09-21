import React from 'react';
import { PdsTableHeadCell } from '@pine-ds/react';

interface TableHeadCellProps {
  children: React.ReactNode;
  sortable?: boolean;
  onSort?: (detail: { column: string; direction: string }) => void;
  className?: string;
}

export const TableHeadCell: React.FC<TableHeadCellProps> = ({
  children,
  sortable = false,
  onSort,
  className = ''
}) => {
  // Handle sort event
  const handleSort = (event: CustomEvent<{ column: string; direction: string }>) => {
    if (onSort) {
      onSort(event.detail);
    }
  };

  return (
    <PdsTableHeadCell
      sortable={sortable}
      className={className}
      onPdsTableSort={handleSort}
    >
      {children}
    </PdsTableHeadCell>
  );
};
