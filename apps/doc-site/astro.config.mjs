import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  server: {
    port: 7000
  },
  integrations: [mdx(), react()]
});
