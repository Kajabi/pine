import React from 'react';
import { Box } from '../Box';
import { Row } from '../Row';

/**
 * Layout - Comprehensive layout examples and patterns
 *
 * **Layout System Overview:**
 * - **Single-Column Layouts**: Use `pds-box` with `direction="column"` for vertical stacking
 * - **Multi-Column Grids**: Use `pds-row` with `pds-box` children for horizontal layouts
 * - **Responsive Design**: Use size modifiers (e.g., `size-md="6"`) for breakpoint-specific layouts
 * - **Nested Layouts**: Combine rows and boxes for complex layouts
 *
 * **Key Layout Patterns:**
 * - **Main Containers**: Always use `direction="column"` and `fit="true"` for page sections
 * - **Grid Layouts**: Use `pds-row` with `pds-box` children that have `size-*` props
 * - **Responsive Breakpoints**: xs, sm, md, lg, xl with different column sizes
 * - **Alignment**: Use `alignItems` and `justifyContent` for positioning
 *
 * **Usage Examples:**
 * ```tsx
 * // Single-column layout
 * <Layout.SingleColumn>
 *   <h1>Page Title</h1>
 *   <p>Page content</p>
 * </Layout.SingleColumn>
 *
 * // Two-column responsive grid
 * <Layout.TwoColumn
 *   leftContent={<div>Left content</div>}
 *   rightContent={<div>Right content</div>}
 * />
 *
 * // Three-column card layout
 * <Layout.ThreeColumnCards
 *   cards={[
 *     { title: 'Card 1', content: 'Content 1' },
 *     { title: 'Card 2', content: 'Content 2' },
 *     { title: 'Card 3', content: 'Content 3' }
 *   ]}
 * />
 * ```
 */

interface LayoutProps {
  children?: React.ReactNode;
  className?: string;
}

interface TwoColumnLayoutProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  leftSize?: string;
  rightSize?: string;
  gap?: 'none' | 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  className?: string;
}

interface CardLayoutProps {
  cards: Array<{
    title: string;
    content: string;
    icon?: string;
  }>;
  gap?: 'none' | 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  className?: string;
}

interface FormLayoutProps {
  mainContent: React.ReactNode;
  sidebarContent: React.ReactNode;
  className?: string;
}

// Single Column Layout - For main content areas
export const SingleColumn: React.FC<LayoutProps> = ({ children, className = '' }) => {
  return (
    <Box
      direction="column"
      fit="true"
      gap="lg"
      padding="lg"
      className={className}
    >
      {children}
    </Box>
  );
};

// Two Column Layout - For content + sidebar patterns
export const TwoColumn: React.FC<TwoColumnLayoutProps> = ({
  leftContent,
  rightContent,
  leftSize = "8",
  rightSize = "4",
  gap = "md",
  className = ''
}) => {
  return (
    <Box fit="true" padding="lg">
      <Row colGap={gap} className={className}>
        <Box sizeMd={leftSize} direction="column" gap="md">
          {leftContent}
        </Box>
        <Box sizeMd={rightSize} direction="column" gap="md">
          {rightContent}
        </Box>
      </Row>
    </Box>
  );
};

// Three Column Cards Layout - For dashboard cards
export const ThreeColumnCards: React.FC<CardLayoutProps> = ({
  cards,
  gap = "md",
  className = ''
}) => {
  return (
    <Box fit="true" padding="lg">
      <Row colGap={gap} className={className}>
        {cards.map((card, index) => (
          <Box
            key={index}
            sizeMd="4"
            direction="column"
            padding="md"
            border="true"
            borderRadius="lg"
            shadow="sm"
            gap="sm"
          >
            <h3>{card.title}</h3>
            <p>{card.content}</p>
            {card.icon && (
              <Box justifyContent="end">
                <span className="icon">{card.icon}</span>
              </Box>
            )}
          </Box>
        ))}
      </Row>
    </Box>
  );
};

// Form Edit Layout - For complex form layouts with sidebar
export const FormEditLayout: React.FC<FormLayoutProps> = ({
  mainContent,
  sidebarContent,
  className = ''
}) => {
  return (
    <Box fit="true" padding="lg">
      <Row colGap="md" className={className}>
        {/* Main Content Area */}
        <Box sizeMd="8" direction="column" gap="md">
          {mainContent}
        </Box>

        {/* Sidebar */}
        <Box sizeMd="4" direction="column" gap="md">
          {sidebarContent}
        </Box>
      </Row>
    </Box>
  );
};

// Hero Layout - For landing page hero sections
export const HeroLayout: React.FC<LayoutProps> = ({ children, className = '' }) => {
  return (
    <Box
      direction="column"
      fit="true"
      alignItems="center"
      justifyContent="center"
      padding="xl"
      minHeight="400px"
      backgroundColor="#F5F5F5"
      borderRadius="lg"
      shadow="md"
      className={className}
    >
      {children}
    </Box>
  );
};

// Responsive Grid Layout - For responsive content grids
export const ResponsiveGrid: React.FC<LayoutProps> = ({ children, className = '' }) => {
  return (
    <Box fit="true" padding="lg">
      <Row colGap="md" className={className}>
        {React.Children.map(children, (child, index) => (
          <Box
            key={index}
            sizeMd="6"
            sizeLg="4"
            sizeXl="3"
            direction="column"
            padding="md"
            border="true"
            borderRadius="lg"
          >
            {child}
          </Box>
        ))}
      </Row>
    </Box>
  );
};

// Nested Layout - For complex nested structures
export const NestedLayout: React.FC<LayoutProps> = ({ children, className = '' }) => {
  return (
    <Box fit="true" padding="lg">
      <Row colGap="md" className={className}>
        {/* Left Column with Nested Content */}
        <Box sizeMd="8" direction="column" gap="md">
          <Box border="true" borderRadius="lg" padding="md" direction="column" gap="md">
            <h3>Main Content Section</h3>
            <Row colGap="sm">
              <Box sizeXl="6" padding="sm" border="true" borderRadius="sm">
                Nested Item 1
              </Box>
              <Box sizeXl="6" padding="sm" border="true" borderRadius="sm">
                Nested Item 2
              </Box>
            </Row>
          </Box>
        </Box>

        {/* Right Column */}
        <Box sizeMd="4" direction="column" gap="md">
          <Box
            border="true"
            borderRadius="lg"
            padding="md"
            direction="column"
            alignItems="center"
            justifyContent="center"
            minHeight="200px"
          >
            <h3>Sidebar Content</h3>
            <p>Additional information or actions</p>
          </Box>
        </Box>
      </Row>
    </Box>
  );
};

// Default export with all layout components
const Layout = {
  SingleColumn,
  TwoColumn,
  ThreeColumnCards,
  FormEditLayout,
  HeroLayout,
  ResponsiveGrid,
  NestedLayout,
};

export default Layout;
