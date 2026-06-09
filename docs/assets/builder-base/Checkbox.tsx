import React from 'react';
import { PdsCheckbox } from '@pine-ds/react';

interface CheckboxChangeEventDetail {
  checked: boolean;
  value: string;
}

interface CheckboxProps {
  label: string;
  checked?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  invalid?: boolean;
  required?: boolean;
  hideLabel?: boolean;
  name?: string;
  value?: string;
  helperMessage?: string;
  errorMessage?: string;
  onChange?: (detail: CheckboxChangeEventDetail) => void;
  onInput?: (detail: CheckboxChangeEventDetail) => void;
  className?: string;
  componentId: string; // Required for accessibility
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked = false,
  disabled = false,
  indeterminate = false,
  invalid = false,
  required = false,
  hideLabel = false,
  name,
  value,
  helperMessage,
  errorMessage,
  onChange,
  onInput,
  className = '',
  componentId
}) => {
  // Handle checkbox change event
  const handleChange = (event: CustomEvent<CheckboxChangeEventDetail>) => {
    if (onChange) {
      onChange(event.detail);
    }
  };

  // Handle input event
  const handleInput = (event: CustomEvent<CheckboxChangeEventDetail>) => {
    if (onInput) {
      onInput(event.detail);
    }
  };

  // Generate unique componentId if not provided
  const checkboxId = componentId || React.useId();

  return (
    <PdsCheckbox
      label={label}
      checked={checked}
      disabled={disabled}
      indeterminate={indeterminate}
      invalid={invalid}
      required={required}
      hideLabel={hideLabel}
      name={name}
      value={value}
      helperMessage={helperMessage}
      errorMessage={errorMessage}
      componentId={checkboxId}
      className={className}
      onPdsCheckboxChange={handleChange}
      onPdsCheckboxInput={handleInput}
    />
  );
};
