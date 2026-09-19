import React from 'react';
import { PdsInput } from '@pine-ds/react';

/**
 * PdsInput - A form input component with validation and accessibility
 *
 * **⚠️ VISUAL PATTERN CLARIFICATION:**
 *
 * When analyzing screenshots or visual layouts:
 * - **Text above input field**: This is the input's LABEL, not a separate `pds-text` component
 * - **Label Integration**: The `label` prop creates text that appears above the input field
 * - **No Separate Text Needed**: Do not add `pds-text` components for input labels
 * - **Visual Hierarchy**: Label text is styled and positioned automatically by the input component
 *
 * **Common Mistake**: Seeing text above an input and assuming it's a separate `pds-text` component
 * **Correct Understanding**: The text is the input's integrated label created by the `label` prop
 *
 * **Usage Examples:**
 * ```tsx
 * // Basic input
 * <pds-input label="Name" component-id="name" required></pds-input>
 *
 * // Input with validation
 * <pds-input
 *   label="Email"
 *   component-id="email"
 *   type="email"
 *   required
 *   helper-message="We'll never share your email"
 * ></pds-input>
 *
 * // ❌ INCORRECT - Don't add separate text for labels
 * <pds-text>Name</pds-text>
 * <pds-input component-id="name"></pds-input>
 *
 * // ✅ CORRECT - Use the label prop
 * <pds-input label="Name" component-id="name"></pds-input>
 * ```
 *
 */
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
