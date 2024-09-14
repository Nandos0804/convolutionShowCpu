// vite.config.js
import { defineConfig } from "vite";
import dns from "node:dns";

dns.setDefaultResultOrder("verbatim");

export default defineConfig({
  assetsInclude: ["**/*.wav", "**/*.csd"],
});
