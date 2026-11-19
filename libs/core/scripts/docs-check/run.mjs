// Exit codes: 0 no findings, 1 findings, 2 the check itself failed.
// Modules load inside the try so that a broken import exits 2, not 1.
try {
  const { loadDocsCheck } = await import('./load.mjs');
  const { checkSnippets, formatReport } = await import('./check.mjs');
  const { context, snippets, pages } = loadDocsCheck();
  const result = checkSnippets(snippets, context);
  process.stdout.write(formatReport(result, pages));
  process.exitCode = result.findings.length > 0 ? 1 : 0;
} catch (error) {
  console.error(`docs-check: the check failed before it could finish.\n${error?.stack ?? error}`);
  process.exitCode = 2;
}
