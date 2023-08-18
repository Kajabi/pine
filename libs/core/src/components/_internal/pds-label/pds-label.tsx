import { FunctionalComponent, h } from '@stencil/core';

/**
 * Props for the input label.
 */
interface LabelProps {
  classNames?: string,
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
export const PdsLabel: FunctionalComponent<LabelProps> = ({ classNames, htmlFor, text }) => (
  <label class={classNames} htmlFor={htmlFor}>{text}</label>
);
