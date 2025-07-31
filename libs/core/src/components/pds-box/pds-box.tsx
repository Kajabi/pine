import { Component, h, Host, Prop } from '@stencil/core';

import { BoxColumnType, BoxTShirtSizeType, BoxShadowSizeType } from '../../utils/types';

/**
 * PdsBox - A flexible layout container component
 *
 * **⚠️ CRITICAL LAYOUT BEHAVIOR:**
 * - **Default Direction**: Items flow HORIZONTALLY by default (`direction="row"`)
 * - **For Vertical Stacking**: You MUST explicitly set `direction="column"`
 * - **Common Mistake**: Expecting vertical stacking without setting direction
 *
 * **Layout Patterns:**
 * - **Horizontal Flow (Default)**: Items are placed side by side
 * - **Vertical Stacking**: Set `direction="column"` for items to stack vertically
 * - **Main Containers**: Always use `direction="column"` and `fit="true"` for page sections and main content areas
 * - **Grid Layout**: Use inside `pds-row` with `size-*` props for responsive grid
 *
 * **Key Props for Layout:**
 * - `direction`: **CRITICAL** - Controls item orientation (`row` = horizontal, `column` = vertical)
 * - `size`: Sets column width (1-12 grid system, works best inside pds-row)
 * - `gap`: Controls spacing between items
 * - `justifyContent`: Horizontal alignment of items
 * - `alignItems`: Vertical alignment of items
 *
 * **Usage Examples:**
 * ```tsx
 * // ⚠️ HORIZONTAL flow (default behavior - items side by side)
 * <pds-box gap="md">
 *   <div>Item 1</div>
 *   <div>Item 2</div> // These will be HORIZONTAL
 * </pds-box>
 *
 * // ✅ VERTICAL stacking (explicit - items stacked)
 * <pds-box direction="column" gap="md">
 *   <div>Item 1</div>
 *   <div>Item 2</div> // These will be VERTICAL
 * </pds-box>
 *
 * // ✅ MAIN CONTAINERS should use direction="column" and fit="true"
 * <pds-box direction="column" gap="lg" fit="true">
 *   <h1>Page Title</h1>
 *   <p>Page description</p>
 *   <pds-box direction="row" gap="md">
 *     <pds-button>Action 1</pds-button>
 *     <pds-button variant="secondary">Action 2</pds-button>
 *   </pds-box>
 * </pds-box>
 *
 * // Grid layout inside pds-row
 * <pds-row>
 *   <pds-box size-md="6">Half width</pds-box>
 *   <pds-box size-md="6">Half width</pds-box>
 * </pds-row>
 * ```
 */
@Component({
  tag: 'pds-box',
  styleUrl: 'pds-box.scss',
})
export class PdsBox {
  /**
   * Defines how items within the box are aligned.
   *
   * **Layout Impact:**
   * - `start`: Items align to the start (top for column, left for row)
   * - `center`: Items align to the center
   * - `end`: Items align to the end (bottom for column, right for row)
   * - `baseline`: Items align to their text baseline
   * - `stretch`: Items stretch to fill the container (default)
   *
   * @defaultValue start
  */
  @Prop() alignItems?: `start` | `center` | `end` | `baseline` | `stretch`;

  /**
   * Defines how the box is aligned within its container.
   * @defaultValue start
  */
  @Prop() alignSelf?: `start` | `center` | `end` | `baseline` | `stretch`;

  /**
   * If `true`, the box will be sized to fit its contents.
   */
  @Prop() auto?: boolean;

  /**
   * ⚠️ LAYOUT RELATIONSHIP WITH PDS-ROW:
   *
   * When pds-box is used inside pds-row:
   * - The default `direction="row"` works well for grid layouts
   * - Use `size` props (1-12) to control column widths
   * - The box becomes a grid column within the row
   *
   * When pds-box is used standalone:
   * - Default `direction="row"` creates horizontal flow
   * - Set `direction="column"` for vertical stacking
   * - Size props have limited effect outside of pds-row
   */

  /**
   *  Defines the background-color of the box.
   */
  @Prop() backgroundColor?: string;

  /**
   * If `true`, the box will have a border.
   */
  @Prop() border? = false;

