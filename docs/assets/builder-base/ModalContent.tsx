import React from 'react';
import { PdsModalContent } from '@pine-ds/react';

interface ModalContentProps {
  children: React.ReactNode;
  border?: 'none' | 'both' | 'top' | 'bottom';
  className?: string;
}

export const ModalContent: React.FC<ModalContentProps> = ({
  children,
  border = 'none',
  className = ''
}) => {
  return (
    <PdsModalContent
      border={border}
      className={className}
    >
      {children}
    </PdsModalContent>
  );
};
