import { Component, h, Host, Prop } from '@stencil/core';

import { BoxColumnType, BoxSpacingType, BoxShadowSizeType } from '../../utils/types';
import { normalizeColorValue } from '../../utils/utils';

@Component({
  tag: 'pds-box',
  styleUrl: 'pds-box.scss',
})
export class PdsBox {
  /**
   * Defines how items within the box are aligned.
   * @defaultValue stretch
  */
  @Prop() alignItems?: `start` | `center` | `end` | `baseline` | `stretch` ;

  /**
   * Defines how items within the box are aligned at the XS breakpoint.
   * @defaultValue stretch
  */
  @Prop() alignItemsXs?: `start` | `center` | `end` | `baseline` | `stretch`;

  /**
   * Defines how items within the box are aligned at the SM breakpoint.
   * @defaultValue stretch
  */
  @Prop() alignItemsSm?: `start` | `center` | `end` | `baseline` | `stretch`;

  /**
   * Defines how items within the box are aligned at the MD breakpoint.
   * @defaultValue stretch
  */
  @Prop() alignItemsMd?: `start` | `center` | `end` | `baseline` | `stretch`;

  /**
   * Defines how items within the box are aligned at the LG breakpoint.
   * @defaultValue stretch
  */
  @Prop() alignItemsLg?: `start` | `center` | `end` | `baseline` | `stretch`;

  /**
   * Defines how items within the box are aligned at the XL breakpoint.
   * @defaultValue stretch
  */
  @Prop() alignItemsXl?: `start` | `center` | `end` | `baseline` | `stretch`;

  /**
   * Defines how the box is aligned within its container.
   * @defaultValue stretch
  */
  @Prop() alignSelf?: `start` | `center` | `end` | `baseline` | `stretch`;

  /**
   * Defines how the box is aligned within its container at the XS breakpoint.
   *
  */
  @Prop() alignSelfXs?: `start` | `center` | `end` | `baseline` | `stretch`;

  /**
   * Defines how the box is aligned within its container at the SM breakpoint.
   *
  */
  @Prop() alignSelfSm?: `start` | `center` | `end` | `baseline` | `stretch`;

  /**
   * Defines how the box is aligned within its container at the MD breakpoint.
   *
  */
  @Prop() alignSelfMd?: `start` | `center` | `end` | `baseline` | `stretch`;

  /**
   * Defines how the box is aligned within its container at the LG breakpoint.
   *
  */
  @Prop() alignSelfLg?: `start` | `center` | `end` | `baseline` | `stretch`;

  /**
   * Defines how the box is aligned within its container at the XL breakpoint.
   *
  */
  @Prop() alignSelfXl?: `start` | `center` | `end` | `baseline` | `stretch`;

  /**
   * If `true`, the box will be sized to fit its contents.
   */
  @Prop() auto?: boolean;

  /**
   * If `true`, the box will be sized to fit its contents at the XS breakpoint.
   */
  @Prop() autoXs?: boolean;

  /**
   * If `true`, the box will be sized to fit its contents at the SM breakpoint.
   */
  @Prop() autoSm?: boolean;

  /**
   * If `true`, the box will be sized to fit its contents at the MD breakpoint.
   */
  @Prop() autoMd?: boolean;

  /**
   * If `true`, the box will be sized to fit its contents at the LG breakpoint.
   */
  @Prop() autoLg?: boolean;

  /**
   * If `true`, the box will be sized to fit its contents at the XL breakpoint.
   */
  @Prop() autoXl?: boolean;

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
   * @defaultValue row
   */
  @Prop() direction?: `row` | `column`;

  /**
   * Defines the display style of the box.
   * @defaultValue flex
  */
  @Prop() display?: `flex` | `inline-flex` | `block` | `inline-block`;

  /**
   * If `true`, sets the box `max-width` to `100%`.
   */
  @Prop() fit?: boolean;

  /**
   * If `true`, sets the box `max-width` to `100%` at the XS breakpoint.
   */
  @Prop() fitXs?: boolean;

  /**
   * If `true`, sets the box `max-width` to `100%` at the SM breakpoint.
   */
  @Prop() fitSm?: boolean;

  /**
   * If `true`, sets the box `max-width` to `100%` at the MD breakpoint.
   */
  @Prop() fitMd?: boolean;

