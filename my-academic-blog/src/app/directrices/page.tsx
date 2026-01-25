import Container from "@/app/_components/container";

export default function DirectricesPage() {
  return (
    <main className="pt-24 pb-20">
      <Container>
        <header className="mb-12 border-b border-zinc-200 pb-8">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-zinc-900 mb-4">
                Directrices para Autores
            </h1>
            <p className="text-lg text-zinc-600">
                Normas de estilo, formato y requisitos para el envío de manuscritos.
            </p>
        </header>

        <div className="prose prose-zinc prose-lg max-w-4xl">
            <h3>1. Formato del Manuscrito</h3>
            <p>Los textos deben enviarse en formato editable (.docx) o PDF anonimizado. La extensión recomendada es de 5,000 a 8,000 palabras para artículos de investigación.</p>
            
            <h3>2. Normas de Citación</h3>
            <p>Se debe utilizar estrictamente el formato <strong>APA 7ª Edición</strong> para citas y referencias bibliográficas.</p>

            <h3>3. Estructura Requerida</h3>
            <ul>
                <li><strong>Título:</strong> Conciso y descriptivo (Español e Inglés).</li>
                <li><strong>Resumen/Abstract:</strong> Máximo 250 palabras.</li>
                <li><strong>Palabras Clave:</strong> 3 a 5 descriptores.</li>
                <li><strong>Cuerpo:</strong> Introducción, Metodología, Resultados, Discusión, Conclusiones.</li>
            </ul>

            <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200 mt-8 not-prose">
                <h4 className="font-bold text-zinc-900 mb-2">¿Listo para enviar?</h4>
                <p className="text-zinc-600 mb-4">Asegúrese de haber eliminado los nombres de los autores del archivo principal.</p>
                <a href="/envios" className="inline-block bg-zinc-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-black transition-colors">
                    Ir a Envíos →
                </a>
            </div>
        </div>
      </Container>
    </main>
  );
}
