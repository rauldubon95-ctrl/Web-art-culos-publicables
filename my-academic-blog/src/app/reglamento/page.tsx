import Container from "@/app/_components/container";

export default function ReglamentoPage() {
  return (
    <main className="pt-24 pb-20">
      <Container>
        <header className="mb-12 border-b border-zinc-200 pb-8">
            <div className="inline-block bg-zinc-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">
                Documentación Interna
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-zinc-900 mb-4">
                Reglamento de la Revista
            </h1>
            <p className="text-lg text-zinc-600">
                Estatutos y funciones del Consejo Editorial y Comité Científico.
            </p>
        </header>

        <div className="space-y-12 max-w-4xl mx-auto">
            <section className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
                <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
                    <span className="bg-zinc-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                    Del Consejo Editorial
                </h2>
                <p className="text-zinc-600 mb-4">
                    El Consejo Editorial es el órgano máximo de decisión académica. Sus funciones incluyen:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-zinc-700">
                    <li>Definir la política editorial y las líneas temáticas.</li>
                    <li>Aprobar la selección de revisores pares.</li>
                    <li>Dirimir conflictos éticos o controversias de autoría.</li>
                </ul>
            </section>

            <section className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
                <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
                    <span className="bg-zinc-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                    De los Revisores
                </h2>
                <p className="text-zinc-600 mb-4">
                    Los árbitros externos son especialistas en la materia que evalúan la calidad, originalidad y rigor científico. Deben declarar cualquier conflicto de interés antes de aceptar una revisión.
                </p>
            </section>
        </div>
      </Container>
    </main>
  );
}
