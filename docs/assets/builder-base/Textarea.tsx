import React from 'react';
import { PdsTextarea } from '@pine-ds/react';

interface TextareaChangeEventDetail {
  value: string | null;
  event: Event;
}

interface TextareaInputEventDetail {
  value: string | null;
  event: Event;
}

interface TextareaProps {
  label?: string;
  value?: string | null;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  invalid?: boolean;
  name?: string;
  autocomplete?: string;
  rows?: number;
  debounce?: number;
  helperMessage?: string;
  errorMessage?: string;
  actionContent?: React.ReactNode;
  onChange?: (detail: TextareaChangeEventDetail) => void;
  onInput?: (detail: TextareaInputEventDetail) => void;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  className?: string;
  componentId?: string; // Optional with fallback
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  value = '',
  placeholder,
  disabled = false,
  readonly = false,
  required = false,
  invalid = false,
  name,
  autocomplete,
  rows,
  debounce,
  helperMessage,
  errorMessage,
  actionContent,
  onChange,
  onInput,
  onFocus,
  onBlur,
  className = '',
  componentId
}) => {
  // Generate unique componentId if not provided
  const textareaId = componentId || React.useId();
  // Handle change event
  const handleChange = (event: CustomEvent<TextareaChangeEventDetail>) => {
    if (onChange) {
      onChange(event.detail);
    }
  };

  // Handle input event
  const handleInput = (event: CustomEvent<TextareaInputEventDetail>) => {
    if (onInput) {
      onInput(event.detail);
    }
  };

  // Handle focus event
  const handleFocus = (event: CustomEvent<FocusEvent>) => {
    if (onFocus) {
      onFocus(event.detail);
    }
  };

  // Handle blur event
  const handleBlur = (event: CustomEvent<FocusEvent>) => {
    if (onBlur) {
      onBlur(event.detail);
    }
  };

  return (
    <PdsTextarea
      label={label}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      readonly={readonly}
      required={required}
      invalid={invalid}
      name={name}
      autocomplete={autocomplete}
      rows={rows}
      debounce={debounce}
      helperMessage={helperMessage}
      errorMessage={errorMessage}
      componentId={textareaId}
      className={className}
      onPdsTextareaChange={handleChange}
      onPdsInput={handleInput}
      onPdsFocus={handleFocus}
      onPdsBlur={handleBlur}
    >
      {actionContent && <div slot="action">{actionContent}</div>}
    </PdsTextarea>
  );
};
