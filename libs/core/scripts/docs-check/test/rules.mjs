import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { checkSnippets, formatReport } from '../check.mjs';
import { closedValues } from '../context.mjs';
import { check, components, context } from './fixtures.mjs';

const HTML = 'webComponent';
const REACT = 'react';

describe('unknown-component', () => {
  it('passes tags in docs.json, including pds-icon from @pine-ds/icons', () => {
    assert.deepEqual(check(HTML, '<pds-button>Save</pds-button>\n<pds-icon name="add"></pds-icon>'), []);
    assert.deepEqual(check(REACT, '<PdsButton>Save</PdsButton>\n<PdsIcon icon={add} />'), []);
  });

  it('fails a pds-* tag that docs.json lacks', () => {
    assert.deepEqual(check(HTML, '<pds-dropdown-item>Edit</pds-dropdown-item>'), [
      'unknown-component: <pds-dropdown-item> isn\'t a Pine component: docs.json has no pds-dropdown-item.',
    ]);
    assert.deepEqual(check(REACT, '<pds-buton>Save</pds-buton>'), ['unknown-component: <pds-buton> isn\'t a Pine component: docs.json has no pds-buton.']);
  });

  it('fails a Pds* React name that maps to no tag', () => {
    assert.deepEqual(check(REACT, '<PdsIconButton icon={add} />'), [
      'unknown-component: <PdsIconButton> isn\'t a Pine React component: no tag in docs.json maps to it.',
    ]);
    assert.deepEqual(check(REACT, "import { PdsDropdownItem } from '@pine-ds/react';\n\n<PdsDropdownItem />").length, 1);
  });

  it('skips Pds* names the snippet declares or imports from elsewhere', () => {
    const code = [
      "import { PdsLayout } from './layout';",
      'const PdsCard = ({ children }) => <div>{children}</div>;',
      'function PdsPage() { return <PdsLayout><PdsCard>Hi</PdsCard></PdsLayout>; }',
    ].join('\n');
    assert.deepEqual(check(REACT, code), []);
  });

  it('resolves @pine-ds/react imports under any local name', () => {
    assert.deepEqual(check(REACT, "import { PdsButton as PdsBtn } from '@pine-ds/react';\n\n<PdsBtn variant=\"secondary\" />"), []);
    assert.deepEqual(check(REACT, "import { PdsButton as Button } from '@pine-ds/react';\n\n<Button variant=\"bogus\" />").length, 1);
    assert.deepEqual(check(REACT, "import { PdsBogus as PdsB } from '@pine-ds/react';\n\n<PdsB />"), [
      'unknown-component: <PdsB> (PdsBogus) isn\'t a Pine React component: no tag in docs.json maps to it.',
    ]);
  });

  it('skips an imported name the snippet also declares, since it may be shadowed', () => {
    const code = "import { PdsButton as Button } from '@pine-ds/react';\n\nfunction Demo({ Button }) {\n  return <Button variant=\"custom\" />;\n}";
    assert.deepEqual(check(REACT, code), []);
    const imported = "import { PdsButton as Button } from '@pine-ds/react';\n";
    for (const local of [
      'const Demo = function Button() {\n  return <Button variant="custom" />;\n};',
      'const Demo = class Button {\n  render() {\n    return <Button variant="custom" />;\n  }\n};',
      'enum Button { A }\n<Button variant="custom" />',
      'try {} catch (Button) {}\n<Button variant="custom" />',
    ]) {
      const result = checkSnippets([{ file: 'f.mdx', title: 't', language: REACT, code: imported + local, line: 1, exactLines: true }], context);
      assert.deepEqual([result.findings, result.unparsed], [[], []], local);
    }
    assert.equal(check(REACT, `${imported}<Button variant="custom" />`).length, 1);
  });

  it('checks members of a @pine-ds/react namespace import, and nothing else reached through a namespace', () => {
    assert.deepEqual(check(REACT, "import * as Pine from '@pine-ds/react';\n\n<Pine.PdsButton variant=\"primary\" />"), []);
    assert.deepEqual(check(REACT, "import * as Pine from '@pine-ds/react';\n\n<Pine.PdsButon />"), [
      'unknown-component: <Pine.PdsButon> isn\'t a Pine React component: no tag in docs.json maps to it.',
    ]);
    assert.deepEqual(check(REACT, "import * as UI from './ui';\n\n<UI.PdsButon />"), []);
  });

  it('matches pds-* JSX tags in any letter case, as the DOM lowercases them', () => {
    assert.deepEqual(check(REACT, '<pds-BUTTON variant="secondary"></pds-BUTTON>'), []);
    assert.deepEqual(check(HTML, '<PDS-BUTTON variant="secondary"></PDS-BUTTON>'), []);
  });

  it('suggests the closest tag', () => {
    const { findings } = checkSnippets([{ file: 'f.mdx', title: 't', language: HTML, code: '<pds-buton></pds-buton>', line: 1, exactLines: true }], context);
    assert.equal(findings[0].hint, 'Did you mean <pds-button>?');
  });
});

