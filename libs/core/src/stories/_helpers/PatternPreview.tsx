import React, { useEffect, useRef } from 'react';

import mcpPatterns from '../resources/mcp-patterns.json';

/** Allowlisted markup strings from mcp-patterns.json (compile-time trusted content). */
const TRUSTED_PATTERN_HTML = new Set(
  mcpPatterns.patterns.map((pattern) => pattern.code),
);

export interface PatternPreviewProps {
  /** Web-component HTML from mcp-patterns.json */
  html: string;
}

/**
 * Mounts verified Pine web-component markup from mcp-patterns.json in Storybook.
 * Uses DOMParser + node import — not innerHTML — because html is static repo content.
 */
function mountPatternMarkup(container: HTMLElement, html: string): void {
  container.replaceChildren();
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const fragment = document.createDocumentFragment();
  Array.from(doc.body.childNodes).forEach((node) => {
    fragment.appendChild(document.importNode(node, true));
  });
  container.append(fragment);
}

export const PatternPreview: React.FC<PatternPreviewProps> = ({ html }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (container === null) {
      return;
    }
    if (!TRUSTED_PATTERN_HTML.has(html)) {
      return;
    }
    mountPatternMarkup(container, html);
  }, [html]);

  return <div ref={ref} />;
};
