import { getCollection, type CollectionEntry } from "astro:content";

export type Lang = "en" | "sk";

export const author = "Filip Mešša";
export const githubUrl = "https://github.com/FilipMessa";
export const linkedinUrl = "https://www.linkedin.com/in/filipmessa";
export const contactEmail = "messa.filip@gmail.com";

// GoatCounter site code: the part before ".goatcounter.com". Leave empty to disable analytics.
export const goatcounterCode = "filipmessa";

export const ui = {
  en: {
    htmlLang: "en",
    articles: "Articles",
    about: "About",
    otherLang: "Slovensky",
    otherLangShort: "SK",
    intro: "I build software. I write about the code, tools and decisions behind it.",
    description:
      "Essays by Filip Mešša on code architecture, TypeScript, React and working with AI tools: how I decide where to draw boundaries so a change needs only the code it touches.",
    minRead: (n: number) => `${n} min read`,
    contents: "Contents",
    nextArticle: "Next article",
    previousArticle: "Previous article",
    rss: "RSS feed",
    elsewhere: "Links",
    readArticles: "Read the articles",
    aboutStatement: "I write about code that is easy to change.",
    aboutIntro:
      "I’m Filip Mešša. I’ve spent more than ten years building web products, mostly on the frontend. I’ve worked on George at Erste Digital, products at Kiwi.com, and transcription software at Parrot.\n\nI work mostly with TypeScript and React. I also use Claude Code and Codex every day.\n\nI write about the decisions I make while building software. I’m interested in when splitting code helps and when it adds more work than it saves. I try to explain my thinking through examples.",
    question: "Is the context this change requires proportionate to what we’re changing?",
    questionSource: "The question behind",
    dateLocale: "en-US",
    privacy: "Privacy",
  },
  sk: {
    htmlLang: "sk",
    articles: "Články",
    about: "O mne",
    otherLang: "English",
    otherLangShort: "EN",
    intro: "Vyvíjam softvér. Píšem o kóde, nástrojoch a rozhodnutiach, ktoré za ním stoja.",
    description:
      "Texty Filipa Meššu o architektúre kódu, TypeScripte, Reacte a práci s AI nástrojmi: ako rozhodujem, kde viesť hranice, aby zmena potrebovala len kód, ktorého sa týka.",
    minRead: (n: number) => `${n} min čítania`,
    contents: "Obsah",
    nextArticle: "Ďalší článok",
    previousArticle: "Predchádzajúci článok",
    rss: "RSS kanál",
    elsewhere: "Odkazy",
    readArticles: "Čítať články",
    aboutStatement: "Píšem o kóde, ktorý sa dá ľahko meniť.",
    aboutIntro:
      "Som Filip Mešša. Vyše desať rokov vyvíjam webové produkty, najviac vo frontende. Pracoval som na Georgeovi v Erste Digital, produktoch Kiwi.com aj softvéri na prepis nahrávok v Parrote.\n\nNajčastejšie používam TypeScript a React. Pri práci denne používam aj Claude Code a Codex.\n\nNa tomto webe píšem o rozhodnutiach, ktoré pri vývoji robím. Zaujíma ma, kedy rozdelenie kódu pomôže a kedy pridá viac práce, než ušetrí. Svoje úvahy skúšam vysvetliť na príkladoch.",
    question: "Je kontext potrebný na túto zmenu primeraný tomu, čo meníme?",
    questionSource: "Otázka, na ktorej stojí článok",
    dateLocale: "sk-SK",
    privacy: "Súkromie",
  },
} as const;

// Newest first. The repo carries no per-article dates, so these come from its first commit.
const meta: Record<string, { date: string; description: Record<Lang, string> }> = {
  "shopping-list": {
    date: "2026-11-26",
    description: {
      en: "I built a shared shopping list in an afternoon. It took months of buying milk to work out what it should remember.",
      sk: "Spoločný nákupný zoznam som postavil za popoludnie. Až pri ďalších nákupoch som zistil, čo si má pamätať.",
    },
  },
  "claude-code-statusline": {
    date: "2026-11-15",
    description: {
      en: "A custom status line for Claude Code, with a skill to install and adjust it.",
      sk: "Vlastný statusline pre Claude Code a skill na jeho inštaláciu a úpravy.",
    },
  },
  "when-extracting-a-function-makes-sense": {
    date: "2026-11-14",
    description: {
      en: "What a small function hides, and where it belongs.",
      sk: "Čo malá funkcia skrýva a kam patrí.",
    },
  },
  "how-i-think-about-good-code-architecture": {
    date: "2026-11-12",
    description: {
      en: "One requirement, two designs, and the question I judge both by.",
      sk: "Jedna požiadavka, dva návrhy a otázka, podľa ktorej ich posudzujem.",
    },
  },
};
const order = ["shopping-list", "how-i-think-about-good-code-architecture", "when-extracting-a-function-makes-sense", "claude-code-statusline"];

export type Article = {
  entry: CollectionEntry<"articles">;
  slug: string;
  lang: Lang;
  title: string;
  description: string;
  date: Date;
  minutes: number;
};

export function href(lang: Lang, path = "") {
  const base = `${import.meta.env.BASE_URL}${lang === "sk" ? "sk/" : ""}`;
  return path ? `${base}${path}/` : base;
}

export function aboutHref(lang: Lang) {
  return `${import.meta.env.BASE_URL}${lang === "sk" ? "sk/o-mne/" : "about/"}`;
}

export function privacyHref(lang: Lang) {
  return `${import.meta.env.BASE_URL}${lang === "sk" ? "sk/sukromie/" : "privacy/"}`;
}

export async function getArticles(lang: Lang): Promise<Article[]> {
  const entries = await getCollection("articles", (e) => e.id.startsWith(`${lang}/`));
  return entries
    .map((entry) => {
      const slug = entry.id.slice(3);
      const body = entry.body ?? "";
      const title = body.match(/^# (.+)$/m)?.[1] ?? slug;
      const words = body.replace(/```[\s\S]*?```/g, " ").split(/\s+/).length;
      const codeLines = (body.match(/```[\s\S]*?```/g) ?? []).join("\n").split("\n").length;
      return {
        entry,
        slug,
        lang,
        title,
        description: meta[slug]?.description[lang] ?? "",
        date: new Date(meta[slug]?.date ?? "2026-11-14"),
        minutes: Math.max(1, Math.round(words / 230 + codeLines / 60)),
      };
    })
    .sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug));
}

export function formatDate(date: Date, lang: Lang) {
  return date.toLocaleDateString(ui[lang].dateLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
