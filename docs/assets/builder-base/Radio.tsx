import React from 'react';
import { PdsRadio } from '@pine-ds/react';

interface RadioProps {
  label: string;
  checked?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  hideLabel?: boolean;
  name?: string;
  value?: string;
  helperMessage?: string;
  errorMessage?: string;
  onChange?: (checked: boolean) => void;
  className?: string;
  componentId: string; // Required for accessibility
}

export const Radio: React.FC<RadioProps> = ({
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
  // Handle radio change event
  const handleChange = (event: CustomEvent<boolean>) => {
    if (onChange) {
      onChange(event.detail);
    }
  };

  return (
    <PdsRadio
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
      onPdsRadioChange={handleChange}
    />
  );
};
