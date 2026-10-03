import React from 'react';
import { PdsRow } from '@pine-ds/react';

/**
 * PdsRow - A horizontal flex container for creating grid layouts
 *
 * **⚠️ CRITICAL LAYOUT BEHAVIOR:**
 * - **Grid Container**: Creates a 12-column grid system for responsive layouts
 * - **Flex Direction**: Always horizontal (row) - cannot be changed
 * - **Child Requirements**: Direct children should be `pds-box` components with `size-*` props
 * - **Column Sum Rule**: Total column sizes should not exceed 12 per row
 *
 * **Layout Patterns:**
 * - **Grid Layout**: Use with `pds-box` children that have `size-*` props (1-12)
 * - **Responsive Grid**: Use responsive size variants (e.g., `size-md="6"`)
 * - **Equal Columns**: Children without `size` props become equal-width columns
 * - **Wrapping**: Columns wrap to next line if total exceeds 12
 *
 * **Key Props for Layout:**
 * - `colGap`: Controls spacing between columns
 * - `justifyContent`: Horizontal alignment of columns
 * - `alignItems`: Vertical alignment of columns
 * - `noWrap`: Prevents column wrapping
 *
 * **Usage Examples:**
 * ```tsx
 * // Basic 2-column grid
 * <pds-row>
 *   <pds-box size-md="6">Left column</pds-box>
 *   <pds-box size-md="6">Right column</pds-box>
 * </pds-row>
 *
 * // Responsive 3-column grid
 * <pds-row col-gap="md">
 *   <pds-box size-md="4" size-lg="3">Column 1</pds-box>
 *   <pds-box size-md="4" size-lg="6">Column 2</pds-box>
 *   <pds-box size-md="4" size-lg="3">Column 3</pds-box>
 * </pds-row>
 *
 * // Equal-width columns (no size props)
 * <pds-row>
 *   <pds-box>Auto width</pds-box>
 *   <pds-box>Auto width</pds-box>
 *   <pds-box>Auto width</pds-box>
 * </pds-row>
 * ```
 */

interface RowProps {
  alignItems?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
  border?: boolean;
  colGap?: 'none' | 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  children?: React.ReactNode;
  className?: string;
  componentId?: string;
  justifyContent?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
  minHeight?: string;
  noWrap?: boolean;
}

export const Row: React.FC<RowProps> = ({
  alignItems,
  border,
  colGap,
  children,
  className = '',
  componentId,
  justifyContent,
  minHeight,
  noWrap,
}) => {
  return (
    <PdsRow
      alignItems={alignItems}
      border={border}
      colGap={colGap}
      componentId={componentId}
      className={className}
      justifyContent={justifyContent}
      minHeight={minHeight}
      noWrap={noWrap}
    >
      {children}
    </PdsRow>
  );
};
