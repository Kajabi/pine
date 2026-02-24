# Pine Design System Component Library

This document provides an overview of all components in the Pine Design System and their purposes.

## Core UI Components

### **Alert (`Alert.tsx`)**
A flexible alert component for displaying notifications and messages to users.
- **Purpose**: Show informational, warning, success, danger, or default messages
- **Features**: Multiple variants (default, danger, info, success, warning), dismissible option, small size variant, custom actions, heading support
- **Usage**: System notifications, form validation feedback, user alerts, status messages

### **Avatar (`Avatar.tsx`)**
Profile image component for displaying user avatars with fallback initials.
- **Purpose**: User profile representation and identification
- **Features**: Image display with initials fallback, size variants, accessibility support
- **Usage**: User profiles, comment sections, member lists, contact displays

### **Button (`Button.tsx`)**
Primary action component with multiple variants and states for user interactions.
- **Purpose**: User interactions, form submissions, and navigation actions
- **Features**: Multiple variants (primary, secondary, accent, disclosure, destructive, unstyled), loading states, icon support (start/end), full-width option, disabled states
- **Usage**: Forms, CTAs, navigation actions, toolbar buttons

### **Chip (`Chip.tsx`)**
Small, interactive elements for displaying compact information and selections.
- **Purpose**: Display tags, filters, selected items, or compact information
- **Features**: Multiple variants, removable option, icon support, different sizes
- **Usage**: Tags, filters, selected items, status indicators, categorical labels

### **Divider (`Divider.tsx`)**
Visual separator component for organizing content sections.
- **Purpose**: Create visual separation between content sections
- **Features**: Horizontal and vertical orientations, customizable styling
- **Usage**: Section separators, content organization, visual breaks

### **Icon (`Icon.tsx`)**
Versatile icon component supporting the comprehensive Pine icon library.
- **Purpose**: Display visual symbols and enhance UI communication
- **Features**: 300+ available icons, size variants, color customization, accessibility support
- **Usage**: Buttons, navigation, status indicators, decorative elements

### **Image (`Image.tsx`)**
Enhanced image component with loading states and accessibility features.
- **Purpose**: Display images with proper loading behavior and accessibility
- **Features**: Loading states, alt text support, responsive behavior
- **Usage**: Product images, hero sections, content illustrations, user uploads

### **Link (`Link.tsx`)**
Styled anchor component for navigation and external links.
- **Purpose**: Navigation between pages and external resources
- **Features**: Internal and external link support, target options, accessibility features
- **Usage**: Navigation menus, content links, call-to-action links

### **Loader (`Loader.tsx`)**
Loading indicator component for async operations and page transitions.
- **Purpose**: Indicate loading states and ongoing processes
- **Features**: Multiple size variants, accessible loading announcements
- **Usage**: Page loading, form submissions, data fetching, async operations

## Layout Components

### **Box (`Box.tsx`)**
Flexible layout container component for creating complex layouts and spacing.
- **Purpose**: Layout structure, spacing control, and responsive design
- **Features**: Direction control (row/column), grid system (12-column), gap spacing, padding/margin utilities, responsive breakpoints, border and shadow options
- **Usage**: Layout containers, spacing control, responsive grids, content wrappers

### **Row (`Row.tsx`)**
Horizontal flex container for creating responsive grid layouts.
- **Purpose**: Create responsive grid systems and column layouts
- **Features**: 12-column grid system, responsive breakpoints, column gap control, alignment options
- **Usage**: Grid layouts, responsive designs, column-based content organization

## Form Components

### **Input (`Input.tsx`)**
Comprehensive text input component with validation and accessibility features.
- **Purpose**: Text data collection with validation and user feedback
- **Features**: Multiple input types (text, email, password, etc.), validation states, helper/error messages, prefix/suffix content, debouncing, full-width option
- **Usage**: Forms, search fields, data entry, user registration

### **Textarea (`Textarea.tsx`)**
Multi-line text input component for longer text content.
- **Purpose**: Long-form text input and content creation
- **Features**: Resizable behavior, character limits, validation states, helper text
- **Usage**: Comments, descriptions, feedback forms, content creation

