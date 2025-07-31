# pds-row



<!-- Auto Generated Below -->


## Overview

PdsRow - A horizontal flex container for creating grid layouts

**⚠️ CRITICAL LAYOUT BEHAVIOR:**
- **Grid Container**: Creates a 12-column grid system for responsive layouts
- **Flex Direction**: Always horizontal (row) - cannot be changed
- **Child Requirements**: Direct children should be `pds-box` components with `size-*` props
- **Column Sum Rule**: Total column sizes should not exceed 12 per row

**Layout Patterns:**
- **Grid Layout**: Use with `pds-box` children that have `size-*` props (1-12)
- **Responsive Grid**: Use responsive size variants (e.g., `size-md="6"`)
- **Equal Columns**: Children without `size` props become equal-width columns
- **Wrapping**: Columns wrap to next line if total exceeds 12

**Key Props for Layout:**
- `colGap`: Controls spacing between columns
- `justifyContent`: Horizontal alignment of columns
- `alignItems`: Vertical alignment of columns
- `noWrap`: Prevents column wrapping

**Usage Examples:**
```tsx
// Basic 2-column grid
<pds-row>
  <pds-box size-md="6">Left column</pds-box>
  <pds-box size-md="6">Right column</pds-box>
</pds-row>

// Responsive 3-column grid
<pds-row col-gap="md">
  <pds-box size-md="4" size-lg="3">Column 1</pds-box>
  <pds-box size-md="4" size-lg="6">Column 2</pds-box>
  <pds-box size-md="4" size-lg="3">Column 3</pds-box>
</pds-row>

// Equal-width columns (no size props)
<pds-row>
  <pds-box>Auto width</pds-box>
  <pds-box>Auto width</pds-box>
  <pds-box>Auto width</pds-box>
</pds-row>
```

## Properties

| Property         | Attribute         | Description                                                                                                                                                                                                                                                                                                                                                                                                                                          | Type                                                                | Default     |
| ---------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ----------- |
| `alignItems`     | `align-items`     | Defines the vertical alignment of the row items.  **Layout Impact:** - `start`: Items align to the top of the row - `center`: Items align to the center of the row - `end`: Items align to the bottom of the row - `baseline`: Items align to their text baseline - `stretch`: Items stretch to fill the row height (default)  **Best Practice**: Use with `minHeight` for consistent vertical alignment                                             | `"baseline" \| "center" \| "end" \| "start" \| "stretch"`           | `undefined` |
| `border`         | `border`          | If `true`, the row will have a border.                                                                                                                                                                                                                                                                                                                                                                                                               | `boolean`                                                           | `false`     |
| `colGap`         | `col-gap`         | Defines the spacing between the row items.  **Layout Impact:** - Controls the gap between columns in the grid - Available sizes: `none`, `xxs`, `xs`, `sm`, `md`, `lg`, `xl`, `xxl` - Creates consistent spacing between all columns - Works with both fixed-size and auto-width columns  **Best Practice**: Use `md` or `lg` for comfortable spacing between content columns                                                                        | `"lg" \| "md" \| "none" \| "sm" \| "xl" \| "xs" \| "xxl" \| "xxs"`  | `undefined` |
| `componentId`    | `component-id`    | A unique identifier used for the underlying component `id` attribute.                                                                                                                                                                                                                                                                                                                                                                                | `string`                                                            | `undefined` |
| `justifyContent` | `justify-content` | Defines the horizontal alignment of the row items.  **Layout Impact:** - `start`: Columns pack toward the left (default) - `center`: Columns pack toward the center - `end`: Columns pack toward the right - `space-between`: Columns are evenly distributed with first at start, last at end - `space-around`: Columns are evenly distributed with equal space around them  **Best Practice**: Use `space-between` for navigation or action buttons | `"center" \| "end" \| "space-around" \| "space-between" \| "start"` | `undefined` |
| `minHeight`      | `min-height`      | The minimum height of the row. Used in conjunction with alignment props  **Layout Impact:** - Ensures consistent row height for vertical alignment - Required for `alignItems="center"` to work properly - Prevents row height from collapsing when content is short  **Best Practice**: Use with `alignItems="center"` for vertically centered content  **Example**: `minHeight="100px"` or `minHeight="10rem"`                                     | `string`                                                            | `undefined` |
| `noWrap`         | `no-wrap`         | If `true`, the row items will not wrap to the next line if horizontal space is not available.  **Layout Impact:** - Prevents columns from wrapping to new lines - Columns may overflow horizontally if total width exceeds container - Useful for navigation bars or horizontal scrolling layouts  **⚠️ Warning**: Can cause horizontal overflow if columns are too wide  **Best Practice**: Use sparingly, only when you need to prevent wrapping   | `boolean`                                                           | `false`     |


----------------------------------------------


