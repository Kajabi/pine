
import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  argTypes: extractArgTypes('pds-grid'),
  component: 'pds-grid',  
  title: 'components/Grid'
}

const BaseTemplate = (args) => html`
<div class="pds-grid-demo">
  <pds-grid>
    <pds-grid-col size="4">Content 1</pds-grid-col>
    <pds-grid-col size="4">Content 2</pds-grid-col>
    <pds-grid-col size="4">Content 3</pds-grid-col>
  </pds-grid>
</div>`;

export const Default = BaseTemplate.bind();

const ResponsiveTemplate = (args) => html`
<div class="pds-grid-demo">
  <pds-grid>
    <pds-grid-col size-sm="12" size-md="6" size-lg="4" size-xl="3">Content 1</pds-grid-col>
    <pds-grid-col size-sm="12" size-md="6" size-lg="4" size-xl="3">Content 2</pds-grid-col>
    <pds-grid-col size-sm="12" size-md="6" size-lg="4" size-xl="3">Content 3</pds-grid-col>
  </pds-grid>
</div>`;

export const Responsive = ResponsiveTemplate.bind();

// TEST EXAMPLE
// Auto
// Wrap
// VAlign
// HAlign

// THIS EXAMPLE DISPLAYS AN ISSUE WITH THE BORDER ONLY BEING APPLIED TO THE
// CONTENT OF THE GRID COL, NOT THE GRID COL ITSELF
const AlignmentTemplate = (args) => html`
<div class="pds-grid-demo">
  <pds-grid>
    <pds-grid-col size="1">Content 1</pds-grid-col>
    <pds-grid-col size="6" class="pds-align-items-center pds-justify-content-center"><p>Content 2</p><p>Content 2</p></pds-grid-col>
    <pds-grid-col size="4" class="pds-align-items-end">Content 3</pds-grid-col>
  </pds-grid>
</div>`;

export const Alignment = AlignmentTemplate.bind();

const NestingTemplate = (args) => html`
<div class="pds-grid-demo">
  <pds-grid>
    <pds-grid-col size-md="8">
      <div>
        <pds-grid>
          <pds-grid-col size-xl="6">Column 1 Item 1</pds-grid-col>
          <pds-grid-col size-xl="6">Column 1 Item 2</pds-grid-col>
        </pds-grid>
      </div>
    </pds-grid-col>
    <pds-grid-col size-md="4">
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100%">
        Column 2
      </div>
    </pds-grid-col>
  </pds-grid>
</div>`;

export const Nesting = NestingTemplate.bind();

const KitchenSinkTemplate = (args) => html`
<div class="pds-grid-demo">
  <pds-grid>
    <pds-grid-col size="1">Content 1</pds-grid-col>
    <pds-grid-col col-start="3" size="4"><p>Content 2</p><p>Content 2</p></pds-grid-col>
    <pds-grid-col col-end="12">Content 3</pds-grid-col>
  </pds-grid>
</div>`;

export const KitchenSink = KitchenSinkTemplate.bind();

