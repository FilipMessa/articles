import { getArticles, href, type Lang } from "../site";

export async function GET() {
  const site = "https://filipmessa.github.io";
  const langs: Lang[] = ["en", "sk"];
  const paths = (await Promise.all(langs.map(async (lang) => [
    href(lang),
    ...(await getArticles(lang)).map((article) => href(lang, article.slug)),
  ]))).flat();
  const urls = paths.map((path) => `<url><loc>${new URL(path, site).href}</loc></url>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
