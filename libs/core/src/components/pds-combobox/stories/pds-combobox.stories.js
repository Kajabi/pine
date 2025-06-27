import { h } from '@stencil/core';

export default {
  title: 'Components/Combobox',
  parameters: {
    layout: 'centered',
  },
};

export const Default = () => `
  <pds-combobox component-id="combobox-story" label="Favorite Animal" placeholder="Type to search...">
    <option value="cat">Cat</option>
    <option value="dog">Dog</option>
    <option value="panda">Panda</option>
    <option value="snake">Snake</option>
  </pds-combobox>
`;