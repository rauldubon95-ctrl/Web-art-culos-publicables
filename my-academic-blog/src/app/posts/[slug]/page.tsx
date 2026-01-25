import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import Container from "@/app/_components/container";
import { PostBody } from "@/app/_components/post-body";
import { prisma } from "@/lib/prisma"; 
// ✅ NUEVO: Importamos el generador de PDF
import DownloadPDFButton from "@/app/_components/article-pdf"; 

export default async function Post(props: Params) {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || "");

  // ---------------------------------------------------------
  // 1. LÓGICA DE MÉTRICAS (Tu código original intacto)
  // ---------------------------------------------------------
  let metrics;
  try {
    metrics = await prisma.postMetric.upsert({
      where: { slug: params.slug },
      update: { views: { increment: 1 } },
      create: { slug: params.slug, views: 1, downloads: 0 },
    });
  } catch (error) {
    console.error("Error conectando a métricas:", error);
    metrics = { views: 0, downloads: 0 };
  }

  // ✅ PREPARAR DATOS PARA PDF: Unimos metadatos + contenido HTML procesado
  const postForPDF = { ...post, content: content };

  return (
    <main>
      <Container>
        
        <article className="mb-32 pt-10">
          
          {/* ENCABEZADO "SÚPER PRO" */}
          <div className="max-w-4xl mx-auto mb-12 border-b border-zinc-200 pb-10">
            
            {/* Categoría y Fecha */}
            <div className="flex items-center gap-4 mb-6">
                <span className="bg-zinc-900 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    Artículo Científico
                </span>
                <span className="text-zinc-500 font-mono text-sm">
                    {new Date(post.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
            </div>

            {/* Título */}
            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter leading-tight text-zinc-900 mb-8">
                {post.title}
            </h1>

            {/* BARRA DE ACCIONES (Autor + Métricas + PDF) */}
            <div className="flex flex-wrap items-center justify-between gap-6 bg-zinc-50 p-6 rounded-xl border border-zinc-100">
                
                {/* IZQUIERDA: Autor */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-200 overflow-hidden shadow-sm">
                         <img src={post.author.picture} alt={post.author.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Autoría</span>
                        <span className="font-bold text-zinc-900 text-sm">{post.author.name}</span>
                    </div>
                </div>

                {/* DERECHA: Métricas y Botón PDF */}
                <div className="flex items-center gap-6">
                    
                    {/* Lecturas */}
                    <div className="flex items-center gap-2" title="Lecturas">
                        <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        <span className="font-mono font-bold text-zinc-700">{metrics.views.toLocaleString()}</span>
                    </div>

                    {/* Descargas (Contador) */}
                    <div className="flex items-center gap-2" title="Descargas">
                        <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        <span className="font-mono font-bold text-zinc-700">{metrics.downloads.toLocaleString()}</span>
                    </div>

                    {/* ✅ NUEVO: Botón PDF Maquetado */}
                    <div className="border-l border-zinc-200 pl-6 ml-2">
                        <DownloadPDFButton post={postForPDF} />
                    </div>

                </div>
            </div>
          </div>

          <PostBody content={content} />
        </article>
      </Container>
    </main>
  );
}

// ... (El resto del archivo: type Params, generateMetadata, generateStaticParams sigue igual)
type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const title = `${post.title} | Cuadernos Abiertos`;

  const ogImages =
    post.ogImage?.url
      ? [post.ogImage.url]
      : post.coverImage
        ? [post.coverImage]
        : [];

  return {
    title,
    openGraph: {
      title,
      images: ogImages,
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}