"use client"; 

import { useMemo, useState } from "react";
import Link from "next/link"; 
import { useSession } from "next-auth/react"; // <--- AGREGADO: Para detectar usuario

const SECCIONES = [
  "Tecnología y Sociedad",
  "Salud y Nutrición",
  "Psicología y Conducta",
  "Ciencias Sociales",
  "Ciencia Política y Políticas Públicas",
  "Métodos y Datos",
  "Reseñas y Debate",
];

const TIPOS = [
  "Artículo de investigación",
  "Ensayo",
  "Revisión (estado del arte)",
  "Nota técnica / método",
  "Comentario / réplica",
  "Reseña",
];

export default function EnviosPage() {
  const { data: session } = useSession(); // <--- AGREGADO: Obtenemos datos de la sesión
  const [loading, setLoading] = useState(false);
  const [resultId, setResultId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const helper = useMemo(
    () => ({
      pdf: "PDF (.pdf)",
      docx: "Word (.docx)",
    }),
    []
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setResultId(null);
    setLoading(true);

    try {
      const form = new FormData(e.currentTarget);

      const res = await fetch("/api/envios", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setError(data?.error || "No se pudo enviar el manuscrito.");
        setLoading(false);
        return;
      }

      setResultId(data.id || "CA-SIN-ID");
      e.currentTarget.reset();
    } catch (err: any) {
      setError(err?.message || "Error de red.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-in fade-in duration-500 font-sans">
      
      {/* 1. ENCABEZADO ACADÉMICO + PERFIL DE USUARIO */}
      <header className="mb-10 border-b border-zinc-200 pb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
                <h1 className="text-4xl font-serif font-bold text-zinc-900 tracking-tight">
                Envío de Manuscritos
                </h1>
                <p className="mt-3 text-lg text-zinc-600 max-w-2xl leading-relaxed">
                Gestión editorial de <span className="font-semibold text-zinc-800">Cuadernos Abiertos</span>.
                </p>
            </div>

            {/* TARJETA DE USUARIO (SOLO SI ESTÁ LOGUEADO) */}
            {session?.user && (
                <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex items-center gap-4 shadow-sm min-w-[280px]">
                    {session.user.image ? (
                        <img src={session.user.image} alt="Avatar" className="w-12 h-12 rounded-full border border-zinc-300" />
                    ) : (
                        <div className="w-12 h-12 bg-zinc-800 text-white rounded-full flex items-center justify-center font-bold text-lg">
                            {session.user.name?.charAt(0)}
                        </div>
                    )}
                    <div>
                        <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Sesión Activa</p>
                        <p className="text-sm font-bold text-zinc-900">{session.user.name}</p>
                        <p className="text-xs text-zinc-500 truncate max-w-[150px]">{session.user.email}</p>
                    </div>
                </div>
            )}
        </div>
      </header>

      {/* 2. BARRA DE NAVEGACIÓN */}
      <div className="grid md:grid-cols-3 gap-4 mb-12">
        {/* Tarjeta 1: Enviar (Activa) */}
        <div className="rounded-xl border-2 border-zinc-900 bg-zinc-900 p-4 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <span className="font-semibold">Nuevo Envío</span>
          </div>
          <p className="text-xs text-zinc-300 mt-2">Formulario de recepción para autores.</p>
        </div>

        {/* Tarjeta 2: Seguimiento */}
        <Link 
          href="/envios/seguimiento" 
          className="group rounded-xl border border-zinc-200 bg-white p-4 text-zinc-600 hover:border-zinc-400 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3 group-hover:text-zinc-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <span className="font-semibold">Rastrear Artículo</span>
          </div>
          <p className="text-xs text-zinc-400 mt-2">Consulte el estado de su evaluación.</p>
        </Link>

        {/* Tarjeta 3: Panel Editorial */}
        <Link 
          href="/envios/panel" 
          className="group rounded-xl border border-zinc-200 bg-white p-4 text-zinc-600 hover:border-zinc-400 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3 group-hover:text-zinc-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            <span className="font-semibold">Acceso Editorial</span>
          </div>
          <p className="text-xs text-zinc-400 mt-2">Solo para revisores y editores.</p>
        </Link>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        
        {/* 3. BARRA LATERAL (INFORMACIÓN) */}
        <aside className="lg:col-span-4 space-y-6 order-2 lg:order-1">
          <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100">
            <h3 className="font-serif font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              Requisitos previos
            </h3>
            <ul className="space-y-3 text-sm text-zinc-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                Formato {helper.pdf} o {helper.docx}.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                Anonimizado (sin nombres en el archivo).
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                Resumen de máx. 250 palabras.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                Bibliografía en formato APA 7.
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm">
            <h3 className="font-bold text-sm text-zinc-900 mb-3">Flujo Editorial</h3>
            <ol className="relative border-l border-zinc-200 ml-2 space-y-6">
              <li className="pl-4 relative">
                <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-zinc-300"></span>
                <p className="text-sm font-medium text-zinc-900">1. Recepción</p>
                <p className="text-xs text-zinc-500">Validación automática de formato.</p>
              </li>
              <li className="pl-4 relative">
                <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-zinc-300"></span>
                <p className="text-sm font-medium text-zinc-900">2. Revisión Editorial</p>
                <p className="text-xs text-zinc-500">Pertinencia y alcance.</p>
              </li>
              <li className="pl-4 relative">
                <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-zinc-300"></span>
                <p className="text-sm font-medium text-zinc-900">3. Pares Ciegos</p>
                <p className="text-xs text-zinc-500">Evaluación experta.</p>
              </li>
            </ol>
          </div>
        </aside>

        {/* 4. FORMULARIO PRINCIPAL */}
        <div className="lg:col-span-8 order-1 lg:order-2">
          <div className="bg-white rounded-2xl p-1">
            
            {resultId && (
              <div className="mb-8 rounded-xl border-l-4 border-green-500 bg-green-50 p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="text-green-600 font-bold text-lg">¡Envío Recibido!</div>
                </div>
                <p className="text-zinc-700 mt-2">Guarde su código de seguimiento:</p>
                <div className="mt-3 bg-white border border-green-200 p-3 rounded-lg font-mono text-xl text-center tracking-widest text-zinc-800 select-all">
                  {resultId}
                </div>
              </div>
            )}

            {error && (
              <div className="mb-8 rounded-xl border-l-4 border-red-500 bg-red-50 p-4 text-red-700">
                <p className="font-bold">Error en el envío</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-8">
              {/* Sección: Detalles del Artículo */}
              <div className="space-y-6">
                <h2 className="text-xl font-serif font-bold text-zinc-800 border-b pb-2">Información del Manuscrito</h2>
                
                <div className="grid gap-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Título del Artículo *</label>
                    <input
                      name="title"
                      required
                      className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
                      placeholder="Ej: Impacto de la IA en la educación superior..."
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">Sección Temática *</label>
                      <select
                        name="section"
                        required
                        className="w-full rounded-lg border border-zinc-300 px-4 py-3 bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                        defaultValue=""
                      >
                        <option value="" disabled>Seleccione una sección</option>
                        {SECCIONES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">Tipo de Trabajo *</label>
                      <select
                        name="type"
                        required
                        className="w-full rounded-lg border border-zinc-300 px-4 py-3 bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                        defaultValue=""
                      >
                        <option value="" disabled>Seleccione el tipo</option>
                        {TIPOS.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Resumen / Abstract</label>
                    <textarea
                      name="abstract"
                      rows={4}
                      className="w-full rounded-lg border border-zinc-300 px-4 py-3 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                      placeholder="Breve descripción del contenido (Máx. 250 palabras)..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Palabras Clave</label>
                    <input
                      name="keywords"
                      className="w-full rounded-lg border border-zinc-300 px-4 py-3 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                      placeholder="Separe con punto y coma (Ej: política; sociedad; datos)"
                    />
                  </div>
                </div>
              </div>

              {/* Sección: Autoría */}
              <div className="space-y-6 pt-4">
                <h2 className="text-xl font-serif font-bold text-zinc-800 border-b pb-2">Datos de Autoría</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Lista completa de autores *</label>
                    <input
                      name="authors"
                      required
                      className="w-full rounded-lg border border-zinc-300 px-4 py-3 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                      placeholder="Apellido, Nombre; Apellido, Nombre..."
                      // Si hay sesión, sugerimos el nombre del usuario logueado
                      defaultValue={session?.user?.name || ""}
                    />
                    <p className="text-xs text-zinc-500 mt-1">Ingrese los nombres tal como deben aparecer en la citación.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Autor de correspondencia *</label>
                    <input
                      name="correspondingAuthor"
                      required
                      className="w-full rounded-lg border border-zinc-300 px-4 py-3 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                      // Autocompletamos con el nombre del usuario
                      defaultValue={session?.user?.name || ""}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Correo electrónico *</label>
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full rounded-lg border border-zinc-300 px-4 py-3 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                      // Autocompletamos con el email de Google
                      defaultValue={session?.user?.email || ""}
                    />
                  </div>

                   <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Afiliación Institucional</label>
                    <input
                      name="affiliation"
                      className="w-full rounded-lg border border-zinc-300 px-4 py-3 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                      placeholder="Universidad o Centro de Investigación"
                    />
                  </div>
                </div>
              </div>

              {/* Sección: Archivos */}
              <div className="space-y-6 pt-4">
                <h2 className="text-xl font-serif font-bold text-zinc-800 border-b pb-2">Archivos y Declaraciones</h2>
                
                <div className="border-2 border-dashed border-zinc-300 rounded-xl p-8 text-center hover:bg-stone-50 transition-colors">
                  <div className="mx-auto w-12 h-12 text-zinc-400 mb-3">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <label className="block cursor-pointer">
                    <span className="text-zinc-900 font-medium hover:underline">Haga clic para subir el archivo</span>
                    <input
                      name="file"
                      type="file"
                      required
                      accept=".pdf,.docx"
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-zinc-500 mt-2">Formatos aceptados: PDF o DOCX (Máx 10MB)</p>
                </div>

                <div className="flex items-start gap-3 bg-stone-50 p-4 rounded-lg">
                  <input
                    id="originalidad"
                    name="originalidad"
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                  />
                  <label htmlFor="originalidad" className="text-sm text-zinc-700 cursor-pointer">
                    Declaro formalmente que este manuscrito es original, no ha sido publicado previamente y no está bajo consideración en otra revista.
                  </label>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    disabled={loading}
                    className="bg-zinc-900 text-white rounded-xl px-8 py-3 font-medium hover:bg-black shadow-lg shadow-zinc-200 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
                    type="submit"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Procesando...
                      </span>
                    ) : (
                      "Enviar Manuscrito"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}