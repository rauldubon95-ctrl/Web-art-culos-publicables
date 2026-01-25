import Link from "next/link";
import { getAllPosts } from "@/lib/api";
import { auth, signIn, signOut } from "@/auth";

export const dynamic = "force-dynamic";

// Función auxiliar para agrupar
function groupBy<T extends Record<string, any>>(items: T[], key: string) {
  const out: Record<string, T[]> = {};
  for (const it of items) {
    const k = (it?.[key] ?? "Artículos Generales") as string;
    out[k] = out[k] ?? [];
    out[k].push(it);
  }
  return out;
}

export default async function HomePage() {
  const session = await auth();
  
  // CORRECCIÓN AQUÍ: Pedimos explícitamente 'type' y 'section'
  const posts = getAllPosts([
    "title",
    "date",
    "slug",
    "author",
    "coverImage",
    "excerpt",
    "type",    // <--- Necesario para el filtro editorial
    "section"  // <--- Necesario para el agrupamiento
  ]);

  // 1. Separar la Editorial
  // Ahora TypeScript no dará error porque 'type' ya existe en la interfaz Post
  const editorial = posts.find((p) => p.type === "editorial") || posts[0];
  
  // 2. El resto son artículos de investigación
  const articulos = posts.filter((p) => p.slug !== editorial.slug);
  
  // 3. Agrupar por Sección Temática
  const porSeccion = groupBy(articulos, "section");

  const numeroActual = "Vol. 1, No. 1 (Enero - Junio 2026)";

  return (
    <div className="grid lg:grid-cols-12 gap-12 font-serif text-zinc-900">
      
      {/* COLUMNA IZQUIERDA: CONTENIDO PRINCIPAL (Ancho 8) */}
      <div className="lg:col-span-8 space-y-12">
        
        {/* A. ENCABEZADO DEL NÚMERO */}
        <header className="border-b-4 border-zinc-900 pb-6">
          <div className="flex justify-between items-end mb-4">
             <span className="font-sans text-xs font-bold uppercase tracking-widest text-zinc-500">
               Edición Actual
             </span>
             <span className="font-sans text-xs font-bold bg-zinc-100 px-3 py-1 rounded text-zinc-600">
               {numeroActual}
             </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tight leading-tight mb-4">
            {editorial?.title || "Bienvenidos a Cuadernos Abiertos"}
          </h1>
          <div className="text-lg text-zinc-600 leading-relaxed font-sans">
             {editorial?.excerpt}
          </div>
          {editorial && (
             <div className="mt-6">
               <Link href={`/posts/${editorial.slug}`} className="inline-block bg-zinc-900 text-white font-sans text-sm font-bold px-6 py-3 hover:bg-zinc-700 transition">
                 Leer Editorial Completa →
               </Link>
             </div>
          )}
        </header>

        {/* B. SECCIÓN: ICONOS INSTITUCIONALES */}
        <section className="grid md:grid-cols-3 gap-4 font-sans">
            <Link href="/directrices" className="group bg-zinc-50 hover:bg-zinc-900 border border-zinc-200 p-6 rounded-xl transition-all duration-300 flex flex-col items-center text-center">
                <div className="mb-3 text-zinc-900 group-hover:text-white transition-colors">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </div>
                <h3 className="font-bold text-sm text-zinc-900 group-hover:text-white mb-1">Para Autores</h3>
                <p className="text-xs text-zinc-500 group-hover:text-zinc-400 leading-snug">Normas de envío.</p>
            </Link>

            <Link href="/politica" className="group bg-zinc-50 hover:bg-zinc-900 border border-zinc-200 p-6 rounded-xl transition-all duration-300 flex flex-col items-center text-center">
                <div className="mb-3 text-zinc-900 group-hover:text-white transition-colors">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                </div>
                <h3 className="font-bold text-sm text-zinc-900 group-hover:text-white mb-1">Política Editorial</h3>
                <p className="text-xs text-zinc-500 group-hover:text-zinc-400 leading-snug">Ética y Acceso.</p>
            </Link>

            <Link href="/reglamento" className="group bg-zinc-50 hover:bg-zinc-900 border border-zinc-200 p-6 rounded-xl transition-all duration-300 flex flex-col items-center text-center">
                <div className="mb-3 text-zinc-900 group-hover:text-white transition-colors">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <h3 className="font-bold text-sm text-zinc-900 group-hover:text-white mb-1">Reglamento</h3>
                <p className="text-xs text-zinc-500 group-hover:text-zinc-400 leading-snug">Procesos internos.</p>
            </Link>
        </section>

        {/* C. SUMARIO DE INVESTIGACIÓN */}
        <section>
          <h3 className="font-sans text-sm font-bold uppercase tracking-widest text-zinc-400 mb-8 border-b border-zinc-100 pb-2">
            Sumario de Investigación
          </h3>
          
          <div className="space-y-10">
            {Object.entries(porSeccion).map(([seccion, items]) => (
              <div key={seccion}>
                <h4 className="font-bold text-xl text-zinc-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                  {seccion}
                </h4>
                <div className="grid gap-6">
                  {items.map((post) => (
                    <article key={post.slug} className="group relative pl-4 border-l border-zinc-200 hover:border-purple-400 transition-colors">
                      <h5 className="text-lg font-bold group-hover:text-purple-700 transition-colors">
                        <Link href={`/posts/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h5>
                      <div className="mt-1 font-sans text-sm text-zinc-500 flex gap-2">
                        <span className="font-semibold text-zinc-700">{post.author.name}</span>
                        <span>•</span>
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* COLUMNA DERECHA: SIDEBAR */}
      <aside className="lg:col-span-4 space-y-8 font-sans">
        
        {/* CAJA DE USUARIO */}
        <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200">
          <h4 className="font-bold text-sm uppercase tracking-wide text-zinc-500 mb-3">Panel de Usuario</h4>
          {session?.user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                 {session.user.image && (
                   <img src={session.user.image} alt="User" className="w-8 h-8 rounded-full" />
                 )}
                 <div>
                   <p className="text-sm font-bold text-zinc-900">{session.user.name}</p>
                   <p className="text-xs text-zinc-500 truncate max-w-[150px]">{session.user.email}</p>
                 </div>
              </div>
              <Link href="/envios/panel" className="block w-full text-center bg-purple-600 text-white text-sm font-bold py-2 rounded hover:bg-purple-700">
                  Ir al Panel Editorial
              </Link>
              <form action={async () => { "use server"; await signOut(); }}>
                <button className="w-full text-center text-xs text-red-500 hover:underline mt-2">Cerrar Sesión</button>
              </form>
            </div>
          ) : (
            <div className="space-y-3">
               <p className="text-sm text-zinc-600">Inicia sesión para enviar artículos o gestionar revisiones.</p>
               <form action={async () => { "use server"; await signIn("google"); }}>
                 <button className="w-full bg-zinc-900 text-white text-sm font-bold py-2 rounded hover:bg-zinc-700 flex items-center justify-center gap-2">
                   <span>Entrar con Google</span>
                 </button>
               </form>
            </div>
          )}
        </div>

        {/* LLAMADOS A LA ACCIÓN */}
        <div className="space-y-4">
           <Link href="/envios" className="block p-6 bg-blue-50 border border-blue-100 rounded-xl hover:shadow-md transition group">
              <h5 className="font-bold text-blue-900 mb-1 group-hover:underline">Convocatoria Abierta →</h5>
              <p className="text-sm text-blue-800">
                Estamos recibiendo manuscritos para el Vol. 1, No. 2. Consulta las normas de publicación.
              </p>
           </Link>
           
           <div className="p-6 border border-zinc-200 rounded-xl">
              <h5 className="font-bold text-zinc-900 mb-2">Sobre la Revista</h5>
              <p className="text-sm text-zinc-600 mb-4">
                Cuadernos Abiertos es una publicación semestral arbitrada por pares ciegos.
              </p>
              <Link href="/equipo-editorial" className="text-sm font-bold text-zinc-900 underline">
                Ver Equipo Editorial
              </Link>
           </div>
        </div>

      </aside>
    </div>
  );
}