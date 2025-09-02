import React from 'react';
import { PdsDropdownMenu } from '@pine-ds/react';

interface DropdownMenuItem {
  label: string;
  value: string;
  disabled?: boolean;
  separator?: boolean;
  onClick?: () => void;
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  open?: boolean;
  onItemClick?: (value: string) => void;
  onOpen?: () => void;
  onClose?: () => void;
  className?: string;
  componentId?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  items,
  placement = 'bottom-start',
  open = false,
  onItemClick,
  onOpen,
  onClose,
  className = '',
  componentId
}) => {
  // Handle item click event
  const handleItemClick = (event: CustomEvent<string>) => {
    if (onItemClick) {
      onItemClick(event.detail);
    }
  };

  // Handle open event
  const handleOpen = () => {
    if (onOpen) {
      onOpen();
    }
  };

  // Handle close event
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <PdsDropdownMenu
      placement={placement}
      open={open}
      componentId={componentId}
      className={className}
      onPdsDropdownMenuItemClick={handleItemClick}
      onPdsDropdownMenuOpen={handleOpen}
      onPdsDropdownMenuClose={handleClose}
    >
      <div slot="trigger">{trigger}</div>
      {items.map((item, index) => (
        <React.Fragment key={item.value || index}>
          {item.separator ? (
            <pds-dropdown-menu-separator />
          ) : (
            <pds-dropdown-menu-item
              value={item.value}
              disabled={item.disabled}
              onClick={item.onClick}
            >
              {item.label}
            </pds-dropdown-menu-item>
          )}
        </React.Fragment>
      ))}
    </PdsDropdownMenu>
  );
};
