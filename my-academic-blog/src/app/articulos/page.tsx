import Link from "next/link";
import { getAllPosts } from "@/lib/api";
import Container from "@/app/_components/container"; // Agregamos el contenedor para márgenes correctos

// Definimos la estructura del Post
type Post = {
  slug: string;
  title: string;
  date: string;
  author: { name: string; picture?: string };
  section: string;
  issue?: string;
  type?: string;
};

// Función auxiliar para agrupar artículos por "Número"
function groupPostsByIssue(posts: Post[]) {
  const groups: Record<string, Post[]> = {};
  
  posts.forEach((post) => {
    // Si el artículo no tiene número, lo ponemos en "En Edición"
    const issueName = post.issue || "Artículos en Edición / Publicación Continua";
    
    if (!groups[issueName]) {
      groups[issueName] = [];
    }
    groups[issueName].push(post);
  });

  // Convertimos el objeto en un array ordenado (Los números más recientes arriba)
  return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
}

export default function ArticulosPage() {
  // 1. Obtenemos todos los datos necesarios
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

  // 2. Ejecutamos el agrupamiento
  const issues = groupPostsByIssue(posts as unknown as Post[]);

  return (
    <main className="pt-24 pb-20">
      <Container>
        {/* HEADER DE LA SECCIÓN */}
        <header className="space-y-6 border-b border-zinc-200 pb-12 mb-16">
            <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter text-zinc-900 leading-none">
                Archivo Histórico
            </h1>
            <p className="text-xl text-zinc-500 max-w-2xl leading-relaxed font-light">
                Colección completa de las publicaciones de <i>Cuadernos Abiertos</i>, 
                organizada cronológicamente por volumen y número semestral.
            </p>
        </header>

        {/* LISTA DE NÚMEROS (VOLÚMENES) */}
        <div className="space-y-24">
            {issues.map(([issueName, issuePosts]) => (
            <div key={issueName} className="relative">
                
                {/* CABECERA DEL NÚMERO (Portada Virtual) */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="w-2 h-2 bg-zinc-900 rounded-full"></span>
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                                Número Publicado
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-zinc-900">
                            {issueName}
                        </h2>
                    </div>
                    
                    <div className="text-right">
                        <span className="text-zinc-400 font-mono text-sm">
                            {issuePosts.length} documentos indexados
                        </span>
                    </div>
                </div>

                {/* TABLA DE CONTENIDOS DEL NÚMERO */}
                <div className="grid gap-px bg-zinc-200 border border-zinc-200 rounded-lg overflow-hidden">
                {issuePosts.map((p) => (
                    <article key={p.slug} className="group relative bg-white p-6 hover:bg-zinc-50 transition-all duration-300">
                    
                        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-2">
                            {/* Sección y Fecha */}
                            <div className="flex items-center gap-3 text-xs uppercase tracking-wider font-bold">
                                {p.section && (
                                    <span className="text-blue-700">
                                        {p.section}
                                    </span>
                                )}
                                <span className="text-zinc-300">•</span>
                                <time className="text-zinc-400 font-mono">
                                    {new Date(p.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' })}
                                </time>
                            </div>

                            {/* Tipo */}
                            {p.type && (
                                <span className="hidden md:inline-block text-[10px] text-zinc-400 border border-zinc-200 px-2 py-0.5 rounded uppercase">
                                    {p.type}
                                </span>
                            )}
                        </div>

                        {/* Título y Enlace (CORREGIDO) */}
                        <h3 className="text-xl font-bold text-zinc-900 mb-2 group-hover:text-blue-800 group-hover:underline decoration-2 underline-offset-4 transition-colors">
                            <Link href={`/articulos/${p.slug}`}>
                                <span className="absolute inset-0" />
                                {p.title}
                            </Link>
                        </h3>

                        {/* Autor */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-zinc-600 font-serif italic">
                                Por: {p.author?.name || "Autor Institucional"}
                            </span>
                        </div>

                    </article>
                ))}
                </div>
            </div>
            ))}
        </div>

        {issues.length === 0 && (
            <div className="text-center py-32 bg-zinc-50 rounded-2xl border border-dashed border-zinc-300">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-bold text-zinc-900">Archivo en Construcción</h3>
                <p className="text-zinc-500 mt-2">Estamos digitalizando los números anteriores.</p>
            </div>
        )}

      </Container>
    </main>
  );
}