  /**
   *  Defines the border color of the box.
   */
  @Prop() borderColor?: string;

  /**
   * Defines how rounded the box corners are.
   * @defaultValue none
   */
  @Prop() borderRadius?: `none` | `xs`| `sm` | `md` | `lg` | `circle`;

      /**
   * Defines the orientation of the box items.
   *
   * **⚠️ IMPORTANT LAYOUT BEHAVIOR:**
   * - **Default is `row`**: Items flow horizontally by default
   * - **For vertical stacking**: Explicitly set `direction="column"`
   * - **Common pattern**: Use `direction="column"` when you want items to stack vertically
   * - **Inside pds-row**: The default `row` direction works well for grid layouts
   *
   * **Usage Examples:**
   * ```tsx
   * // Horizontal flow (default behavior)
   * <pds-box>
   *   <div>Item 1</div>
   *   <div>Item 2</div> // These will be side by side
   * </pds-box>
   *
   * // Vertical stacking (explicit)
   * <pds-box direction="column">
   *   <div>Item 1</div>
   *   <div>Item 2</div> // These will stack vertically
   * </pds-box>
   * ```
   *
   * @defaultValue row
   */
  @Prop() direction?: `row` | `column`;

  /**
   * Defines the display style of the box.
   *
   * **Layout Impact:**
   * - `flex`: Creates a flex container (default)
   * - `inline-flex`: Creates an inline flex container
   * - `block`: Creates a block-level container
   * - `inline-block`: Creates an inline-block container
   *
   * @defaultValue flex
  */
  @Prop() display?: `flex` | `inline-flex` | `block` | `inline-block`;

  /**
   * If `true`, sets the box `max-width` to `100%`.
   */
  @Prop() fit?: boolean;

  /**
   * Defines the spacing between the box items.
   *
   * **Layout Impact:**
   * - Controls the gap between flex items
   * - Available sizes: `none`, `xxs`, `xs`, `sm`, `md`, `lg`, `xl`, `xxl`
   * - Works with both `row` and `column` directions
   *
   * @defaultValue none
  */
  @Prop() gap?: BoxTShirtSizeType;

  /**
   * Defines how a box will grow or shrink to fit the space available in its container.
   * @defaultValue none
   */
  @Prop() flex?: `none` | `grow` | `shrink`;

  /**
   * Defines the horizontal alignment of the box items.
   *
   * **Layout Impact:**
   * - `start`: Items pack toward the start (left for row, top for column)
   * - `center`: Items pack toward the center
   * - `end`: Items pack toward the end (right for row, bottom for column)
   * - `space-between`: Items are evenly distributed with first at start, last at end
   * - `space-around`: Items are evenly distributed with equal space around them
   *
   * @defaultValue start
  */
  @Prop() justifyContent?: `start` | `center` | `end` | `space-between` | `space-around`;

  /**
   * Defines the box's outer top spacing.
   * @defaultValue none
  */
  @Prop() marginBlockStart?: BoxTShirtSizeType;

  /**
   * Defines the box's outer left spacing.
   * @defaultValue none
  */
  @Prop() marginInlineStart?: BoxTShirtSizeType;

  /**
   * Defines the box's outer right spacing.
   * @defaultValue none
  */
  @Prop() marginInlineEnd?: BoxTShirtSizeType;

  /**
   * Defines the box's outer bottom spacing.
   * @defaultValue none
  */
  @Prop() marginBlockEnd?: BoxTShirtSizeType;

  /**
   * The minimum height of the row. Used in conjunction with alignment props
   */
  @Prop() minHeight?: string;

  /**
   * The minimum width of the row. Used in conjunction with alignment props
   */
  @Prop() minWidth?: string;

  /**
   * Move columns to the end direction of the row for all screen sizes. Increases the starting margin of a column by specified number of columns.
   */
  @Prop() offset?: BoxColumnType;

  /**
   * Move columns to the end direction of the row for `XS` screen sizes. Increases the starting margin of a column by specified number of columns.
  */
  @Prop() offsetXs?: BoxColumnType;

  /**
   * Move columns to the end direction of the row for `SM` screen sizes. Increases the starting margin of a column by specified number of columns.
  */
  @Prop() offsetSm?: BoxColumnType;

