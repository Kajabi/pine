import React from 'react';
import { PdsInput } from '@pine-ds/react';

interface InputChangeEventDetail {
  value: string | null;
  event: Event;
}

interface InputInputEventDetail {
  value: string | null;
  event: Event;
}

interface InputProps {
  label?: string;
  value?: string | number | null;
  type?: 'email' | 'number' | 'password' | 'tel' | 'text' | 'url';
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  invalid?: boolean;
  fullWidth?: boolean;
  name?: string;
  autocomplete?: string;
  min?: string;
  max?: string;
  minlength?: string;
  maxlength?: string;
  pattern?: string;
  step?: string;
  debounce?: number;
  helperMessage?: string;
  errorMessage?: string;
  prefixContent?: React.ReactNode;
  suffixContent?: React.ReactNode;
  prependContent?: React.ReactNode;
  appendContent?: React.ReactNode;
  actionContent?: React.ReactNode;
  onChange?: (detail: InputChangeEventDetail) => void;
  onInput?: (detail: InputInputEventDetail) => void;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  className?: string;
  componentId?: string; // Optional with fallback
}

export const Input: React.FC<InputProps> = ({
  label,
  value = '',
  type = 'text',
  placeholder,
  disabled = false,
  readonly = false,
  required = false,
  invalid = false,
  fullWidth = false,
  name,
  autocomplete,
  min,
  max,
  minlength,
  maxlength,
  pattern,
  step,
  debounce,
  helperMessage,
  errorMessage,
  prefixContent,
  suffixContent,
  prependContent,
  appendContent,
  actionContent,
  onChange,
  onInput,
  onFocus,
  onBlur,
  className = '',
  componentId
}) => {
  // Generate unique componentId if not provided
  const inputId = componentId || React.useId();
  // Handle change event
  const handleChange = (event: CustomEvent<InputChangeEventDetail>) => {
    if (onChange) {
      onChange(event.detail);
    }
  };

  // Handle input event
  const handleInput = (event: CustomEvent<InputInputEventDetail>) => {
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
    <PdsInput
      label={label}
      value={value}
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      readonly={readonly}
      required={required}
      invalid={invalid}
      fullWidth={fullWidth}
      name={name}
      autocomplete={autocomplete}
      min={min}
      max={max}
      minlength={minlength}
      maxlength={maxlength}
      pattern={pattern}
      step={step}
      debounce={debounce}
      helperMessage={helperMessage}
      errorMessage={errorMessage}
      componentId={inputId}
      className={className}
      onPdsChange={handleChange}
      onPdsInput={handleInput}
      onPdsFocus={handleFocus}
      onPdsBlur={handleBlur}
    >
      {prefixContent && <div slot="prefix">{prefixContent}</div>}
      {suffixContent && <div slot="suffix">{suffixContent}</div>}
      {prependContent && <div slot="prepend">{prependContent}</div>}
      {appendContent && <div slot="append">{appendContent}</div>}
      {actionContent && <div slot="action">{actionContent}</div>}
    </PdsInput>
  );
};
