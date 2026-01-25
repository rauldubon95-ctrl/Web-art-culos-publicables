import Container from "@/app/_components/container";

export default function PoliticaPage() {
  return (
    <main className="pt-24 pb-20">
      <Container>
        <header className="mb-12 border-b border-zinc-200 pb-8">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-zinc-900 mb-4">
                Política Editorial
            </h1>
            <p className="text-lg text-zinc-600">
                Principios éticos, acceso abierto y derechos de autor.
            </p>
        </header>

        <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 prose prose-zinc prose-lg">
                <h3>Acceso Abierto (Open Access)</h3>
                <p>Esta revista provee acceso inmediato y gratuito a su contenido bajo el principio de que hacer disponible gratuitamente la investigación al publico apoya a un mayor intercambio de conocimiento global.</p>
                
                <h3>Proceso de Evaluación por Pares</h3>
                <p>Todos los manuscritos son sometidos a un proceso de arbitraje <strong>doble ciego</strong> (double-blind peer review), donde ni los autores ni los revisores conocen sus identidades.</p>

                <h3>Ética y Detección de Plagio</h3>
                <p>Utilizamos herramientas avanzadas para la detección de similitud. Cualquier manuscrito con evidencia de plagio o uso no ético de IA será rechazado inmediatamente.</p>
            </div>

            <aside className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <h4 className="font-bold text-blue-900 mb-2">Licencia</h4>
                    <p className="text-sm text-blue-800">
                        Los artículos se publican bajo licencia Creative Commons Attribution 4.0 International (CC BY 4.0).
                    </p>
                </div>
                <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200">
                    <h4 className="font-bold text-zinc-900 mb-2">Frecuencia</h4>
                    <p className="text-sm text-zinc-600">
                        Publicación semestral con recepción continua de documentos.
                    </p>
                </div>
            </aside>
        </div>
      </Container>
    </main>
  );
}
