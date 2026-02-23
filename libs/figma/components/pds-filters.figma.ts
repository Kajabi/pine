import figma, { html } from '@figma/code-connect/html';

figma.connect('<FIGMA_FILTERS>', {
  props: {
    filters: figma.children(['filter-select']),
  },
  example: () => html`<pds-filters>
    <pds-filter component-id="filter-1" variant="default" icon="flash" text="Trigger">
      <!-- Popover content goes here -->
    </pds-filter>
    <pds-filter component-id="filter-2" variant="default" icon="switch-vertical" text="Action">
      <!-- Popover content goes here -->
    </pds-filter>
    <pds-filter component-id="filter-3" variant="default" icon="calendar-simple" text="Date">
      <!-- Popover content goes here -->
    </pds-filter>
    <pds-filter component-id="filter-4" variant="default" icon="activity" text="Status">
      <!-- Popover content goes here -->
    </pds-filter>
    <pds-filter component-id="filter-5" variant="more" icon="add-circle" text="More filters">
      <!-- Popover content goes here -->
    </pds-filter>
  </pds-filters>`,
});
