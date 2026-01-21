"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession, signIn } from "next-auth/react";

/**
 * LISTA BLANCA DE EDITORES
 * Solo estos correos pueden entrar al panel
 */
const EDITORS = [
  "tucorreo@gmail.com",
  // agrega aquí más correos autorizados
];

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
  const { data: session, status } = useSession();

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

  const userEmail = session?.user?.email;

  // 🔄 Cargar envíos solo si está autorizado
  useEffect(() => {
    if (status === "authenticated" && userEmail && EDITORS.includes(userEmail)) {
      load();
    }
  }, [status, userEmail]);

  async function load() {
    try {
      setLoading(true);
      const res = await fetch("/api/envios", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || !json?.ok) throw new Error(json?.error);
      setItems(json.items || []);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (!selected) return;

    try {
      setLoading(true);
      const res = await fetch("/api/envios", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selected),
      });

      const json = await res.json();
      if (!res.ok || !json?.ok) throw new Error(json?.error);

      setMsg("Actualizado correctamente.");
      load();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  /* ===============================
     BLOQUEO DE ACCESO
     =============================== */

  if (status === "loading") {
    return <div className="p-10">Cargando...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-semibold mb-4">
          Acceso restringido
        </h2>
        <button
          onClick={() => signIn("google")}
          className="rounded-xl border px-4 py-2"
        >
          Iniciar sesión con Google
        </button>
      </div>
    );
  }

  if (!userEmail || !EDITORS.includes(userEmail)) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-semibold text-red-600">
          Acceso denegado
        </h2>
        <p>No tienes permisos para acceder al panel editorial.</p>
      </div>
    );
  }

  /* ===============================
     PANEL EDITORIAL
     =============================== */

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold">Panel editorial</h1>

      {err && <div className="text-red-600">{err}</div>}
      {msg && <div className="text-green-700">{msg}</div>}

      <div className="text-sm text-zinc-600">
        Sesión activa: {userEmail}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div>
          <h3 className="font-semibold mb-2">Envíos</h3>
          <ul className="border rounded-xl divide-y">
            {items.map((it) => (
              <li key={it.id}>
                <button
                  className="w-full text-left p-3 hover:bg-zinc-50"
                  onClick={() => setSelected(it)}
                >
                  <div className="text-sm font-medium">{it.title}</div>
                  <div className="text-xs text-zinc-500">
                    {statusLabel.get(it.status)}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <div className="space-y-4 border p-6 rounded-xl">
              <h2 className="text-xl font-semibold">{selected.title}</h2>

              <div>
                <label className="text-sm font-medium">Estado</label>
                <select
                  className="mt-1 w-full border rounded p-2"
                  value={selected.status}
                  onChange={(e) =>
                    setSelected({ ...selected, status: e.target.value })
                  }
                >
                  {STATUSES.map((s) => (
                    <option key={s.v} value={s.v}>
                      {s.t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Notas editoriales</label>
                <textarea
                  className="mt-1 w-full border rounded p-2"
                  rows={4}
                  value={selected.editorialNotes || ""}
                  onChange={(e) =>
                    setSelected({
                      ...selected,
                      editorialNotes: e.target.value,
                    })
                  }
                />
              </div>

              <button
                onClick={save}
                className="px-4 py-2 border rounded hover:bg-zinc-50"
              >
                Guardar cambios
              </button>
            </div>
          ) : (
            <div className="text-zinc-600">
              Selecciona un envío para editar.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
