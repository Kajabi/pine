import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'pds-progress',
  styleUrl: 'pds-progress.scss',
  shadow: true,
})
export class PdsProgress {
  @Prop() animated: boolean;
  @Prop() componentId!: string;
  @Prop() fillColor: string;
  @Prop() label!: string;
  @Prop() percentage: number;
  @Prop() showPercent: boolean;

  render() {
    return (
      <Host class={this.animated ? { 'is-animated': this.animated } : ''}>
        <div class="pds-progress-bar">
          <label class="pds-progress__label" htmlFor={this.componentId}>
            {this.label}
          </label>
          <progress
            id={this.componentId}
            max="100"
            style={this.fillColor ? { '--progress-fill-color': this.fillColor } : {}}
            value={this.percentage || 0}
          >
          </progress>
        </div>
        {this.showPercent && <div class="pds-progress__percentage">{this.percentage}%</div>}
      </Host>
    );
  }
}
