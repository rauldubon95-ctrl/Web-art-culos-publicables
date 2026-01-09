"use client";

import { useState } from "react";

export default function SeguimientoPage() {
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(`/api/envios?id=${encodeURIComponent(id)}&email=${encodeURIComponent(email)}`, {
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok || !json?.ok) {
        setError(json?.error || "No encontrado.");
      } else {
        setData(json.item);
      }
    } catch (err: any) {
      setError(err?.message || "Error de red.");
    } finally {
      setLoading(false);
    }
  }

  const labels: Record<string, string> = {
    "recibido": "Recibido",
    "revision-editorial": "Revisión editorial",
    "en-revision": "En revisión por pares",
    "cambios-solicitados": "Cambios solicitados",
    "aceptado": "Aceptado",
    "rechazado": "Rechazado",
    "publicado": "Publicado",
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Seguimiento de envío</h1>
        <p className="text-zinc-600 max-w-3xl">
          Consultá el estado editorial usando tu <span className="font-medium">código de envío</span> y el
          <span className="font-medium"> correo</span> registrado.
        </p>
      </header>

      <div className="rounded-2xl border p-6 space-y-4">
        <form onSubmit={onSearch} className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Código (ID)</label>
            <input
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border px-3 py-2"
              placeholder="CA-XXXX"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">Correo</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              className="mt-1 w-full rounded-xl border px-3 py-2"
              placeholder="correo@dominio.com"
            />
          </div>

          <div className="md:col-span-3">
            <button
              disabled={loading}
              className="rounded-xl border px-4 py-2 hover:bg-zinc-50 disabled:opacity-60"
              type="submit"
            >
              {loading ? "Consultando..." : "Consultar estado"}
            </button>
          </div>
        </form>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>
        ) : null}

        {data ? (
          <div className="rounded-xl border bg-zinc-50 p-5 space-y-2">
            <div className="text-sm text-zinc-500">{data.id}</div>
            <div className="text-lg font-semibold">{data.title}</div>
            <div className="text-sm text-zinc-700">
              <span className="font-medium">Sección:</span> {data.section} • <span className="font-medium">Tipo:</span>{" "}
              {data.type}
            </div>
            <div className="text-sm text-zinc-700">
              <span className="font-medium">Estado:</span> {labels[data.status] || data.status}
            </div>
            <div className="text-sm text-zinc-600">
              <span className="font-medium">Última actualización:</span>{" "}
              {data.lastUpdatedAt ? new Date(data.lastUpdatedAt).toLocaleString() : "—"}
            </div>
            {data.editorialNotes ? (
              <div className="text-sm text-zinc-700 mt-2">
                <div className="font-medium">Notas editoriales</div>
                <div className="mt-1 whitespace-pre-wrap">{data.editorialNotes}</div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
