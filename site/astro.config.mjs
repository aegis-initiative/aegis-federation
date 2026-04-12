import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { readSiteVersion } from '@aegis-initiative/design-system/build';

// Version is read from the committed VERSION file in this site
// directory. The Header component in @aegis-initiative/design-system
// reads `import.meta.env.AEGIS_VERSION`, which is populated here
// before Astro/Vite loads its env files.
process.env.AEGIS_VERSION = readSiteVersion();

export default defineConfig({
  site: 'https://aegis-federation.com',
  integrations: [mdx()],
});
