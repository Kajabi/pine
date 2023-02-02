import { Component, Element, Host, h, Prop, State } from '@stencil/core';

@Component({
  tag: 'sage-tabs',
  styleUrl: 'sage-tabs.scss',
  shadow: true,
})
export class SageTabs {
  @Element() el: HTMLSageButtonElement;

  /**
   * Provides button with a submittable value
   */
  @Prop() tabs? = [
    {
      id: 'tab-1',
      label: 'Tab 1',
      content: 'Tab 1 Pane Content',
    },
    {
      id: 'tab-2',
      label: 'Tab 2',
      content: 'Tab 2 Pane Content',
    },
    {
      id: 'tab-3',
      label: 'Tab 3',
      content: 'Tab 3 Pane Content',
    },
  ];

  @State() activeTab = '';

  buildTabs() {
    return (
      <div>
        <button onClick={this.tabClick.bind(this)} id="tab-1">First Tab</button>
        <button onClick={this.tabClick.bind(this)} id="tab-2">Second Tab</button>
      </div>
    );
  };

  buildTabPanel() {
    if (this.activeTab === "" || this.activeTab === 'tab-1') {
      return (<div class="sage-tabs-panel">tab one panel</div>)
    } else {
      return (<div class="sage-tabs-panel">tab two panel</div>)
    }
  }
  
  tabClick(ev) {
    this.activeTab = ev.currentTarget.id;
  }

  componentWillUpdate() {
    // alert('content will update');
  }

  render() {
    return (
      <Host>
        {this.buildTabs()}
        {this.buildTabPanel()}
      </Host>
    );
  }
}
