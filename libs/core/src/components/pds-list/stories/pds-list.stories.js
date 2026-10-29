import { html } from 'lit-html';

export default {
  argTypes: {
    border: { control: 'boolean' },
    compact: { control: 'boolean' },
    dividers: { control: 'boolean' },
  },
  component: 'pds-list',
  subcomponents: { 'pds-list-item': 'pds-list-item' },
  parameters: {},
  title: 'components/List',
};

// A neutral stand-in for a thumbnail, so stories don't depend on an image host.
const thumbnail = html`<pds-box slot="leading" min-width="96px" padding-block-start="lg" padding-block-end="lg" border border-radius="sm" background-color="var(--pine-color-background-subtle)"></pds-box>`;

const BaseTemplate = (args) => html`
<pds-list component-id="${args.componentId}" ?border=${args.border} ?compact=${args.compact} ?dividers=${args.dividers}>
  <pds-list-item>
    <pds-icon slot="leading" name="file" aria-hidden="true"></pds-icon>
    Onboarding worksheet
    <span slot="description">PDF · 1.2 MB</span>
  </pds-list-item>
  <pds-list-item>
    <pds-icon slot="leading" name="file" aria-hidden="true"></pds-icon>
    Pricing calculator
    <span slot="description">XLSX · 84 KB</span>
  </pds-list-item>
  <pds-list-item>
    <pds-icon slot="leading" name="file" aria-hidden="true"></pds-icon>
    Brand assets
    <span slot="description">ZIP · 12.4 MB</span>
  </pds-list-item>
</pds-list>`;

const InteractiveTemplate = (args) => html`
<pds-list component-id="${args.componentId}" ?border=${args.border} ?compact=${args.compact} ?dividers=${args.dividers}>
  <pds-list-item href="#lesson-1">
    <pds-icon slot="leading" name="play" aria-hidden="true"></pds-icon>
    Module 1: Foundations
    <span slot="description">Business Bootcamp · 4 lessons</span>
  </pds-list-item>
  <pds-list-item href="#lesson-2">
    <pds-icon slot="leading" name="play" aria-hidden="true"></pds-icon>
    Module 2: Pricing
    <span slot="description">Business Bootcamp · 6 lessons</span>
  </pds-list-item>
  <pds-list-item href="https://example.com" target="_blank">
    <pds-icon slot="leading" name="launch" aria-hidden="true"></pds-icon>
    Pricing strategy guide
    <span slot="description">example.com</span>
  </pds-list-item>
</pds-list>`;

const pageRow = (title, sentiment, status) => html`
  <pds-list-item href="#${title.toLowerCase().replace(/\s+/g, '-')}">
    ${thumbnail}
    ${title}
    <pds-property slot="description" icon="calendar-date">Updated April 20, 2026</pds-property>
    <pds-chip slot="trailing" dot sentiment="${sentiment}">${status}</pds-chip>
    <pds-button slot="trailing" variant="unstyled" icon-only>
      <pds-icon slot="start" name="preview-on" aria-hidden="true"></pds-icon>
      Preview ${title}
    </pds-button>
    <pds-button slot="trailing" variant="unstyled" icon-only>
      <pds-icon slot="start" name="dot-menu-horizontal" aria-hidden="true"></pds-icon>
      More options for ${title}
    </pds-button>
  </pds-list-item>`;

const IndexTemplate = (args) => html`
<pds-list component-id="${args.componentId}" ?border=${args.border} ?compact=${args.compact} ?dividers=${args.dividers}>
  ${pageRow('Library', 'info', 'System')}
  ${pageRow('Landing page', 'success', 'Published')}
  ${pageRow('Spring sale', 'neutral', 'Draft')}
</pds-list>`;

const downloadRow = (title, file) => html`
  <pds-list-item>
    <pds-icon slot="leading" name="file" aria-hidden="true"></pds-icon>
    ${title}
    <span slot="description">${file}</span>
    <pds-button slot="trailing" variant="unstyled" icon-only>
      <pds-icon slot="start" name="download" aria-hidden="true"></pds-icon>
      Download ${title}
    </pds-button>
    <pds-button slot="trailing" variant="unstyled" icon-only>
      <pds-icon slot="start" name="pen" aria-hidden="true"></pds-icon>
      Edit ${title}
    </pds-button>
    <pds-button slot="trailing" variant="unstyled" icon-only>
      <pds-icon slot="start" name="remove-circle" aria-hidden="true"></pds-icon>
      Remove ${title}
    </pds-button>
  </pds-list-item>`;

const DownloadsTemplate = (args) => html`
<pds-list component-id="${args.componentId}" ?border=${args.border} ?compact=${args.compact} ?dividers=${args.dividers}>
  ${downloadRow('Onboarding worksheet', 'onboarding-worksheet.pdf')}
  ${downloadRow('Pricing calculator', 'pricing-calculator.xlsx')}
</pds-list>`;

const checklistRow = (id, title, due, checked) => html`
  <pds-list-item>
    <pds-checkbox slot="leading" component-id="${id}" label="${title}" hide-label ?checked=${checked}></pds-checkbox>
    ${title}
    <span slot="description">${due}</span>
  </pds-list-item>`;

const ChecklistTemplate = (args) => html`
<pds-list component-id="${args.componentId}" ?border=${args.border} ?compact=${args.compact} ?dividers=${args.dividers}>
  ${checklistRow('task-1', 'Finish the onboarding worksheet', 'Due Oct 31', false)}
  ${checklistRow('task-2', 'Watch module 2: Pricing', 'Due Oct 28', false)}
  ${checklistRow('task-3', 'Book your first coaching call', 'Done', true)}
</pds-list>`;

const SortableTemplate = () => html`
<pds-sortable component-id="sortable-list" handle-type="handle" border dividers>
  <pds-sortable-item>
    <pds-list-item>
      <pds-icon slot="leading" name="file" aria-hidden="true"></pds-icon>
      Lesson 1: Welcome
      <pds-chip slot="trailing" dot sentiment="success">Published</pds-chip>
    </pds-list-item>
  </pds-sortable-item>
  <pds-sortable-item>
    <pds-list-item>
      <pds-icon slot="leading" name="file" aria-hidden="true"></pds-icon>
      Lesson 2: Setting your prices
      <pds-chip slot="trailing" dot sentiment="neutral">Draft</pds-chip>
    </pds-list-item>
  </pds-sortable-item>
</pds-sortable>`;

export const Default = BaseTemplate.bind();
Default.args = {
  componentId: 'default',
  border: false,
  compact: false,
  dividers: false,
};

export const Bordered = BaseTemplate.bind();
Bordered.args = {
  componentId: 'bordered',
  border: true,
  compact: false,
  dividers: true,
};

export const Compact = BaseTemplate.bind();
Compact.args = {
  componentId: 'compact',
  border: true,
  compact: true,
  dividers: true,
};

export const Interactive = InteractiveTemplate.bind();
Interactive.args = {
  componentId: 'interactive',
  border: false,
  compact: false,
  dividers: false,
};

export const Index = IndexTemplate.bind();
Index.args = {
  componentId: 'index',
  border: false,
  compact: false,
  dividers: false,
};

export const Downloads = DownloadsTemplate.bind();
Downloads.args = {
  componentId: 'downloads',
  border: true,
  compact: false,
  dividers: true,
};

export const Checklist = ChecklistTemplate.bind();
Checklist.args = {
  componentId: 'checklist',
  border: false,
  compact: true,
  dividers: false,
};

export const InSortable = SortableTemplate.bind();
InSortable.storyName = 'In a sortable';
