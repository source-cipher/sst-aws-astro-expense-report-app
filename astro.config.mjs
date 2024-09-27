// @ts-check
import { defineConfig } from 'astro/config';
import aws from "astro-sst";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  output: "server",
  redirects: {
    '/': '/reports'
  },
  adapter: aws({
    serverRoutes: [
      "reports/add",
      "reports/*/expenses/add",
      "reports/*/expenses/*"
    ]
  }),
  integrations: [tailwind()]
});