import React from 'react';
import { PdsCombobox } from '@pine-ds/react';

interface ComboboxProps {
  label?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  name?: string;
  helperMessage?: string;
  errorMessage?: string;
  options: Array<{ label: string; value: string; disabled?: boolean }>;
  filterable?: boolean;
  multiSelect?: boolean;
  onChange?: (value: string | string[]) => void;
  onFilter?: (query: string) => void;
  className?: string;
  componentId: string; // Required
}

export const Combobox: React.FC<ComboboxProps> = ({
  label,
  value,
  placeholder,
  disabled = false,
  required = false,
  invalid = false,
  name,
  helperMessage,
  errorMessage,
  options,
  filterable = true,
  multiSelect = false,
  onChange,
  onFilter,
  className = '',
  componentId
}) => {
  // Handle change event
  const handleChange = (event: CustomEvent) => {
    if (onChange) {
      onChange(event.detail);
    }
  };

  // Handle filter event
  const handleFilter = (event: CustomEvent<string>) => {
    if (onFilter) {
      onFilter(event.detail);
    }
  };

  return (
    <PdsCombobox
      label={label}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      invalid={invalid}
      name={name}
      helperMessage={helperMessage}
      errorMessage={errorMessage}
      filterable={filterable}
      multiSelect={multiSelect}
      componentId={componentId}
      className={className}
      onPdsComboboxChange={handleChange}
      onPdsComboboxFilter={handleFilter}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </option>
      ))}
    </PdsCombobox>
  );
};
