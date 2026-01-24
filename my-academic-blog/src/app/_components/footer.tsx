import Container from "@/app/_components/container";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function Footer() {
  const year = new Date().getFullYear();
  let stats = { views: 0, downloads: 0, countries: 0 };
  
  try {
    const totalViews = await prisma.postMetric.aggregate({
      _sum: { views: true, downloads: true }
    });
    const totalCountries = await prisma.visitorCountry.count();
    
    stats = {
      views: totalViews._sum.views || 0,
      downloads: totalViews._sum.downloads || 0,
      countries: totalCountries
    };
  } catch (e) {
    console.log("Esperando métricas...");
  }

  return (
    <footer className="bg-white border-t border-zinc-200 mt-20 font-sans">
      
      {/* SECCIÓN DE MÉTRICAS INTERACTIVA */}
      <div className="bg-zinc-900 text-white border-b border-zinc-800 transition-colors duration-300 hover:bg-zinc-950">
        <Container>
            <Link href="/estadisticas" className="block py-8 group cursor-pointer">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                
                {/* Título con indicador */}
                <div className="flex flex-col gap-1 text-center md:text-left">
                    <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center justify-center md:justify-start gap-2 group-hover:text-zinc-400 transition-colors">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Impacto Global
                    </div>
                    <div className="hidden md:flex text-xs text-zinc-600 group-hover:text-zinc-300 transition-colors items-center gap-1 mt-1">
                        Ver reporte detallado <span className="transition-transform group-hover:translate-x-1">→</span>
                    </div>
                </div>
                
                {/* Los Números */}
                <div className="flex gap-8 md:gap-20">
                   <div className="text-center">
                     <span className="block font-serif font-bold text-2xl md:text-4xl text-white group-hover:text-yellow-400 transition-colors">
                        {stats.views.toLocaleString()}
                     </span>
                     <span className="text-[10px] uppercase tracking-widest text-zinc-500 group-hover:text-zinc-400">Lecturas</span>
                   </div>
                   <div className="text-center">
                     <span className="block font-serif font-bold text-2xl md:text-4xl text-white group-hover:text-yellow-400 transition-colors">
                        {stats.downloads.toLocaleString()}
                     </span>
                     <span className="text-[10px] uppercase tracking-widest text-zinc-500 group-hover:text-zinc-400">Descargas</span>
                   </div>
                   <div className="text-center">
                     <span className="block font-serif font-bold text-2xl md:text-4xl text-white group-hover:text-yellow-400 transition-colors">
                        {stats.countries}
                     </span>
                     <span className="text-[10px] uppercase tracking-widest text-zinc-500 group-hover:text-zinc-400">Países</span>
                   </div>
                </div>
              </div>
            </Link>
        </Container>
      </div>

      <div className="bg-zinc-50 pt-16 pb-12">
        <Container>
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-5 space-y-6">
              <h3 className="text-lg font-serif font-bold text-zinc-900">Cuadernos Abiertos</h3>
              <p className="text-sm text-zinc-500 text-justify leading-relaxed">
                Plataforma de difusión científica comprometida con el acceso abierto y la rigurosidad académica.
                Arbitraje por pares doble ciego.
              </p>
            </div>
            <div className="md:col-span-4 space-y-4">
               <h4 className="font-bold text-zinc-900 uppercase text-xs tracking-wider">Indexaciones</h4>
               <div className="flex gap-3 opacity-50 grayscale hover:grayscale-0 transition-all cursor-not-allowed">
                 <div className="h-8 w-20 bg-zinc-200 rounded"></div>
                 <div className="h-8 w-20 bg-zinc-200 rounded"></div>
                 <div className="h-8 w-20 bg-zinc-200 rounded"></div>
               </div>
               <p className="text-[10px] text-zinc-400">En proceso de indexación: Latindex, Redalyc.</p>
            </div>
            <div className="md:col-span-3 space-y-2">
              <h4 className="font-bold text-zinc-900 uppercase text-xs tracking-wider mb-2">Navegación</h4>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li><a href="/articulos" className="hover:text-black hover:underline">Archivo Histórico</a></li>
                <li><a href="/equipo-editorial" className="hover:text-black hover:underline">Consejo Editorial</a></li>
                <li><a href="/envios/panel" className="font-bold text-zinc-900 hover:text-black mt-4 block">→ Acceso Editor</a></li>
              </ul>
            </div>
          </div>
        </Container>
      </div>
      <div className="bg-white border-t border-zinc-200 py-6 text-center text-xs text-zinc-400 font-mono">
        ISSN: En trámite &bull; San Salvador, El Salvador &bull; {year}
      </div>
    </footer>
  );
}
