import { Component, Host, h, Prop, State } from '@stencil/core';

export interface MdxSource {
  react?: string;
  webComponent?: string;
}

@Component({
  tag: 'doc-canvas',
  styleUrl: 'doc-canvas.scss',
})
export class DocCanvas {
  private source: MdxSource = {};
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

  @Prop() mdxSource?: string;

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
    const codeToCopy = this.activeTab === 'react' ? this.source?.react : this.source?.webComponent;

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

  componentWillRender() {
    this.source = JSON.parse(this.mdxSource);
  }

  render() {
    console.log('React Code:', this.source?.react);
    console.log('Web Component Code:', this.source?.webComponent);

    return (
      <Host
        id={this.componentId}
        class={`doc-canvas ${this.isMenuVisible ? 'doc-canvas--menu-visible' : ''}`}
      >
        <div class="doc-canvas-preview">
          <slot></slot>
        </div>
        <div class="doc-canvas-actions">
          {this.source?.react && 
            <button
              class={`
                doc-canvas-action
                ${this.activeTab === 'react' ? 'doc-canvas-action--active' : ''}
              `}
              disabled={!this.source?.react}
              onClick={() => this.handleTabClick('react')}
            >
              React
            </button>
          }
          
          {this.source?.webComponent && 
            <button
              class={`
              doc-canvas-action
                ${this.activeTab === 'webComponent' ? 'doc-canvas-action--active' : ''}
              `}
              disabled={!this.source?.webComponent}
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
          {this.activeTab === 'react' && this.source?.react && <code>{this.source?.react}</code>}
          {this.activeTab === 'webComponent' && this.source?.webComponent && <code>{this.source?.webComponent}</code>}
        </div>
      </Host>
    );
  }
}
