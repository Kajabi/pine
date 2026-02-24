import React from 'react';
import { PdsSwitch } from '@pine-ds/react';

interface SwitchProps {
  label: string; // Required
  checked?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  hideLabel?: boolean;
  name?: string;
  value?: string;
  helperMessage?: string;
  errorMessage?: string;
  onChange?: (event: InputEvent) => void;
  className?: string;
  componentId: string; // Required for accessibility
}

export const Switch: React.FC<SwitchProps> = ({
  label,
  checked = false,
  disabled = false,
  invalid = false,
  required = false,
  hideLabel = false,
  name,
  value,
  helperMessage,
  errorMessage,
  onChange,
  className = '',
  componentId
}) => {
  // Handle switch change event
  const handleChange = (event: CustomEvent<InputEvent>) => {
    if (onChange) {
      onChange(event.detail);
    }
  };

  return (
    <PdsSwitch
      label={label}
      checked={checked}
      disabled={disabled}
      invalid={invalid}
      required={required}
      hideLabel={hideLabel}
      name={name}
      value={value}
      helperMessage={helperMessage}
      errorMessage={errorMessage}
      componentId={componentId}
      className={className}
      onPdsSwitchChange={handleChange}
    />
  );
};
