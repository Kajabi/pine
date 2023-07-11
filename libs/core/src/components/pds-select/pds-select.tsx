import { Component, h, Prop, Listen } from '@stencil/core';

@Component({
  tag: 'pds-select',
  styleUrl: 'pds-select.scss',
  shadow: true,
})
export class PdsSelect {
  @Prop() options: Array<string>;
  @Prop({ mutable: true }) selectedOption: string;

  private expanded = false;

  @Listen('keydown', {})
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      this.expanded = true;
      event.preventDefault();
    }
  }

  handleOptionClick(option: string) {
    this.selectedOption = option;
    this.expanded = false;
  }

  render() {
    return (
      <div
        role="combobox"
        aria-expanded={this.expanded}
        aria-haspopup="listbox"
        aria-owns="options-list"
        aria-controls="options-list"
      >
        <input
          type="text"
          value={this.selectedOption}
          aria-autocomplete="list"
          aria-controls="options-list"
          onFocus={() => (this.expanded = true)}
          onBlur={() => (this.expanded = false)}
        />
        {this.expanded && (
          <ul id="options-list" role="listbox">
            {this.options.map((option) => (
              <li
                role="option"
                aria-selected={option === this.selectedOption}
                onClick={() => this.handleOptionClick(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}
