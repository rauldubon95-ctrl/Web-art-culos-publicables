// src/app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "Cuadernos Abiertos — Revista interdisciplinaria",
  description:
    "Revista abierta al público para publicar sobre tecnología, nutrición, psicología, ciencias sociales y ciencia política.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-white text-zinc-900">
        <header className="border-b bg-white/80 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 py-5 flex items-center justify-between gap-6">
            <a href="/" className="leading-tight">
              <div className="text-xl font-semibold tracking-tight">
                Cuadernos Abiertos
              </div>
              <div className="text-sm text-zinc-600">
                Revista abierta • Rigor académico • Acceso público
              </div>
            </a>

            <nav className="flex flex-wrap items-center gap-4 text-sm">
              <a className="hover:underline" href="/articulos">Artículos</a>
              <a className="hover:underline" href="/secciones">Secciones</a>
              <a className="hover:underline" href="/envios">Envíos</a>
              <a className="hover:underline" href="/equipo-editorial">Equipo editorial</a>
              <a className="hover:underline" href="/acerca">Acerca</a>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>

        <footer className="border-t">
          <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-zinc-600 space-y-2">
            <div>© {new Date().getFullYear()} Cuadernos Abiertos</div>
            <div>
              Licencia: (definir, p.ej. Creative Commons) • Contacto: (correo)
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