  /**
   * If `true`, sets the box `max-width` to `100%` at the LG breakpoint.
   */
  @Prop() fitLg?: boolean;

  /**
   * If `true`, sets the box `max-width` to `100%` at the XL breakpoint.
   */
  @Prop() fitXl?: boolean;

  /**
   * Defines the spacing between the box items.
   * @defaultValue none
  */
  @Prop() gap?: BoxSpacingType;

  /**
   * Defines the spacing between the box items at the XS breakpoint.
   * @defaultValue none
  */
  @Prop() gapXs?: BoxSpacingType;

  /**
   * Defines the spacing between the box items at the SM breakpoint.
   * @defaultValue none
  */
  @Prop() gapSm?: BoxSpacingType;

  /**
   * Defines the spacing between the box items at the MD breakpoint.
   * @defaultValue none
  */
  @Prop() gapMd?: BoxSpacingType;

  /**
   * Defines the spacing between the box items at the LG breakpoint.
   * @defaultValue none
  */
  @Prop() gapLg?: BoxSpacingType;

  /**
   * Defines the spacing between the box items at the XL breakpoint.
   * @defaultValue none
  */
  @Prop() gapXl?: BoxSpacingType;

  /**
   * Defines whether flex items are forced onto one line or can wrap onto multiple lines.
   * @defaultValue false
   */
  @Prop() wrap?: boolean;

  /**
   * Defines whether flex items can wrap onto multiple lines at the XS breakpoint.
   * @defaultValue false
   */
  @Prop() wrapXs?: boolean;

  /**
   * Defines whether flex items can wrap onto multiple lines at the SM breakpoint.
   * @defaultValue false
   */
  @Prop() wrapSm?: boolean;

  /**
   * Defines whether flex items can wrap onto multiple lines at the MD breakpoint.
   * @defaultValue false
   */
  @Prop() wrapMd?: boolean;

  /**
   * Defines whether flex items can wrap onto multiple lines at the LG breakpoint.
   * @defaultValue false
   */
  @Prop() wrapLg?: boolean;

  /**
   * Defines whether flex items can wrap onto multiple lines at the XL breakpoint.
   * @defaultValue false
   */
  @Prop() wrapXl?: boolean;

  /**
   * Defines how a box will grow or shrink to fit the space available in its container.
   * Can be a predefined value ('none', 'grow', 'shrink') or a custom flex value (e.g., '1', '0 1 auto').
   * @defaultValue none
   */
  @Prop() flex?: `none` | `grow` | `shrink` | string;

  /**
   * Defines the horizontal alignment of the box items.
   * @defaultValue start
  */
  @Prop() justifyContent?: `start` | `center` | `end` | `space-between` | `space-around` | `space-evenly`;

  /**
   * Defines the horizontal alignment of the box items at the XS breakpoint.
   * @defaultValue start
  */
  @Prop() justifyContentXs?: `start` | `center` | `end` | `space-between` | `space-around` | `space-evenly`;

  /**
   * Defines the horizontal alignment of the box items at the SM breakpoint.
   * @defaultValue start
  */
  @Prop() justifyContentSm?: `start` | `center` | `end` | `space-between` | `space-around` | `space-evenly`;

  /**
   * Defines the horizontal alignment of the box items at the MD breakpoint.
   * @defaultValue start
  */
  @Prop() justifyContentMd?: `start` | `center` | `end` | `space-between` | `space-around` | `space-evenly`;

  /**
   * Defines the horizontal alignment of the box items at the LG breakpoint.
   * @defaultValue start
  */
  @Prop() justifyContentLg?: `start` | `center` | `end` | `space-between` | `space-around` | `space-evenly`;

  /**
   * Defines the horizontal alignment of the box items at the XL breakpoint.
   * @defaultValue start
  */
  @Prop() justifyContentXl?: `start` | `center` | `end` | `space-between` | `space-around` | `space-evenly`;

  /**
   * Defines the box's outer top spacing.
   * @defaultValue none
  */
  @Prop() marginBlockStart?: BoxSpacingType;

  /**
   * Defines the box's outer top spacing at the XS breakpoint.
   * @defaultValue none
  */
  @Prop() marginBlockStartXs?: BoxSpacingType;

  /**
   * Defines the box's outer top spacing at the SM breakpoint.
   * @defaultValue none
  */
  @Prop() marginBlockStartSm?: BoxSpacingType;