describe('unknown-icon', () => {
  it('passes icon names in the set, in any letter case', () => {
    assert.deepEqual(check(HTML, '<pds-icon name="info-circle"></pds-icon><pds-icon name="Trash"></pds-icon>'), []);
    assert.deepEqual(check(REACT, '<PdsIcon name="trash" />'), []);
  });

  it('fails a name the icon set lacks', () => {
    assert.deepEqual(check(HTML, '<pds-icon name="info"></pds-icon>'), [
      'unknown-icon: <pds-icon name="info"> names an icon that @pine-ds/icons 1.0.0 doesn\'t have.',
    ]);
    assert.deepEqual(check(REACT, '<PdsIcon name="infoCircle" />').length, 1);
  });

  it('skips names that src overrides or addIcons may register, and names that are not literals', () => {
    assert.deepEqual(check(HTML, '<pds-icon src="/icons/custom.svg" name="custom"></pds-icon>'), []);
    assert.deepEqual(check(HTML, '<pds-icon name="custom"></pds-icon>\n<script>addIcons({ custom })</script>'), []);
    assert.deepEqual(check(REACT, "import { addIcons } from '@pine-ds/icons';\naddIcons({ custom });\n<PdsIcon name=\"custom\" />"), []);
    assert.deepEqual(check(REACT, '<PdsIcon name={iconName} />'), []);
    assert.deepEqual(check(REACT, '<PdsIcon {...props} name="custom" />'), []);
  });

  it('checks name when src is empty, has no / or ., or is a bare React prop, since pds-icon then falls back to name', () => {
    assert.equal(check(HTML, '<pds-icon src="" name="info"></pds-icon>').length, 1);
    assert.equal(check(HTML, '<pds-icon src="  " name="info"></pds-icon>').length, 1);
    assert.equal(check(HTML, '<pds-icon src="custom" name="info"></pds-icon>').length, 1);
    assert.equal(check(REACT, '<PdsIcon src name="info" />').length, 1);
    assert.deepEqual(check(HTML, '<pds-icon src="icon.svg" name="info"></pds-icon>'), []);
    assert.deepEqual(check(REACT, '<PdsIcon src={url} name="info" />'), []);
  });

  it('checks icon={x} only when the snippet imports x from @pine-ds/icons/icons', () => {
    assert.deepEqual(check(REACT, "import { infoCircle } from '@pine-ds/icons/icons';\n\n<PdsIcon icon={infoCircle} />"), []);
    assert.deepEqual(check(REACT, "import { info } from '@pine-ds/icons/icons';\n\n<PdsIcon icon={info} />"), [
      'unknown-icon: icon={info} imports "info" from @pine-ds/icons/icons, which @pine-ds/icons 1.0.0 doesn\'t export.',
    ]);
    assert.deepEqual(check(REACT, "import { info as infoIcon } from '@pine-ds/icons/icons';\n\n<PdsButton icon={infoIcon} />").length, 1);
    assert.deepEqual(check(REACT, '<PdsIcon icon={info} />'), []);
  });
});

