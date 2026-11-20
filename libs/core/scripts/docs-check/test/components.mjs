import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { checkDocs, formatReport } from '../check.mjs';
import { readComponentSource } from '../component-source.mjs';
import { componentTargets } from '../load.mjs';
import { context } from './fixtures.mjs';

const FILE = 'libs/core/src/components/pds-widget/pds-widget.tsx';

const SOURCE = `import { Component, Event, EventEmitter, Host, Method, Prop, h } from '@stencil/core';

/**
 * @slot (default) - Widget content.
 * @slot header - Widget header.
 * @part body - The widget body.
 * @part icon - The widget icon.
 */
@Component({ tag: 'pds-widget', shadow: true })
export class PdsWidget {
  /** The size. */
  @Prop() size: 'sm' | 'md' = 'md';

  /** Whether it's open. */
  @Prop() open = false;

  /** Emitted on change. */
  @Event({ eventName: 'pdsWidgetChange' }) changed: EventEmitter<void>;

  /** Emitted on close. */
  @Event() pdsWidgetClose: EventEmitter<void>;

  /** Opens the widget. */
  @Method()
  async show() {}

  private renderHeader() {
    return <slot name="header" />;
  }

  render() {
    return (
      <Host>
        {this.renderHeader()}
        <div part="body">
          <pds-icon part="icon" />
          <slot />
        </div>
      </Host>
    );
  }
}
`;

const prop = (name, docs, { defaultCode, tags = [], deprecation } = {}) => ({
  name,
  docs,
  docsTags: tags,
  ...(defaultCode === undefined ? {} : { default: defaultCode }),
  ...(deprecation === undefined ? {} : { deprecation }),
});

function docsEntry(overrides = {}) {
  return {
    tag: 'pds-widget',
    filePath: 'src/components/pds-widget/pds-widget.tsx',
    props: [
      prop('size', 'The size.', { defaultCode: "'md'", tags: [{ name: 'defaultValue', text: 'md' }] }),
      prop('open', "Whether it's open.", { defaultCode: 'false', tags: [{ name: 'defaultValue', text: 'false' }] }),
    ],
    events: [
      { event: 'pdsWidgetChange', docs: 'Emitted on change.', docsTags: [] },
      { event: 'pdsWidgetClose', docs: 'Emitted on close.', docsTags: [] },
    ],
    methods: [{ name: 'show', docs: 'Opens the widget.', docsTags: [] }],
    slots: [
      { name: '(default)', docs: 'Widget content.' },
      { name: 'header', docs: 'Widget header.' },
    ],
    parts: [
      { name: 'body', docs: 'The widget body.' },
      { name: 'icon', docs: 'The widget icon.' },
    ],
    ...overrides,
  };
}

function run(entry, source = SOURCE) {
  return checkDocs({ components: componentTargets([entry], () => source) }, context);
}

const messages = (result) => result.findings.map((f) => `${f.rule}:${f.line}: ${f.message}`);

describe('readComponentSource', () => {
  it('finds members, slots in any method of the file, and literal parts, with their lines', () => {
    const facts = readComponentSource(SOURCE, FILE);
    assert.equal(facts.componentLine, 10);
    assert.deepEqual(Object.fromEntries(Object.entries(facts.members).map(([kind, map]) => [kind, [...map]])), {
      props: [['size', 12], ['open', 15]],
      events: [['pdsWidgetChange', 18], ['pdsWidgetClose', 21]],
      methods: [['show', 25]],
    });
    assert.deepEqual(facts.slots, [{ name: 'header', line: 28 }, { name: '', line: 37 }]);
    assert.deepEqual(facts.parts, [{ name: 'body', line: 35 }, { name: 'icon', line: 36 }]);
    assert.deepEqual(facts.dynamic, []);
  });

  it("splits a part list on whitespace and reads name={'x'} as a literal", () => {
    const facts = readComponentSource(`const a = <div part="  one\ttwo  "><slot name={'x'} /></div>;`, FILE);
    assert.deepEqual(facts.parts.map((p) => p.name), ['one', 'two']);
    assert.deepEqual(facts.slots.map((s) => s.name), ['x']);
  });

  it('notes an id on the host or anywhere, and resolves a spread of a const object literal', () => {
    const facts = (jsx) => readComponentSource(`function render() {\n  const host = { role: 'row', 'aria-busy': 'true' };\n  const withId = { id: 'x' };\n  return ${jsx};\n}`, FILE).ids;
    assert.deepEqual(facts('<Host {...host}><div /></Host>'), { onHost: false, anywhere: false });
    assert.deepEqual(facts('<Host {...withId} />'), { onHost: true, anywhere: true });
    assert.deepEqual(facts('<Host {...this.attrs} />'), { onHost: true, anywhere: true });
    assert.deepEqual(facts('<Host><input id={this.inputId} /></Host>'), { onHost: false, anywhere: true });
  });

  it('finds a @Prop on an accessor', () => {
    const facts = readComponentSource('class A {\n  /** V. */\n  @Prop()\n  get value() { return 1; }\n}', FILE);
    assert.deepEqual([...facts.members.props], [['value', 4]]);
  });

  it('sets aside slot names and parts it can only know at run time', () => {
    const code = [
      'const a = <slot name={this.slotName} />;',
      'const b = <slot {...attrs} />;',
      'const c = <div part={open ? "a" : "b"} />;',
      'const d = <div part={`item-${i}`} />;',
      'const e = <div part={`plain`} />;',
      "const f = h('slot', { name: 'built' });",
      'const g = <div part="a&#10;b"><slot name="x&amp;y" /></div>;',
    ].join('\n');
    const facts = readComponentSource(code, FILE);
    assert.deepEqual(facts.slots, []);
    assert.deepEqual(facts.parts, []);
    assert.deepEqual(facts.dynamic, [
      { kind: 'slot', line: 1 },
      { kind: 'slot', line: 2 },
      { kind: 'part', line: 3 },
      { kind: 'part', line: 4 },
      { kind: 'part', line: 5 },
      { kind: 'part', line: 7 },
      { kind: 'slot', line: 7 },
    ]);
  });
});

