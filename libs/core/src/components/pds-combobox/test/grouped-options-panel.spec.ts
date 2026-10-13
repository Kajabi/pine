import { FlyoutController, buildPanelEntries, groupIconOf, groupLabelOf, parentOptgroupOf, scrollIntoViewWithin } from '../grouped-options-panel';

const optgroup = (label: string, icon?: string, ...values: string[]) => {
  const group = document.createElement('optgroup');
  group.label = label;
  if (icon !== undefined) group.setAttribute('data-icon', icon);
  const options = values.map(value => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    group.appendChild(option);
    return option;
  });
  return { group, options };
};

const option = (value: string) => {
  const el = document.createElement('option');
  el.value = value;
  return el;
};

describe('buildPanelEntries', () => {
  it('collects each optgroup into one entry and counts indexes across all options', () => {
    const tag = optgroup('Tag', 'hashtag', 'tag-add', 'tag-remove');
    const email = optgroup('Email', undefined, 'email-send');
    const loose = option('loose');

    const entries = buildPanelEntries([loose, tag.group, ...tag.options, email.group, ...email.options]);

    expect(entries.map(entry => (entry.kind === 'group' ? `group:${entry.group.label}` : entry.option.value))).toEqual([
      'loose',
      'group:Tag',
      'group:Email',
    ]);
    const [, tagEntry, emailEntry] = entries;
    expect(tagEntry.kind === 'group' && tagEntry.group.icon).toBe('hashtag');
    expect(tagEntry.kind === 'group' && tagEntry.group.optgroup).toBe(tag.group);
    expect(tagEntry.kind === 'group' && tagEntry.group.options.map(o => o.index)).toEqual([1, 2]);
    expect(emailEntry.kind === 'group' && emailEntry.group.icon).toBeNull();
    expect(emailEntry.kind === 'group' && emailEntry.group.options.map(o => o.index)).toEqual([3]);
  });

  it('builds a group from options alone, as a filtered list leaves them', () => {
    const tag = optgroup('Tag', undefined, 'tag-add', 'tag-remove');

    const entries = buildPanelEntries([tag.options[1]]);

    expect(entries).toHaveLength(1);
    expect(entries[0].kind === 'group' && entries[0].group.options.map(o => [o.option.value, o.index])).toEqual([
      ['tag-remove', 0],
    ]);
  });
});

describe('groupLabelOf', () => {
  it("returns an option's optgroup label, or null when it has none", () => {
    const tag = optgroup('Tag', undefined, 'tag-add');
    expect(groupLabelOf(tag.options[0])).toBe('Tag');
    expect(groupLabelOf(option('loose'))).toBeNull();
    expect(groupLabelOf(undefined)).toBeNull();
  });
});

describe('parentOptgroupOf / groupIconOf', () => {
  it('finds the optgroup, and treats a missing or empty data-icon as no icon', () => {
    const withIcon = optgroup('Tag', 'hashtag', 'tag-add');
    const empty = optgroup('Email', '', 'email-send');
    expect(parentOptgroupOf(withIcon.options[0])).toBe(withIcon.group);
    expect(parentOptgroupOf(option('loose'))).toBeNull();
    expect(groupIconOf(withIcon.group)).toBe('hashtag');
    expect(groupIconOf(empty.group)).toBeNull();
  });
});

describe('scrollIntoViewWithin', () => {
  const box = (top: number, bottom: number) => {
    const el = document.createElement('div');
    el.getBoundingClientRect = () => ({ top, bottom }) as DOMRect;
    return el;
  };

  it('scrolls the container just enough to show the element, and nothing else', () => {
    const container = box(100, 200);
    container.scrollTop = 50;

    scrollIntoViewWithin(container, box(180, 230));
    expect(container.scrollTop).toBe(80);

    scrollIntoViewWithin(container, box(70, 90));
    expect(container.scrollTop).toBe(50);

    scrollIntoViewWithin(container, box(120, 160));
    expect(container.scrollTop).toBe(50);
  });
});

describe('FlyoutController', () => {
  let open: string | null;
  let controller: FlyoutController<string>;

  beforeEach(() => {
    jest.useFakeTimers();
    open = null;
    controller = new FlyoutController(
      () => open,
      label => {
        open = label;
      },
    );
  });

  afterEach(() => {
    controller.reset();
    jest.useRealTimers();
  });

  it('opens the first group hovered straight away', () => {
    controller.enter('Tag');
    expect(open).toBe('Tag');
  });

  it('waits before switching to another group, so a diagonal move into the flyout keeps it', () => {
    controller.enter('Tag');
    controller.enter('Email');
    expect(open).toBe('Tag');

    // Back over Tag (or into its flyout) before the delay: the switch is cancelled.
    controller.enter('Tag');
    jest.runAllTimers();
    expect(open).toBe('Tag');
  });

  it('switches once the pointer rests on another group', () => {
    controller.enter('Tag');
    controller.enter('Email');
    jest.runAllTimers();
    expect(open).toBe('Email');
  });

  it('closes after leaving, unless the pointer comes back across the gap', () => {
    controller.enter('Tag');
    controller.leave('Tag');
    expect(open).toBe('Tag');
    controller.enter('Tag');
    jest.runAllTimers();
    expect(open).toBe('Tag');

    controller.leave('Tag');
    jest.runAllTimers();
    expect(open).toBeNull();
  });

  // Hover opens the group before the click lands, and a tap fires an emulated mouseenter first.
  it('keeps a hovered group open when its row is clicked', () => {
    controller.enter('Tag');
    controller.open('Tag');
    expect(open).toBe('Tag');
  });

  it('opens a group on click, cancelling a pending switch or close', () => {
    controller.enter('Tag');
    controller.enter('Email');
    controller.open('Coupon');
    jest.runAllTimers();
    expect(open).toBe('Coupon');
  });
});
