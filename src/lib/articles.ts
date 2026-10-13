import { getCollection } from 'astro:content';

export async function getArticles() {
  const articles = await getCollection('articles', ({ data }) => !data.draft);
  return articles.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function articleUrl(id: string) {
  return `/articles/${id.split('/').map(encodeURIComponent).join('/')}/`;
}

export function articleDate(date: Date) {
  return date.toISOString().slice(0, 10);
}
