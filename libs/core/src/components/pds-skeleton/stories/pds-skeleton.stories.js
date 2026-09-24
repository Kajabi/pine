import { html } from 'lit';

export default {
  component: 'pds-skeleton',
  title: 'components/Skeleton',
  args: {
    variant: 'text',
  },
}

const BaseTemplate = (args) => html`
  <pds-skeleton
    variant="${args.variant}"
    width="${args.width}"
    height="${args.height}"
  ></pds-skeleton>
`;

export const Default = BaseTemplate.bind();
Default.args = {
  variant: 'text',
  width: '240px',
};

export const Rect = BaseTemplate.bind();
Rect.args = {
  variant: 'rect',
  width: '320px',
};

export const Circle = BaseTemplate.bind();
Circle.args = {
  variant: 'circle',
};

export const MediaObject = () => html`
  <div role="status" aria-label="Loading people" style="display: flex; gap: 16px; align-items: center; inline-size: 320px;">
    <pds-skeleton variant="circle"></pds-skeleton>
    <div style="display: flex; flex-direction: column; gap: 8px; flex: 1;">
      <pds-skeleton variant="text" width="60%"></pds-skeleton>
      <pds-skeleton variant="text" width="90%"></pds-skeleton>
    </div>
  </div>
`;
