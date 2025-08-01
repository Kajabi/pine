import React from 'react';
import { PdsTooltip } from '@pine-ds/react';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  trigger?: 'hover' | 'click' | 'focus';
  disabled?: boolean;
  delay?: number;
  className?: string;
  componentId?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  placement = 'top',
  trigger = 'hover',
  disabled = false,
  delay = 0,
  className = '',
  componentId
}) => {
  return (
    <PdsTooltip
      placement={placement}
      trigger={trigger}
      disabled={disabled}
      delay={delay}
      componentId={componentId}
      className={className}
    >
      <div slot="trigger">{children}</div>
      <div slot="content">{content}</div>
    </PdsTooltip>
  );
};
