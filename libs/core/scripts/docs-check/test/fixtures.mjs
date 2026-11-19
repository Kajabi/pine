import { checkSnippets } from '../check.mjs';
import { buildContext } from '../context.mjs';

const literals = (...values) => ({ type: values.map((v) => `"${v}"`).join(' | '), values: values.map((value) => ({ type: 'string', value })) });
const typed = (type) => ({ type, values: [{ type }] });

export const components = [
  { tag: 'mock-pds-modal', props: [] },
  { tag: 'pds-accordion', props: [{ name: 'isOpen', attr: 'is-open', ...typed('boolean') }] },
  {
    tag: 'pds-button',
    props: [
      { name: 'variant', attr: 'variant', ...literals('primary', 'secondary', 'tertiary') },
      { name: 'disabled', attr: 'disabled', ...typed('boolean') },
      { name: 'fullWidth', attr: 'full-width', ...typed('boolean') },
      { name: 'icon', attr: 'icon', ...typed('string') },
    ],
  },
  {
    tag: 'pds-modal',
    props: [
      {
        name: 'size',
        attr: 'size',
        type: '"fullscreen" | "lg" | "md" | "sm" | string & Record<never, never>',
        values: [...literals('fullscreen', 'lg', 'md', 'sm').values, { type: 'string & Record<never, never>' }],
      },
    ],
  },
  { tag: 'pds-multiselect', props: [{ name: 'value', ...typed('string[]') }, { name: 'formatResult', ...typed('(item: unknown) => MultiselectOption') }] },
  { tag: 'pds-select', props: [{ name: 'name', attr: 'name', ...typed('string') }] },
  { tag: 'pds-sortable', props: [] },
  { tag: 'pds-sortable-item', props: [{ name: 'enableActions', attr: 'enable-actions', ...typed('boolean') }] },
  { tag: 'pds-text', props: [{ name: 'size', attr: 'size', ...literals('sm', 'md', 'lg') }, { name: 'maxWidth', attr: 'max-width', ...typed('string') }] },
  { tag: 'pds-tooltip', props: [{ name: 'htmlContent', attr: 'html-content', ...typed('boolean') }] },
  {
    tag: 'pds-icon',
    props: [
      { name: 'name', attr: 'name', ...typed('string') },
      { name: 'src', attr: 'src', ...typed('string') },
      { name: 'icon', attr: 'icon', ...typed('any') },
      { name: 'size', attr: 'size', ...typed('string') },
    ],
  },
];

export const context = buildContext({
  components,
  iconNames: ['add', 'info-circle', 'trash'],
  iconExports: ['add', 'infoCircle', 'trash'],
  iconsVersion: '1.0.0',
});

/** Checks one snippet and returns its findings as `rule: message` strings. */
export function check(language, code, line = 10) {
  const { findings } = checkSnippets([{ file: 'docs/page.mdx', title: 'Example', language, code, line, exactLines: true }], context);
  return findings.map((f) => `${f.rule}: ${f.message}`);
}
