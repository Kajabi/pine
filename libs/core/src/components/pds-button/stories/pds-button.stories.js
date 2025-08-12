import { html } from 'lit';
import { withActions } from '@storybook/addon-actions/decorator';

import { customArgsWithIconControl } from '../../../stories/_helpers';

export default {
  argTypes: customArgsWithIconControl({ component: 'pds-button', property: 'icon' }),
  component: 'pds-button',
  decorators: [withActions],
  title: 'components/Button',
  parameters: {
    actions: {
      handles: ['pdsClick'],
    }
  }
}

const BaseTemplate = (args) => html`
  <pds-button
    component-id=${args.componentId}
    .disabled=${args.disabled}
    .fullWidth=${args.fullWidth}
    href=${args.href}
    .iconOnly=${args.iconOnly}
    icon=${args.icon}
    .loading=${args.loading}
    name=${args.name}
    target=${args.target}
    type=${args.type}
    value=${args.value}
    variant=${args.variant}
  >
    ${args.slot?.start}
    ${args.slot?.default}
    ${args.slot?.end}
  </pds-button>`;

export const Accent = BaseTemplate.bind();
Accent.args = {
  disabled: false,
  fullWidth: false,
  iconOnly: false,
  loading: false,
  slot: {
    default: 'Accent',
  },
  type: 'button',
  variant: 'accent',
};

export const ButtonLink = BaseTemplate.bind();
ButtonLink.args = {
  disabled: false,
  fullWidth: false,
  href: 'https://pine-design-system.netlify.app/',
  iconOnly: false,
  loading: false,
  slot: {
    default: 'Link Button',
  },
  target: '_blank',
  variant: 'primary',
};

export const Destructive = BaseTemplate.bind({});
Destructive.args = {
  disabled: false,
  fullWidth: false,
  iconOnly: false,
  loading: false,
  slot: {
    default: 'Destructive',
  },
  type: 'button',
  variant: 'destructive',
}

export const Disclosure = BaseTemplate.bind({});
Disclosure.args = {
  disabled: false,
  fullWidth: false,
  iconOnly: false,
  loading: false,
  slot: {
    default: 'Disclosure',
  },
  type: 'button',
  variant: 'disclosure'
}

// We do not want to show Icon control, but icon is hard coded
Disclosure.parameters = {
  controls: { exclude: 'icon' }
}

export const FullWidth = BaseTemplate.bind({});
FullWidth.args = {
  disabled: false,
  fullWidth: true,
  iconOnly: false,
  loading: false,
  slot: {
    default: 'Full Width',
  },
  type: 'button',
  variant: 'primary'
}

export const StartAndEndSlots = BaseTemplate.bind({});
StartAndEndSlots.args = {
  disabled: false,
  fullWidth: false,
  iconOnly: false,
  loading: false,
  slot: {
    start: html`<pds-icon slot="start" name="favorite"></pds-icon>`,
    default: 'Button with Icons',
    end: html`<pds-icon slot="end" name="add-image"></pds-icon>`
  },
  type: 'button',
  variant: 'primary'
}

export const IconOnly = BaseTemplate.bind();
IconOnly.args = {
  disabled: false,
  fullWidth: false,
  icon: 'favorite',
  iconOnly: true,
  loading: false,
  slot: {
    default: 'Icon Only',
  },
  type: 'button',
  variant: 'secondary',
};

export const Loading = BaseTemplate.bind({});
Loading.args = {
  disabled: false,
  fullWidth: false,
  iconOnly: false,
  loading: true,
  slot: {
    default: 'Loading',
  },
  type: 'button',
  variant: 'primary',
}

export const Primary = BaseTemplate.bind({});
Primary.args = {
  disabled: false,
  fullWidth: false,
  iconOnly: false,
  loading: false,
  slot: {
    default: 'Primary',
  },
  type: 'button',
  variant: 'primary'
}

export const Secondary = BaseTemplate.bind({});
Secondary.args = {
  disabled: false,
  fullWidth: false,
  iconOnly: false,
  loading: false,
  slot: {
    default: 'Secondary',
  },
  type: 'button',
  variant: 'secondary',
}