describe('missing-description', () => {
  it('passes props, events and methods with a description', () => {
    assert.deepEqual(messages(run(docsEntry())), []);
  });

  it('fails an empty description at the member, using the event name @Event gives', () => {
    const entry = docsEntry();
    entry.props[0].docs = ' ';
    entry.events[0].docs = '';
    entry.methods[0].docs = '';
    assert.deepEqual(messages(run(entry)), [
      "missing-description:12: pds-widget's size prop has no JSDoc description.",
      "missing-description:18: pds-widget's pdsWidgetChange event has no JSDoc description.",
      "missing-description:25: pds-widget's show method has no JSDoc description.",
    ]);
  });

  it('skips deprecated and internal members', () => {
    const entry = docsEntry();
    entry.props[0] = { ...entry.props[0], docs: '', deprecation: 'Use another prop.' };
    entry.props[1] = { ...entry.props[1], docs: '', docsTags: [{ name: 'internal' }] };
    assert.deepEqual(messages(run(entry)), []);
  });

  it('skips test components', () => {
    const entry = docsEntry({ filePath: 'src/components/pds-widget/test/pds-widget.tsx' });
    entry.props[0].docs = '';
    assert.deepEqual(messages(run(entry)), []);
  });
});

describe('undocumented-slot', () => {
  it('fails a rendered slot with no @slot line, once per name', () => {
    const entry = docsEntry({ slots: [] });
    const source = SOURCE.replace('<slot />', '<slot /><slot />');
    assert.deepEqual(messages(run(entry, source)), [
      'undocumented-slot:28: pds-widget renders <slot name="header">, but its JSDoc has no @slot header line.',
      'undocumented-slot:37: pds-widget renders a default <slot>, but its JSDoc has no @slot (default) line.',
    ]);
  });

  it('lists a slot with a dynamic name as not checked, never as a finding', () => {
    const result = run(docsEntry(), SOURCE.replace('<slot name="header" />', '<slot name={this.name} />'));
    assert.deepEqual(messages(result), []);
    assert.deepEqual(result.skipped.map((s) => `${s.rule}:${s.line}`), ['undocumented-slot:28']);
  });
});

describe('undocumented-part', () => {
  it('fails each part name with no @part line', () => {
    const entry = docsEntry({ parts: [{ name: 'body', docs: 'Body.' }] });
    assert.deepEqual(messages(run(entry, SOURCE.replace('part="body"', 'part="body extra"'))), [
      'undocumented-part:35: pds-widget renders part="extra", but its JSDoc has no @part extra line.',
      'undocumented-part:36: pds-widget renders part="icon", but its JSDoc has no @part icon line.',
    ]);
  });

  it('lists template literal and expression parts as not checked, never as findings', () => {
    const result = run(docsEntry(), SOURCE.replace('part="icon"', 'part={`icon-${this.size}`}').replace('part="body"', 'part={this.part}'));
    assert.deepEqual(messages(result), []);
    assert.deepEqual(result.skipped.map((s) => `${s.rule}:${s.line}`), ['undocumented-part:35', 'undocumented-part:36']);
  });
});

