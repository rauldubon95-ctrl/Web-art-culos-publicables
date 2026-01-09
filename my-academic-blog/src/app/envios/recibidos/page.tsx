async function getData() {
  const res = await fetch("http://localhost:3000/api/envios", { cache: "no-store" });
  return res.json();
}

export default async function RecibidosPage() {
  const data = await getData();
  const items = data?.items || [];

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Envíos recibidos (demo)</h1>
        <p className="text-zinc-600">
          Vista interna simple para el comité editorial (solo para pruebas locales).
        </p>
      </header>

      <div className="grid gap-3">
        {items.length === 0 ? (
          <div className="rounded-xl border p-5 text-zinc-700">
            Aún no hay envíos registrados.
          </div>
        ) : (
          items.map((s: any) => (
            <div key={s.id} className="rounded-xl border p-5">
              <div className="text-sm text-zinc-500">{s.id} • {new Date(s.createdAt).toLocaleString()}</div>
              <div className="text-lg font-semibold mt-1">{s.title}</div>
              <div className="text-sm text-zinc-700 mt-1">
                <span className="font-medium">Sección:</span> {s.section} • <span className="font-medium">Tipo:</span> {s.type}
              </div>
              <div className="text-sm text-zinc-700">
                <span className="font-medium">Autores:</span> {s.authors}
              </div>
              <div className="text-sm text-zinc-700">
                <span className="font-medium">Contacto:</span> {s.email}
              </div>
              {s.filePath ? (
                <div className="text-sm text-zinc-600 mt-2">
                  Archivo guardado: <span className="font-mono">{s.filePath}</span>
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
