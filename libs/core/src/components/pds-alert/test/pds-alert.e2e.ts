import { newE2EPage } from '@stencil/core/testing';
import { formatViolations, runAxe } from '../../../utils/test/axe';

describe('pds-alert', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-alert></pds-alert>');

    const element = await page.find('pds-alert');
    expect(element).toHaveClass('hydrated');
  });

  it('emits "pdsAlertDismissClick" event when dismiss button is clicked', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-alert dismissible="true">Test alert with dismiss button</pds-alert>');

    const closeBtn = await page.find('pds-alert >>> .pds-alert__dismiss');
    const eventSpy = await page.spyOnEvent('pdsAlertDismissClick');
    await closeBtn.click();

    expect(eventSpy).toHaveReceivedEvent();
  });
});

describe('pds-alert accessibility', () => {
  it('has no axe violations', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-alert>This is an important message.</pds-alert>');
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});

describe('pds-alert severity', () => {
  const text = (node) => [node.name, ...(node.children ?? []).flatMap(text)].filter(Boolean).join(' ');

  it('announces its severity before the message, and not the icon name', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-alert variant="danger">Payment failed</pds-alert>');

    const spoken = text(await page.accessibility.snapshot());
    expect(spoken).toMatch(/Error.*Payment failed/);
    expect(spoken).not.toMatch(/warning filled/);
  });

  it('announces severity when the icon is hidden', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-alert variant="warning" hide-icon>Storage almost full</pds-alert>');

    expect(text(await page.accessibility.snapshot())).toMatch(/Warning.*Storage almost full/);
  });
});
