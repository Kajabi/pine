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
  children?: React.ReactNode;
  display?: 'block' | 'flex' | 'inline' | 'inline-block' | 'inline-flex' | 'none';
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  justifyContent?: 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  alignContent?: 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'stretch';
  gap?: 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  padding?: 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  paddingTop?: 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  paddingBottom?: 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  paddingLeft?: 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  paddingRight?: 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  margin?: 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  marginTop?: 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  marginBottom?: 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  marginLeft?: 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  marginRight?: 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  border?: boolean;
  borderTop?: boolean;
  borderBottom?: boolean;
  borderLeft?: boolean;
  borderRight?: boolean;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  backgroundColor?: string;
  borderColor?: string;
  flex?: 'none' | 'auto' | 'initial' | 'grow' | 'shrink';
  className?: string;
  componentId?: string;
}

export const Box: React.FC<BoxProps> = ({
  children,
  display,
  direction,
  wrap,
  justifyContent,
  alignItems,
  alignContent,
  gap,
  padding,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  margin,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  border,
  borderTop,
  borderBottom,
  borderLeft,
  borderRight,
  borderRadius,
  backgroundColor,
  borderColor,
  flex,
  className = '',
  componentId
}) => {
  return (
    <PdsBox
      display={display}
      direction={direction}
      wrap={wrap}
      justifyContent={justifyContent}
      alignItems={alignItems}
      alignContent={alignContent}
      gap={gap}
      padding={padding}
      paddingTop={paddingTop}
      paddingBottom={paddingBottom}
      paddingLeft={paddingLeft}
      paddingRight={paddingRight}
      margin={margin}
      marginTop={marginTop}
      marginBottom={marginBottom}
      marginLeft={marginLeft}
      marginRight={marginRight}
      border={border}
      borderTop={borderTop}
      borderBottom={borderBottom}
      borderLeft={borderLeft}
      borderRight={borderRight}
      borderRadius={borderRadius}
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      flex={flex}
      componentId={componentId}
      className={className}
    >
      {children}
    </PdsBox>
  );
};
