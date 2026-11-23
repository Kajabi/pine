/**
 * The shape of `dist/docs-content.json`: Pine's component docs and guides, parsed from the MDX pages
 * Storybook shows, for tools and AI agents that read the docs as data.
 */
export interface DocsContent {
  /** Bumped when a field is removed or changes meaning. Adding a field doesn't bump it. */
  schemaVersion: 1;
  /** The `@pine-ds/core` version this file ships in. */
  version: string;
  /** Full SHA of the commit the file was built from, or null when git wasn't available. */
  commit: string | null;
  /** Every component tag, sorted by tag. */
  components: DocsContentComponent[];
  /** One entry per Storybook MDX page, sorted by `file`. */
  docs: DocsContentDoc[];
}

export interface DocsContentComponent {
  /** The component's tag, as in `components[].tag` of `docs.json`. `pds-icon` is in the `docs.json` of `@pine-ds/icons`. */
  tag: string;
  /** Tag of the component whose folder holds this one (`pds-modal-header` → `pds-modal`), or null for a top-level component. */
  parent: string | null;
  /** `storybookId` of the page that documents the tag: its own page, or else its parent's. */
  doc: string | null;
}

export interface DocsContentDoc {
  kind: 'component' | 'guide';
  /** The tag a component page documents. Null for guides. */
  tag: string | null;
  /** The tag's parent, as in `components`. Null for guides and top-level components. */
  parent: string | null;
  /** The page's h1, as plain text with inline code kept in backticks. */
  title: string;
  /** Storybook's id for the page, such as `components-modal--docs`. Unique within the file. */
  storybookId: string;
  /** The page's path in the Storybook sidebar, such as `components/Modal`. */
  storybookTitle: string;
  /** Path of the MDX file in the Pine repository. */
  file: string;
  /** Lifecycle status the page's status badge shows. Null for guides. */
  status: 'stable' | 'beta' | 'deprecated' | null;
  /** The note the status badge shows next to the status, if any. */
  statusNote: string | null;
  /** Markdown of the first paragraph under the h1, or null when the page has none there. */
  summary: string | null;
  /** The page's content before its first h2, other than the h1 itself; the summary included. Same rules as `DocsContentSection.markdown`. */
  markdown: string;
  /** Examples in that content. Their `sectionSlug` is null. */
  examples: DocsContentExample[];
  /** Embedded blocks in that content. */
  embeds: DocsContentEmbed[];
  /** The page's h2 sections in page order, each with its subsections in `children`. */
  sections: DocsContentSection[];
}

export interface DocsContentSection {
  /** 2 to 6. A page's second h1, if it has one, is a section with level 1. */
  level: 1 | 2 | 3 | 4 | 5 | 6;
  /** The heading as plain text with inline code kept in backticks. Not escaped markdown. */
  heading: string;
  /** The anchor Storybook gives this heading. Unique within the page, so `#slug` links resolve to it. */
  slug: string;
  /** Set on the sections readers ask for by name; null on the rest. */
  role: 'guidelines' | 'when-to-use' | 'when-not-to-use' | 'accessibility' | 'properties' | 'examples' | null;
  /**
   * The section's own content, without its heading line and without its subsections.
   *
   * - Each example in `examples` stands on its own line as `<!-- example:N -->`, where N is its index.
   * - Fenced code stays in place, with its language.
   * - A link to `#slug` points at a heading on the same page. A link to `pine-doc:<storybookId>` or
   *   `pine-doc:<storybookId>#slug` points at another page in this file. Any other link is an absolute URL.
   */
  markdown: string;
  examples: DocsContentExample[];
  /** Blocks Storybook renders from data outside the page, in page order. */
  embeds: DocsContentEmbed[];
  children: DocsContentSection[];
}

export interface DocsContentExample {
  /** Slug of the section the example sits in, or null when it sits between the h1 and the first h2. */
  sectionSlug: string | null;
  /** The heading of that section, or the page title. */
  title: string;
  /** Markdown between the start of the section (or the previous example) and this example. It is also in the section's `markdown`. */
  prose: string;
  /** The web component code shown with the example, or null when the page gives none. */
  webComponent: string | null;
  /** The React code shown with the example, or null when the page gives none. */
  react: string | null;
}

/** A block Storybook renders from data outside the page. */
export type DocsContentEmbed =
  /** The props, events, methods, slots and parts of `tag`, which `docs.json` holds. */
  | { type: 'props'; tag: string | null }
  /** A live Storybook story. */
  | { type: 'story'; storyId: string }
  /** A table of design tokens. */
  | { type: 'tokens'; tier: string | null; category: string | null; use?: string }
  /** The changelog. */
  | { type: 'changelog' }
  /** The catalog of layout patterns. */
  | { type: 'patterns' };