### **Checkbox (`Checkbox.tsx`)**
Selection component for boolean choices and multi-select options.
- **Purpose**: Boolean selections and multi-option choices
- **Features**: Checked/unchecked states, indeterminate state, validation, helper messages, label hiding option
- **Usage**: Form selections, settings toggles, agreement checkboxes, multi-select lists

### **Radio (`Radio.tsx`)**
Single-selection component for mutually exclusive choices.
- **Purpose**: Single selection from multiple mutually exclusive options
- **Features**: Grouped selections, validation states, helper messages, disabled options
- **Usage**: Settings preferences, form choices, option selection, survey questions

### **Select (`Select.tsx`)**
Dropdown selection component with search and validation capabilities.
- **Purpose**: Single or multiple option selection from lists
- **Features**: Searchable options, clearable selections, validation states, placeholder text
- **Usage**: Form dropdowns, filters, option selection, category choices

### **Switch (`Switch.tsx`)**
Toggle component for boolean settings and feature controls.
- **Purpose**: Enable/disable settings and binary feature controls
- **Features**: On/off states, size variants, labels, disabled states
- **Usage**: Settings panels, feature toggles, preferences, boolean controls

### **Combobox (`Combobox.tsx`)**
Advanced input component combining text input with dropdown selection.
- **Purpose**: Searchable selection with custom input capability
- **Features**: Autocomplete functionality, custom values, searchable options
- **Usage**: Search with suggestions, location inputs, flexible selection fields

## Content Components

### **Text (`Text.tsx`)**
Typography component for consistent text styling and semantic markup.
- **Purpose**: Consistent text styling and semantic content structure
- **Features**: Multiple text variants, semantic HTML elements, size options
- **Usage**: Body text, headings, captions, labels, content typography

### **Copytext (`Copytext.tsx`)**
Specialized text component for content writing and editorial use.
- **Purpose**: Editorial content and marketing copy display
- **Features**: Consistent styling for marketing content, proper typography
- **Usage**: Marketing content, editorial text, promotional copy

## Navigation Components

### **Tabs (`Tabs.tsx`)**
Tab navigation component for organizing content into switchable sections.
- **Purpose**: Organize related content into navigable sections
- **Features**: Horizontal navigation, active state management, keyboard navigation
- **Usage**: Content organization, settings panels, multi-step forms

## Overlay Components

### **Modal (`Modal.tsx`)**
Overlay component for displaying content in a dialog format.
- **Purpose**: Display focused content and capture user attention
- **Features**: Multiple sizes (sm, md, lg, fullscreen), backdrop dismiss, open/close events
- **Usage**: Confirmations, forms, detailed views, focused interactions

### **ModalHeader (`ModalHeader.tsx`)**
Header component specifically designed for modal dialogs.
- **Purpose**: Provide consistent modal header structure
- **Features**: Title display, close button integration
- **Usage**: Modal titles, dialog headers

### **ModalContent (`ModalContent.tsx`)**
Content area component for modal body content.
- **Purpose**: Structured content area within modals
- **Features**: Proper spacing and content organization
- **Usage**: Modal body content, form containers within modals

### **ModalFooter (`ModalFooter.tsx`)**
Footer component for modal action buttons and secondary content.
- **Purpose**: Action buttons and footer content in modals
- **Features**: Button alignment, consistent spacing
- **Usage**: Modal actions, cancel/confirm buttons

### **Popover (`Popover.tsx`)**
Floating content component for contextual information and actions.
- **Purpose**: Display contextual content without leaving current context
- **Features**: Positioning control, trigger management, dismissible
- **Usage**: Tooltips, context menus, additional information, help text

### **Tooltip (`Tooltip.tsx`)**
Small overlay component for providing helpful context and information.
- **Purpose**: Provide contextual help and additional information
- **Features**: Hover/focus triggers, positioning, accessible content
- **Usage**: Help text, explanations, additional context, accessibility aids

