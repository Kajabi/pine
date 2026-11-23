const GUIDELINES = 'Guidelines';
const GUIDELINES_HEADINGS = ['When to use', 'When not to use', 'Accessibility'];
const GUIDELINES_LIST = '### When to use, ### When not to use and ### Accessibility';

const written = (section) => `${'#'.repeat(section.level)} ${section.heading}`;
const isNamed = (section, name) => section.heading.toLowerCase() === name.toLowerCase();
const lineOf = (page, section) => page.headingLines.get(section.slug) ?? null;

function descendants(section) {
  return section.children.flatMap((child) => [child, ...descendants(child)]);
}

/**
 * The # heading the docs content takes as the title is the one heading of depth 1 outside the page's sections. When
 * there are more, the others sit inside JSX, a list or a quote, and which one is the title isn't known.
 */
function findTitle(page) {
  const sectionSlugs = new Set(page.sections.map((section) => section.slug));
  const outside = page.headings.filter((heading) => !sectionSlugs.has(heading.slug));
  const h1s = outside.filter((heading) => heading.depth === 1);
  const hasTitle = page.title.trim() !== '';
  return { outside, h1s, hasTitle, line: hasTitle && h1s.length === 1 ? h1s[0].line : null };
}

function titleFindings(page, title) {
  const findings = [];
  if (!title.hasTitle) {
    findings.push({
      line: null,
      message: 'The page has no # title, or its # heading is empty.',
      hint: 'Start the page with a # heading that names the component, then a one-paragraph summary.',
    });
  }
  for (const section of page.sections.filter((s) => s.level === 1)) {
    findings.push({
      line: lineOf(page, section),
      message: `"${written(section)}" is a second # heading. The docs content takes only the first one as the page title.`,
      hint: 'Make it a ## heading.',
    });
  }
  if (!title.hasTitle) return findings;
  if (title.line === null) {
    findings.push({
      line: title.h1s[0]?.line ?? null,
      skipped: true,
      message: `# headings at lines ${title.h1s.map((h) => h.line).join(', ')} sit outside the page's sections, so which one is the title, and whether it comes first, isn't known.`,
    });
  } else {
    const first = page.sections.find((section) => (lineOf(page, section) ?? Infinity) < title.line);
    if (first) {
      findings.push({
        line: lineOf(page, first),
        message: `"${written(first)}" comes before the "# ${page.title}" title, which must be the page's first heading.`,
        hint: 'Move the title and its summary above it.',
      });
    }
  }
  if (!page.summary?.trim()) {
    findings.push({
      line: title.line,
      message: `The page has no summary under "# ${page.title}", so the docs content has no description for the component.`,
      hint: 'Add a one-paragraph summary under the title, before the first ## heading.',
    });
  }
  return findings;
}

function guidelinesFindings(page, guidelines, titleLine) {
  if (!guidelines) {
    return [{ line: titleLine, message: `The page has no ## ${GUIDELINES} section.`, hint: `Add ## ${GUIDELINES} after the summary, with ${GUIDELINES_LIST}.` }];
  }
  const findings = [];
  if (guidelines.heading !== GUIDELINES) {
    findings.push({
      line: lineOf(page, guidelines),
      message: `"${written(guidelines)}" must be "## ${GUIDELINES}": agents find it by that exact name.`,
      hint: `Rename it to ## ${GUIDELINES}.`,
    });
  }
  const found = [];
  const extra = [];
  for (const child of guidelines.children) {
    const name = child.level === 3 ? GUIDELINES_HEADINGS.find((n) => isNamed(child, n)) : undefined;
    if (name === undefined) {
      extra.push(child);
    } else {
      found.push(name);
      if (child.heading !== name) {
        findings.push({
          line: lineOf(page, child),
          message: `"${written(child)}" must be "### ${name}": agents match the Guidelines headings case-sensitively.`,
          hint: `Rename it to ### ${name}.`,
        });
      }
    }
    extra.push(...descendants(child));
  }
  for (const section of extra) {
    findings.push({
      line: lineOf(page, section),
      message: `"${written(section)}" is inside ${GUIDELINES}, which holds only ${GUIDELINES_LIST}. Agents drop or misfile any other heading there.`,
      hint: `Move it and its content to a ## section of its own after ${GUIDELINES}.`,
    });
  }
  if (found.join('\n') !== GUIDELINES_HEADINGS.join('\n')) {
    const has = found.length > 0 ? found.map((name) => `### ${name}`).join(', ') : 'none of them';
    findings.push({
      line: lineOf(page, guidelines),
      message: `${GUIDELINES} needs exactly ${GUIDELINES_LIST}, in that order. It has ${has}.`,
      hint: `Give ${GUIDELINES} those three ### headings, each once, in that order.`,
    });
  }
  const accessibility = guidelines.children.find((child) => child.level === 3 && isNamed(child, 'Accessibility'));
  const line = accessibility && lineOf(page, accessibility);
  if (line && page.lines[line]?.trim() !== '') {
    findings.push({
      line,
      message: `No blank line follows "${written(accessibility)}", so the Pine MCP leaves out the accessibility notes.`,
      hint: 'Add a blank line after the heading.',
    });
  }
  return findings;
}

