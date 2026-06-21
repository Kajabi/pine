import React from 'react';
import { PdsTableCell } from '@pine-ds/react';

interface TableCellProps {
  children: React.ReactNode;
  truncate?: boolean;
  className?: string;
}

export const TableCell: React.FC<TableCellProps> = ({
  children,
  truncate = false,
  className = ''
}) => {
  return (
    <PdsTableCell
      truncate={truncate}
      className={className}
    >
      {children}
    </PdsTableCell>
  );
};