### **Toast (`Toast.tsx`)**
Notification component for temporary status messages and feedback.
- **Purpose**: Temporary notifications and status updates
- **Features**: Auto-dismiss, multiple variants, positioning, action buttons
- **Usage**: Success messages, error notifications, status updates, user feedback

## Data Display Components

### **Table (`Table.tsx`)**
Structured data display component for tabular information.
- **Purpose**: Display structured data in rows and columns
- **Features**: Sortable columns, responsive behavior, selection states
- **Usage**: Data tables, comparison charts, structured lists

### **TableHead (`TableHead.tsx`)**
Header section component for table structure.
- **Purpose**: Define table column headers and structure
- **Features**: Column definitions, sorting indicators
- **Usage**: Table headers, column labels

### **TableHeadCell (`TableHeadCell.tsx`)**
Individual header cell component for table columns.
- **Purpose**: Individual column header definition
- **Features**: Sorting capabilities, alignment options
- **Usage**: Column headers, sortable table headers

### **TableBody (`TableBody.tsx`)**
Body section component containing table data rows.
- **Purpose**: Container for table data content
- **Features**: Row management, scrollable content
- **Usage**: Table data container, row grouping

### **TableRow (`TableRow.tsx`)**
Individual row component for table data organization.
- **Purpose**: Individual row of table data
- **Features**: Selection states, hover effects, responsive behavior
- **Usage**: Data rows, table content organization

### **TableCell (`TableCell.tsx`)**
Individual cell component for table data display.
- **Purpose**: Individual data cell within table rows
- **Features**: Content alignment, responsive behavior
- **Usage**: Data cells, table content display

### **Progress (`Progress.tsx`)**
Visual progress indicator for showing completion status.
- **Purpose**: Display progress and completion status
- **Features**: Percentage display, multiple variants, indeterminate state
- **Usage**: Loading progress, task completion, step indicators

## Utility Components

### **Accordion (`Accordion.tsx`)**
Collapsible content component for space-efficient information display.
- **Purpose**: Organize content in expandable/collapsible sections
- **Features**: Expand/collapse states, multiple sections, keyboard navigation
- **Usage**: FAQ sections, content organization, space-saving layouts

### **DropdownMenu (`DropdownMenu.tsx`)**
Context menu component for actions and navigation options.
- **Purpose**: Contextual actions and menu navigation
- **Features**: Trigger management, keyboard navigation, nested menus
- **Usage**: Action menus, context menus, navigation dropdowns

---

## Usage Guidelines

### **🎯 Component Mapping Guide (For AI Tools & Code Generators)**
**When tools like Bolt, V0, or Claude generate components, map them to Pine equivalents:**

#### **🔄 Common Component Name Mappings:**
- **`Card` → `Box`** with `border="true"` and `padding="md"`
- **`Badge` → `Chip`** for status indicators and labels
- **`Container` → `Box`** with appropriate layout props
- **`Flex` → `Box`** with `display="flex"` and `direction` props
- **`Grid` → `Row`** for multi-column layouts
- **`Section` → `Box`** with `direction="column"` and `fit="true"`
- **`Header` → `Text`** with `tag="h1"` (or appropriate heading level)
- **`Paragraph` → `Text`** with `tag="p"`
- **`Label` → Use component's `label` prop** (e.g., `<Input label="Email" />` instead of separate label)
- **`Span` → `Text`** with `tag="span"`
- **`Divider` → `Divider`** for visual separators
- **`● + Text` → `Chip`** with `dot="true"` (status indicators with colored dots)
- **`Button` with nested Icon → `Button`** with `startIcon` or `endIcon` prop

#### **❌ NEVER Create These Custom Components:**
- **NO `<Card>`** - Use `Box` with styling props
- **NO `<Badge>`** - Use `Chip` component
- **NO `<Container>`** - Use `Box` for layout
- **NO `<Flex>`** - Use `Box` with flex properties
- **NO `<Grid>`** - Use `Row` + `Box` grid system
- **NO `● + text`** - Use `Chip` with `dot="true"`
- **NO nested Icons in Buttons** - Use `startIcon` or `endIcon` props
- **NO custom styled `<div>`** - Use appropriate Pine component

