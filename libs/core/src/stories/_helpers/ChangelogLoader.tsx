import React, { useEffect, useState } from 'react';
import { ChangelogRenderer } from './ChangelogRenderer';

/**
 * Component that loads and displays the changelog from the static directory
 * Tries to fetch from /CHANGELOG.md (served from staticDirs) or falls back to GitHub
 */
export const ChangelogLoader: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadChangelog = async () => {
      try {
        setLoading(true);
        // Try to fetch from static directory (configured in Storybook main.js)
        // The file should be accessible at /CHANGELOG.md when served from staticDirs
        const response = await fetch('/CHANGELOG.md', { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Failed to load changelog: ${response.statusText}`);
        }
        const text = await response.text();
        setContent(text);
        setError(null);
      } catch (err) {
        // Ignore AbortError when component unmounts
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        // If loading fails, show error with link to GitHub
        setError(err instanceof Error ? err.message : 'Failed to load changelog');
        console.error('Error loading changelog:', err);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadChangelog();

    return () => {
      controller.abort();
    };
  }, []);

  if (loading) {
    return <div>Loading changelog...</div>;
  }

  if (error !== null) {
    return (
      <div>
        <p>Unable to load changelog from local file. {error}</p>
        <p>
          <a href="https://github.com/Kajabi/pine/releases" target="_blank" rel="noopener noreferrer">
            View releases on GitHub
          </a>
        </p>
      </div>
    );
  }

  return <ChangelogRenderer changelogContent={content} />;
};