  /**
   * Defines the box's outer top spacing at the MD breakpoint.
   * @defaultValue none
  */
  @Prop() marginBlockStartMd?: BoxSpacingType;

  /**
   * Defines the box's outer top spacing at the LG breakpoint.
   * @defaultValue none
  */
  @Prop() marginBlockStartLg?: BoxSpacingType;

  /**
   * Defines the box's outer top spacing at the XL breakpoint.
   * @defaultValue none
  */
  @Prop() marginBlockStartXl?: BoxSpacingType;

  /**
   * Defines the box's outer left spacing.
   * @defaultValue none
  */
  @Prop() marginInlineStart?: BoxSpacingType;

  /**
   * Defines the box's outer left spacing at the XS breakpoint.
   * @defaultValue none
  */
  @Prop() marginInlineStartXs?: BoxSpacingType;

  /**
   * Defines the box's outer left spacing at the SM breakpoint.
   * @defaultValue none
  */
  @Prop() marginInlineStartSm?: BoxSpacingType;

  /**
   * Defines the box's outer left spacing at the MD breakpoint.
   * @defaultValue none
  */
  @Prop() marginInlineStartMd?: BoxSpacingType;

  /**
   * Defines the box's outer left spacing at the LG breakpoint.
   * @defaultValue none
  */
  @Prop() marginInlineStartLg?: BoxSpacingType;

  /**
   * Defines the box's outer left spacing at the XL breakpoint.
   * @defaultValue none
  */
  @Prop() marginInlineStartXl?: BoxSpacingType;

  /**
   * Defines the box's outer right spacing.
   * @defaultValue none
  */
  @Prop() marginInlineEnd?: BoxSpacingType;

  /**
   * Defines the box's outer right spacing at the XS breakpoint.
   * @defaultValue none
  */
  @Prop() marginInlineEndXs?: BoxSpacingType;

  /**
   * Defines the box's outer right spacing at the SM breakpoint.
   * @defaultValue none
  */
  @Prop() marginInlineEndSm?: BoxSpacingType;

  /**
   * Defines the box's outer right spacing at the MD breakpoint.
   * @defaultValue none
  */
  @Prop() marginInlineEndMd?: BoxSpacingType;

  /**
   * Defines the box's outer right spacing at the LG breakpoint.
   * @defaultValue none
  */
  @Prop() marginInlineEndLg?: BoxSpacingType;

  /**
   * Defines the box's outer right spacing at the XL breakpoint.
   * @defaultValue none
  */
  @Prop() marginInlineEndXl?: BoxSpacingType;

  /**
   * Defines the box's outer bottom spacing.
   * @defaultValue none
  */
  @Prop() marginBlockEnd?: BoxSpacingType;

  /**
   * Defines the box's outer bottom spacing at the XS breakpoint.
   * @defaultValue none
  */
  @Prop() marginBlockEndXs?: BoxSpacingType;

  /**
   * Defines the box's outer bottom spacing at the SM breakpoint.
   * @defaultValue none
  */
  @Prop() marginBlockEndSm?: BoxSpacingType;

  /**
   * Defines the box's outer bottom spacing at the MD breakpoint.
   * @defaultValue none
  */
  @Prop() marginBlockEndMd?: BoxSpacingType;

  /**
   * Defines the box's outer bottom spacing at the LG breakpoint.
   * @defaultValue none
  */
  @Prop() marginBlockEndLg?: BoxSpacingType;

  /**
   * Defines the box's outer bottom spacing at the XL breakpoint.
   * @defaultValue none
  */
  @Prop() marginBlockEndXl?: BoxSpacingType;

  /**
   * The minimum height of the row. Used in conjunction with alignment props
   */
  @Prop({ reflect: true }) minHeight?: string;

  /**
   * The minimum width of the row. Used in conjunction with alignment props
   */
  @Prop({ reflect: true }) minWidth?: string;

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
  @Prop() padding?: BoxSpacingType;

  /**
   * Defines the spacing between the box items at the XS breakpoint.
   * @defaultValue none
  */
  @Prop() paddingXs?: BoxSpacingType;

  /**
   * Defines the spacing between the box items at the SM breakpoint.
   * @defaultValue none
  */
  @Prop() paddingSm?: BoxSpacingType;

  /**
   * Defines the spacing between the box items at the MD breakpoint.
   * @defaultValue none
  */
  @Prop() paddingMd?: BoxSpacingType;