#### **🔄 Code Conversion Examples:**

**❌ AI Tool Generated (DON'T DO THIS):**
```jsx
<Card className="p-4 border rounded-lg">
  <h2>Product Name</h2>
  <p>Product description here</p>
  <Badge variant="success">In Stock</Badge>
  <Button>Add to Cart</Button>
</Card>
```

**✅ Pine Design System (DO THIS):**
```jsx
<Box border="true" padding="md" borderRadius="md">
  <Text tag="h2">Product Name</Text>
  <Text tag="p">Product description here</Text>
  <Chip dot variant="success">In Stock</Chip>
  <Button>Add to Cart</Button>
</Box>
```

**❌ AI Tool Generated (DON'T DO THIS):**
```jsx
<Container>
  <Grid>
    <div className="col-md-6">
      <h1>Welcome</h1>
    </div>
    <div className="col-md-6">
      <input placeholder="Search..." />
    </div>
  </Grid>
</Container>
```

**✅ Pine Design System (DO THIS):**
```jsx
<Box fit="true" direction="column">
  <Row colGap="md">
    <Box sizeMd="6">
      <Box border="true">
        <Text tag="h1">Welcome</Text>
      </Box>
    </Box>
    <Box sizeMd="6">
      <Box border="true">
        <Input placeholder="Search..." />
      </Box>
    </Box>
  </Row>
</Box>
```

**❌ AI Tool Generated (DON'T DO THIS):**
```jsx
<div className="status-item">
  <span className="dot">●</span>
  <span>Online</span>
</div>
```

**✅ Pine Design System (DO THIS):**
```jsx
<Chip dot variant="success">Online</Chip>
```

**❌ AI Tool Generated (DON'T DO THIS):**
```jsx
<Button onClick={handleClick}>
  <Icon name="cart" size="20px" />
  Add to Cart
</Button>
```

**✅ Pine Design System (DO THIS):**
```jsx
<Button
  onClick={handleClick}
  startIcon={<Icon name="cart" size="20px" />}
>
  Add to Cart
</Button>
```

#### **📝 Prompt Templates for AI Tools:**

**When using Bolt, V0, Claude, or other AI tools, include this in your prompt:**

> "Use Pine Design System components only. Never create custom Card, Badge, Container, Flex, Grid, or other generic components.
>
> **Component Mappings:**
> - Card → Box with border and padding
> - Badge → Chip
> - Container → Box with fit="true"
> - Grid → Row + Box with sizeMd attributes
> - Any button → Button
> - Any input → Input
> - Any text → Text with tag prop
> - Dot + text (● Online) → Chip with dot="true"
> - Button with nested Icon → Button with startIcon/endIcon prop
>
> **Requirements:**
> - Use mobile-first design with sizeMd, sizeLg (never base size)
> - Use Row for multi-column layouts
> - Use semantic components before layout components
> - Never use bullet points (●) or dots - use Chip with dot prop
> - Never nest Icons inside Button content - use startIcon/endIcon props
> - Never mix raw HTML with Pine components"

#### **🔧 Quick Reference for AI Tool Integration:**
- **Always specify**: "Use Pine Design System components"
- **Never allow**: Custom component creation when Pine equivalent exists
- **Emphasize**: Mobile-first responsive design patterns
- **Require**: Semantic component selection over layout components

### **🥇 Semantic Components First (Critical Decision Hierarchy)**
**Before using any layout component, ask: "Is there a semantic component for this?"**

#### **✅ Use Semantic Components For:**
- **Navigation/Tabs**: Use `Tabs` + `Tab` (NOT `Box` + `span`)
- **Buttons**: Use `Button` (NOT `Box` + click handlers)
- **Text Content**: Use `Text` with `tag` prop (NOT raw `h1`/`p`/`span`)
- **Form Inputs**: Use `Input`, `Select`, `Textarea` (NOT raw form elements)
- **Icons**: Use `Icon` (NOT custom SVG or styled elements)
- **Alerts/Feedback**: Use `Alert`, `Toast` (NOT custom styled boxes)

#### **❌ Critical Violations to Avoid:**
- **NO raw HTML mixed with Pine components** (`div`, `span`, `p`, `h1`, etc.)
- **NO inline styles** (`style="..."`) on Pine components
- **NO `min-height='100vh'`** without explicit user request (breaks layouts)
- **NO layout components for semantic content** (use purpose-built components)

### **🔴 Blocking Rules (Implementation Will Be Rejected)**

#### **Mobile-First Design (Mandatory)**
- **NEVER use base `size` attribute** - Use responsive modifiers only
- **Required Pattern**: `<Box sizeMd="6">` (100% width on mobile, 50% on medium+)
- **Forbidden Pattern**: `<Box size="6">` (forces fixed width on ALL screens)

#### **Layout Foundation Requirements**
- **Multi-column layouts MUST use `Row` container** with `Box` children
- **Grid columns MUST have `size-*` properties** (e.g., `sizeMd="6"`)
- **Column sizes MUST total ≤12 per row**
- **NO mixing `fit` and `size` properties** - they are mutually exclusive

#### **Component Verification**
- **All components must exist in Pine documentation** - Use only documented components
- **Props must be verified** - Undocumented properties cause runtime errors
- **NO style attributes** - Use Pine component properties instead

### **📱 Mobile-First Layout System**

#### **Grid System**
- **12-column responsive grid** using `Row` and `Box`
- **Critical Pattern**: `colGap` requires nested structure for proper spacing
  ```jsx
  <Row colGap="md">
    {/* Grid column - gets the size, NO styling */}
    <Box sizeMd="6" sizeLg="4">
      {/* Content box - gets styling, padding, borders */}
      <Box border padding="md">Content 1</Box>
    </Box>
    <Box sizeMd="6" sizeLg="8">
      <Box border padding="md">Content 2</Box>
    </Box>
  </Row>
  ```

#### **🚨 Grid Layout Rules:**
- **Outer `Box`**: Gets size attributes (`sizeMd`, `sizeLg`) - NO styling
- **Inner `Box`**: Gets all styling (`border`, `padding`, `backgroundColor`)
- **`colGap` on `Row`**: Creates spacing between grid columns only
- **NEVER**: Put styling directly on the grid column box

#### **Responsive Breakpoints**
- **xs**: Extra small devices (default, 100% width)
- **sm**: Small devices (≥576px)
- **md**: Medium devices (≥768px)
- **lg**: Large devices (≥992px)
- **xl**: Extra large devices (≥1200px)

#### **Critical Layout Rules**
- **`Box` defaults to horizontal layout** - ALWAYS set `direction="column"` for vertical stacking
- **MUST set `display="flex"`** to use alignment properties (`alignItems`, `justifyContent`)
- **Main content sections MUST use `fit="true"`** for proper space distribution
- **Grid Pattern**: Size goes on outer `Box`, styling goes on inner `Box` - this separation is REQUIRED for `colGap` to work
- **Use `colGap` on `Row`** - NEVER add margins/padding to direct grid column children

### **Quick Reference**

#### **Core Implementation Rules**
- **Semantic First**: Use purpose-built components (Button, Input, Text) before layout components (Box, Row)
- **Mobile-First**: Use responsive modifiers (`sizeMd="6"`) - NEVER base size attributes
- **Design Tokens**: Use Pine's spacing tokens (xs, sm, md, lg, xl) - NO hardcoded values
- **Component Validation**: All components must exist in Pine documentation

#### **Essential Component Categories**
- **Layout**: `Box` (containers), `Row` (grid system)
- **Forms**: `Input`, `Select`, `Textarea`, `Button`, `Checkbox`, `Radio`
- **Content**: `Text` (with tag prop), `Icon`, `Image`, `Alert`
- **Navigation**: `Tabs`, `Link`, `DropdownMenu`
- **Data Display**: `Table`, `Progress`, `Chip`

#### **Technical Standards**
- **TypeScript**: Full type safety with comprehensive interfaces
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Web Components**: Built on Stencil.js for cross-framework compatibility
- **Validation**: Automatic validation against Pine rules and mobile-first principles