function orderFindings(page, h2s, guidelines, titleLine) {
  const findings = [];
  const properties = h2s.find((section) => isNamed(section, 'Properties'));
  if (!properties) {
    findings.push({ line: titleLine, message: 'The page has no ## Properties section.', hint: `Add ## Properties with a <DocArgsTable> after ${GUIDELINES}.` });
  } else if (guidelines && h2s.indexOf(properties) < h2s.indexOf(guidelines)) {
    findings.push({ line: lineOf(page, properties), message: `"${written(properties)}" comes before "${written(guidelines)}".`, hint: `Move ## Properties below ${GUIDELINES}.` });
  }
  const playground = h2s.find((section) => isNamed(section, 'Playground'));
  if (!playground) {
    findings.push({ line: titleLine, message: 'The page has no ## Playground section.', hint: 'End the page with ## Playground and a <Canvas> of the main story.' });
  } else if (playground !== h2s.at(-1)) {
    const after = h2s.slice(h2s.indexOf(playground) + 1).map((section) => `"${written(section)}"`);
    findings.push({
      line: lineOf(page, playground),
      message: `"${written(playground)}" isn't the last ## section: ${after.join(', ')} ${after.length === 1 ? 'follows' : 'follow'} it. The Pine MCP ignores everything from ## Playground on.`,
      hint: 'Move ## Playground to the end of the page.',
    });
  }
  return findings;
}

function statusFindings(page, titleLine) {
  if (page.status !== null) return [];
  return [{
    line: titleLine,
    message: 'The docs content has no status for the page. It needs a <StatusBadge> at the top level whose component is in component-status.json, with a status of stable, beta or deprecated.',
    hint: `Put <StatusBadge component="${page.tag}" /> above the title, and list ${page.tag} in libs/core/src/stories/resources/component-status.json.`,
  }];
}

/** A heading inside JSX, a list or a quote isn't a section in the docs content, so the rule can't place it. */
function headingsOutsideSections(title) {
  return title.outside
    .filter((heading) => heading.depth !== 1)
    .map((heading) => ({
      line: heading.line,
      skipped: true,
      message: `The heading #${heading.slug} sits inside JSX, a list or a quote, so it isn't a section in the docs content and its place isn't checked.`,
    }));
}

/**
 * Checks the headings of a component page against CONTRIBUTING.md § Writing component docs. Agents read a page
 * section by section and look sections up by name, so a renamed, missing or misplaced heading hides its content.
 * Guides have no template, so only component pages are checked.
 */
export default {
  id: 'heading-contract',
  scope: 'page',
  check(page) {
    if (page.kind !== 'component') return [];
    const h2s = page.sections.filter((section) => section.level === 2);
    const guidelines = h2s.find((section) => section.heading === GUIDELINES) ?? h2s.find((section) => isNamed(section, GUIDELINES));
    const title = findTitle(page);
    return [
      ...titleFindings(page, title),
      ...statusFindings(page, title.line),
      ...guidelinesFindings(page, guidelines, title.line),
      ...orderFindings(page, h2s, guidelines, title.line),
      ...headingsOutsideSections(title),
    ];
  },
};
