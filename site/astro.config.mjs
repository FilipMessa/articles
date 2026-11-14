import { mkdirSync, writeFileSync } from "node:fs";
import { defineConfig } from "astro/config";
import rehypeMermaid from "rehype-mermaid";
import { codeThemeDark, codeThemeLight } from "./src/code-theme.mjs";
import { parseStateDiagram, stateDiagramSvg } from "./src/state-diagram.mjs";

// Mermaid measures labels in its own headless page; give it the site font so labels fit.
const fontDir = new URL("./node_modules/@fontsource-variable/instrument-sans/files/", import.meta.url);
const monoFile = new URL("./node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2", import.meta.url);
const fontCss = new URL("./node_modules/.cache/diagram-fonts.css", import.meta.url);
const latinExt =
  "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF";
const face = (file, range) =>
  `@font-face{font-family:"Instrument Sans Variable";font-weight:400 700;font-stretch:75% 100%;src:url("${new URL(file, fontDir)}") format("woff2-variations");${range ? `unicode-range:${range};` : ""}}`;
mkdirSync(new URL("./node_modules/.cache/", import.meta.url), { recursive: true });
writeFileSync(
  fontCss,
  face("instrument-sans-latin-wdth-normal.woff2") +
    face("instrument-sans-latin-ext-wdth-normal.woff2", latinExt) +
    `@font-face{font-family:"JetBrains Mono Variable";font-weight:100 800;src:url("${monoFile}") format("woff2-variations");}` +
    'body{font-family:"Instrument Sans Variable",sans-serif}',
);

// Wraps each rendered diagram in a figure so small screens can scroll it.
function rehypeWrapDiagrams() {
  return (tree) => {
    const visit = (node) => {
      if (!node.children) return;
      node.children = node.children.map((child) => {
        if (child.type === "element" && child.tagName === "svg" && String(child.properties?.id ?? "").startsWith("mermaid")) {
          // Mermaid's natural size reads small next to 19px body text; draw diagrams a fifth larger.
          child.properties.style = String(child.properties.style ?? "").replace(
            /max-width:\s*([\d.]+)px/,
            (_, px) => `max-width: ${Math.round(Number(px) * 1.2)}px`,
          );
          return { type: "element", tagName: "figure", properties: { className: ["diagram"] }, children: [child] };
        }
        visit(child);
        return child;
      });
    };
    visit(tree);
  };
}

// Replaces the deletion state machine's Mermaid block with the hand-drawn version.
function rehypeStateDiagrams() {
  const text = (node) => (node.type === "text" ? node.value : (node.children ?? []).map(text).join(""));
  return (tree, file) => {
    const sk = String(file.path ?? "").endsWith(".sk.md");
    const visit = (node) => {
      if (!node.children) return;
      node.children = node.children.map((child) => {
        const code = child.tagName === "pre" ? child.children?.find((c) => c.tagName === "code") : null;
        const isMermaid = code && String(code.properties?.className ?? "").includes("language-mermaid");
        const labels = isMermaid ? parseStateDiagram(text(code)) : null;
        if (labels) {
          const title = sk
            ? "Stavový diagram: idle, confirming, deleting a failed"
            : "State diagram: idle, confirming, deleting and failed";
          return {
            type: "element",
            tagName: "figure",
            properties: { className: ["diagram", "diagram--drawn"] },
            children: [{ type: "raw", value: stateDiagramSvg(labels, title) }],
          };
        }
        visit(child);
        return child;
      });
    };
    visit(tree);
  };
}

// The article READMEs start with a link to the other language and an H1.
// The site renders both itself, so they are dropped from the body.
function remarkStripReadmeChrome() {
  return (tree) => {
    tree.children = tree.children.filter((node, index) => {
      if (index > 3) return true;
      if (node.type === "heading" && node.depth === 1) return false;
      if (
        node.type === "blockquote" &&
        JSON.stringify(node).includes("README")
      )
        return false;
      return true;
    });
  };
}

export default defineConfig({
  site: "https://filipmessa.github.io",
  base: "/articles",
  trailingSlash: "always",
  markdown: {
    remarkPlugins: [remarkStripReadmeChrome],
    rehypePlugins: [
      rehypeStateDiagrams,
      [
        rehypeMermaid,
        {
          strategy: "inline-svg",
          css: fontCss,
          mermaidConfig: {
            theme: "base",
            look: "classic",
            fontFamily: "Instrument Sans Variable, sans-serif",
            themeVariables: {
              fontFamily: "Instrument Sans Variable, sans-serif",
              fontSize: "17px",
              primaryColor: "#ffffff",
              primaryBorderColor: "#0a0a0a",
              primaryTextColor: "#0a0a0a",
              lineColor: "#0a0a0a",
              secondaryColor: "#ffffff",
              tertiaryColor: "#ffffff",
              edgeLabelBackground: "#ebebeb",
            },
            flowchart: { curve: "linear", padding: 16 },
            themeCSS: ".edgeLabel, .edgeLabel * { font-size: 14px !important; }",
          },
        },
      ],
      rehypeWrapDiagrams,
    ],
    syntaxHighlight: { type: "shiki", excludeLangs: ["mermaid"] },
    shikiConfig: { themes: { light: codeThemeLight, dark: codeThemeDark }, defaultColor: false, wrap: false },
  },
});
