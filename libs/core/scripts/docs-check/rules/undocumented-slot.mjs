const DEFAULT_SLOT = '(default)';

export default {
  id: 'undocumented-slot',
  scope: 'component',
  check({ tag, docs, source }) {
    const documented = new Set(docs.slots.map((slot) => slot.name));
    const reported = new Set();
    const findings = [];
    for (const slot of source.slots) {
      const name = slot.name === '' ? DEFAULT_SLOT : slot.name;
      if (documented.has(name) || reported.has(name)) continue;
      reported.add(name);
      findings.push({
        line: slot.line,
        message: `${tag} renders ${slot.name === '' ? 'a default <slot>' : `<slot name="${name}">`}, but its JSDoc has no @slot ${name} line.`,
        hint: `Add "@slot ${name} - …" to the JSDoc above @Component, saying what goes in the slot.`,
      });
    }
    for (const slot of source.dynamic.filter((d) => d.kind === 'slot')) {
      findings.push({ line: slot.line, skipped: true, message: `${tag} renders a <slot> whose name is set by an expression or a spread.` });
    }
    return findings;
  },
};
