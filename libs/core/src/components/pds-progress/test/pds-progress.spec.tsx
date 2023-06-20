import { newSpecPage } from '@stencil/core/testing';
import { PdsProgress } from '../pds-progress';

describe('pds-progress', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsProgress],
      html: `<pds-progress></pds-progress>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-progress>
        <mock:shadow-root>
          <div class="pds-progress">
            <label class="pds-progress__label"></label>
            <progress max="100" value="0"></progress>
          </div>
        </mock:shadow-root>
      </pds-progress>
    `);
  });

  it('renders with id when componentId prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsProgress],
      html: `<pds-progress component-id="default" label="Label text"></pds-progress>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-progress component-id="default" label="Label text">
        <mock:shadow-root>
          <div class="pds-progress">
            <label class="pds-progress__label" htmlfor="default">Label text</label>
            <progress id="default" max="100" value="0"></progress>
          </div>
        </mock:shadow-root>
      </pds-progress>
    `);
  });

  it('renders animated when animated prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsProgress],
      html: `<pds-progress component-id="default" label="Label text" animated="true"></pds-progress>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-progress component-id="default" label="Label text" animated="true" class="is-animated">
        <mock:shadow-root>
          <div class="pds-progress">
            <label class="pds-progress__label" htmlfor="default">Label text</label>
            <progress id="default" max="100" value="0"></progress>
          </div>
        </mock:shadow-root>
      </pds-progress>
    `);
  });

  it('renders with progress filled when percent prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsProgress],
      html: `<pds-progress component-id="default" label="Label text" percent="38"></pds-progress>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-progress component-id="default" label="Label text" percent="38">
        <mock:shadow-root>
          <div class="pds-progress">
            <label class="pds-progress__label" htmlfor="default">Label text</label>
            <progress id="default" max="100" value="38"></progress>
          </div>
        </mock:shadow-root>
      </pds-progress>
    `);
  });

  it('renders percent when showPercent prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsProgress],
      html: `<pds-progress component-id="default" label="Label text" show-percent="true"></pds-progress>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-progress component-id="default" label="Label text" show-percent="true">
        <mock:shadow-root>
          <div class="pds-progress">
            <label class="pds-progress__label" htmlfor="default">Label text</label>
            <progress id="default" max="100" value="0"></progress>
          </div>
          <div class="pds-progress__percentage">0%</div>
        </mock:shadow-root>
      </pds-progress>
    `);
  });

  it('renders with custom color when fillColor prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsProgress],
      html: `<pds-progress component-id="default" label="Label text" fill-color="#333333"></pds-progress>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-progress component-id="default" label="Label text" fill-color="#333333">
        <mock:shadow-root>
          <div class="pds-progress">
            <label class="pds-progress__label" htmlfor="default">Label text</label>
            <progress id="default" max="100" value="0" style="--progress-fill-color: #333333;"></progress>
          </div>
        </mock:shadow-root>
      </pds-progress>
    `);
  });
});
