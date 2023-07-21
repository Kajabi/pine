import { FunctionalComponent, h } from '@stencil/core';

/**
 * Props for the input label.
 */
interface LabelProps {
  /**
   * Corresponds to the 'for' attribute on a label. Useful for
   * associating a label with a specific input.
   */
  htmlFor: string,
  /**
   * Label text displayed.
   */
  text: string,
}

/**
 * Returns markup for an input label.
 * @internal
 */
export const PdsLabel: FunctionalComponent<LabelProps> = ({ htmlFor, text }) => (
  <label htmlFor={htmlFor}>{text}</label>
);
