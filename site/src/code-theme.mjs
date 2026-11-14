// Monochrome code theme with a single accent for literals.
export const codeThemeDark = {
  name: "fm-mono-dark",
  type: "dark",
  colors: { "editor.background": "#111111", "editor.foreground": "#d6d6d6" },
  tokenColors: [
    { settings: { foreground: "#d6d6d6" } },
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "#8f8f8f", fontStyle: "" } },
    { scope: ["keyword", "storage", "storage.type", "storage.modifier", "keyword.operator.new", "keyword.control"], settings: { foreground: "#ffffff" } },
    { scope: ["keyword.operator", "punctuation", "meta.brace", "punctuation.definition.block"], settings: { foreground: "#8c8c8c" } },
    { scope: ["string", "string.template", "punctuation.definition.string", "constant.numeric", "constant.language", "constant.other", "support.constant"], settings: { foreground: "#d9f28b" } },
    { scope: ["entity.name.function", "support.function", "meta.function-call entity.name.function"], settings: { foreground: "#ffffff" } },
    { scope: ["entity.name.type", "support.type", "entity.other.inherited-class", "entity.name.type.alias"], settings: { foreground: "#ffffff", fontStyle: "" } },
    { scope: ["variable", "variable.other", "variable.parameter", "meta.object-literal.key", "support.type.property-name"], settings: { foreground: "#d6d6d6" } },
    { scope: ["entity.name.tag", "support.class.component"], settings: { foreground: "#ffffff" } },
    { scope: ["entity.other.attribute-name"], settings: { foreground: "#a8a8a8" } },
    { scope: ["punctuation.definition.template-expression", "punctuation.section.embedded"], settings: { foreground: "#8c8c8c" } },
  ],
};

export const codeThemeLight = {
  name: "fm-mono-light",
  type: "light",
  colors: { "editor.background": "#e2e2e2", "editor.foreground": "#0a0a0a" },
  tokenColors: [
    { settings: { foreground: "#0a0a0a" } },
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "#575757", fontStyle: "" } },
    { scope: ["keyword", "storage", "storage.type", "storage.modifier", "keyword.operator.new", "keyword.control"], settings: { foreground: "#000000" } },
    { scope: ["keyword.operator", "punctuation", "meta.brace", "punctuation.definition.block"], settings: { foreground: "#575757" } },
    { scope: ["string", "string.template", "punctuation.definition.string", "constant.numeric", "constant.language", "constant.other", "support.constant"], settings: { foreground: "#355a00" } },
    { scope: ["entity.name.function", "support.function", "meta.function-call entity.name.function"], settings: { foreground: "#000000" } },
    { scope: ["entity.name.type", "support.type", "entity.other.inherited-class", "entity.name.type.alias"], settings: { foreground: "#000000", fontStyle: "" } },
    { scope: ["variable", "variable.other", "variable.parameter", "meta.object-literal.key", "support.type.property-name"], settings: { foreground: "#0a0a0a" } },
    { scope: ["entity.name.tag", "support.class.component"], settings: { foreground: "#000000" } },
    { scope: ["entity.other.attribute-name"], settings: { foreground: "#4d4d4d" } },
    { scope: ["punctuation.definition.template-expression", "punctuation.section.embedded"], settings: { foreground: "#595959" } },
  ],
};