  /**
   * Defines the spacing between the box items at the LG breakpoint.
   * @defaultValue none
  */
  @Prop() paddingLg?: BoxSpacingType;

  /**
   * Defines the spacing between the box items at the XL breakpoint.
   * @defaultValue none
  */
  @Prop() paddingXl?: BoxSpacingType;


  /**
   * Defines the top spacing.
   * @defaultValue none
  */
  @Prop() paddingBlockStart?: BoxSpacingType;

  /**
   * Defines the top spacing at the XS breakpoint.
   * @defaultValue none
  */
  @Prop() paddingBlockStartXs?: BoxSpacingType;

  /**
   * Defines the top spacing at the SM breakpoint.
   * @defaultValue none
  */
  @Prop() paddingBlockStartSm?: BoxSpacingType;

  /**
   * Defines the top spacing at the MD breakpoint.
   * @defaultValue none
  */
  @Prop() paddingBlockStartMd?: BoxSpacingType;

  /**
   * Defines the top spacing at the LG breakpoint.
   * @defaultValue none
  */
  @Prop() paddingBlockStartLg?: BoxSpacingType;

  /**
   * Defines the top spacing at the XL breakpoint.
   * @defaultValue none
  */
  @Prop() paddingBlockStartXl?: BoxSpacingType;

  /**
   * Defines the bottom spacing.
   * @defaultValue none
  */
  @Prop() paddingBlockEnd?: BoxSpacingType;

  /**
   * Defines the bottom spacing at the XS breakpoint.
   * @defaultValue none
  */
  @Prop() paddingBlockEndXs?: BoxSpacingType;

  /**
   * Defines the bottom spacing at the SM breakpoint.
   * @defaultValue none
  */
  @Prop() paddingBlockEndSm?: BoxSpacingType;

  /**
   * Defines the bottom spacing at the MD breakpoint.
   * @defaultValue none
  */
  @Prop() paddingBlockEndMd?: BoxSpacingType;

  /**
   * Defines the bottom spacing at the LG breakpoint.
   * @defaultValue none
  */
  @Prop() paddingBlockEndLg?: BoxSpacingType;

  /**
   * Defines the bottom spacing at the XL breakpoint.
   * @defaultValue none
  */
  @Prop() paddingBlockEndXl?: BoxSpacingType;

  /**
   * Defines the left spacing.
   * @defaultValue none
  */
  @Prop() paddingInlineStart?: BoxSpacingType;

  /**
   * Defines the left spacing at the XS breakpoint.
   * @defaultValue none
  */
  @Prop() paddingInlineStartXs?: BoxSpacingType;

  /**
   * Defines the left spacing at the SM breakpoint.
   * @defaultValue none
  */
  @Prop() paddingInlineStartSm?: BoxSpacingType;

  /**
   * Defines the left spacing at the MD breakpoint.
   * @defaultValue none
  */
  @Prop() paddingInlineStartMd?: BoxSpacingType;

  /**
   * Defines the left spacing at the LG breakpoint.
   * @defaultValue none
  */
  @Prop() paddingInlineStartLg?: BoxSpacingType;

  /**
   * Defines the left spacing at the XL breakpoint.
   * @defaultValue none
  */
  @Prop() paddingInlineStartXl?: BoxSpacingType;

  /**
   * Defines the right spacing.
   * @defaultValue none
  */
  @Prop() paddingInlineEnd?: BoxSpacingType;

  /**
   * Defines the right spacing at the XS breakpoint.
   * @defaultValue none
  */
  @Prop() paddingInlineEndXs?: BoxSpacingType;

  /**
   * Defines the right spacing at the SM breakpoint.
   * @defaultValue none
  */
  @Prop() paddingInlineEndSm?: BoxSpacingType;

  /**
   * Defines the right spacing at the MD breakpoint.
   * @defaultValue none
  */
  @Prop() paddingInlineEndMd?: BoxSpacingType;

  /**
   * Defines the right spacing at the LG breakpoint.
   * @defaultValue none
  */
  @Prop() paddingInlineEndLg?: BoxSpacingType;

  /**
   * Defines the right spacing at the XL breakpoint.
   * @defaultValue none
  */
  @Prop() paddingInlineEndXl?: BoxSpacingType;

  /**
   * Defines the box shadow.
   * @defaultValue none
  */
  @Prop() shadow?: BoxShadowSizeType;

