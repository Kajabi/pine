import { newSpecPage } from '@stencil/core/testing';
import { SageTooltip } from '../sage-tooltip';

describe('sage-tooltip', () => {
  // it('is rendered', async () => {
  //   const { root } = await newSpecPage({
  //     components: [SageTooltip],
  //     html: `<sage-tooltip></sage-tooltip>`
  //   });
  //   expect(root).toEqualHtml(`
  //   <sage-tooltip>
  //     <mock:shadow-root>
  //     <div class="sage-tooltip>
  //       <span class="sage-tooltip__trigger" part="trigger">
  //         <slot></slot>
  //       </span>
  //       <div class="sage-tooltip__content" aria-hidden="true" aria-live="off" part="content" role="tooltip">
  //         <slot name="content"></slot>
  //       </div>
  //     </div>
  //     </mock:shadow-root>
  //   </sage-tooltip>
  //   `);
  // });

  // it('renders the trigger', async () => {
  //   const { root } = await newSpecPage({
  //     components: [SageTooltip],
  //     html: `
  //     <sage-tooltip>
  //       <a href="#">Trigger</a>
  //     </sage-tooltip>`
  //   });
  //   expect(root).toEqualHtml(`
  //   <sage-tooltip>
  //     <mock:shadow-root>
  //     <div class="sage-tooltip">
  //       <span class="sage-tooltip__trigger" part="trigger">
  //         <slot></slot>
  //       </span>
  //       <div class="sage-tooltip__content" aria-hidden="true" aria-live="off" part="content" role="tooltip">
  //         <slot name="content"></slot>
  //       </div>
  //     </div>
  //     </mock:shadow-root>
  //     <a href="#">Trigger</a>
  //   </sage-tooltip>
  //   `);
  // });

  // it('renders the slot content', async () => {
  //   const { root } = await newSpecPage({
  //     components: [SageTooltip],
  //     html: `
  //     <sage-tooltip>
  //       <p slot="content">this is the slotted tooltip content</p>
  //     </sage-tooltip>`
  //   });
  //   expect(root).toEqualHtml(`
  //   <sage-tooltip>
  //     <mock:shadow-root>
  //     <div class="sage-tooltip">
  //       <span class="sage-tooltip__trigger" part="trigger">
  //         <slot></slot>
  //       </span>
  //       <div class="sage-tooltip__content" aria-hidden="true" aria-live="off" part="content" role="tooltip">
  //         <slot name="content"></slot>
  //       </div>
  //     </div>
  //     </mock:shadow-root>
  //     <p slot="content">this is the slotted tooltip content</p>
  //   </sage-tooltip>
  //   `);
  // });

  // it('renders the placement', async () => {
  //   const { root } = await newSpecPage({
  //     components: [SageTooltip],
  //     html: `<sage-tooltip placement="right-start"></sage-tooltip>`
  //   });

  //   const placement = root.shadowRoot.querySelector('.sage-tooltip--right-start');
  //   expect(placement).not.toBeNull();
  // });

  it('renders with disabled', async () => {
    // arrange
    // act
    // assert
  })

  // it('renders with disabled', async () => {
  //   const page = await newSpecPage({
  //     components: [SageTooltip],
  //     html: `
  //     <sage-tooltip>
  //       <a href="#">Trigger</a>
  //     </sage-tooltip>`
  //   })

  //   page.root.disabled = ''

  //   const component = page.root;
  //   const defaultSlot = component.shadowRoot.querySelector<HTMLSlotElement>(
  //     '.sage-tooltip__trigger slot'
  //   );

  //   defaultSlot.assignedNodes = () =>
  //     component.querySelectorAll('> *') as unknown as Node[]
  //   expect(page.root).toMatchSnapshot()
  // })

  it('showToolip', async() => {
    const page = await newSpecPage({
      components: [SageTooltip],
      html: `
      <sage-tooltip>
        <a href="#">Trigger</a>
      </sage-tooltip>`
    });

    // const foo = page.body.querySelector('foo-component');
    const component = await page.root?.find('sage-tooltip');

    if (!component) {
        throw new Error('Could not find Foo component');
    }

    await expect(component.showTooltip()).toBeTruthy();
  });

  // it('should call method to show', async () => {
  //   const page = await newSpecPage({
  //     components: [SageTooltip],
  //     html: `<sage-tooltip placement="right-start"></sage-tooltip>`
  //   });

  //   const component = await page.root.find('sage-tooltip');

  //   await page.root.showTooltip();
  //   await page.waitForChanges();

  //   // tried in the spec just to be sure
  //   // const wrapper = await page.root.shadowRoot.querySelector('.sage-tooltip__content').isVisible;
  //   // expect(wrapper).
  // });
});
