import React from 'react';
import { PdsModal } from '@pine-ds/react';

interface ModalProps {
  children: React.ReactNode;
  open?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
  backdropDismiss?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  className?: string;
  componentId?: string;
}

export const Modal: React.FC<ModalProps> = ({
  children,
  open = false,
  size = 'md',
  backdropDismiss = true,
  onOpen,
  onClose,
  className = '',
  componentId
}) => {
  // Handle modal open event
  const handleOpen = () => {
    if (onOpen) {
      onOpen();
    }
  };

  // Handle modal close event
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  // Ref to access modal methods
  const modalRef = React.useRef<any>(null);

  // Expose modal methods
  const showModal = React.useCallback(() => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  }, []);

  const hideModal = React.useCallback(() => {
    if (modalRef.current) {
      modalRef.current.hideModal();
    }
  }, []);

  // Attach methods to ref for external access
  React.useImperativeHandle(modalRef, () => ({
    showModal,
    hideModal
  }));

  return (
    <PdsModal
      ref={modalRef}
      open={open}
      size={size}
      backdropDismiss={backdropDismiss}
      componentId={componentId}
      className={className}
      onPdsModalOpen={handleOpen}
      onPdsModalClose={handleClose}
    >
      {children}
    </PdsModal>
  );
};
