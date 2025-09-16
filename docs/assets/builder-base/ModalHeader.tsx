import React from 'react';
import { PdsModalHeader } from '@pine-ds/react';

interface ModalHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  children,
  className = ''
}) => {
  return (
    <PdsModalHeader className={className}>
      {children}
    </PdsModalHeader>
  );
};
