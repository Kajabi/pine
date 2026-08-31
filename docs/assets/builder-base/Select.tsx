import React from 'react';
import { PdsSelect } from '@pine-ds/react';

interface SelectProps {
  label?: string;
  value?: string | string[];
  name: string; // Required
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  multiple?: boolean;
  hideLabel?: boolean;
  autocomplete?: string; // Optional for React-friendliness
  helperMessage?: string; // Optional for React-friendliness
  errorMessage?: string; // Optional for React-friendliness
  actionContent?: React.ReactNode;
  children: React.ReactNode; // option and optgroup elements
  onChange?: (event: InputEvent) => void;
  className?: string;
  componentId?: string; // Optional with fallback
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  name,
  disabled = false,
  required = false,
  invalid = false,
  multiple = false,
  hideLabel = false,
  autocomplete,
  helperMessage,
  errorMessage,
  actionContent,
  children,
  onChange,
  className = '',
  componentId
}) => {
  // Generate unique componentId if not provided
  const selectId = componentId || React.useId();
  // Handle change event
  const handleChange = (event: CustomEvent<InputEvent>) => {
    if (onChange) {
      onChange(event.detail);
    }
  };

  return (
    <PdsSelect
      label={label}
      value={value}
      name={name}
      disabled={disabled}
      required={required}
      invalid={invalid}
      multiple={multiple}
      hideLabel={hideLabel}
      autocomplete={autocomplete}
      helperMessage={helperMessage}
      errorMessage={errorMessage}
      componentId={selectId}
      className={className}
      onPdsSelectChange={handleChange}
    >
      {actionContent && <div slot="action">{actionContent}</div>}
      {children}
    </PdsSelect>
  );
};
