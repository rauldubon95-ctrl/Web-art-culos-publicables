import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts } from "@/lib/api";

type PostMini = {
  slug: string;
  title?: string;
  excerpt?: string;
  section?: string;
  type?: string;
  date?: string;
};

type Props = {
  params: { section: string };
};

export default function SeccionDetallePage({ params }: Props) {
  const sectionName = decodeURIComponent(params.section);

  const posts = getAllPosts([
    "slug",
    "title",
    "excerpt",
    "section",
    "type",
    "date",
  ]) as PostMini[];

  const filtered = posts
    .filter((p) => (p.section || "Sin sección").trim() === sectionName)
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));

  if (filtered.length === 0) return notFound();

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{sectionName}</h1>
        <p className="text-zinc-600">
          {filtered.length} {filtered.length === 1 ? "publicación" : "publicaciones"} en esta sección.
        </p>
      </header>

      <div className="space-y-4">
        {filtered.map((p) => (
          <Link
            key={p.slug}
            href={`/posts/${p.slug}`}
            className="block rounded-2xl border p-5 hover:bg-zinc-50 transition-colors"
          >
            <div className="flex items-center gap-2 flex-wrap">
              {p.type ? (
                <span className="text-xs rounded-full border px-2 py-1 text-zinc-600">
                  {p.type}
                </span>
              ) : null}
              {p.date ? (
                <span className="text-xs text-zinc-500">{p.date}</span>
              ) : null}
            </div>

            <h2 className="mt-2 font-semibold">{p.title || p.slug}</h2>

            {p.excerpt ? (
              <p className="mt-2 text-sm text-zinc-700">{p.excerpt}</p>
            ) : null}
          </Link>
        ))}
      </div>
    </section>
  );
}

export async function generateStaticParams() {
  const posts = getAllPosts(["section"]) as { section?: string }[];
  const uniq = new Set((posts.map((p) => (p.section || "Sin sección").trim())));
  return Array.from(uniq).map((s) => ({ section: encodeURIComponent(s) }));
}
