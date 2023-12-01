import { newSpecPage } from '@stencil/core/testing';
import { PdsLayoutRow } from '../pds-layout-row';

describe('pds-layout-row', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutRow],
      html: `<pds-layout-row></pds-layout-row>`,
    });
    expect(page.root).toBeTruthy();
  });

  it('renders a min-height when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutRow],
      html: `<pds-layout-row min-height="150px"></pds-layout-row>`,
    });
    
    const element = page.root;

    expect(element).toEqualAttribute('style', 'min-height: 150px;');
  });

  it('renders a gap when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutRow],
      html: `<pds-layout-row gap="16px"></pds-layout-row>`,
    });
    
    const element = page.root;

    expect(element).toEqualAttribute('style', '--pine-gap-x: 16px; --pine-gap-y: 16px;');
  });

  it('renders the align-items when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutRow],
      html: `<pds-layout-row align-items="center"></pds-layout-row>`,
    });
    
    const element = page.root;

    expect(element).toHaveClass('pds-align-items-center');
  });

  it('renders the justify-content when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutRow],
      html: `<pds-layout-row justify-content="center"></pds-layout-row>`,
    });
    
    const element = page.root;

    expect(element).toHaveClass('pds-justify-content-center');
  });
  
  it('renders a border if true', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutRow],
      html: `<pds-layout-row bordered></pds-layout-row>`,
    });
    
    const element = page.root;

    expect(element).toHaveClass('pds-layout-row--bordered');
  });

  it('does not wrap when no-wrap if true', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutRow],
      html: `<pds-layout-row no-wrap></pds-layout-row>`,
    });
    
    const element = page.root;

    expect(element).toHaveClass('pds-layout-row--no-wrap');
  });
});
