"use client";

import { useEffect, useMemo, useState } from "react";

const STATUSES = [
  { v: "recibido", t: "Recibido" },
  { v: "revision-editorial", t: "Revisión editorial" },
  { v: "en-revision", t: "En revisión por pares" },
  { v: "cambios-solicitados", t: "Cambios solicitados" },
  { v: "aceptado", t: "Aceptado" },
  { v: "rechazado", t: "Rechazado" },
  { v: "publicado", t: "Publicado" },
] as const;

export default function PanelPage() {
  const [key, setKey] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const statusLabel = useMemo(() => {
    const m = new Map<string, string>();
    STATUSES.forEach((s) => m.set(s.v, s.t));
    return m;
  }, []);

  async function load() {
    setLoading(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch("/api/envios", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || !json?.ok) throw new Error(json?.error || "No se pudo cargar.");
      setItems(json.items || []);
    } catch (e: any) {
      setErr(e?.message || "Error.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!selected) return;
    setLoading(true);
    setErr(null);
    setMsg(null);

    try {
      const res = await fetch("/api/envios", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key,
          id: selected.id,
          status: selected.status,
          editorialNotes: selected.editorialNotes || "",
          reviewerNotes: selected.reviewerNotes || "",
          reviewers: selected.reviewers || "",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json?.ok) throw new Error(json?.error || "No se pudo guardar.");

      setMsg("Actualizado.");
      await load();

      // refresca seleccionado desde lista
      const refreshed = (items || []).find((x) => x.id === selected.id);
      setSelected(refreshed || selected);
    } catch (e: any) {
      setErr(e?.message || "Error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Panel editorial (demo)</h1>
        <p className="text-zinc-600 max-w-3xl">
          Gestión mínima de envíos: cambiar estado, registrar notas y asignaciones. Protección demo mediante clave.
        </p>
      </header>

      <div className="rounded-2xl border p-5 grid md:grid-cols-3 gap-4 items-end">
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Clave editorial</label>
          <input
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="mt-1 w-full rounded-xl border px-3 py-2"
            placeholder="CAMBIAME-123 (demo)"
          />
          <div className="text-xs text-zinc-500 mt-1">
            Para producción: OAuth + roles. En demo: se valida contra CA_ADMIN_KEY o "CAMBIAME-123".
          </div>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="rounded-xl border px-4 py-2 hover:bg-zinc-50 disabled:opacity-60"
        >
          {loading ? "Cargando..." : "Recargar"}
        </button>
      </div>

      {err ? <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{err}</div> : null}
      {msg ? <div className="rounded-xl border bg-zinc-50 p-4 text-sm text-zinc-700">{msg}</div> : null}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3">
          <div className="text-sm font-semibold">Envíos</div>
          <div className="rounded-2xl border overflow-hidden">
            {items.length === 0 ? (
              <div className="p-4 text-sm text-zinc-700">Sin envíos.</div>
            ) : (
              <ul className="divide-y">
                {items.map((it) => (
                  <li key={it.id}>
                    <button
                      className="w-full text-left p-4 hover:bg-zinc-50"
                      onClick={() => setSelected(it)}
                    >
                      <div className="text-xs text-zinc-500">{it.id}</div>
                      <div className="font-medium">{it.title}</div>
                      <div className="text-sm text-zinc-600">
                        {statusLabel.get(it.status) || it.status}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-2xl border p-6 space-y-4">
            <h2 className="text-xl font-semibold">Detalle</h2>

            {!selected ? (
              <div className="text-zinc-700">Seleccioná un envío para editar.</div>
            ) : (
              <>
                <div className="text-sm text-zinc-500">{selected.id}</div>
                <div className="text-lg font-semibold">{selected.title}</div>
                <div className="text-sm text-zinc-700">
                  <span className="font-medium">Autores:</span> {selected.authors}
                </div>
                <div className="text-sm text-zinc-700">
                  <span className="font-medium">Correo:</span> {selected.email}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Estado</label>
                    <select
                      className="mt-1 w-full rounded-xl border px-3 py-2 bg-white"
                      value={selected.status}
                      onChange={(e) => setSelected({ ...selected, status: e.target.value })}
                    >
                      {STATUSES.map((s) => (
                        <option key={s.v} value={s.v}>{s.t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Revisores (lista)</label>
                    <input
                      className="mt-1 w-full rounded-xl border px-3 py-2"
                      placeholder='Nombre (correo); Nombre (correo)'
                      value={selected.reviewers || ""}
                      onChange={(e) => setSelected({ ...selected, reviewers: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Notas editoriales (visibles al autor en seguimiento)</label>
                  <textarea
                    rows={5}
                    className="mt-1 w-full rounded-xl border px-3 py-2"
                    value={selected.editorialNotes || ""}
                    onChange={(e) => setSelected({ ...selected, editorialNotes: e.target.value })}
                    placeholder="Ej.: En revisión editorial. Ajustar formato APA y estructura del resumen."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Notas internas / revisión (no visibles al autor)</label>
                  <textarea
                    rows={5}
                    className="mt-1 w-full rounded-xl border px-3 py-2"
                    value={selected.reviewerNotes || ""}
                    onChange={(e) => setSelected({ ...selected, reviewerNotes: e.target.value })}
                    placeholder="Ej.: Comentarios de pares, criterios de decisión, observaciones internas."
                  />
                </div>

                <button
                  onClick={save}
                  disabled={loading}
                  className="rounded-xl border px-4 py-2 hover:bg-zinc-50 disabled:opacity-60"
                >
                  {loading ? "Guardando..." : "Guardar cambios"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
