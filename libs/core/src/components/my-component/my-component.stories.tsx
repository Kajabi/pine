import { h } from '@stencil/core';
import { MyComponent } from '@sage/core/my-component';
import readme from './readme.md';

export default {
  title: 'WebComponents/MyComponent',
  component: MyComponent,
  parameters: {
    notes: { readme },
  },
};

const Template = args => <my-component {...args}></my-component>;

export const Primary = Template.bind({});
Primary.args = { first: 'John', last: 'Smith' };
