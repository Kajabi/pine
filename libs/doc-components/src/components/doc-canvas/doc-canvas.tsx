import { Component, Host, h, Prop, State } from '@stencil/core';

@Component({
  tag: 'doc-canvas',
  styleUrl: 'doc-canvas.scss',
})
export class DocCanvas {
  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  /**
   * React code snippet for the component
   */
  @Prop() react?: string;

  /**
   * Web Component code snippet for the component 
   */
  @Prop() webComponent?: string;

  /**
   * Determines which tab is active
   */
  @State() activeTab: 'react' | 'webComponent' = 'react';

  /**
   * Determines whether the menu is visible
   */
  @State() isMenuVisible = false;

  handleTabClick(tab: 'react' | 'webComponent'): void {
    if (!this.isMenuVisible) {
      this.isMenuVisible = true;
    }

    this.activeTab = tab;
  }

  handleToggleMenuClick(): void {
    console.log('handleToggleMenuClick');
    this.isMenuVisible = !this.isMenuVisible;
  }

  handleCopyCodeClick(): void {
    const codeToCopy = this.activeTab === 'react' ? this.react : this.webComponent;

    if (codeToCopy) {
      // Create a temporary textarea element to copy the code
      const textarea = document.createElement('textarea');
      textarea.value = codeToCopy;
      document.body.appendChild(textarea);
      
      // Select and copy the text
      textarea.select();
      document.execCommand('copy');
      
      // Remove the temporary textarea
      document.body.removeChild(textarea);
    }
  }

  render() {
    return (
      <Host
        id={this.componentId}
        class={`doc-canvas ${this.isMenuVisible ? 'doc-canvas--menu-visible' : ''}`}
      >
        <div class="doc-canvas-preview">
          <slot></slot>
        </div>
        <div class="doc-canvas-actions">
          {this.react && 
            <button
              class={`
                doc-canvas-action
                ${this.activeTab === 'react' ? 'doc-canvas-action--active' : ''}
              `}
              disabled={!this.react}
              onClick={() => this.handleTabClick('react')}
            >
              React
            </button>
          }
          
          {this.webComponent && 
            <button
              class={`
              doc-canvas-action
                ${this.activeTab === 'webComponent' ? 'doc-canvas-action--active' : ''}
              `}
              disabled={!this.webComponent}
              onClick={() => this.handleTabClick('webComponent')}
            >
              Web Component
            </button>
          }
          <button 
            class={`
              doc-canvas-action
              ${this.isMenuVisible ? 'doc-canvas-action--active' : ''}
            `}
            onClick={() => this.handleToggleMenuClick()}
          >
            Toggle menu
          </button>
        </div>
        <div class="doc-canvas-code">
          <button
            class="doc-canvas-action doc-canvas-action--copy-code"
            onClick={() => this.handleCopyCodeClick()}
          >
            Copy Code
          </button>
          {this.activeTab === 'react' && this.react && <code>{this.react}</code>}
          {this.activeTab === 'webComponent' && this.webComponent && <code>{this.webComponent}</code>}
        </div>
      </Host>
    );
  }
}