  /**
   * Sets the default column width for the component. This value applies from the smallest screen size (XS) upwards, unless overridden by a breakpoint-specific size prop at that breakpoint or larger.
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
    const boxClasses = `
    ${this.alignItems !== undefined && this.alignItems.trim() !== '' ? `pds-align-items-${this.alignItems}` : ''}
    ${this.alignItemsXs !== undefined && this.alignItemsXs.trim() !== '' ? `pds-align-items-xs-${this.alignItemsXs}` : ''}
    ${this.alignItemsSm !== undefined && this.alignItemsSm.trim() !== '' ? `pds-align-items-sm-${this.alignItemsSm}` : ''}
    ${this.alignItemsMd !== undefined && this.alignItemsMd.trim() !== '' ? `pds-align-items-md-${this.alignItemsMd}` : ''}
    ${this.alignItemsLg !== undefined && this.alignItemsLg.trim() !== '' ? `pds-align-items-lg-${this.alignItemsLg}` : ''}
    ${this.alignItemsXl !== undefined && this.alignItemsXl.trim() !== '' ? `pds-align-items-xl-${this.alignItemsXl}` : ''}
    ${this.alignSelf !== undefined && this.alignSelf.trim() !== '' ? `pds-align-self-${this.alignSelf}` : ''}
    ${this.alignSelfXs !== undefined && this.alignSelfXs.trim() !== '' ? `pds-align-self-xs-${this.alignSelfXs}` : ''}
    ${this.alignSelfSm !== undefined && this.alignSelfSm.trim() !== '' ? `pds-align-self-sm-${this.alignSelfSm}` : ''}
    ${this.alignSelfMd !== undefined && this.alignSelfMd.trim() !== '' ? `pds-align-self-md-${this.alignSelfMd}` : ''}
    ${this.alignSelfLg !== undefined && this.alignSelfLg.trim() !== '' ? `pds-align-self-lg-${this.alignSelfLg}` : ''}
    ${this.alignSelfXl !== undefined && this.alignSelfXl.trim() !== '' ? `pds-align-self-xl-${this.alignSelfXl}` : ''}
    ${this.auto ? 'pds-box--auto' : ''}
    ${this.autoXs ? 'pds-box--auto-xs' : ''}
    ${this.autoSm ? 'pds-box--auto-sm' : ''}
    ${this.autoMd ? 'pds-box--auto-md' : ''}
    ${this.autoLg ? 'pds-box--auto-lg' : ''}
    ${this.autoXl ? 'pds-box--auto-xl' : ''}
    ${this.border ? 'pds-box--border' : ''}
    ${this.borderRadius !== undefined && this.borderRadius.trim() !== '' ? `pds-border-radius-${this.borderRadius}` : ''}
    ${this.direction !== undefined && this.direction.trim() !== '' ? `pds-box-direction-${this.direction}` : ''}
    ${this.display !== undefined && this.display.trim() !== '' ? `pds-box--display-${this.display}` : ''}
    ${this.fit ? 'pds-box--fit' : ''}
    ${this.fitXs ? 'pds-box--fit-xs' : ''}
    ${this.fitSm ? 'pds-box--fit-sm' : ''}
    ${this.fitMd ? 'pds-box--fit-md' : ''}
    ${this.fitLg ? 'pds-box--fit-lg' : ''}
    ${this.fitXl ? 'pds-box--fit-xl' : ''}
    ${this.gap !== undefined && this.gap.trim() !== '' ? `pds-box-gap-${this.gap}` : ''}
    ${this.gapXs !== undefined && this.gapXs.trim() !== '' ? `pds-box-gap-xs-${this.gapXs}` : ''}
    ${this.gapSm !== undefined && this.gapSm.trim() !== '' ? `pds-box-gap-sm-${this.gapSm}` : ''}
    ${this.gapMd !== undefined && this.gapMd.trim() !== '' ? `pds-box-gap-md-${this.gapMd}` : ''}
    ${this.gapLg !== undefined && this.gapLg.trim() !== '' ? `pds-box-gap-lg-${this.gapLg}` : ''}
    ${this.gapXl !== undefined && this.gapXl.trim() !== '' ? `pds-box-gap-xl-${this.gapXl}` : ''}
    ${this.wrap ? 'pds-box--wrap' : ''}
    ${this.wrapXs ? 'pds-box--wrap-xs' : ''}
    ${this.wrapSm ? 'pds-box--wrap-sm' : ''}
    ${this.wrapMd ? 'pds-box--wrap-md' : ''}
    ${this.wrapLg ? 'pds-box--wrap-lg' : ''}
    ${this.wrapXl ? 'pds-box--wrap-xl' : ''}
    ${this.flex !== undefined && this.flex.trim() !== '' && ['none', 'grow', 'shrink'].includes(this.flex) ? `pds-box--flex-${this.flex}` : ''}
    ${this.justifyContent !== undefined && this.justifyContent.trim() !== '' ? `pds-justify-content-${this.justifyContent}` : ''}
    ${this.justifyContentXs !== undefined && this.justifyContentXs.trim() !== '' ? `pds-justify-content-xs-${this.justifyContentXs}` : ''}
    ${this.justifyContentSm !== undefined && this.justifyContentSm.trim() !== '' ? `pds-justify-content-sm-${this.justifyContentSm}` : ''}
    ${this.justifyContentMd !== undefined && this.justifyContentMd.trim() !== '' ? `pds-justify-content-md-${this.justifyContentMd}` : ''}
    ${this.justifyContentLg !== undefined && this.justifyContentLg.trim() !== '' ? `pds-justify-content-lg-${this.justifyContentLg}` : ''}
    ${this.justifyContentXl !== undefined && this.justifyContentXl.trim() !== '' ? `pds-justify-content-xl-${this.justifyContentXl}` : ''}
    ${this.marginBlockStart !== undefined && this.marginBlockStart.trim() !== '' ? `pds-margin-block-start-${this.marginBlockStart}` : ''}
    ${this.marginBlockStartXs !== undefined && this.marginBlockStartXs.trim() !== '' ? `pds-margin-block-start-xs-${this.marginBlockStartXs}` : ''}
    ${this.marginBlockStartSm !== undefined && this.marginBlockStartSm.trim() !== '' ? `pds-margin-block-start-sm-${this.marginBlockStartSm}` : ''}
    ${this.marginBlockStartMd !== undefined && this.marginBlockStartMd.trim() !== '' ? `pds-margin-block-start-md-${this.marginBlockStartMd}` : ''}
    ${this.marginBlockStartLg !== undefined && this.marginBlockStartLg.trim() !== '' ? `pds-margin-block-start-lg-${this.marginBlockStartLg}` : ''}
    ${this.marginBlockStartXl !== undefined && this.marginBlockStartXl.trim() !== '' ? `pds-margin-block-start-xl-${this.marginBlockStartXl}` : ''}
    ${this.marginInlineStart !== undefined && this.marginInlineStart.trim() !== '' ? `pds-margin-inline-start-${this.marginInlineStart}` : ''}
    ${this.marginInlineStartXs !== undefined && this.marginInlineStartXs.trim() !== '' ? `pds-margin-inline-start-xs-${this.marginInlineStartXs}` : ''}
    ${this.marginInlineStartSm !== undefined && this.marginInlineStartSm.trim() !== '' ? `pds-margin-inline-start-sm-${this.marginInlineStartSm}` : ''}
    ${this.marginInlineStartMd !== undefined && this.marginInlineStartMd.trim() !== '' ? `pds-margin-inline-start-md-${this.marginInlineStartMd}` : ''}
    ${this.marginInlineStartLg !== undefined && this.marginInlineStartLg.trim() !== '' ? `pds-margin-inline-start-lg-${this.marginInlineStartLg}` : ''}
    ${this.marginInlineStartXl !== undefined && this.marginInlineStartXl.trim() !== '' ? `pds-margin-inline-start-xl-${this.marginInlineStartXl}` : ''}
    ${this.marginInlineEnd !== undefined && this.marginInlineEnd.trim() !== '' ? `pds-margin-inline-end-${this.marginInlineEnd}` : ''}
    ${this.marginInlineEndXs !== undefined && this.marginInlineEndXs.trim() !== '' ? `pds-margin-inline-end-xs-${this.marginInlineEndXs}` : ''}
    ${this.marginInlineEndSm !== undefined && this.marginInlineEndSm.trim() !== '' ? `pds-margin-inline-end-sm-${this.marginInlineEndSm}` : ''}
    ${this.marginInlineEndMd !== undefined && this.marginInlineEndMd.trim() !== '' ? `pds-margin-inline-end-md-${this.marginInlineEndMd}` : ''}
    ${this.marginInlineEndLg !== undefined && this.marginInlineEndLg.trim() !== '' ? `pds-margin-inline-end-lg-${this.marginInlineEndLg}` : ''}
    ${this.marginInlineEndXl !== undefined && this.marginInlineEndXl.trim() !== '' ? `pds-margin-inline-end-xl-${this.marginInlineEndXl}` : ''}
    ${this.marginBlockEnd !== undefined && this.marginBlockEnd.trim() !== '' ? `pds-margin-block-end-${this.marginBlockEnd}` : ''}
    ${this.marginBlockEndXs !== undefined && this.marginBlockEndXs.trim() !== '' ? `pds-margin-block-end-xs-${this.marginBlockEndXs}` : ''}
    ${this.marginBlockEndSm !== undefined && this.marginBlockEndSm.trim() !== '' ? `pds-margin-block-end-sm-${this.marginBlockEndSm}` : ''}
    ${this.marginBlockEndMd !== undefined && this.marginBlockEndMd.trim() !== '' ? `pds-margin-block-end-md-${this.marginBlockEndMd}` : ''}
    ${this.marginBlockEndLg !== undefined && this.marginBlockEndLg.trim() !== '' ? `pds-margin-block-end-lg-${this.marginBlockEndLg}` : ''}
    ${this.marginBlockEndXl !== undefined && this.marginBlockEndXl.trim() !== '' ? `pds-margin-block-end-xl-${this.marginBlockEndXl}` : ''}
    ${this.offset !== undefined && this.offset.trim() !== '' ? `pds-box-offset-${this.offset}` : ''}
    ${this.offsetXs !== undefined && this.offsetXs.trim() !== '' ? `pds-box-offset-xs-${this.offsetXs}` : ''}
    ${this.offsetSm !== undefined && this.offsetSm.trim() !== '' ? `pds-box-offset-sm-${this.offsetSm}` : ''}
    ${this.offsetMd !== undefined && this.offsetMd.trim() !== '' ? `pds-box-offset-md-${this.offsetMd}` : ''}
    ${this.offsetLg !== undefined && this.offsetLg.trim() !== '' ? `pds-box-offset-lg-${this.offsetLg}` : ''}
    ${this.offsetXl !== undefined && this.offsetXl.trim() !== '' ? `pds-box-offset-xl-${this.offsetXl}` : ''}
    ${this.padding !== undefined && this.padding.trim() !== '' ? `pds-padding-${this.padding}` : ''}
    ${this.paddingXs !== undefined && this.paddingXs.trim() !== '' ? `pds-padding-xs-${this.paddingXs}` : ''}
    ${this.paddingSm !== undefined && this.paddingSm.trim() !== '' ? `pds-padding-sm-${this.paddingSm}` : ''}
    ${this.paddingMd !== undefined && this.paddingMd.trim() !== '' ? `pds-padding-md-${this.paddingMd}` : ''}
    ${this.paddingLg !== undefined && this.paddingLg.trim() !== '' ? `pds-padding-lg-${this.paddingLg}` : ''}
    ${this.paddingXl !== undefined && this.paddingXl.trim() !== '' ? `pds-padding-xl-${this.paddingXl}` : ''}
    ${this.paddingBlockStart !== undefined && this.paddingBlockStart.trim() !== '' ? `pds-padding-block-start-${this.paddingBlockStart}` : ''}
    ${this.paddingBlockStartXs !== undefined && this.paddingBlockStartXs.trim() !== '' ? `pds-padding-block-start-xs-${this.paddingBlockStartXs}` : ''}
    ${this.paddingBlockStartSm !== undefined && this.paddingBlockStartSm.trim() !== '' ? `pds-padding-block-start-sm-${this.paddingBlockStartSm}` : ''}
    ${this.paddingBlockStartMd !== undefined && this.paddingBlockStartMd.trim() !== '' ? `pds-padding-block-start-md-${this.paddingBlockStartMd}` : ''}
    ${this.paddingBlockStartLg !== undefined && this.paddingBlockStartLg.trim() !== '' ? `pds-padding-block-start-lg-${this.paddingBlockStartLg}` : ''}
    ${this.paddingBlockStartXl !== undefined && this.paddingBlockStartXl.trim() !== '' ? `pds-padding-block-start-xl-${this.paddingBlockStartXl}` : ''}
    ${this.paddingBlockEnd !== undefined && this.paddingBlockEnd.trim() !== '' ? `pds-padding-block-end-${this.paddingBlockEnd}` : ''}
    ${this.paddingBlockEndXs !== undefined && this.paddingBlockEndXs.trim() !== '' ? `pds-padding-block-end-xs-${this.paddingBlockEndXs}` : ''}
    ${this.paddingBlockEndSm !== undefined && this.paddingBlockEndSm.trim() !== '' ? `pds-padding-block-end-sm-${this.paddingBlockEndSm}` : ''}
    ${this.paddingBlockEndMd !== undefined && this.paddingBlockEndMd.trim() !== '' ? `pds-padding-block-end-md-${this.paddingBlockEndMd}` : ''}
    ${this.paddingBlockEndLg !== undefined && this.paddingBlockEndLg.trim() !== '' ? `pds-padding-block-end-lg-${this.paddingBlockEndLg}` : ''}
    ${this.paddingBlockEndXl !== undefined && this.paddingBlockEndXl.trim() !== '' ? `pds-padding-block-end-xl-${this.paddingBlockEndXl}` : ''}
    ${this.paddingInlineStart !== undefined && this.paddingInlineStart.trim() !== '' ? `pds-padding-inline-start-${this.paddingInlineStart}` : ''}
    ${this.paddingInlineStartXs !== undefined && this.paddingInlineStartXs.trim() !== '' ? `pds-padding-inline-start-xs-${this.paddingInlineStartXs}` : ''}
    ${this.paddingInlineStartSm !== undefined && this.paddingInlineStartSm.trim() !== '' ? `pds-padding-inline-start-sm-${this.paddingInlineStartSm}` : ''}
    ${this.paddingInlineStartMd !== undefined && this.paddingInlineStartMd.trim() !== '' ? `pds-padding-inline-start-md-${this.paddingInlineStartMd}` : ''}
    ${this.paddingInlineStartLg !== undefined && this.paddingInlineStartLg.trim() !== '' ? `pds-padding-inline-start-lg-${this.paddingInlineStartLg}` : ''}
    ${this.paddingInlineStartXl !== undefined && this.paddingInlineStartXl.trim() !== '' ? `pds-padding-inline-start-xl-${this.paddingInlineStartXl}` : ''}
    ${this.paddingInlineEnd !== undefined && this.paddingInlineEnd.trim() !== '' ? `pds-padding-inline-end-${this.paddingInlineEnd}` : ''}
    ${this.paddingInlineEndXs !== undefined && this.paddingInlineEndXs.trim() !== '' ? `pds-padding-inline-end-xs-${this.paddingInlineEndXs}` : ''}
    ${this.paddingInlineEndSm !== undefined && this.paddingInlineEndSm.trim() !== '' ? `pds-padding-inline-end-sm-${this.paddingInlineEndSm}` : ''}
    ${this.paddingInlineEndMd !== undefined && this.paddingInlineEndMd.trim() !== '' ? `pds-padding-inline-end-md-${this.paddingInlineEndMd}` : ''}
    ${this.paddingInlineEndLg !== undefined && this.paddingInlineEndLg.trim() !== '' ? `pds-padding-inline-end-lg-${this.paddingInlineEndLg}` : ''}
    ${this.paddingInlineEndXl !== undefined && this.paddingInlineEndXl.trim() !== '' ? `pds-padding-inline-end-xl-${this.paddingInlineEndXl}` : ''}
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

    // Normalize so pds-box accepts --token, var(--token), or literals (no semantic names)
    const normalizedBackground = normalizeColorValue(this.backgroundColor);
    const normalizedBorder = normalizeColorValue(this.borderColor);

    const boxInlineStyles = {
      ...(normalizedBackground && { '--color-background-box': normalizedBackground }),
      ...(normalizedBorder && { '--color-border-box': normalizedBorder }),
      ...(this.minHeight && { '--sizing-min-height-box': this.minHeight }),
      ...(this.minWidth && { '--sizing-min-width-box': this.minWidth }),
      ...(this.flex && !['none', 'grow', 'shrink'].includes(this.flex) && { 'flex': this.flex }),
    };

    return (
      <Host class={boxClasses} style={boxInlineStyles}>
      </Host>
    );
  }
}
