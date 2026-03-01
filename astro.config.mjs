// @ts-check
import { defineConfig } from 'astro/config';
import aws from "astro-sst";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  output: "server",
  redirects: {
    '/': '/reports'
  },
  adapter: aws(),
  vite: {
    // @ts-expect-error - Type mismatch between Astro's Vite and Tailwind's Vite
    plugins: [tailwindcss()]
  }
});