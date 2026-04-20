import { html } from 'lit';

export default {
  component: 'pds-layout',
  title: 'components/Layout',
}

const BaseTemplate = (args) => html`
<pds-layout
  size="${args.size}"
  tag="${args.tag}"
  ?centered="${args.centered}"
>
  ${args.slot}
</pds-layout>`;

export const Default = BaseTemplate.bind();
Default.args = {
  slot: html`<pds-box background-color="secondary" padding="md"><pds-text tag="p">No max-width applied — container grows to fill its parent.</pds-text></pds-box>`,
  tag: 'div',
  centered: true,
};

export const Sm = BaseTemplate.bind();
Sm.args = {
  size: 'sm',
  tag: 'div',
  centered: true,
  slot: html`<pds-box background-color="secondary" padding="md"><pds-text tag="p">sm — 340px max-width. Narrow forms, confirmations.</pds-text></pds-box>`,
};

export const Md = BaseTemplate.bind();
Md.args = {
  size: 'md',
  tag: 'div',
  centered: true,
  slot: html`<pds-box background-color="secondary" padding="md"><pds-text tag="p">md — 520px max-width. Standard forms, settings panels.</pds-text></pds-box>`,
};

export const Lg = BaseTemplate.bind();
Lg.args = {
  size: 'lg',
  tag: 'div',
  centered: true,
  slot: html`<pds-box background-color="secondary" padding="md"><pds-text tag="p">lg — 700px max-width. Wide panels, content pages.</pds-text></pds-box>`,
};

export const Xl = BaseTemplate.bind();
Xl.args = {
  size: 'xl',
  tag: 'div',
  centered: true,
  slot: html`<pds-box background-color="secondary" padding="md"><pds-text tag="p">xl — 1064px max-width. Page-level wrappers.</pds-text></pds-box>`,
};

export const Full = BaseTemplate.bind();
Full.args = {
  size: 'full',
  tag: 'div',
  centered: true,
  slot: html`<pds-box background-color="secondary" padding="md"><pds-text tag="p">full — 1440px max-width. Max-width site container.</pds-text></pds-box>`,
};

export const ArbitrarySize = BaseTemplate.bind();
ArbitrarySize.args = {
  size: '640px',
  tag: 'div',
  centered: true,
  slot: html`<pds-box background-color="secondary" padding="md"><pds-text tag="p">Arbitrary size — 640px passed directly as a CSS length.</pds-text></pds-box>`,
};

export const NotCentered = BaseTemplate.bind();
NotCentered.args = {
  size: 'md',
  tag: 'div',
  centered: false,
  slot: html`<pds-box background-color="secondary" padding="md"><pds-text tag="p">centered=false — aligned to the start of its container.</pds-text></pds-box>`,
};

export const SemanticTag = (args) => html`
<pds-layout size="${args.size}" tag="main">
  <pds-box background-color="secondary" padding="md">
    <pds-text tag="h1">Page title</pds-text>
    <pds-text tag="p">Using tag="main" as the inner container element.</pds-text>
  </pds-box>
</pds-layout>`;
SemanticTag.args = {
  size: 'lg',
};
