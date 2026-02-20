import figma, { html } from '@figma/code-connect/html';

// PATTERNS
figma.connect("<FIGMA_SORTABLE_ITEM_SIMPLE>", {
  example: () => html`<pds-sortable-item handle>
    <pds-box>
      <pds-text weight="bold">Product title</pds-text>
    </pds-box>
  </pds-sortable-item>`,
});

figma.connect("<FIGMA_SORTABLE_ITEM_DOWNLOADS>", {
  example: () => html`<pds-sortable-item enable-actions handle>
    <pds-box direction="column">
      <pds-text weight="bold">Download title</pds-text>
      <pds-text>file_name.jpg</pds-text>
    </pds-box>
    <pds-box slot="sortable-item-actions">
      <pds-icon name="download" />
      <pds-icon name="pen"/>
      <pds-icon name="remove-circle" />
    </pds-box>
  </pds-sortable-item>`,
});

figma.connect("<FIGMA_SORTABLE_ITEM_NAV>", {
  example: () => html`<pds-sortable-item enable-actions handle>
    <pds-box direction="column">
      <pds-text weight="bold">Nav title</pds-text>
      <pds-text>NavType</pds-text>
    </pds-box>
    <pds-box slot="sortable-item-actions">
      <pds-icon name="preview-on" />
      <pds-icon name="pen"/>
    </pds-box>
  </pds-sortable-item>`,
});

figma.connect("<FIGMA_SORTABLE_ITEM_FORM>", {
  example: () => html`<pds-sortable-item enable-actions handle>
    <pds-box direction="column">
      <pds-text weight="bold">Form field title</pds-text>
      <pds-text>FormFieldType</pds-text>
    </pds-box>
    <pds-box slot="sortable-item-actions">
      <pds-icon name="pen" />
      <pds-icon name="remove-circle"/>
    </pds-box>
  </pds-sortable-item>`,
});

figma.connect("<FIGMA_SORTABLE_ITEM_LESSON>", {
  example: () => html`<pds-sortable-item enable-actions handle>
    <pds-box align-items="center" gap="sm">
      <pds-icon icon="file" />
      <pds-text weight="bold">Lesson title</pds-text>
    </pds-box>
    <pds-box align-items="center" gap="sm" slot="sortable-item-actions">
      <pds-chip dot sentiment="success" variant="dropdown">Published</pds-chip>
      <pds-button variant="unstyled" icon-only="true">
        <pds-icon slot="start" aria-hidden="true" name="dot-menu-horizontal"></pds-icon>
      </pds-button>
    </pds-box>
  </pds-sortable-item>`,
});

