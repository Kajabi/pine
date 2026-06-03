import React, { useEffect, useRef } from 'react';

export interface PatternPreviewProps {
  /** Web-component HTML from mcp-patterns.json */
  html: string;
}

/**
 * Renders verified Pine web-component markup from mcp-patterns.json in Storybook.
 * Source of truth for pattern recipes is libs/core/src/stories/resources/mcp-patterns.json.
 */
export const PatternPreview: React.FC<PatternPreviewProps> = ({ html }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = html;
    }
  }, [html]);

  return <div ref={ref} />;
};
