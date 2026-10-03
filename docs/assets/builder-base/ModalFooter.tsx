import React from 'react';
import { PdsModalFooter } from '@pine-ds/react';

interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  className = ''
}) => {
  return (
    <PdsModalFooter className={className}>
      {children}
    </PdsModalFooter>
  );
};
