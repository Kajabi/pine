import React from 'react';
import { PdsTableBody } from '@pine-ds/react';

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const TableBody: React.FC<TableBodyProps> = ({
  children,
  className = ''
}) => {
  return (
    <PdsTableBody className={className}>
      {children}
    </PdsTableBody>
  );
};
