import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const articles = defineCollection({
  loader: glob({
    base: "..",
    pattern: ["*/README.md", "*/README.sk.md"],
    generateId: ({ entry }) => {
      const [dir, file] = entry.split("/");
      return file === "README.sk.md" ? `sk/${dir}` : `en/${dir}`;
    },
  }),
});

export const collections = { articles };
