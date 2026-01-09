import Image from "next/image";
import Link from "next/link";

type Props = {
  title: string;
  src?: string | null;
  slug?: string;
};

export default function CoverImage({ title, src, slug }: Props) {
  const hasSrc = typeof src === "string" && src.trim().length > 0;

  const content = hasSrc ? (
    <Image
      src={src as string}
      alt={`Cover Image for ${title}`}
      className="shadow-sm w-full h-auto rounded-lg border"
      width={2000}
      height={1200}
      priority={false}
    />
  ) : (
    <div className="w-full rounded-lg border shadow-sm bg-gradient-to-b from-zinc-50 to-white">
      <div className="aspect-[16/9] w-full flex items-end p-6">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-wide text-zinc-500">
            Cuadernos Abiertos
          </div>
          <div className="mt-2 text-lg md:text-xl font-semibold leading-snug text-zinc-900">
            {title}
          </div>
          <div className="mt-2 text-sm text-zinc-600">
            (Portada no disponible — placeholder editorial)
          </div>
        </div>
      </div>
    </div>
  );

  return slug ? (
    <Link href={`/posts/${slug}`} aria-label={title}>
      {content}
    </Link>
  ) : (
    content
  );
}
