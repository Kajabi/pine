import { html } from 'lit-html';

const BaseTemplate = (args) => html` <pds-copytext border="${args.border}" full-width="${args.fullWidth}" component-id=${args.componentId} onClick=${args.onClick} truncate="${args.truncate}" value="${args.value}"></pds-copytext>`;

const defaultParameters = { docs: { disable: true } };

const copyTextEventExample = () => {
  document.addEventListener('pdsCopyTextClick', function(e) {
    console.info(e.detail);
  });
};

export const Default = BaseTemplate.bind();
Default.args = {
  border: true,
  fullWidth: false,
  onClick: copyTextEventExample(),
  truncate: false,
  value: 'Default copy text',
};
Default.parameters = { ...defaultParameters };

export const Borderless = BaseTemplate.bind();
Borderless.args = {
  border: false,
  fullWidth: false,
  truncate: false,
  value: 'Borderless copy text',
};
Borderless.parameters = { ...defaultParameters };

export const FullWidth = BaseTemplate.bind();
FullWidth.args = {
  border: true,
  fullWidth: true,
  truncate: false,
  value: 'Full width copy text',
};
FullWidth.parameters = { ...defaultParameters };

export const Truncate = BaseTemplate.bind();
Truncate.args = {
  border: true,
  fullWidth: false,
  truncate: true,
  value: 'Copy all of this really long text that should be truncated in the UI, but will still be copied to the clipboard. This can be used in cases where the text is too long to fit in the UI, but the user still needs to copy the full text.',
};
Truncate.parameters = { ...defaultParameters };
