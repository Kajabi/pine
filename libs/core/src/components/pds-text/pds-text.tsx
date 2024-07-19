import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'pds-text',
  styleUrl: 'pds-text.scss',
  shadow: true,
})
export class PdsText {

  /**
   * Determines what semantic text tag to render.
   */
  @Prop() tag!: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';

  render() {
    const Tag = this.tag;

    return (
      <Tag>
        <slot />
      </Tag>
    );
  }

}
