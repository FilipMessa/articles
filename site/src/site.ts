import { getCollection, type CollectionEntry } from "astro:content";

export type Lang = "en" | "sk";

export const author = "Filip Mešša";
export const githubUrl = "https://github.com/FilipMessa";

export const ui = {
  en: {
    htmlLang: "en",
    articles: "Articles",
    about: "About",
    otherLang: "Slovensky",
    otherLangShort: "SK",
    intro:
      "I write about how I divide code and decide where each part belongs. When designing code, I ask how much I will need to understand when the requirements change.",
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
  },
  sk: {
    htmlLang: "sk",
    articles: "Články",
    about: "O mne",
    otherLang: "English",
    otherLangShort: "EN",
    intro:
      "Píšem o tom, ako rozdeľujem kód a podľa čoho sa rozhodujem, kde má ktorá časť patriť. Pri návrhu sa pýtam, koľko toho budem musieť pochopiť, keď sa zadanie zmení.",
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
  },
} as const;

// Newest first. The repo carries no per-article dates, so these come from its first commit.
const meta: Record<string, { date: string; description: Record<Lang, string> }> = {
  "when-extracting-a-function-makes-sense": {
    date: "2026-11-14",
    description: {
      en: "What a small function hides, and where it belongs.",
      sk: "Čo malá funkcia skrýva a kam patrí.",
    },
  },
  "how-i-think-about-good-code-architecture": {
    date: "2026-11-14",
    description: {
      en: "One requirement, two designs, and the question I judge both by.",
      sk: "Jedna požiadavka, dva návrhy a otázka, podľa ktorej ich posudzujem.",
    },
  },
};
const order = ["how-i-think-about-good-code-architecture", "when-extracting-a-function-makes-sense"];

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
