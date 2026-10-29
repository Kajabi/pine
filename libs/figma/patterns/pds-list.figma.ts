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
  <pds-list-item href="#">
    <pds-image slot="leading" src={image} alt="" width="100px"></pds-image>
    Course title
    <pds-box slot="description" gap="sm"><pds-property icon="users">14</pds-property><pds-property icon="calendar-date">Created on April 20th, 2022</pds-property></pds-box>
    <pds-chip slot="trailing" sentiment="accent">Course</pds-chip>
    <pds-button slot="trailing" variant="unstyled" icon-only><pds-icon slot="start" name="dot-menu-horizontal" aria-hidden="true"></pds-icon>More options</pds-button>
  </pds-list-item>
  <pds-list-item href="#">
    <pds-image slot="leading" src={image} alt="" width="100px"></pds-image>
    Podcast title
    <pds-box slot="description" gap="sm"><pds-property icon="users">14</pds-property><pds-property icon="calendar-date">Created on April 20th, 2022</pds-property></pds-box>
    <pds-chip slot="trailing" sentiment="accent">Podcast</pds-chip>
    <pds-button slot="trailing" variant="unstyled" icon-only><pds-icon slot="start" name="dot-menu-horizontal" aria-hidden="true"></pds-icon>More options</pds-button>
  </pds-list-item>`,
      "Courses": html`
  <pds-list-item href="#">
    <pds-image slot="leading" src={image} alt="" width="100px"></pds-image>
    Course title
    <pds-box slot="description" gap="sm"><pds-property icon="users">14</pds-property><pds-property icon="calendar-date">Created on April 20th, 2022</pds-property></pds-box>
    <pds-button slot="trailing" variant="unstyled" icon-only><pds-icon slot="start" name="dot-menu-horizontal" aria-hidden="true"></pds-icon>More options</pds-button>
  </pds-list-item>
  <pds-list-item href="#">
    <pds-image slot="leading" src={image} alt="" width="100px"></pds-image>
    Course title
    <pds-box slot="description" gap="sm"><pds-property icon="users">14</pds-property><pds-property icon="calendar-date">Created on April 20th, 2022</pds-property></pds-box>
    <pds-button slot="trailing" variant="unstyled" icon-only><pds-icon slot="start" name="dot-menu-horizontal" aria-hidden="true"></pds-icon>More options</pds-button>
  </pds-list-item>`,
      "Podcasts": html`
  <pds-list-item href="#">
    <pds-image slot="leading" src={image} alt="" width="100px"></pds-image>
    The Daily Seed: Conversations with Floral Designers
    <pds-box slot="description" gap="sm"><pds-property icon="file">4 episodes</pds-property><pds-property icon="chart">32 downloads</pds-property><pds-property icon="calendar-simple">Created on April 20th, 2022</pds-property></pds-box>
    <pds-chip slot="trailing" sentiment="accent">Private</pds-chip>
    <pds-button slot="trailing" variant="unstyled" icon-only><pds-icon slot="start" name="dot-menu-horizontal" aria-hidden="true"></pds-icon>More options</pds-button>
  </pds-list-item>`,
      "Coaching": html`
  <pds-list-item href="#">
    <pds-image slot="leading" src={image} alt="" width="100px"></pds-image>
    Program title
    <pds-box slot="description" gap="sm"><pds-property icon="users">14</pds-property><pds-property icon="calendar-date">Created on April 20th, 2022</pds-property></pds-box>
    <pds-button slot="trailing" variant="unstyled" icon-only><pds-icon slot="start" name="dot-menu-horizontal" aria-hidden="true"></pds-icon>More options</pds-button>
  </pds-list-item>
  <pds-list-item href="#">
    <pds-image slot="leading" src={image} alt="" width="100px"></pds-image>
    Program title
    <pds-box slot="description" gap="sm"><pds-property icon="users">14</pds-property><pds-property icon="calendar-date">Created on April 20th, 2022</pds-property></pds-box>
    <pds-button slot="trailing" variant="unstyled" icon-only><pds-icon slot="start" name="dot-menu-horizontal" aria-hidden="true"></pds-icon>More options</pds-button>
  </pds-list-item>`,
      "Community": html`
  <pds-list-item href="#">
    <pds-image slot="leading" src={image} alt="" width="100px"></pds-image>
    Program title
    <pds-box slot="description" gap="sm"><pds-property icon="users">14</pds-property><pds-property icon="calendar-date">Created on April 20th, 2022</pds-property></pds-box>
    <pds-button slot="trailing" variant="unstyled" icon-only><pds-icon slot="start" name="dot-menu-horizontal" aria-hidden="true"></pds-icon>More options</pds-button>
  </pds-list-item>
  <pds-list-item href="#">
    <pds-image slot="leading" src={image} alt="" width="100px"></pds-image>
    Program title
    <pds-box slot="description" gap="sm"><pds-property icon="users">14</pds-property><pds-property icon="calendar-date">Created on April 20th, 2022</pds-property></pds-box>
    <pds-button slot="trailing" variant="unstyled" icon-only><pds-icon slot="start" name="dot-menu-horizontal" aria-hidden="true"></pds-icon>More options</pds-button>
  </pds-list-item>`,
      "Pages": html`
  <pds-list-item href="#">
    <pds-image slot="leading" src={image} alt="" width="100px"></pds-image>
    Library
    <pds-property slot="description" icon="calendar-simple">Updated April 20th, 2022</pds-property>
    <pds-chip slot="trailing" dot sentiment="info">System</pds-chip>
    <pds-button slot="trailing" variant="unstyled" icon-only><pds-icon slot="start" name="preview-on" aria-hidden="true"></pds-icon>Preview</pds-button>
    <pds-button slot="trailing" variant="unstyled" icon-only><pds-icon slot="start" name="customize" aria-hidden="true"></pds-icon>Customize</pds-button>
    <pds-button slot="trailing" variant="unstyled" icon-only><pds-icon slot="start" name="dot-menu-horizontal" aria-hidden="true"></pds-icon>More options</pds-button>
  </pds-list-item>
  <pds-list-item href="#">
    <pds-image slot="leading" src={image} alt="" width="100px"></pds-image>
    Landing page
    <pds-property slot="description" icon="calendar-simple">Updated April 20th, 2022</pds-property>
    <pds-chip slot="trailing" dot sentiment="success">Published</pds-chip>
    <pds-button slot="trailing" variant="unstyled" icon-only><pds-icon slot="start" name="preview-on" aria-hidden="true"></pds-icon>Preview</pds-button>
    <pds-button slot="trailing" variant="unstyled" icon-only><pds-icon slot="start" name="customize" aria-hidden="true"></pds-icon>Customize</pds-button>
    <pds-button slot="trailing" variant="unstyled" icon-only><pds-icon slot="start" name="dot-menu-horizontal" aria-hidden="true"></pds-icon>More options</pds-button>
  </pds-list-item>`,
    }),
  },
  example: (props) => html`<pds-list component-id="product-list">
${props.variant}
</pds-list>`,
});

figma.connect("<FIGMA_LIST_ITEM>", {
  example: () => html`<pds-list component-id="list">
  <pds-list-item href="#">
    <pds-image slot="leading" src={image} alt="" width="100px"></pds-image>
    Product title
  </pds-list-item>
</pds-list>`,
});
