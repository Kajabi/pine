import React from 'react';
import { PdsPopover } from '@pine-ds/react';

type PlacementType =
  | 'top' | 'top-start' | 'top-end'
  | 'right' | 'right-start' | 'right-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end';

interface PopoverProps {
  children: React.ReactNode;
  componentId: string;
  text: string;
  popoverTargetAction?: 'show' | 'toggle' | 'hide';
  popoverType?: 'auto' | 'manual';
  maxWidth?: number;
  placement?: PlacementType;
  className?: string;
}

export const Popover: React.FC<PopoverProps> = ({
  children,
  componentId,
  text,
  popoverTargetAction = 'show',
  popoverType = 'auto',
  maxWidth = 352,
  placement = 'right',
  className = ''
}) => {
  return (
    <PdsPopover
      componentId={componentId}
      text={text}
      popoverTargetAction={popoverTargetAction}
      popoverType={popoverType}
      maxWidth={maxWidth}
      placement={placement}
      className={className}
    >
      {children}
    </PdsPopover>
  );
};