describe('wrong-default', () => {
  const withDefault = (defaultCode, text, name = 'defaultValue') =>
    docsEntry({ props: [prop('size', 'The size.', { defaultCode, tags: [{ name, text }] })] });

  it('passes a stated default that matches the code, apart from quotes, whitespace and escapes', () => {
    for (const [code, text] of [
      ["'md'", 'md'],
      ["'md'", "'md'"],
      ['"md"', '`md`'],
      ["'Close  dialog'", 'Close dialog'],
      ["'it\\'s'", "it's"],
      ['0', '0'],
      ['1.0', '1'],
      ['-1', '-1'],
      ['false', 'false'],
      ['false', 'False'],
      ['null', 'NULL'],
      ['0', '"0"'],
      ["'false'", 'false'],
      ['[]', '[]'],
      ["'_blank'", '_blank'],
      ["'#fff'", '#fff'],
      ["'1.5rem'", '1.5rem'],
      ["''", '""'],
    ]) {
      assert.deepEqual(messages(run(withDefault(code, text))), [], `${code} vs ${text}`);
    }
    assert.deepEqual(messages(run(withDefault("'md'", 'md', 'default'))), []);
  });

  it('fails a stated default that differs from a literal code default', () => {
    assert.deepEqual(messages(run(withDefault("'md'", 'lg'))), ["wrong-default:12: pds-widget's size prop: @defaultValue says lg, but the code default is 'md'."]);
    assert.deepEqual(messages(run(withDefault('false', 'true', 'default'))), ["wrong-default:12: pds-widget's size prop: @default says true, but the code default is false."]);
    assert.equal(messages(run(withDefault('1', '2'))).length, 1);
    assert.equal(messages(run(withDefault("'md'", 'MD'))).length, 1);
    assert.equal(messages(run(withDefault("''", "'none'"))).length, 1);
  });

  it('lists a tag it cannot read as one value, or a code default that is an expression, as not checked', () => {
    for (const [code, text, why] of [
      ['generateId()', 'A generated id', "can't be compared with the code default generateId(), which isn't a literal"],
      ["'sm'", "'sm' (small)", 'says more than a single value'],
      ["'md'", 'Medium size', 'says more than a single value'],
      ["'sm'", 'sm.', 'says more than a single value'],
      ["'sm'", '**sm**', 'says more than a single value'],
      ["'sm'", '_sm_', 'says more than a single value'],
      ['1000', '1,000', 'says more than a single value'],
      ['1', '1px', "says 1px, which can't be compared with the code default 1"],
      ['undefined', 'none', "says none, which can't be compared with the code default undefined"],
      ["''", 'empty', "says empty, which can't be compared with the code default ''"],
      ["'md'", '', 'has no value'],
    ]) {
      const result = run(withDefault(code, text));
      assert.deepEqual(messages(result), [], `${code} vs ${text}`);
      assert.deepEqual(result.skipped.map((s) => s.message), [`pds-widget's size prop: @defaultValue ${why}.`]);
    }
  });

  it('lists a stated default with no code default for review, never as a finding', () => {
    const entry = docsEntry({
      props: [
        prop('size', 'The size.', { tags: [{ name: 'defaultValue', text: 'md' }] }),
        prop('open', 'Whether.', { tags: [{ name: 'defaultValue', text: 'undefined' }] }),
      ],
    });
    const result = run(entry);
    assert.deepEqual(messages(result), []);
    assert.deepEqual(result.review.map((r) => `${r.rule}:${r.line}: ${r.message}`), [
      'wrong-default:12: pds-widget sets no default in code for a prop whose JSDoc states one: size.',
    ]);
    const empty = run(docsEntry({ props: [prop('size', 'The size.', { tags: [{ name: 'defaultValue', text: '' }] })] }));
    assert.deepEqual([empty.review, empty.skipped.map((s) => s.message)], [[], ["pds-widget's size prop: @defaultValue has no value."]]);
    const both = docsEntry({
      props: [
        prop('size', 'The size.', { tags: [{ name: 'defaultValue', text: 'md' }] }),
        prop('open', 'Whether.', { tags: [{ name: 'defaultValue', text: 'false' }] }),
      ],
    });
    assert.deepEqual(run(both).review.map((r) => `${r.line}: ${r.message}`), ['15: pds-widget sets no default in code for 2 props whose JSDoc states one: open, size.']);
    assert.match(formatReport(result), /For review: 1 item worth a look, which don't fail the check\.\n {2}libs\/core\/src\/components\/pds-widget\/pds-widget\.tsx:12 {2}wrong-default {2}pds-widget\n/);
    assert.match(formatReport(result), /docs-check: no findings in 0 example snippets on 0 pages, 0 links and 0 sections, and 1 component\.\n$/);
  });
});
