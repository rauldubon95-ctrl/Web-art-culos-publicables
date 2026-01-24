"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession, signIn } from "next-auth/react";

// --- BASE DE DATOS SIMULADA ---
const MOCK_EXPERTS = [
  { id: 1, name: "Dr. Carlos Méndez", email: "cmendez@universidad.edu", area: "Sociología Política" },
  { id: 2, name: "Dra. Elena Rojas", email: "elena.rojas@research.org", area: "Antropología" },
  { id: 3, name: "MSc. Javier Dubón", email: "raul.dubon95@gmail.com", area: "Metodología (TEST)" },
  { id: 4, name: "Dr. Revisor Externo", email: "revisor.externo@gmail.com", area: "Ciencias Sociales" }
];

const EDITORS = [
  "raul.dubon95@gmail.com", 
  "rauldubon95-ctrl@gmail.com"
];

const ADMIN_KEY = "CAMBIAME-123"; 

const STATUSES = [
  { v: "recibido", t: "Recibido" },
  { v: "revision-editorial", t: "Revisión Editorial" },
  { v: "en-revision", t: "En Revisión por Pares" },
  { v: "cambios-solicitados", t: "Cambios Solicitados" },
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
  
  const [reviewers, setReviewers] = useState<any[]>([]);
  const [newReviewerName, setNewReviewerName] = useState("");
  const [newReviewerEmail, setNewReviewerEmail] = useState("");
  const [inviteStatus, setInviteStatus] = useState<string | null>(null);
  const [selectedExpertId, setSelectedExpertId] = useState("");

  const statusLabel = useMemo(() => {
    const m = new Map<string, string>();
    STATUSES.forEach((s) => m.set(s.v, s.t));
    return m;
  }, []);

  const userEmail = session?.user?.email;

  useEffect(() => {
    if (status === "authenticated" && userEmail && isEditor(userEmail)) {
      loadSubmissions();
    }
  }, [status, userEmail]);

  useEffect(() => {
    if (selected?.id) {
      loadReviewers(selected.id);
      setInviteStatus(null);
      setMsg(null);
      setNewReviewerName("");
      setNewReviewerEmail("");
      setSelectedExpertId("");
    }
  }, [selected]);

  function isEditor(email: string) {
    if (!email) return false;
    if (EDITORS.length === 0) return true;
    return EDITORS.some(e => email.includes(e) || e === email);
  }

  async function loadSubmissions() {
    setLoading(true);
    try {
      const res = await fetch("/api/envios", { cache: "no-store" });
      const json = await res.json();
      if (json.ok) setItems(json.items || []);
    } finally {
      setLoading(false);
    }
  }

  async function loadReviewers(submissionId: string) {
    const res = await fetch(`/api/revisores?submissionId=${submissionId}`);
    const json = await res.json();
    if (json.ok) setReviewers(json.items || []);
  }

  function handleExpertSelect(e: any) {
    const expertId = e.target.value;
    setSelectedExpertId(expertId);
    
    const expert = MOCK_EXPERTS.find(ex => ex.id.toString() === expertId);
    if (expert) {
      setNewReviewerName(expert.name);
      setNewReviewerEmail(expert.email);
    } else {
      setNewReviewerName("");
      setNewReviewerEmail("");
    }
  }

  async function inviteReviewer() {
    if (!selected || !newReviewerName || !newReviewerEmail) return;
    
    setLoading(true);
    setInviteStatus(null);

    try {
      const res = await fetch("/api/revisores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: selected.id,
          reviewerName: newReviewerName,
          reviewerEmail: newReviewerEmail,
          key: ADMIN_KEY 
        }),
      });
      const json = await res.json();
      
      if (json.ok) {
        setInviteStatus("Invitación enviada correctamente");
        setNewReviewerName("");
        setNewReviewerEmail("");
        setSelectedExpertId("");
        loadReviewers(selected.id); 
        
        if (selected.status === "recibido" || selected.status === "revision-editorial") {
            updateStatus("en-revision");
        }
      } else {
        alert("Error: " + json.error);
      }
    } catch (e) {
      alert("Error de red.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(newStatus: string) {
    if (!selected) return;
    const res = await fetch("/api/envios", {
      method: "PATCH", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...selected, status: newStatus }), 
    });
    if (res.ok) {
        setSelected({ ...selected, status: newStatus });
        loadSubmissions();
        setMsg("Guardado");
    }
  }

  if (status === "loading") return <div className="p-10 text-zinc-500 font-serif">Cargando escritorio editorial...</div>;
  
  if (!userEmail || !isEditor(userEmail)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        <h2 className="text-xl font-serif font-bold text-zinc-900">Acceso Editorial</h2>
        <p className="text-zinc-500 mb-6 font-serif italic">Solo personal autorizado.</p>
        <button onClick={() => signIn("google")} className="bg-zinc-900 text-white px-6 py-2 rounded-full hover:bg-zinc-800 transition">Entrar</button>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-zinc-50/30 p-4 md:p-8 font-sans text-zinc-900">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-200 pb-6 mb-8 gap-4">
        <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-zinc-900">Escritorio Editorial</h1>
            <p className="text-sm text-zinc-500 mt-1">Sesión activa: <span className="font-medium text-zinc-700">{session?.user?.name}</span></p>
        </div>
        <button onClick={loadSubmissions} className="text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 transition flex items-center gap-1">
          Actualizar Lista ↻
        </button>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUMNA IZQUIERDA: LISTA */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
             <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Manuscritos Recientes</h3>
             <span className="text-xs bg-zinc-100 px-2 py-1 rounded-full text-zinc-500">{items.length}</span>
          </div>
          
          <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden max-h-[75vh] overflow-y-auto">
            {items.length === 0 && <div className="p-10 text-center text-zinc-400 font-serif italic">No hay manuscritos pendientes.</div>}
            <ul className="divide-y divide-zinc-100">
              {items.map((it) => (
                <li key={it.id}>
                  <button
                    className={`w-full text-left p-5 transition-all duration-200 group ${selected?.id === it.id ? 'bg-zinc-50 border-l-4 border-zinc-900' : 'hover:bg-zinc-50 border-l-4 border-transparent'}`}
                    onClick={() => setSelected(it)}
                  >
                    <div className="font-serif font-bold text-zinc-900 leading-snug group-hover:text-zinc-700">{it.title}</div>
                    <div className="flex justify-between items-end mt-3">
                        <div className="text-xs text-zinc-500">
                           <span className="block font-medium text-zinc-800">{it.authorName}</span>
                           <span className="text-zinc-400">{new Date(it.createdAt).toLocaleDateString()}</span>
                        </div>
                        <span className={`text-[10px] uppercase tracking-wide px-2 py-1 rounded border ${
                            it.status === 'recibido' ? 'bg-white border-zinc-300 text-zinc-600' : 
                            it.status === 'publicado' ? 'bg-zinc-900 border-zinc-900 text-white' : 
                            'bg-zinc-100 border-zinc-200 text-zinc-500'
                        }`}>
                            {statusLabel.get(it.status)}
                        </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* COLUMNA DERECHA: DETALLE */}
        <div className="lg:col-span-8">
          {selected ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              
              {/* TARJETA PRINCIPAL DEL ARTÍCULO */}
              <div className="bg-white border border-zinc-200 p-8 rounded-lg shadow-sm relative">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start gap-4">
                        <h2 className="text-3xl font-serif font-bold text-zinc-900 leading-tight">{selected.title}</h2>
                        <a href={selected.fileUrl || "#"} target="_blank" className="shrink-0 bg-zinc-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-zinc-700 transition shadow-sm">
                            Ver PDF
                        </a>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-y-2 gap-x-8 text-sm text-zinc-600 border-t border-zinc-100 pt-4 mt-2">
                        <p><span className="font-bold text-zinc-900">Autor:</span> {selected.authorName}</p>
                        <p><span className="font-bold text-zinc-900">Afiliación:</span> {selected.affiliation}</p>
                        <p><span className="font-bold text-zinc-900">Contacto:</span> {selected.email}</p>
                        <p><span className="font-bold text-zinc-900">Sección:</span> {selected.section}</p>
                    </div>
                </div>

                {/* VISTA PREVIA HTML */}
                {selected.contentHtml && (
                  <div className="mt-6 pt-6 border-t border-zinc-100">
                    <details className="group">
                      <summary className="cursor-pointer text-sm font-bold text-zinc-500 hover:text-zinc-900 flex items-center gap-2 select-none">
                        <span className="group-open:rotate-90 transition-transform">▶</span>
                        Vista de Lectura (HTML)
                      </summary>
                      <div className="mt-4 p-6 bg-zinc-50 border border-zinc-200 rounded text-zinc-800 prose prose-zinc prose-sm max-w-none max-h-96 overflow-y-auto font-serif" dangerouslySetInnerHTML={{ __html: selected.contentHtml }} />
                    </details>
                  </div>
                )}
              </div>

              {/* GESTIÓN DE REVISORES (LIMPIA, SIN MORADOS) */}
              <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
                <div className="bg-zinc-50/50 p-4 border-b border-zinc-200 flex items-center justify-between">
                    <h3 className="font-bold text-zinc-900 text-sm uppercase tracking-wide flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-zinc-900"></span>
                      Asignación de Pares
                    </h3>
                    <span className="text-xs text-zinc-400">Doble Ciego</span>
                </div>
                
                <div className="p-6 space-y-8">
                    {/* FORMULARIO DE INVITACIÓN */}
                    <div className="grid gap-5 p-5 border border-zinc-100 rounded-lg bg-zinc-50/30">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase">1. Seleccionar Experto</label>
                            <select 
                              className="w-full border border-zinc-300 rounded p-2.5 bg-white text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-all"
                              value={selectedExpertId}
                              onChange={handleExpertSelect}
                            >
                              <option value="">-- Buscar en Directorio --</option>
                              {MOCK_EXPERTS.map(exp => (
                                <option key={exp.id} value={exp.id}>{exp.name} — {exp.area}</option>
                              ))}
                            </select>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-400 uppercase">Nombre</label>
                                <input 
                                    type="text" 
                                    className="w-full border border-zinc-300 rounded p-2.5 bg-white text-sm focus:border-zinc-900 outline-none"
                                    value={newReviewerName}
                                    onChange={(e) => setNewReviewerName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-400 uppercase">Correo Institucional</label>
                                <input 
                                    type="email" 
                                    className="w-full border border-zinc-300 rounded p-2.5 bg-white text-sm focus:border-zinc-900 outline-none"
                                    value={newReviewerEmail}
                                    onChange={(e) => setNewReviewerEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        <button 
                            onClick={inviteReviewer} 
                            disabled={loading || !newReviewerName || !newReviewerEmail}
                            className="w-full bg-zinc-900 text-white px-4 py-3 rounded font-bold text-sm hover:bg-zinc-700 disabled:opacity-50 transition shadow-sm"
                        >
                            {loading ? "Procesando envío..." : "Enviar Solicitud Formal"}
                        </button>

                        {inviteStatus && (
                            <div className="text-center text-xs font-bold text-green-700 bg-green-50 p-2 rounded border border-green-100">
                                ✓ {inviteStatus}
                            </div>
                        )}
                    </div>

                    {/* LISTA DE EVALUACIONES */}
                    <div>
                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Dictámenes en Curso</h4>
                        {reviewers.length === 0 ? (
                            <p className="text-sm text-zinc-400 italic text-center py-4 border border-dashed rounded">Ningún revisor asignado.</p>
                        ) : (
                            <ul className="space-y-3">
                                {reviewers.map((r) => (
                                    <li key={r.id} className="border border-zinc-200 p-4 rounded bg-white flex justify-between items-center hover:border-zinc-300 transition-colors">
                                        <div>
                                            <div className="font-bold text-zinc-900 text-sm">{r.reviewerName}</div>
                                            <div className="text-xs text-zinc-500 font-mono">{r.reviewerEmail}</div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                r.status === 'completado' 
                                                ? (r.verdict === 'aceptar' ? 'bg-zinc-900 text-white' : 'bg-zinc-200 text-zinc-600')
                                                : 'bg-white border border-zinc-200 text-zinc-400'
                                            }`}>
                                                {r.status === 'completado' ? r.verdict : 'Pendiente'}
                                            </span>
                                            {r.feedback && (
                                                <button onClick={() => alert(r.feedback)} className="block text-xs text-blue-800 underline mt-1 hover:text-black">
                                                    Ver Informe
                                                </button>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-300 p-10 border-2 border-dashed border-zinc-200 rounded-lg">
              <span className="text-4xl mb-4 grayscale opacity-20">📄</span>
              <p className="font-serif italic">Seleccione un manuscrito para comenzar.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}