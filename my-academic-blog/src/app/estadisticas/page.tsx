import Container from "@/app/_components/container";
import { prisma } from "@/lib/prisma";
import { getPostBySlug } from "@/lib/api";

export const dynamic = 'force-dynamic';

export default async function EstadisticasPage() {
  // 1. Obtener totales globales
  const totalViews = await prisma.postMetric.aggregate({ _sum: { views: true } });
  const totalDownloads = await prisma.postMetric.aggregate({ _sum: { downloads: true } });
  const totalCountries = await prisma.visitorCountry.count();

  // 2. Obtener desglose por países (Ranking geográfico)
  const countryDistribution = await prisma.visitorCountry.findMany({
    orderBy: { count: 'desc' },
    take: 10
  });

  // 3. Obtener los artículos más leídos (Ranking de impacto)
  const topMetrics = await prisma.postMetric.findMany({
    orderBy: { views: 'desc' },
    take: 8 // Listar los 8 más leídos
  });

  // Mapear los slugs a títulos reales usando la función de la API existente
  const rankedArticles = topMetrics.map((metric) => {
    try {
      const post = getPostBySlug(metric.slug);
      return { 
        title: post ? post.title : metric.slug, 
        views: metric.views,
        downloads: metric.downloads
      };
    } catch (e) {
      return null; // Si el artículo fue borrado pero la métrica existe
    }
  }).filter(Boolean);

  return (
    <main className="pt-20 pb-20 bg-white">
      <Container>
        {/* ENCABEZADO FORMAL */}
        <div className="mb-16 border-b border-zinc-200 pb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-zinc-900 mb-4">
            Métricas de Impacto y Transparencia
          </h1>
          <p className="text-zinc-600 max-w-3xl leading-relaxed text-justify">
            En cumplimiento con los estándares de ciencia abierta, <i>Cuadernos Abiertos</i> pone a disposición de la comunidad académica los datos de alcance y lectura de su producción científica. Los siguientes datos se actualizan en tiempo real.
          </p>
        </div>

        {/* TARJETAS DE DATOS DUROS (KPIs) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="p-6 bg-zinc-50 border-t-4 border-zinc-900">
            <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Lecturas Acumuladas</div>
            <div className="text-4xl font-serif text-zinc-900">
              {(totalViews._sum.views || 0).toLocaleString()}
            </div>
          </div>
          <div className="p-6 bg-zinc-50 border-t-4 border-zinc-900">
            <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Descargas de Archivos</div>
            <div className="text-4xl font-serif text-zinc-900">
              {(totalDownloads._sum.downloads || 0).toLocaleString()}
            </div>
          </div>
          <div className="p-6 bg-zinc-50 border-t-4 border-zinc-900">
            <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Cobertura Internacional</div>
            <div className="text-4xl font-serif text-zinc-900">
              {totalCountries} <span className="text-sm font-sans text-zinc-500 font-normal">Países / Regiones</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
            
            {/* COLUMNA 1: TABLA DE ARTÍCULOS MÁS LEÍDOS */}
            <div className="lg:col-span-2">
                <h3 className="text-lg font-bold text-zinc-900 mb-6 uppercase tracking-wider text-xs border-b border-zinc-200 pb-2">
                    Artículos de Mayor Impacto
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-zinc-500 uppercase bg-zinc-50">
                            <tr>
                                <th scope="col" className="px-4 py-3 font-medium">Título del Artículo</th>
                                <th scope="col" className="px-4 py-3 font-medium text-right">Lecturas</th>
                                <th scope="col" className="px-4 py-3 font-medium text-right">Descargas</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {rankedArticles.length > 0 ? rankedArticles.map((article: any, index: number) => (
                                <tr key={index} className="bg-white hover:bg-zinc-50 transition-colors">
                                    <td className="px-4 py-3 font-serif text-zinc-900 font-medium">
                                        {article.title}
                                    </td>
                                    <td className="px-4 py-3 text-zinc-600 text-right font-mono">
                                        {article.views.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-zinc-600 text-right font-mono">
                                        {article.downloads.toLocaleString()}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={3} className="px-4 py-8 text-center text-zinc-400 italic">
                                        No hay datos suficientes registrados aún.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* COLUMNA 2: DISTRIBUCIÓN GEOGRÁFICA */}
            <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-6 uppercase tracking-wider text-xs border-b border-zinc-200 pb-2">
                    Procedencia de Lectores
                </h3>
                <ul className="space-y-3">
                    {countryDistribution.length > 0 ? countryDistribution.map((c) => (
                        <li key={c.code} className="flex justify-between items-center text-sm">
                            <span className="text-zinc-700">Código: {c.code}</span>
                            <span className="font-mono text-zinc-500">{c.count.toLocaleString()}</span>
                        </li>
                    )) : (
                        <li className="text-zinc-400 text-sm italic">Esperando datos...</li>
                    )}
                </ul>
                <div className="mt-8 p-4 bg-zinc-50 text-xs text-zinc-500 leading-relaxed text-justify">
                    <strong>Nota metodológica:</strong> Los datos presentados corresponden a interacciones únicas filtradas por IP para evitar duplicidad masiva. El conteo de descargas refiere a accesos directos al archivo final.
                </div>
            </div>

        </div>
      </Container>
    </main>
  );
}
