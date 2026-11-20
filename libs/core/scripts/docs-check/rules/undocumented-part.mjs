export default {
  id: 'undocumented-part',
  scope: 'component',
  check({ tag, docs, source }) {
    const documented = new Set(docs.parts.map((part) => part.name));
    const reported = new Set();
    const findings = [];
    for (const part of source.parts) {
      if (documented.has(part.name) || reported.has(part.name)) continue;
      reported.add(part.name);
      findings.push({
        line: part.line,
        message: `${tag} renders part="${part.name}", but its JSDoc has no @part ${part.name} line.`,
        hint: `Add "@part ${part.name} - …" to the JSDoc above @Component, saying what the part exposes.`,
      });
    }
    for (const part of source.dynamic.filter((d) => d.kind === 'part')) {
      findings.push({ line: part.line, skipped: true, message: `${tag} sets a part attribute with an expression.` });
    }
    return findings;
  },
};
