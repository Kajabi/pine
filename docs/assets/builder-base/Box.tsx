import React from 'react';
import { PdsBox } from '@pine-ds/react';


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

interface BoxProps {
  alignItems?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  alignContent?: 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'stretch';
  backgroundColor?: string;
  border?: boolean;
  borderColor?: string;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children?: React.ReactNode;
  className?: string;
  componentId?: string;
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  display?: 'block' | 'flex' | 'inline' | 'inline-block' | 'inline-flex' | 'none';
  justifyContent?: 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  gap?: 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  fit?: boolean;
  flex?: 'none' | 'auto' | 'initial' | 'grow' | 'shrink';
  padding?: 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  paddingBlockStart?: 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  paddingBlockEnd?: 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  paddingInlineStart?: 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  paddingInlineEnd?: 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  paddingBottom?: 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  paddingLeft?: 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  paddingRight?: 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  marginBlockStart?: 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  marginBlockEnd?: 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  marginInlineStart?: 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  marginInlineEnd?: 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  minHeight?: 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  minWidth?: 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  offset?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';
  offsetXs?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';
  offsetSm?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';
  offsetMd?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';
  offsetLg?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';
  offsetXl?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  size?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';
  sizeXs?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';
  sizeSm?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';
  sizeMd?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';
  sizeLg?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';
  sizeXl?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
}

export const Box: React.FC<BoxProps> = ({
  alignItems,
  alignContent,
  backgroundColor,
  border,
  borderColor,
  borderRadius,
  children,
  className = '',
  componentId,
  direction,
  display,
  fit,
  flex,
  gap,
  justifyContent,
  marginBlockStart,
  marginBlockEnd,
  marginInlineStart,
  marginInlineEnd,
  minHeight,
  minWidth,
  offset,
  offsetXs,
  offsetSm,
  offsetMd,
  offsetLg,
  offsetXl,
  padding,
  paddingBlockStart,
  paddingBlockEnd,
  paddingInlineStart,
  paddingInlineEnd,
  shadow,
  size,
  sizeXs,
  sizeSm,
  sizeMd,
  sizeLg,
  sizeXl,
  wrap,
}) => {
  return (
    <PdsBox
      alignItems={alignItems}
      alignContent={alignContent}
      border={border}
      borderRadius={borderRadius}
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      componentId={componentId}
      className={className}
      direction={direction}
      display={display}
      fit={fit}
      flex={flex}
      gap={gap}
      justifyContent={justifyContent}
      padding={padding}
      paddingBlockStart={paddingBlockStart}
      paddingBlockEnd={paddingBlockEnd}
      paddingInlineStart={paddingInlineStart}
      paddingInlineEnd={paddingInlineEnd}
      marginBlockStart={marginBlockStart}
      marginBlockEnd={marginBlockEnd}
      marginInlineStart={marginInlineStart}
      marginInlineEnd={marginInlineEnd}
      minHeight={minHeight}
      minWidth={minWidth}
      offset={offset}
      offsetXs={offsetXs}
      offsetSm={offsetSm}
      offsetMd={offsetMd}
      offsetLg={offsetLg}
      offsetXl={offsetXl}
      shadow={shadow}
      size={size}
      sizeXs={sizeXs}
      sizeSm={sizeSm}
      sizeMd={sizeMd}
      sizeLg={sizeLg}
      sizeXl={sizeXl}
      wrap={wrap}
    >
      {children}
    </PdsBox>
  );
};
