import { Component, Element, Host, h, Prop, State } from '@stencil/core';

/**
 * @slot (default) - The item's title. Long titles truncate to one line.
 * @slot leading - Content before the title, such as an icon, thumbnail, avatar or checkbox. When `href` is set it's part of the item's link, so put interactive controls in `trailing`.
 * @slot description - Secondary text below the title, such as a date, file size or type. Truncates to one line.
 * @slot trailing - Content after the title, such as a chip, buttons or a dropdown menu. It stays clickable when `href` is set.
 * @part item - The row that lays out the leading, title, description and trailing content.
 * @part link - The anchor wrapping the title when `href` is set.
 */
@Component({
  tag: 'pds-list-item',
  styleUrl: 'pds-list-item.scss',
  shadow: true,
})
export class PdsListItem {
  @Element() el: HTMLPdsListItemElement;

  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  /**
   * The hyperlink's destination URL. If provided, renders the title as an anchor (`<a>`)
   * and the whole item becomes its click target. Content in the `trailing` slot stays
   * separately clickable.
   */
  @Prop() href?: string;

  /**
   * Specifies where to open the linked document. Only applies when href is set.
   */
  @Prop() target?: '_blank' | '_self' | '_parent' | '_top';

  @State() private inList = false;
  @State() private hasLeading = false;
  @State() private hasDescription = false;
  @State() private hasTrailing = false;

  connectedCallback() {
    // A list item only means something inside a list, as its direct child (a wrapper would
    // break the list structure anyway). Elsewhere (in a pds-sortable-item,
    // say) it's just the row layout, and a stray listitem role would be invalid ARIA.
    this.inList = this.el.parentElement?.tagName === 'PDS-LIST';
  }

  componentWillLoad() {
    this.updateSlots();
  }

  private updateSlots = () => {
    // Children, not `:scope` selectors: Stencil's mock-doc (spec tests) has no `:scope`.
    const slotted = (name: string) =>
      Array.from(this.el.children).some((child) => child.getAttribute('slot') === name);
    this.hasLeading = slotted('leading');
    this.hasDescription = slotted('description');
    this.hasTrailing = slotted('trailing');
  };

  private get hasHref(): boolean {
    return typeof this.href === 'string' && this.href !== '';
  }

  private renderTitle() {
    if (!this.hasHref) {
      return (
        <span class="pds-list-item__title">
          <slot />
        </span>
      );
    }

    return (
      <a
        class="pds-list-item__title pds-list-item__link"
        href={this.href}
        target={this.target}
        rel={this.target === '_blank' ? 'noopener noreferrer' : undefined}
        part="link"
      >
        <slot />
      </a>
    );
  }

  render() {
    return (
      <Host role={this.inList ? 'listitem' : undefined} id={this.componentId}>
        <div class={{ 'pds-list-item': true, 'pds-list-item--interactive': this.hasHref }} part="item">
          <div class="pds-list-item__leading" hidden={!this.hasLeading}>
            <slot name="leading" onSlotchange={this.updateSlots} />
          </div>
          <div class="pds-list-item__content">
            {this.renderTitle()}
            <div class="pds-list-item__description" hidden={!this.hasDescription}>
              <slot name="description" onSlotchange={this.updateSlots} />
            </div>
          </div>
          <div class="pds-list-item__trailing" hidden={!this.hasTrailing}>
            <slot name="trailing" onSlotchange={this.updateSlots} />
          </div>
        </div>
      </Host>
    );
  }
}
