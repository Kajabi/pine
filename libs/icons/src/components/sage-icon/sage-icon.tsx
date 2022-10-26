import { Component, Host, Prop, h } from '@stencil/core';
import { format } from '../../utils/utils';

@Component({
  tag: 'sage-icon',
  styleUrl: 'sage-icon.scss',
  shadow: true,
})
export class SageIcon {
  /**
   * The first name
   */
  @Prop() first: string;

  /**
   * The middle name
   */
  @Prop() middle: string;

  /**
   * The last name
   */
  @Prop() last: string;

  private getText(): string {
    return format(this.first, this.middle, this.last);
  }

  render() {
   return (
    <Host>
      <div>Hello, World! I'm {this.getText()}</div>
    </Host>
   )
  }
}