describe('unknown-attribute', () => {
  it('passes docs.json attributes, boolean attributes and global attributes', () => {
    const code = '<pds-button variant="primary" disabled full-width id="save" class="x" style="width: 100%" slot="footer" part="p" tabindex="0" hidden title="t" role="link" aria-label="Save" data-test="save" onclick="save()">Save</pds-button>';
    assert.deepEqual(check(HTML, code), []);
  });

  it('passes the attribute Stencil observes for a prop docs.json gives no attr', () => {
    assert.deepEqual(check(HTML, '<pds-multiselect value=\'["1", "3"]\'><option value="1">One</option></pds-multiselect>'), []);
  });

  it('fails an attribute the component lacks', () => {
    assert.deepEqual(check(HTML, '<pds-button varient="primary">Save</pds-button>'), [
      'unknown-attribute: <pds-button varient>: pds-button has no varient attribute, and it isn\'t a global attribute.',
    ]);
    assert.deepEqual(check(HTML, '<pds-multiselect formatResult="x"></pds-multiselect>').length, 1);
  });

  it('does not run on React snippets', () => {
    assert.deepEqual(check(REACT, '<PdsButton varient="primary" fullWidth full-width onPdsClick={go} className="x" key="k">Save</PdsButton>'), []);
  });
});

describe('invalid-value', () => {
  it('passes a value in a closed set, in both languages and both React prop spellings', () => {
    assert.deepEqual(check(HTML, '<pds-button variant="secondary"></pds-button>'), []);
    assert.deepEqual(check(REACT, '<PdsButton variant="secondary" />\n<PdsText size={"sm"} />\n<PdsText max-width="20ch" size="lg" />'), []);
  });

  it('fails a literal value outside a closed set', () => {
    assert.deepEqual(check(HTML, '<pds-button variant="primry"></pds-button>'), [
      'invalid-value: <pds-button variant="primry">: pds-button accepts only "primary", "secondary", "tertiary".',
    ]);
    assert.deepEqual(check(REACT, '<PdsButton variant="Primary" />').length, 1);
    assert.deepEqual(check(REACT, '<PdsText size={`xl`} />').length, 1);
  });

  it('skips a value a later JSX spread may replace, but not one set after the spread', () => {
    assert.deepEqual(check(REACT, '<PdsButton variant="bogus" {...props} />'), []);
    assert.deepEqual(check(REACT, '<PdsButton {...props} variant="bogus" />').length, 1);
  });

  it('skips open types, expressions and booleans', () => {
    assert.deepEqual(check(HTML, '<pds-modal size="1100px"></pds-modal><pds-text max-width="40ch"></pds-text><pds-button disabled="false"></pds-button>'), []);
    assert.deepEqual(check(REACT, '<PdsModal size="1100px" />\n<PdsButton variant={variant} disabled />'), []);
  });
});

describe('closedValues', () => {
  it('reads only types that are exactly a union of string literals', () => {
    const byName = (tag, name) => components.find((c) => c.tag === tag).props.find((p) => p.name === name);
    assert.deepEqual(closedValues(byName('pds-button', 'variant')), ['primary', 'secondary', 'tertiary']);
    assert.equal(closedValues(byName('pds-modal', 'size')), null);
    assert.equal(closedValues(byName('pds-button', 'disabled')), null);
    assert.equal(closedValues({ type: '"a" | "b"', values: [{ type: 'string', value: 'a' }] }), null);
    assert.equal(closedValues({ type: 'Size', values: [{ type: 'string', value: 'a' }] }), null);
  });
});

