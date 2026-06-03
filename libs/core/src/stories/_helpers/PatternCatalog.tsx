import React from 'react';
import { DocCanvas } from '@pine-ds/doc-components';

import mcpPatterns from '../resources/mcp-patterns.json';
import { PatternPreview } from './PatternPreview';

interface McpPattern {
  id: string;
  name: string;
  category: string;
  description: string;
  when: string;
  code: string;
  notes: string[];
}

/**
 * Storybook catalog for admin composition patterns (mcp-patterns.json).
 */
export const PatternCatalog: React.FC = () => {
  const patterns = mcpPatterns.patterns as McpPattern[];

  return (
    <>
      {patterns.map((pattern) => (
        <section key={pattern.id} style={{ marginBlockEnd: 'var(--pine-dimension-3xl)' }}>
          <h2 id={pattern.id}>{pattern.name}</h2>
          <p>
            <strong>When:</strong> {pattern.when}
          </p>
          <p>{pattern.description}</p>
          <DocCanvas
            display="block"
            mdxSource={{
              webComponent: pattern.code,
            }}
          >
            <PatternPreview html={pattern.code} />
          </DocCanvas>
          {pattern.notes.length > 0 && (
            <>
              <h3>Notes</h3>
              <ul>
                {pattern.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </>
          )}
        </section>
      ))}
    </>
  );
};
