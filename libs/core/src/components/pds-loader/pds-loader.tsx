import { Component, Host, h, Prop } from '@stencil/core';

/**
 * @slot label - Default slot for Loader label text.
 */

@Component({
  tag: 'pds-loader',
  styleUrl: 'pds-loader.scss',
  shadow: true,
})
export class PdsLoader {
  /**
   * If false, the loader will be hidden.
   */
  @Prop() isLoading: boolean = true;

  /**
   * Determines whether the loader should display a label.
   */
  @Prop() showLabel?: boolean = false;

  /**
   * Sets the size of the spinner loader. Value can be preset or custom.
   */
  @Prop({ reflect: true }) size?:
  | 'xs' // 24px
  | 'sm' // 32px
  | 'md' // 48px
  | 'lg' // 64px
  | 'xl' // 80px
  | string = 'md';

  /**
   * Determines the type of loader.
   */
  @Prop() variant: 'spinner' | 'typing' = 'spinner';

  private loaderSize() {
    const sizes: { [key: string]: string } = {
      xs: '24px',
      sm: '32px',
      md: '48px',
      lg: '64px',
      xl: '80px',
    };

    if (sizes[this.size]) {
      return sizes[this.size];
    } else {
      return this.size;
    }
  }

  private style = () => {
    if (this.size !== undefined) {
      return {
        height: this.loaderSize(),
        width: this.loaderSize(),
      };
    }
  };

  render() {
    return (
      <Host class={`pds-loader ${this.isLoading ? '' : 'pds-loader--hidden'}`} aria-hidden={!this.isLoading} aria-busy={this.isLoading} aria-live="polite">
        {this.variant === 'spinner' && (
          <div class="pds-loader--spinner">
            <svg style={this.style()} viewBox="0 0 200 200" fill="none">
              <defs>
                <linearGradient id="spinner-secondHalf">
                  <stop offset="0%" stop-opacity="0" stop-color="currentColor" />
                  <stop offset="100%" stop-opacity="0.5" stop-color="currentColor" />
                </linearGradient>
                <linearGradient id="spinner-firstHalf">
                  <stop offset="0%" stop-opacity="1" stop-color="currentColor" />
                  <stop offset="100%" stop-opacity="0.5" stop-color="currentColor" />
                </linearGradient>
              </defs>

              <g class="pds-loader__spinner-path">
                <path stroke="url(#spinner-secondHalf)" d="M 4 100 A 96 96 0 0 1 196 100" />
                <path stroke="url(#spinner-firstHalf)" d="M 196 100 A 96 96 0 0 1 4 100" />

                <path stroke="currentColor" stroke-linecap="round" d="M 4 100 A 96 96 0 0 1 4 98" />
              </g>
            </svg>
          </div>
        )}

        {this.variant === 'typing' && (
          <div class="pds-loader--typing">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}

        <div class={`pds-loader__label ${this.showLabel ? '' : 'pds-loader--hidden'}`}>
          <slot name="label">Loading...</slot>
        </div>
      </Host>
    );
  }
}
