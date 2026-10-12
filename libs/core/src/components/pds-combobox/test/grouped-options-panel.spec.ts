import { FlyoutController, buildPanelEntries, groupLabelOf } from '../grouped-options-panel';

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

describe('FlyoutController', () => {
  let open: string | null;
  let controller: FlyoutController;

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

  it('toggles a group on click', () => {
    controller.toggle('Tag');
    expect(open).toBe('Tag');
    controller.toggle('Tag');
    expect(open).toBeNull();
  });
});