describe('markup the docs use on purpose', () => {
  it('passes slot carriers', () => {
    const code = [
      '<pds-accordion is-open><span slot="label">Details</span><p>Plain HTML panel</p></pds-accordion>',
      '<pds-tooltip html-content><div slot="content"><strong>Bold</strong> tip</div><pds-button slot="trigger">?</pds-button></pds-tooltip>',
      '<pds-sortable><pds-sortable-item enable-actions>Row<div slot="sortable-item-actions"><pds-button variant="tertiary">Edit</pds-button></div></pds-sortable-item></pds-sortable>',
      '<pds-multiselect value=\'["1"]\'><button slot="trigger" type="button">Pick</button><option value="1">One</option></pds-multiselect>',
    ].join('\n');
    assert.deepEqual(check(HTML, code), []);
  });

  it('passes <option> children, dir and lang scopes, and raw elements', () => {
    const code = [
      '<pds-select name="plan"><option value="a">A</option><optgroup label="More"><option value="b">B</option></optgroup></pds-select>',
      '<div dir="rtl" lang="ar"><pds-icon name="add" dir="rtl" lang="ar"></pds-icon></div>',
      '<div style="height: 150px"><a href="#">Link</a><button type="button" aria-controls="details">Toggle</button><p role="status"></p></div>',
      '<table><tr><td><pds-button>In a table</pds-button></td></tr></table>',
      '<template><pds-button variant="primary">In a template</pds-button></template>',
      '<svg viewBox="0 0 10 10"><circle r="4"></circle></svg>',
    ].join('\n');
    assert.deepEqual(check(HTML, code), []);
  });

  it('passes React snippets with imports, components and siblings', () => {
    const code = [
      "import { useState } from 'react';",
      "import { PdsButton, PdsModal } from '@pine-ds/react';",
      '',
      'export function Example() {',
      '  const [open, setOpen] = useState(false);',
      '  return (',
      '    <>',
      '      <PdsButton variant="primary" onClick={() => setOpen(true)}>Open</PdsButton>',
      '      <PdsModal size="lg" open={open}>Body</PdsModal>',
      '    </>',
      '  );',
      '}',
    ].join('\n');
    assert.deepEqual(check(REACT, code), []);
  });
});

describe('reporting', () => {
  it('maps a React finding to its own line and a web component finding to the snippet line', () => {
    const snippets = [
      { file: 'b.mdx', title: 'React', language: REACT, code: '<PdsButton>\n  <PdsText size="xl" />\n</PdsButton>', line: 20, exactLines: true },
      { file: 'b.mdx', title: 'HTML', language: HTML, code: '<pds-button>\n  <pds-text size="xl"></pds-text>\n</pds-button>', line: 30, exactLines: true },
      { file: 'b.mdx', title: 'Escaped', language: REACT, code: '<PdsButton>\n  <PdsText size="xl" />\n</PdsButton>', line: 40, exactLines: false },
      { file: 'b.mdx', title: 'Siblings', language: REACT, code: '<PdsButton />\n<PdsText size="xl" />', line: 50, exactLines: true },
    ];
    assert.deepEqual(checkSnippets(snippets, context).findings.map((f) => f.line), [21, 30, 40, 51]);
  });

  it('sorts by file, line and rule order, and counts repeats once', () => {
    const snippets = [
      { file: 'b.mdx', title: 'B', language: HTML, code: '<pds-x></pds-x><pds-x></pds-x>', line: 5, exactLines: true },
      { file: 'a.mdx', title: 'A2', language: HTML, code: '<pds-button variant="x" bad></pds-button>', line: 9, exactLines: true },
      { file: 'a.mdx', title: 'A1', language: HTML, code: '<pds-y></pds-y>', line: 9, exactLines: true },
    ];
    const { findings } = checkSnippets(snippets, context);
    assert.deepEqual(
      findings.map((f) => `${f.file}:${f.line} ${f.rule} x${f.count}`),
      ['a.mdx:9 unknown-component x1', 'a.mdx:9 unknown-attribute x1', 'a.mdx:9 invalid-value x1', 'b.mdx:5 unknown-component x2'],
    );
  });

  it('gives the same report for the same input, whatever the input order', () => {
    const snippets = [
      { file: 'a.mdx', title: 'A', language: HTML, code: '<pds-button varient="x"></pds-button>', line: 3, exactLines: true },
      { file: 'c.mdx', title: 'C', language: REACT, code: '<PdsIconButton />', line: 7, exactLines: true },
      { file: 'b.mdx', title: 'B', language: REACT, code: '<PdsButton variant="x" />\n<PdsBadge />', line: 1, exactLines: true },
    ];
    const first = formatReport(checkSnippets(snippets, context));
    assert.equal(formatReport(checkSnippets([...snippets].reverse(), context)), first);
    assert.match(first, /docs-check: 4 findings in 3 example snippets on 0 pages\./);
  });

  it('lists React snippets with syntax errors as not checked, not as findings', () => {
    const result = checkSnippets([{ file: 'a.mdx', title: 'Broken', language: REACT, code: '<PdsButton variant="nope">', line: 2, exactLines: true }], context);
    assert.deepEqual(result.findings, []);
    assert.deepEqual(result.unparsed, [{ file: 'a.mdx', line: 2, title: 'Broken' }]);
  });
});
