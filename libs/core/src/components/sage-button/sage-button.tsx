import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'sage-button',
  styleUrl: 'sage-button.scss',
  shadow: true,
})
export class SageButton {
  // Other props currently in React button
    // alignEnd: false,
    // className: '',
    // customContentClassName: null,
    // disclosure: false,
    // fullWidth: false,
    // hasCustomContent: false,
    // icon: null,
    // iconOnly: false,
    // iconPosition: Button.ICON_POSITIONS.LEFT,
    // loading: false,


  /**
   * Button type
   * @defaultValue primary
   */
  @Prop() variant: 'accent' | 'secondary' | 'disclosure' | 'destructive' | 'primary' = 'primary';
  /* TODO: Figure out why primary isn't setting as the default */

  /**
   * When set to true, icon is added to button
   * @defaultValue false
   */
  @Prop() icon: string;
  
  /**
   * When set to true, buttons are disabled
   * @defaultValue false
   */
  @Prop() disabled: true;
  
  render() {
    const trashIcon = (
      <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.333 0a.667.667 0 0 0-.666.667v2h-4A.667.667 0 1 0 .667 4h14.666a.667.667 0 1 0 0-1.333h-4v-2A.667.667 0 0 0 10.667 0H5.333ZM10 2.667V1.333H6v1.334h4Z"/>
        <path d="M2.667 5.333c.368 0 .666.299.666.667v8a.667.667 0 0 0 .667.667h8a.667.667 0 0 0 .667-.667V6A.667.667 0 1 1 14 6v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6c0-.368.298-.667.667-.667Z"/>
        <path d="M10.471 7.519c.26.26.26.682 0 .942L8.943 9.99l1.528 1.529a.667.667 0 1 1-.942.942L8 10.933 6.471 12.46a.667.667 0 0 1-.942-.942L7.057 9.99 5.53 8.461a.667.667 0 1 1 .942-.942L8 9.047 9.529 7.52c.26-.26.682-.26.942 0Z"/>
      </svg>
    );

    return (
      <Host
        aria-disabled={this.disabled ? 'true' : null}
      >
        <button class={`sage-button sage-button--${this.variant}`} disabled={this.disabled}>
          {this.icon == "trashIcon" && trashIcon}
          <slot />
        </button>
      </Host>
    );
  }
}
