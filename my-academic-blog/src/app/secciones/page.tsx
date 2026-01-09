import Link from "next/link";
import { getAllPosts } from "@/lib/api";

type PostMini = {
  slug: string;
  title?: string;
  section?: string;
  type?: string;
  date?: string;
};

export default function SeccionesPage() {
  const posts = getAllPosts([
    "slug",
    "title",
    "section",
    "type",
    "date",
  ]) as PostMini[];

  // agrupa por sección
  const bySection = new Map<string, PostMini[]>();
  for (const p of posts) {
    const s = (p.section || "Sin sección").trim();
    if (!bySection.has(s)) bySection.set(s, []);
    bySection.get(s)!.push(p);
  }

  const sections = Array.from(bySection.entries())
    .map(([name, items]) => ({
      name,
      count: items.length,
      latest: items
        .filter((x) => x.date)
        .sort((a, b) => String(b.date).localeCompare(String(a.date)))[0],
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Secciones</h1>
        <p className="text-zinc-600 max-w-3xl">
          Explorá el contenido por sección editorial. Cada sección agrupa artículos por campo temático.
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((s) => {
          const href = `/secciones/${encodeURIComponent(s.name)}`;
          return (
            <Link
              key={s.name}
              href={href}
              className="rounded-2xl border p-5 hover:bg-zinc-50 transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-semibold">{s.name}</h2>
                <span className="text-xs rounded-full border px-2 py-1 text-zinc-600">
                  {s.count} {s.count === 1 ? "ítem" : "ítems"}
                </span>
              </div>

              <div className="mt-3 text-sm text-zinc-700">
                {s.latest?.title ? (
                  <>
                    <span className="text-zinc-500">Último:</span>{" "}
                    <span className="font-medium">{s.latest.title}</span>
                  </>
                ) : (
                  <span className="text-zinc-500">Sin publicaciones con fecha.</span>
                )}
              </div>

              <div className="mt-2 text-xs text-zinc-500">
                Abrir sección →
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
