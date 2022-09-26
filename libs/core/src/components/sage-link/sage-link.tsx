import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'sage-link',
  styleUrl: 'sage-link.scss',
  shadow: true,
})
export class SageLink {
  /**
   * The URL that the hyperlink points to.
   */

  @Prop() href!: string;

  /**
   * The text content that is rendered.
   */
  @Prop() text!: string;

  render() {
    return <a href={this.href}>{this.text}</a>;
  }
}
