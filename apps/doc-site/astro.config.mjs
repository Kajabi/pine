import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  server: { port: 7000},
  // markdown: {
	// 	syntaxHighlight: 'shiki',
	// 	shikiConfig: {
	// 		theme: 'dracula',
	// 		// Learn more about this configuration here:
	// 		// https://docs.astro.build/en/guides/markdown-content/#syntax-highlighting
	// 	},
	// },
	markdown: {
    render: [
      '@astrojs/markdown-remark',
      {
        syntaxHighlight: 'shiki',
        shikiConfig: {
          theme: 'nord',
          langs: ['js', 'html', 'css', 'astro'],
          wrap: false,
        },
      },
    ],
  },
});
