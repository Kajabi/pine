import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'pds-loader',
  styleUrl: 'pds-loader.scss',
  shadow: true,
})
export class PdsLoader {
  /**
   * Determines the type of loader.
   */
  @Prop() variant: 'spinner' | 'typing' = 'spinner';

  private renderLoader = () => {
    if (this.variant === 'spinner') {
      return (
        <svg class="pds-loader" viewBox="0 0 200 200" fill="none">
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
      );
    }
    if (this.variant === 'typing') {
      return (
        <div class="pds-loader--typing">
          <span></span>
          <span></span>
          <span></span>
        </div>
      );
    }
  };

  render() {
    return <Host>{this.renderLoader()}</Host>;
  }
}
