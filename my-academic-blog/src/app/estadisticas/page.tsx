import Container from "@/app/_components/container";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function EstadisticasPage() {
  const totalViews = await prisma.postMetric.aggregate({ _sum: { views: true } });
  const totalDownloads = await prisma.postMetric.aggregate({ _sum: { downloads: true } });
  const totalCountries = await prisma.visitorCountry.count();

  // Obtener el top 5 de países
  const topCountries = await prisma.visitorCountry.findMany({
    orderBy: { count: 'desc' },
    take: 5
  });

  return (
    <main className="pt-24 pb-20 bg-white">
      <Container>
        <div className="mb-12 border-b border-zinc-100 pb-8">
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter leading-tight mb-4 text-zinc-900">
            Transparencia Editorial
          </h1>
          <p className="text-lg text-zinc-500 max-w-2xl">
            Métricas abiertas en tiempo real. Visualice el impacto, alcance y distribución global del conocimiento.
          </p>
        </div>

        {/* TARJETAS DE RESUMEN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-8 bg-zinc-50 rounded-2xl border border-zinc-200">
            <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
               <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Lecturas Totales
            </div>
            <div className="text-5xl font-serif font-bold text-zinc-900">
              {(totalViews._sum.views || 0).toLocaleString()}
            </div>
          </div>
          <div className="p-8 bg-zinc-50 rounded-2xl border border-zinc-200">
            <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
               <span className="w-2 h-2 bg-purple-500 rounded-full"></span> Descargas PDF
            </div>
            <div className="text-5xl font-serif font-bold text-zinc-900">
              {(totalDownloads._sum.downloads || 0).toLocaleString()}
            </div>
          </div>
          <div className="p-8 bg-zinc-50 rounded-2xl border border-zinc-200">
            <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
               <span className="w-2 h-2 bg-green-500 rounded-full"></span> Alcance Global
            </div>
            <div className="text-5xl font-serif font-bold text-zinc-900">
              {totalCountries} <span className="text-lg text-zinc-400 font-sans font-normal">Países</span>
            </div>
          </div>
        </div>

        {/* LISTAS DETALLADAS */}
        <div className="grid md:grid-cols-2 gap-12">
            <div className="border border-zinc-200 rounded-xl p-6">
                <h3 className="font-bold text-zinc-900 mb-6 flex items-center gap-2">
                    📊 Top Países Lectores
                </h3>
                <ul className="space-y-0 divide-y divide-zinc-100">
                    {topCountries.length > 0 ? topCountries.map((c) => (
                        <li key={c.code} className="flex justify-between items-center py-3">
                            <span className="font-mono text-zinc-600 bg-zinc-100 px-2 py-1 rounded text-xs">{c.code}</span>
                            <span className="font-bold text-zinc-900">{c.count}</span>
                        </li>
                    )) : (
                        <li className="text-zinc-400 text-sm italic py-4">Esperando datos de países...</li>
                    )}
                </ul>
            </div>
            
            <div className="border border-zinc-200 rounded-xl p-6 flex flex-col items-center justify-center bg-zinc-50 text-center min-h-[200px]">
                <div className="text-4xl mb-2">📈</div>
                <h3 className="font-bold text-zinc-900 mb-2">Evolución Temporal</h3>
                <p className="text-zinc-400 text-sm italic max-w-xs">
                    Las gráficas de evolución mensual estarán disponibles cuando se acumule suficiente historial de datos (aprox. 24 horas).
                </p>
            </div>
        </div>

      </Container>
    </main>
  );
}
