import { author, getArticles, href, ui, type Lang } from "./site";

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function rss(lang: Lang) {
  const site = import.meta.env.SITE.replace(/\/$/, "");
  const articles = await getArticles(lang);
  const items = articles
    .map(
      (a) => `<item><title>${escape(a.title)}</title><link>${site}${href(lang, a.slug)}</link><guid>${site}${href(lang, a.slug)}</guid><pubDate>${a.date.toUTCString()}</pubDate><description>${escape(a.description)}</description></item>`,
    )
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escape(author)}</title><link>${site}${href(lang)}</link><description>${escape(ui[lang].description)}</description><language>${lang}</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
