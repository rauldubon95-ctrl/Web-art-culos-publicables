import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google"; 
import Link from "next/link"; 
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Cuadernos Abiertos",
  description: "Revista académica interdisciplinaria de acceso abierto.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${merriweather.variable} bg-[#F9F9F7] text-zinc-800 antialiased min-h-screen flex flex-col`}
      >
        {/* 1. FRANJA INSTITUCIONAL SUPERIOR */}
        <div className="w-full h-1.5 bg-zinc-900 fixed top-0 left-0 z-50"></div>

        <div className="flex-1 flex justify-center py-8 md:py-12 px-4 sm:px-6">
          <main className="w-full max-w-6xl bg-white shadow-2xl shadow-zinc-900/5 border border-zinc-200 flex flex-col relative mt-2">
            
            {/* 2. BARRA DE NAVEGACIÓN */}
            <nav className="border-b border-zinc-100 px-6 py-5 md:px-12 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white sticky top-0 z-10">
              <Link href="/" className="group">
                <h1 className="font-serif text-2xl md:text-3xl font-black tracking-tight text-zinc-900 group-hover:text-zinc-700 transition-colors">
                  Cuadernos Abiertos
                </h1>
                <p className="text-xs font-sans text-zinc-500 uppercase tracking-widest mt-1">
                  Revista Interdisciplinaria
                </p>
              </Link>

              <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-zinc-600">
                <Link href="/" className="hover:text-zinc-900 hover:underline decoration-zinc-400 underline-offset-4 transition-all">
                  Inicio
                </Link>
                {/* AQUÍ ESTABA FALTANDO: Enlace arriba también */}
                <Link href="/equipo-editorial" className="hover:text-zinc-900 hover:underline decoration-zinc-400 underline-offset-4 transition-all">
                  Equipo Editorial
                </Link>
                <Link href="/articulos" className="hover:text-zinc-900 hover:underline decoration-zinc-400 underline-offset-4 transition-all">
                  Archivo
                </Link>
                <Link href="/envios" className="px-3 py-1.5 bg-zinc-900 text-white rounded-md hover:bg-zinc-700 transition-colors">
                  Enviar Artículo
                </Link>
              </div>
            </nav>

            {/* 3. CONTENIDO PRINCIPAL */}
            <div className="flex-1 px-6 py-10 md:px-16 md:py-14">
              {children}
            </div>

            {/* 4. PIE DE PÁGINA */}
            <footer className="bg-zinc-50 border-t border-zinc-200 px-6 py-12 md:px-16 text-sm">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <h3 className="font-serif font-bold text-zinc-900">Cuadernos Abiertos</h3>
                  <p className="text-zinc-500 leading-relaxed">
                    Promoviendo el debate académico riguroso y el acceso libre al conocimiento científico.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-bold text-zinc-900">Enlaces de Interés</h4>
                  <ul className="space-y-2 text-zinc-600">
                    <li><Link href="/normas" className="hover:underline">Normas de publicación</Link></li>
                    <li><Link href="/etica" className="hover:underline">Código de ética</Link></li>
                    {/* CORRECCIÓN CRÍTICA AQUÍ ABAJO: De /equipo a /equipo-editorial */}
                    <li><Link href="/equipo-editorial" className="hover:underline">Equipo editorial</Link></li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-zinc-900">Contacto</h4>
                  <p className="text-zinc-600">
                    San Salvador, El Salvador<br/>
                    contacto@cuadernosabiertos.org
                  </p>
                  <p className="text-zinc-400 text-xs mt-4">
                    &copy; {new Date().getFullYear()} Todos los derechos reservados.
                    <br/>ISSN en trámite.
                  </p>
                </div>
              </div>
            </footer>

          </main>
        </div>
      </body>
    </html>
  );
}