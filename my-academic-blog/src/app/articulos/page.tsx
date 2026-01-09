import Link from "next/link";
import { getAllPosts } from "@/lib/api";

export default function ArticulosPage() {
  // Campos mínimos típicos del starter
  const posts = getAllPosts([
    "title",
    "date",
    "slug",
    "excerpt",
    "author",
    "section",
    "type",
    "issue",
  ]);

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Artículos</h1>
        <p className="text-zinc-600 max-w-2xl">
          Listado general de publicaciones de <span className="font-medium">Cuadernos Abiertos</span>.
          (En el siguiente paso: filtros por sección y tipo).
        </p>
      </header>

      <div className="grid gap-4">
        {posts.map((p: any) => (
          <article key={p.slug} className="rounded-xl border p-5 hover:shadow-sm transition">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="text-xl font-semibold leading-snug">
                <Link className="hover:underline" href={`/posts/${p.slug}`}>
                  {p.title}
                </Link>
              </h2>
              {p.date ? <div className="text-sm text-zinc-500">{p.date}</div> : null}
            </div>

            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {p.section ? <span className="rounded-full border px-2 py-1 text-zinc-700">{p.section}</span> : null}
              {p.type ? <span className="rounded-full border px-2 py-1 text-zinc-700">{p.type}</span> : null}
              {p.issue ? <span className="rounded-full border px-2 py-1 text-zinc-700">{p.issue}</span> : null}
            </div>

            {p.excerpt ? <p className="mt-3 text-zinc-700">{p.excerpt}</p> : null}

            <div className="mt-3 text-sm text-zinc-500">
              {p.author?.name ? <>Autor/a: <span className="font-medium">{p.author.name}</span></> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
