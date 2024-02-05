import { newSpecPage } from '@stencil/core/testing';
import { PdsRow } from '../pds-row';

describe('pds-row', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsRow],
      html: `<pds-row></pds-row>`,
    });
    expect(page.root).toBeTruthy();
  });

  it('renders a min-height when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsRow],
      html: `<pds-row min-height="150px"></pds-row>`,
    });
    
    const element = page.root;

    expect(element).toEqualAttribute('style', 'min-height: 150px;');
  });

  it('renders a gap when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsRow],
      html: `<pds-row col-gap="sm"></pds-row>`,
    });
    
    const element = page.root;

    expect(element).toEqualAttribute('style', '--pine-gap-x: 1rem; --pine-gap-y: 1rem;');
  });

  it('renders the align-items when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsRow],
      html: `<pds-row align-items="center"></pds-row>`,
    });
    
    const element = page.root;

    expect(element).toHaveClass('pds-align-items-center');
  });

  it('renders the justify-content when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsRow],
      html: `<pds-row justify-content="center"></pds-row>`,
    });
    
    const element = page.root;

    expect(element).toHaveClass('pds-justify-content-center');
  });
  
  it('renders a border if true', async () => {
    const page = await newSpecPage({
      components: [PdsRow],
      html: `<pds-row bordered></pds-row>`,
    });
    
    const element = page.root;

    expect(element).toHaveClass('pds-row--bordered');
  });

  it('does not wrap when no-wrap if true', async () => {
    const page = await newSpecPage({
      components: [PdsRow],
      html: `<pds-row no-wrap></pds-row>`,
    });
    
    const element = page.root;

    expect(element).toHaveClass('pds-row--no-wrap');
  });
});