figma.connect("<FIGMA_SORTABLE_LIST>", {
  props: {
    variant: figma.enum("Variant", {
      "Library sorting": html`<pds-sortable-item enable-actions handle>
    <pds-box direction="column">
      <pds-text weight="bold">Product title 1</pds-text>
      <pds-text>Category</pds-text>
    </pds-box>
    <pds-box slot="sortable-item-actions">
      <pds-icon name="pen" />
      <pds-icon name="remove-circle"/>
    </pds-box>
  </pds-sortable-item>
  <pds-sortable-item enable-actions handle>
    <pds-box direction="column">
      <pds-text weight="bold">Product title 1</pds-text>
      <pds-text>Category</pds-text>
    </pds-box>
    <pds-box slot="sortable-item-actions">
      <pds-icon name="pen" />
      <pds-icon name="remove-circle"/>
    </pds-box>
  </pds-sortable-item>
  <pds-sortable-item enable-actions handle>
    <pds-box direction="column">
      <pds-text weight="bold">Product title 1</pds-text>
      <pds-text>Category</pds-text>
    </pds-box>
    <pds-box slot="sortable-item-actions">
      <pds-icon name="pen" />
      <pds-icon name="remove-circle"/>
    </pds-box>
  </pds-sortable-item>`,
      "Downloads": html`<pds-sortable-item enable-actions handle>
    <pds-box direction="column">
      <pds-text weight="bold">Download title</pds-text>
      <pds-text>file_name.jpg</pds-text>
    </pds-box>
    <pds-box slot="sortable-item-actions">
      <pds-icon name="download" />
      <pds-icon name="pen" />
      <pds-icon name="remove-circle"/>
    </pds-box>
  </pds-sortable-item>
  <pds-sortable-item enable-actions handle>
    <pds-box direction="column">
      <pds-text weight="bold">Download title</pds-text>
      <pds-text>file_name.jpg</pds-text>
    </pds-box>
    <pds-box slot="sortable-item-actions">
      <pds-icon name="download" />
      <pds-icon name="pen" />
      <pds-icon name="remove-circle"/>
    </pds-box>
  </pds-sortable-item>
  <pds-sortable-item enable-actions handle>
    <pds-box direction="column">
      <pds-text weight="bold">Download title</pds-text>
      <pds-text>file_name.jpg</pds-text>
    </pds-box>
    <pds-box slot="sortable-item-actions">
      <pds-icon name="download" />
      <pds-icon name="pen" />
      <pds-icon name="remove-circle"/>
    </pds-box>
  </pds-sortable-item>`,
      "Navigation": html`<pds-sortable-item enable-actions handle>
    <pds-box direction="column">
      <pds-text weight="bold">Nav title</pds-text>
      <pds-text>NavType</pds-text>
    </pds-box>
    <pds-box slot="sortable-item-actions">
      <pds-icon name="preview-on" />
      <pds-icon name="pen" />
    </pds-box>
  </pds-sortable-item>
  <pds-sortable-item enable-actions handle>
    <pds-box direction="column">
      <pds-text weight="bold">Nav title</pds-text>
      <pds-text>NavType</pds-text>
    </pds-box>
    <pds-box slot="sortable-item-actions">
      <pds-icon name="preview-on" />
      <pds-icon name="pen" />
    </pds-box>
  </pds-sortable-item>
  <pds-sortable-item enable-actions handle>
    <pds-box direction="column">
      <pds-text weight="bold">Nav title</pds-text>
      <pds-text>NavType</pds-text>
    </pds-box>
    <pds-box slot="sortable-item-actions">
      <pds-icon name="preview-on" />
      <pds-icon name="pen" />
    </pds-box>
  </pds-sortable-item>`,
      "Lessons": html`<pds-sortable-item enable-actions handle>
    <pds-box align-items="center" gap="sm">
      <pds-icon icon="file" />
      <pds-text weight="bold">Lesson title</pds-text>
    </pds-box>
    <pds-box align-items="center" gap="sm" slot="sortable-item-actions">
      <pds-chip dot sentiment="success" variant="dropdown">Published</pds-chip>
      <pds-button variant="unstyled" icon-only="true">
        <pds-icon slot="start" aria-hidden="true" name="dot-menu-horizontal"></pds-icon>
      </pds-button>
    </pds-box>
  </pds-sortable-item>
  <pds-sortable-item enable-actions handle>
    <pds-box align-items="center" gap="sm">
      <pds-icon icon="file" />
      <pds-text weight="bold">Lesson title</pds-text>
    </pds-box>
    <pds-box align-items="center" gap="sm" slot="sortable-item-actions">
      <pds-chip dot sentiment="success" variant="dropdown">Published</pds-chip>
      <pds-button variant="unstyled" icon-only="true">
        <pds-icon slot="start" aria-hidden="true" name="dot-menu-horizontal"></pds-icon>
      </pds-button>
    </pds-box>
  </pds-sortable-item>
  <pds-sortable-item enable-actions handle>
    <pds-box align-items="center" gap="sm">
      <pds-icon icon="file" />
      <pds-text weight="bold">Lesson title</pds-text>
    </pds-box>
    <pds-box align-items="center" gap="sm" slot="sortable-item-actions">
      <pds-chip dot sentiment="success" variant="dropdown">Published</pds-chip>
      <pds-button variant="unstyled" icon-only="true">
        <pds-icon slot="start" aria-hidden="true" name="dot-menu-horizontal"></pds-icon>
      </pds-button>
    </pds-box>
  </pds-sortable-item>`,
    }),
  },
  example: (props) => html`<pds-sortable component-id="sortable-list" handle-type="handle" border dividers>
  ${props.variant}
</pds-sortable>`,
});