  /**
   * Move columns to the end direction of the row for `MD` screen sizes. Increases the starting margin of a column by specified number of columns.
  */
  @Prop() offsetMd?: BoxColumnType;

  /**
   * Move columns to the end direction of the row for `LG` screen sizes. Increases the starting margin of a column by specified number of columns.
  */
  @Prop() offsetLg?: BoxColumnType;

  /**
   * Move columns to the end direction of the row for `XL` screen sizes. Increases the starting margin of a column by specified number of columns.
  */
  @Prop() offsetXl?: BoxColumnType;

  /**
   * Defines the spacing between the box items.
   * @defaultValue none
  */
  @Prop() padding?: BoxTShirtSizeType;


  /**
   * Defines the top spacing.
   * @defaultValue none
  */
  @Prop() paddingBlockStart?: BoxTShirtSizeType;

  /**
   * Defines the bottom spacing.
   * @defaultValue none
  */
  @Prop() paddingBlockEnd?: BoxTShirtSizeType;

  /**
   * Defines the left spacing.
   * @defaultValue none
  */
  @Prop() paddingInlineStart?: BoxTShirtSizeType;

  /**
   * Defines the right spacing.
   * @defaultValue none
  */
  @Prop() paddingInlineEnd?: BoxTShirtSizeType;

  /**
   * Defines the box shadow.
   * @defaultValue none
  */
  @Prop() shadow?: BoxShadowSizeType;

  /**
   * Sets the default column width for the component. This value applies from the smallest screen size (XS) upwards, unless overridden by a breakpoint-specific size prop at that breakpoint or larger.
   *
   * **Grid System:**
   * - Uses a 12-column grid system
   * - Values range from 1-12 (e.g., `6` = 50% width, `12` = 100% width)
   * - Most effective when used inside `pds-row` containers
   * - Responsive variants available: `sizeXs`, `sizeSm`, `sizeMd`, `sizeLg`, `sizeXl`
   */
  @Prop() size?: BoxColumnType;

  /**
   * At the XS breakpoint, this prop will take the number of columns specified. This overrides the base size prop for this specific range.
   */
  @Prop() sizeXs?: BoxColumnType;

  /**
   * At screen sizes from the SM breakpoint and larger (576px and up), this will take the specified number of columns. This overrides any value set by size or sizeXs.
   */
  @Prop() sizeSm?: BoxColumnType;

  /**
   * At screen sizes from the MD breakpoint and larger (768px and up), this will take the specified number of columns. This overrides any value set by size, sizeXs, and up.
   */
  @Prop() sizeMd?: BoxColumnType;

  /**
   * At screen sizes from the LG breakpoint and larger (992px and up), this will take the specified number of columns. This overrides any value set by size, sizeXs, and up.
   */
  @Prop() sizeLg?: BoxColumnType;

  /**
   * At screen sizes from the XL breakpoint and larger (1200px and up), this will take the specified number of columns. This overrides any value set by size, sizeXs, and up.
   */
  @Prop() sizeXl?: BoxColumnType;



