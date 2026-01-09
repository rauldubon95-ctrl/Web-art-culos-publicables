"use client";

import { useMemo, useState } from "react";

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
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Envíos</h1>
        <p className="text-zinc-600 max-w-3xl">
          <span className="font-medium">Cuadernos Abiertos</span> recibe manuscritos
          de acceso público con rigor académico. Este formulario funciona para llevar registro:
          recepción, revisión editorial y decisión.
        </p>
      </header>

      {/* Accesos rápidos */}
      <div className="flex gap-3 flex-wrap">
        <a
          className="rounded-xl border px-4 py-2 hover:bg-zinc-50"
          href="/envios/seguimiento"
        >
          Seguimiento de envío
        </a>
        <a
          className="rounded-xl border px-4 py-2 hover:bg-zinc-50"
          href="/envios/panel"
        >
          Panel editorial 
        </a>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <aside className="lg:col-span-1 space-y-4">
          <div className="rounded-2xl border p-5 space-y-3">
            <div className="text-sm font-semibold">Requisitos mínimos</div>
            <ul className="list-disc pl-5 text-sm text-zinc-700 space-y-1">
              <li>Archivo {helper.pdf} o {helper.docx}.</li>
              <li>Resumen y palabras clave (recomendado).</li>
              <li>Datos completos de autoría y afiliación.</li>
              <li>Declaración básica de originalidad.</li>
            </ul>
          </div>

          <div className="rounded-2xl border p-5 space-y-3">
            <div className="text-sm font-semibold">Proceso editorial (resumen)</div>
            <ol className="list-decimal pl-5 text-sm text-zinc-700 space-y-1">
              <li>Recepción y acuse.</li>
              <li>Revisión editorial (alcance y formato).</li>
              <li>Evaluación por pares (si aplica).</li>
              <li>Decisión: aceptado / cambios / rechazado.</li>
              <li>Edición y publicación.</li>
            </ol>
          </div>

          <div className="rounded-2xl border p-5 text-sm text-zinc-700">
            Nota: autenticación con Gmail (cuentas) y panel editorial con roles se implementa
            en una fase posterior. En esta simulación, el envío queda registrado localmente
            para pruebas.
          </div>
        </aside>

        <div className="lg:col-span-2">
          <div className="rounded-2xl border p-6 space-y-6">
            <h2 className="text-xl font-semibold">Formulario de envío</h2>

            {resultId ? (
              <div className="rounded-xl border bg-zinc-50 p-4">
                <div className="font-semibold">Envío recibido</div>
                <div className="text-sm text-zinc-700 mt-1">
                  Tu código de envío es: <span className="font-mono">{resultId}</span>
                </div>
                <div className="text-sm text-zinc-600 mt-1">
                  El equipo editorial se comunicará por correo una vez iniciada la revisión.
                </div>
              </div>
            ) : null}

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                {error}
              </div>
            ) : null}

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Título del manuscrito *</label>
                  <input
                    name="title"
                    required
                    className="mt-1 w-full rounded-xl border px-3 py-2"
                    placeholder="Título completo del artículo"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Sección *</label>
                  <select
                    name="section"
                    required
                    className="mt-1 w-full rounded-xl border px-3 py-2 bg-white"
                    defaultValue=""
                  >
                    <option value="" disabled>Seleccionar</option>
                    {SECCIONES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Tipo de contribución *</label>
                  <select
                    name="type"
                    required
                    className="mt-1 w-full rounded-xl border px-3 py-2 bg-white"
                    defaultValue=""
                  >
                    <option value="" disabled>Seleccionar</option>
                    {TIPOS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Afiliación (opcional)</label>
                  <input
                    name="affiliation"
                    className="mt-1 w-full rounded-xl border px-3 py-2"
                    placeholder="Universidad / Centro / Organización"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Autores/as (lista) *</label>
                  <input
                    name="authors"
                    required
                    className="mt-1 w-full rounded-xl border px-3 py-2"
                    placeholder="Apellido, Nombre; Apellido, Nombre; ..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Autor/a de correspondencia *</label>
                  <input
                    name="correspondingAuthor"
                    required
                    className="mt-1 w-full rounded-xl border px-3 py-2"
                    placeholder="Apellido, Nombre"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Correo de contacto *</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="mt-1 w-full rounded-xl border px-3 py-2"
                    placeholder="correo@dominio.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Resumen (recomendado)</label>
                <textarea
                  name="abstract"
                  rows={4}
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                  placeholder="Resumen del manuscrito (150–250 palabras recomendado)"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Palabras clave (recomendado)</label>
                <input
                  name="keywords"
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                  placeholder="ej.: desinformación; esfera pública; plataformas; democracia"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Archivo del manuscrito *</label>
                <input
                  name="file"
                  type="file"
                  required
                  accept=".pdf,.docx"
                  className="mt-1 w-full rounded-xl border px-3 py-2 bg-white"
                />
                <div className="text-xs text-zinc-500 mt-1">
                  Formatos aceptados: PDF o DOCX. Evitar nombres con tildes/espacios.
                </div>
              </div>

              <div className="flex items-start gap-2">
                <input id="originalidad" name="originalidad" type="checkbox" required className="mt-1" />
                <label htmlFor="originalidad" className="text-sm text-zinc-700">
                  Declaro que este manuscrito es original y que cualquier material de terceros está citado
                  y referenciado de forma adecuada.
                </label>
              </div>

              <button
                disabled={loading}
                className="rounded-xl border px-4 py-2 hover:bg-zinc-50 disabled:opacity-60"
                type="submit"
              >
                {loading ? "Enviando..." : "Enviar manuscrito"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