figma.connect("<FIGMA_PRODUCT_LIST>", {
  props: {
    variant: figma.enum("Variant", {
      "All products": html`
      <pds-box gap="sm">
    <!-- Image -->
    <pds-box flex="shrink">
      <pds-image src={image} alt="Offers" width="100px"/>
    </pds-box>
    <!-- Title and properties -->
    <pds-box direction="column" flex="grow">
      <pds-text weight="bold">Course title</pds-text>
      <pds-box gap="sm">
        <pds-property icon="users" value="Category">14</pds-property>
        <pds-property icon="calendar-date" value="Category">Created on April 20th, 2022</pds-property>
      </pds-box>
    </pds-box>
    <!-- Actions -->
    <pds-box flex="shrink" align-items="center" gap="sm">
      <pds-chip sentiment="accent" >Course</pds-chip>
      <pds-button variant="unstyled" icon-only>
        <pds-icon name="dot-menu-horizontal" slot="start"/>
      </pds-button>
    </pds-box>
  </pds-box>
  <pds-box gap="sm">
    <!-- Image -->
    <pds-box flex="shrink">
      <pds-image src={image} alt="Offers" width="100px"/>
    </pds-box>
    <!-- Title and properties -->
    <pds-box direction="column" flex="grow">
      <pds-text weight="bold">Podcast title</pds-text>
      <pds-box gap="sm">
        <pds-property icon="users" value="Category">14</pds-property>
        <pds-property icon="calendar-date" value="Category">Created on April 20th, 2022</pds-property>
      </pds-box>
    </pds-box>
    <!-- Actions -->
    <pds-box flex="shrink" align-items="center" gap="sm">
      <pds-chip sentiment="accent" >Course</pds-chip>
      <pds-button variant="unstyled" icon-only>
        <pds-icon name="dot-menu-horizontal" slot="start"/>
      </pds-button>
    </pds-box>
  </pds-box>
  <pds-box gap="sm">
    <!-- Image -->
    <pds-box flex="shrink">
      <pds-image src={image} alt="Offers" width="100px"/>
    </pds-box>
    <!-- Title and properties -->
    <pds-box direction="column" flex="grow">
      <pds-text weight="bold">Coaching title</pds-text>
      <pds-box gap="sm">
        <pds-property icon="users" value="Category">14</pds-property>
        <pds-property icon="calendar-date" value="Category">Created on April 20th, 2022</pds-property>
      </pds-box>
    </pds-box>
    <!-- Actions -->
    <pds-box flex="shrink" align-items="center" gap="sm">
      <pds-chip sentiment="accent" >Course</pds-chip>
      <pds-button variant="unstyled" icon-only>
        <pds-icon name="dot-menu-horizontal" slot="start"/>
      </pds-button>
    </pds-box>
  </pds-box>
  <pds-box gap="sm">
    <!-- Image -->
    <pds-box flex="shrink">
      <pds-image src={image} alt="Offers" width="100px"/>
    </pds-box>
    <!-- Title and properties -->
    <pds-box direction="column" flex="grow">
      <pds-text weight="bold">Community title</pds-text>
      <pds-box gap="sm">
        <pds-property icon="users" value="Category">14</pds-property>
        <pds-property icon="calendar-date" value="Category">Created on April 20th, 2022</pds-property>
      </pds-box>
    </pds-box>
    <!-- Actions -->
    <pds-box flex="shrink" align-items="center" gap="sm">
      <pds-chip sentiment="accent" >Course</pds-chip>
      <pds-button variant="unstyled" icon-only>
        <pds-icon name="dot-menu-horizontal" slot="start"/>
      </pds-button>
    </pds-box>
  </pds-box>
      `,
      "Courses": html`
  <!-- Course -->
  <pds-box gap="sm">
    <!-- Image -->
    <pds-box flex="shrink">
      <pds-image src={image} alt="Offers" width="100px"/>
    </pds-box>
    <!-- Title and properties -->
    <pds-box direction="column" flex="grow">
      <pds-text weight="bold">Course title</pds-text>
      <pds-box gap="sm">
        <pds-property icon="users" value="Category">14</pds-property>
        <pds-property icon="calendar-date" value="Category">Created on April 20th, 2022</pds-property>
      </pds-box>
    </pds-box>
    <!-- Actions -->
    <pds-box flex="shrink" align-items="center" gap="sm">
      <pds-button variant="unstyled" icon-only>
        <pds-icon name="dot-menu-horizontal" slot="start"/>
      </pds-button>
    </pds-box>
  </pds-box>
  <!-- Course -->
  <pds-box gap="sm">
    <!-- Image -->
    <pds-box flex="shrink">
      <pds-image src={image} alt="Offers" width="100px"/>
    </pds-box>
    <!-- Title and properties -->
    <pds-box direction="column" flex="grow">
      <pds-text weight="bold">Course title</pds-text>
      <pds-box gap="sm">
        <pds-property icon="users" value="Category">14</pds-property>
        <pds-property icon="calendar-date" value="Category">Created on April 20th, 2022</pds-property>
      </pds-box>
    </pds-box>
    <!-- Actions -->
    <pds-box flex="shrink" align-items="center" gap="sm">
      <pds-button variant="unstyled" icon-only>
        <pds-icon name="dot-menu-horizontal" slot="start"/>
      </pds-button>
    </pds-box>
  </pds-box>
  <pds-box gap="sm">
    <!-- Image -->
    <pds-box flex="shrink">
      <pds-image src={image} alt="Offers" width="100px"/>
    </pds-box>
    <!-- Title and properties -->
    <pds-box direction="column" flex="grow">
      <pds-text weight="bold">Course title</pds-text>
      <pds-box gap="sm">
        <pds-property icon="users" value="Category">14</pds-property>
        <pds-property icon="calendar-date" value="Category">Created on April 20th, 2022</pds-property>
      </pds-box>
    </pds-box>
    <!-- Actions -->
    <pds-box flex="shrink" align-items="center" gap="sm">
      <pds-button variant="unstyled" icon-only>
        <pds-icon name="dot-menu-horizontal" slot="start"/>
      </pds-button>
    </pds-box>
  </pds-box>
      `,
      "Podcasts": html`
  <!-- Podcast -->
  <pds-box gap="sm">
    <!-- Image -->
    <pds-box flex="shrink">
      <pds-image src={image} alt="Offers" width="100px"/>
    </pds-box>
    <!-- Title and properties -->
    <pds-box direction="column" flex="grow">
      <pds-text weight="bold">The Daily Seed: Conversations with Floral Designers</pds-text>
      <pds-box gap="sm">
        <pds-property icon="file">4 episodes</pds-property>
        <pds-property icon="chart">32 downloads</pds-property>
        <pds-property icon="calendar-simple">Created on April 20th, 2022</pds-property>
      </pds-box>
    </pds-box>
    <!-- Actions -->
    <pds-box flex="shrink" align-items="center" gap="sm">
      <pds-chip sentiment="accent" >Private</pds-chip>
      <pds-button variant="unstyled" icon-only>
        <pds-icon name="dot-menu-horizontal" slot="start"/>
      </pds-button>
    </pds-box>
  </pds-box>
  <!-- Podcast -->
  <pds-box gap="sm">
    <!-- Image -->
    <pds-box flex="shrink">
      <pds-image src={image} alt="Offers" width="100px"/>
    </pds-box>
    <!-- Title and properties -->
    <pds-box direction="column" flex="grow">
      <pds-text weight="bold">The Daily Seed: Conversations with Floral Designers</pds-text>
      <pds-box gap="sm">
        <pds-property icon="file">4 episodes</pds-property>
        <pds-property icon="chart">32 downloads</pds-property>
        <pds-property icon="calendar-simple">Created on April 20th, 2022</pds-property>
      </pds-box>
    </pds-box>
    <!-- Actions -->
    <pds-box flex="shrink" align-items="center" gap="sm">
      <pds-chip sentiment="accent" >Private</pds-chip>
      <pds-button variant="unstyled" icon-only>
        <pds-icon name="dot-menu-horizontal" slot="start"/>
      </pds-button>
    </pds-box>
  </pds-box>
  <!-- Podcast -->
  <pds-box gap="sm">
    <!-- Image -->
    <pds-box flex="shrink">
      <pds-image src={image} alt="Offers" width="100px"/>
    </pds-box>
    <!-- Title and properties -->
    <pds-box direction="column" flex="grow">
      <pds-text weight="bold">The Daily Seed: Conversations with Floral Designers</pds-text>
      <pds-box gap="sm">
        <pds-property icon="file">4 episodes</pds-property>
        <pds-property icon="chart">32 downloads</pds-property>
        <pds-property icon="calendar-simple">Created on April 20th, 2022</pds-property>
      </pds-box>
    </pds-box>
    <!-- Actions -->
    <pds-box flex="shrink" align-items="center" gap="sm">
      <pds-chip sentiment="accent" >Private</pds-chip>
      <pds-button variant="unstyled" icon-only>
        <pds-icon name="dot-menu-horizontal" slot="start"/>
      </pds-button>
    </pds-box>
  </pds-box>
  `,
      "Coaching": html`
  <!-- Coaching -->
  <pds-box gap="sm">
    <!-- Image -->
    <pds-box flex="shrink">
      <pds-image src={image} alt="Offers" width="100px"/>
    </pds-box>
    <!-- Title and properties -->
    <pds-box direction="column" flex="grow">
      <pds-text weight="bold">Program title</pds-text>
      <pds-box gap="sm">
        <pds-property icon="users" value="Category">14</pds-property>
        <pds-property icon="calendar-date" value="Category">Created on April 20th, 2022</pds-property>
      </pds-box>
    </pds-box>
    <!-- Actions -->
    <pds-box flex="shrink" align-items="center" gap="sm">
      <pds-button variant="unstyled" icon-only>
        <pds-icon name="dot-menu-horizontal" slot="start"/>
      </pds-button>
    </pds-box>
  </pds-box>
  <!-- Coaching -->
  <pds-box gap="sm">
    <!-- Image -->
    <pds-box flex="shrink">
      <pds-image src={image} alt="Offers" width="100px"/>
    </pds-box>
    <!-- Title and properties -->
    <pds-box direction="column" flex="grow">
      <pds-text weight="bold">Program title</pds-text>
      <pds-box gap="sm">
        <pds-property icon="users" value="Category">14</pds-property>
        <pds-property icon="calendar-date" value="Category">Created on April 20th, 2022</pds-property>
      </pds-box>
    </pds-box>
    <!-- Actions -->
    <pds-box flex="shrink" align-items="center" gap="sm">
      <pds-button variant="unstyled" icon-only>
        <pds-icon name="dot-menu-horizontal" slot="start"/>
      </pds-button>
    </pds-box>
  </pds-box>
  <!-- Coaching -->
  <pds-box gap="sm">
    <!-- Image -->
    <pds-box flex="shrink">
      <pds-image src={image} alt="Offers" width="100px"/>
    </pds-box>
    <!-- Title and properties -->
    <pds-box direction="column" flex="grow">
      <pds-text weight="bold">Program title</pds-text>
      <pds-box gap="sm">
        <pds-property icon="users" value="Category">14</pds-property>
        <pds-property icon="calendar-date" value="Category">Created on April 20th, 2022</pds-property>
      </pds-box>
    </pds-box>
    <!-- Actions -->
    <pds-box flex="shrink" align-items="center" gap="sm">
      <pds-button variant="unstyled" icon-only>
        <pds-icon name="dot-menu-horizontal" slot="start"/>
      </pds-button>
    </pds-box>
  </pds-box>`,
      "Community": html`
  <!-- Community -->
  <pds-box gap="sm">
    <!-- Image -->
    <pds-box flex="shrink">
      <pds-image src={image} alt="Offers" width="100px"/>
    </pds-box>
    <!-- Title and properties -->
    <pds-box direction="column" flex="grow">
      <pds-text weight="bold">Program title</pds-text>
      <pds-box gap="sm">
        <pds-property icon="users" value="Category">14</pds-property>
        <pds-property icon="calendar-date" value="Category">Created on April 20th, 2022</pds-property>
      </pds-box>
    </pds-box>
    <!-- Actions -->
    <pds-box flex="shrink" align-items="center" gap="sm">
      <pds-button variant="unstyled" icon-only>
        <pds-icon name="dot-menu-horizontal" slot="start"/>
      </pds-button>
    </pds-box>
  </pds-box>
  <!-- Community -->
  <pds-box gap="sm">
    <!-- Image -->
    <pds-box flex="shrink">
      <pds-image src={image} alt="Offers" width="100px"/>
    </pds-box>
    <!-- Title and properties -->
    <pds-box direction="column" flex="grow">
      <pds-text weight="bold">Program title</pds-text>
      <pds-box gap="sm">
        <pds-property icon="users" value="Category">14</pds-property>
        <pds-property icon="calendar-date" value="Category">Created on April 20th, 2022</pds-property>
      </pds-box>
    </pds-box>
    <!-- Actions -->
    <pds-box flex="shrink" align-items="center" gap="sm">
      <pds-button variant="unstyled" icon-only>
        <pds-icon name="dot-menu-horizontal" slot="start"/>
      </pds-button>
    </pds-box>
  </pds-box>
  <!-- Community -->
  <pds-box gap="sm">
    <!-- Image -->
    <pds-box flex="shrink">
      <pds-image src={image} alt="Offers" width="100px"/>
    </pds-box>
    <!-- Title and properties -->
    <pds-box direction="column" flex="grow">
      <pds-text weight="bold">Program title</pds-text>
      <pds-box gap="sm">
        <pds-property icon="users" value="Category">14</pds-property>
        <pds-property icon="calendar-date" value="Category">Created on April 20th, 2022</pds-property>
      </pds-box>
    </pds-box>
    <!-- Actions -->
    <pds-box flex="shrink" align-items="center" gap="sm">
      <pds-button variant="unstyled" icon-only>
        <pds-icon name="dot-menu-horizontal" slot="start"/>
      </pds-button>
    </pds-box>
  </pds-box>`,
    "Pages": html`
  <!-- Page -->
  <pds-box gap="sm">
    <!-- Image -->
    <pds-box flex="shrink">
      <pds-image src={image} alt="Offers" width="100px"/>
    </pds-box>
    <!-- Title and properties -->
    <pds-box direction="column" flex="grow">
      <pds-text weight="bold">Library</pds-text>
      <pds-box gap="sm">
        <pds-property icon="calendar-simple">Created on April 20th, 2022</pds-property>
      </pds-box>
    </pds-box>
    <!-- Actions -->
    <pds-box flex="shrink" align-items="center" gap="sm">
      <pds-chip dot sentiment="info" dropdown>System</pds-chip>
      <pds-button variant="unstyled" icon-only>
        <pds-icon name="preview-on" slot="start"/>
        Preview
      </pds-button>
      <pds-button variant="unstyled" icon-only>
        <pds-icon name="customize" slot="start"/>
        More options
      </pds-button>
      <pds-button variant="unstyled" icon-only>
        <pds-icon name="dot-menu-horizontal" slot="start"/>
        More options
      </pds-button>
    </pds-box>
  </pds-box>
  <!-- Page -->
  <pds-box gap="sm">
    <!-- Image -->
    <pds-box flex="shrink">
      <pds-image src={image} alt="Offers" width="100px"/>
    </pds-box>
    <!-- Title and properties -->
    <pds-box direction="column" flex="grow">
      <pds-text weight="bold">Landing page</pds-text>
      <pds-box gap="sm">
        <pds-property icon="calendar-simple">Created on April 20th, 2022</pds-property>
      </pds-box>
    </pds-box>
    <!-- Actions -->
    <pds-box flex="shrink" align-items="center" gap="sm">
      <pds-chip dot sentiment="success" dropdown>Published</pds-chip>
      <pds-button variant="unstyled" icon-only>
        <pds-icon name="preview-on" slot="start"/>
        Preview
      </pds-button>
      <pds-button variant="unstyled" icon-only>
        <pds-icon name="customize" slot="start"/>
        More options
      </pds-button>
      <pds-button variant="unstyled" icon-only>
        <pds-icon name="dot-menu-horizontal" slot="start"/>
        More options
      </pds-button>
    </pds-box>
  </pds-box>
  <!-- Page -->
  <pds-box gap="sm">
    <!-- Image -->
    <pds-box flex="shrink">
      <pds-image src={image} alt="Offers" width="100px"/>
    </pds-box>
    <!-- Title and properties -->
    <pds-box direction="column" flex="grow">
      <pds-text weight="bold">Library</pds-text>
      <pds-box gap="sm">
        <pds-property icon="calendar-simple">Created on April 20th, 2022</pds-property>
      </pds-box>
    </pds-box>
    <!-- Actions -->
    <pds-box flex="shrink" align-items="center" gap="sm">
      <pds-chip dot sentiment="neutral" dropdown>System</pds-chip>
      <pds-button variant="unstyled" icon-only>
        <pds-icon name="preview-on" slot="start"/>
        Preview
      </pds-button>
      <pds-button variant="unstyled" icon-only>
        <pds-icon name="customize" slot="start"/>
        More options
      </pds-button>
      <pds-button variant="unstyled" icon-only>
        <pds-icon name="dot-menu-horizontal" slot="start"/>
        More options
      </pds-button>
    </pds-box>
  </pds-box>
  `,
    }),
  },
  example: (props) => html`<pds-box direction="column" gap="sm" fit>
  ${props.variant}
</pds-box>`,
});
