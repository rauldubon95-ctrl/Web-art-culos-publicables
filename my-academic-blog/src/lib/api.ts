import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import { Post } from "@/interfaces/post";

const postsDirectory = join(process.cwd(), "_posts");

/**
 * Devuelve únicamente slugs válidos (.md) y archivos (no directorios).
 */
export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) return [];

  const entries = fs.readdirSync(postsDirectory, { withFileTypes: true });

  return entries
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .filter((name) => name.toLowerCase().endsWith(".md"))
    .map((name) => name.replace(/\.md$/i, ""));
}

/**
 * Lee un post por slug. Si no existe, devuelve null (no revienta el server).
 */
export function getPostBySlug(slug: string, fields: string[] = []): Post | null {
  const realSlug = slug.replace(/\.md$/i, "");

  const fullPath = join(postsDirectory, `${realSlug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const item: any = {};

  // Siempre incluimos slug + content si se piden.
  fields.forEach((field) => {
    if (field === "slug") item.slug = realSlug;
    if (field === "content") item.content = content;
    if (data[field] !== undefined) item[field] = data[field];
  });

  // Si no pidieron nada explícito, devolvemos todo lo común.
  if (fields.length === 0) {
    return {
      ...(data as any),
      slug: realSlug,
      content,
    } as Post;
  }

  return item as Post;
}

/**
 * Lista todos los posts, aplicando el mismo filtro seguro.
 */
export function getAllPosts(fields: string[] = []): Post[] {
  const slugs = getPostSlugs();

  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    .filter((p): p is Post => Boolean(p));

  // Orden descendente por fecha si existe
  posts.sort((a: any, b: any) => {
    const da = a?.date ? new Date(a.date).getTime() : 0;
    const db = b?.date ? new Date(b.date).getTime() : 0;
    return db - da;
  });

  return posts;
}
