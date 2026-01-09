import Image from "next/image";

type Miembro = {
  name: string;
  role: string;
  area: string;
  affiliation?: string;
  bio: string;
  photo?: string; // ruta en /public
  orcid?: string;
};

const equipo: Miembro[] = [
  {
    name: "José Raúl Dubón Huezo",
    role: "Director editorial",
    area: "Sociología • Monitoreo y evaluación • Políticas públicas",
    affiliation: "El Salvador",
    bio:
      "Sociólogo e investigador, con experiencia en diseño de sistemas de monitoreo y evaluación, análisis de políticas públicas y coordinación de proyectos académicos. Su trabajo se orienta a la producción de evidencia social aplicada, con énfasis en rigor metodológico, transparencia y acceso abierto.",
    photo: "/equipo/raul-dubon.jpg",
    orcid: "0009-0007-2398-7927",
  },
  {
    name: "Ariel Quintanilla Magaña",
    role: "Editor asociado",
    area: "Geografía humana • Socioecología • Sistemas territoriales",
    affiliation: "Investigación socioambiental y GIS",
    bio:
      "Geógrafo humano/sociólogo con trayectoria en análisis territorial, sistemas socioecológicos y herramientas de información geográfica (GIS). Interés en gobernanza, justicia ambiental y dinámicas socioambientales en América Latina.",
    photo: "/equipo/ariel-quintanilla.jpg",
    orcid: "0000-0002-4412-8482",
  },
  {
    name: "Jesús Osmán Juárez Artiga",
    role: "Editor asociado",
    area: "Política social • Deporte • Desarrollo • Gestión",
    affiliation: "Programas socio-deportivos y políticas públicas",
    bio:
      "Profesional con experiencia en gestión y seguimiento de programas socio-deportivos, con enfoque en inclusión, trabajo con juventudes y articulación institucional. Su interés se centra en evaluación de intervenciones, gobernanza y modelos de desarrollo con enfoque de derechos.",
    photo: "/equipo/jesus-juarez.jpg",
  },
  {
    name: "Reina de los Ángeles Díaz López",
    role: "Miembro del consejo editorial",
    area: "Antropología sociocultural • Comunidad • Memoria",
    affiliation: "Investigación cualitativa y análisis territorial",
    bio:
      "Antropóloga con experiencia en investigación cualitativa aplicada, trabajo comunitario y análisis sociocultural. Interés en memoria colectiva, identidad, enfoques de género y producción de conocimiento situado.",
    photo: "/equipo/angeles-diaz.jpg",
  },
];

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs text-zinc-700">
      {children}
    </span>
  );
}

export default function EquipoEditorialPage() {
  return (
    <section className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Equipo editorial</h1>
        <p className="text-zinc-600 max-w-3xl">
          <span className="font-medium">Cuadernos Abiertos</span> es una revista académica
          interdisciplinaria de acceso público, orientada a investigación original, ensayos
          críticos y revisiones con estándar científico. Esta página presenta el equipo
          responsable de la política editorial, la integridad académica y el proceso de revisión.
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          <Badge>Acceso abierto</Badge>
          <Badge>Revisión por pares (cuando aplique)</Badge>
          <Badge>Transparencia editorial</Badge>
          <Badge>Rigor metodológico</Badge>
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {equipo.map((m) => (
          <article key={m.name} className="rounded-2xl border p-6 space-y-4">
            <div className="flex gap-4">
              <div className="shrink-0">
                <div className="relative h-20 w-20 overflow-hidden rounded-2xl border bg-zinc-50">
                  {m.photo ? (
                    <Image
                      src={m.photo}
                      alt={`Foto de ${m.name}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                      priority={m.role === "Director editorial"}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs text-zinc-500">
                      Sin foto
                    </div>
                  )}
                </div>
              </div>

              <div className="min-w-0 space-y-1">
                <h2 className="text-lg font-semibold leading-tight">{m.name}</h2>
                <div className="text-sm text-zinc-700">{m.role}</div>
                <div className="text-sm text-zinc-600">{m.area}</div>
                {m.affiliation ? (
                  <div className="text-xs text-zinc-500">{m.affiliation}</div>
                ) : null}
                {m.orcid ? (
                  <div className="text-xs text-zinc-500">
                    ORCID: <span className="font-mono">{m.orcid}</span>
                  </div>
                ) : null}
              </div>
            </div>

            <p className="text-sm text-zinc-700 leading-relaxed">{m.bio}</p>
          </article>
        ))}
      </div>

      <div className="rounded-2xl border p-6 space-y-2">
        <h2 className="text-lg font-semibold">Estructura y buenas prácticas (simulación)</h2>
        <p className="text-sm text-zinc-700 leading-relaxed">
          En esta fase, el sitio simula componentes editoriales clave (envío, seguimiento y panel).
          La autenticación por cuentas (p. ej., Google) y la gestión de roles (autor, revisor, editor)
          se incorporarán en una fase posterior, cuando se defina el esquema definitivo de operación
          (política de datos, flujo de revisión, y seguridad).
        </p>
      </div>
    </section>
  );
}
