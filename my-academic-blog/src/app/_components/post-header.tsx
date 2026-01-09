import Avatar from "./avatar";
import CoverImage from "./cover-image";
import DateFormatter from "./date-formatter";

type Props = {
  title: string;
  coverImage?: string;
  date?: string;
  author?: {
    name: string;
    picture?: string;
  };
  abstract?: string;
  keywords?: string[];
  received?: string;
  accepted?: string;
  published?: string;
  section?: string;
  type?: string;
};

export function PostHeader({
  title,
  coverImage,
  date,
  author,
  abstract,
  keywords,
  received,
  accepted,
  published,
  section,
  type,
}: Props) {
  return (
    <header className="mb-10 space-y-6">
      {/* Sección y tipo */}
      <div className="flex flex-wrap gap-2 text-xs text-zinc-600">
        {section ? (
          <span className="rounded-full border px-2 py-1">{section}</span>
        ) : null}
        {type ? <span className="rounded-full border px-2 py-1">{type}</span> : null}
      </div>

      {/* Título */}
      <h1 className="text-4xl font-semibold tracking-tight leading-tight">
        {title}
      </h1>

      {/* Autor y fecha */}
      <div className="flex items-center gap-4 text-sm text-zinc-600">
        {author?.name ? (
          <div className="flex items-center gap-2">
            <Avatar name={author.name} picture={author.picture} />
            <span>{author.name}</span>
          </div>
        ) : null}

        {date ? (
          <>
            <span>•</span>
            <time dateTime={date}>
              <DateFormatter dateString={date} />
            </time>
          </>
        ) : null}
      </div>

      {/* Imagen de portada */}
      <div className="mt-6">
        <CoverImage title={title} src={coverImage} />
      </div>

      {/* Resumen / Abstract */}
      {abstract ? (
        <section className="mt-8 rounded-xl border p-5 bg-zinc-50">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-700">
            Resumen
          </h2>
          <p className="mt-2 text-zinc-800 leading-relaxed">{abstract}</p>
        </section>
      ) : null}

      {/* Palabras clave */}
      {keywords && keywords.length > 0 ? (
        <section className="mt-4 text-sm text-zinc-600">
          <span className="font-medium">Palabras clave:</span>{" "}
          {keywords.join(", ")}
        </section>
      ) : null}

      {/* Metadatos editoriales */}
      {(received || accepted || published) ? (
        <section className="mt-4 text-xs text-zinc-500 space-x-3">
          {received ? <span>Recibido: {received}</span> : null}
          {accepted ? <span>Aceptado: {accepted}</span> : null}
          {published ? <span>Publicado: {published}</span> : null}
        </section>
      ) : null}
    </header>
  );
}