  render() {
    // Generate CSS classes based on props
    // This creates utility classes for layout, spacing, sizing, and styling
    // NOTE: direction defaults to 'row' (horizontal flow) - use 'column' for vertical stacking
    const boxClasses = `
    ${this.alignItems !== undefined && this.alignItems.trim() !== '' ? `pds-align-items-${this.alignItems}` : ''}
    ${this.alignSelf !== undefined && this.alignSelf.trim() !== '' ? `pds-align-self-${this.alignSelf}` : ''}
    ${this.auto ? 'pds-box--auto' : ''}
    ${this.border ? 'pds-box--border' : ''}
    ${this.borderRadius !== undefined && this.borderRadius.trim() !== '' ? `pds-border-radius-${this.borderRadius}` : ''}
    ${this.direction !== undefined && this.direction.trim() !== '' ? `pds-box-direction-${this.direction}` : ''}
    ${this.display !== undefined && this.display.trim() !== '' ? `pds-box--display-${this.display}` : ''}
    ${this.fit ? 'pds-box--fit' : ''}
    ${this.gap !== undefined && this.gap.trim() !== '' ? `pds-box-gap-${this.gap}` : ''}
    ${this.flex !== undefined && this.flex.trim() !== '' ? `pds-box--flex-${this.flex}` : ''}
    ${this.justifyContent !== undefined && this.justifyContent.trim() !== '' ? `pds-justify-content-${this.justifyContent}` : ''}
    ${this.marginBlockStart !== undefined && this.marginBlockStart.trim() !== '' ? `pds-margin-block-start-${this.marginBlockStart}` : ''}
    ${this.marginInlineStart !== undefined && this.marginInlineStart.trim() !== '' ? `pds-margin-inline-start-${this.marginInlineStart}` : ''}
    ${this.marginInlineEnd !== undefined && this.marginInlineEnd.trim() !== '' ? `pds-margin-inline-end-${this.marginInlineEnd}` : ''}
    ${this.marginBlockEnd !== undefined && this.marginBlockEnd.trim() !== '' ? `pds-margin-block-end-${this.marginBlockEnd}` : ''}
    ${this.offset !== undefined && this.offset.trim() !== '' ? `pds-box-offset-${this.offset}` : ''}
    ${this.offsetXs !== undefined && this.offsetXs.trim() !== '' ? `pds-box-offset-xs-${this.offsetXs}` : ''}
    ${this.offsetSm !== undefined && this.offsetSm.trim() !== '' ? `pds-box-offset-sm-${this.offsetSm}` : ''}
    ${this.offsetMd !== undefined && this.offsetMd.trim() !== '' ? `pds-box-offset-md-${this.offsetMd}` : ''}
    ${this.offsetLg !== undefined && this.offsetLg.trim() !== '' ? `pds-box-offset-lg-${this.offsetLg}` : ''}
    ${this.offsetXl !== undefined && this.offsetXl.trim() !== '' ? `pds-box-offset-xl-${this.offsetXl}` : ''}
    ${this.padding !== undefined && this.padding.trim() !== '' ? `pds-padding-${this.padding}` : ''}
    ${this.paddingBlockStart !== undefined && this.paddingBlockStart.trim() !== '' ? `pds-padding-block-start-${this.paddingBlockStart}` : ''}
    ${this.paddingBlockEnd !== undefined && this.paddingBlockEnd.trim() !== '' ? `pds-padding-block-end-${this.paddingBlockEnd}` : ''}
    ${this.paddingInlineStart !== undefined && this.paddingInlineStart.trim() !== '' ? `pds-padding-inline-start-${this.paddingInlineStart}` : ''}
    ${this.paddingInlineEnd !== undefined && this.paddingInlineEnd.trim() !== '' ? `pds-padding-inline-end-${this.paddingInlineEnd}` : ''}
    ${this.shadow !== undefined && this.shadow.trim() !== '' ? `pds-shadow-${this.shadow}` : ''}
    ${this.size !== undefined && this.size.trim() !== '' ? `pds-box pds-box-${this.size}` : ''}
    ${this.sizeXs !== undefined && this.sizeXs.trim() !== '' ? `pds-box-xs-${this.sizeXs}` : ''}
    ${this.sizeSm !== undefined && this.sizeSm.trim() !== '' ? `pds-box-sm-${this.sizeSm}` : ''}
    ${this.sizeMd !== undefined && this.sizeMd.trim() !== '' ? `pds-box-md-${this.sizeMd}` : ''}
    ${this.sizeLg !== undefined && this.sizeLg.trim() !== '' ? `pds-box-lg-${this.sizeLg}` : ''}
    ${this.sizeXl !== undefined && this.sizeXl.trim() !== '' ? `pds-box-xl-${this.sizeXl}` : ''}
    ${this.size == undefined &&
      this.sizeSm == undefined &&
      this.sizeMd == undefined &&
      this.sizeLg == undefined &&
      this.sizeXl == undefined ? 'pds-box' : ''}
    `;

    const boxInlineStyles = {
      ...(this.backgroundColor && { '--color-background-box': this.backgroundColor }),
      ...(this.borderColor && { '--color-border-box': this.borderColor }),
      ...(this.minHeight && { '--sizing-min-height-box': this.minHeight }),
      ...(this.minWidth && { '--sizing-min-width-box': this.minWidth }),
    };

    return (
      <Host class={boxClasses} style={boxInlineStyles}>
      </Host>
    );
  }
}
