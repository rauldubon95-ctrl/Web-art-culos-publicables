import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // El motor nuevo (Neon)
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

// MANTENEMOS TUS ESTADOS ORIGINALES
type SubmissionStatus =
  | "recibido"
  | "revision-editorial"
  | "en-revision"
  | "cambios-solicitados"
  | "aceptado"
  | "rechazado"
  | "publicado";

// Función auxiliar para limpiar nombres (SE QUEDA IGUAL)
function safeName(name: string) {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ----------------------------------------------------------------------
// POST: CREAR ENVÍO (Lógica intacta + Motor Prisma)
// ----------------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const form = await req.formData();

    // 1. Recibir datos (IGUAL)
    const title = String(form.get("title") || "").trim();
    const section = String(form.get("section") || "").trim();
    const type = String(form.get("type") || "").trim();
    const authors = String(form.get("authors") || "").trim();
    const correspondingAuthor = String(form.get("correspondingAuthor") || "").trim();
    const email = String(form.get("email") || "").trim();
    const affiliation = String(form.get("affiliation") || "").trim();
    const abstract = String(form.get("abstract") || "").trim();
    const keywords = String(form.get("keywords") || "").trim();
    const file = form.get("file") as File | null;

    // 2. Validaciones (IGUAL)
    if (!title || !section || !type || !authors || !correspondingAuthor || !email) {
      return NextResponse.json({ ok: false, error: "Faltan campos obligatorios." }, { status: 400 });
    }

    // 3. Generar ID amigable "CA-..." (CONSERVAMOS ESTO)
    // Aunque Prisma genera IDs, el tuyo es más bonito para la revista.
    const id = `CA-${Date.now().toString(36).toUpperCase()}`;

    // 4. Guardar PDF en disco (CONSERVAMOS ESTO)
    let fileUrl = "";
    if (file && typeof file.arrayBuffer === "function") {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });

      const ext = (file.name || "").split(".").pop()?.toLowerCase() || "bin";
      const fileName = `${safeName(id)}-${safeName(title).slice(0, 60)}.${ext}`;
      const fileAbs = path.join(uploadDir, fileName);

      const buf = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(fileAbs, buf);
      
      fileUrl = `/uploads/${fileName}`;
    }

    // 5. GUARDAR EN NEON (AQUÍ CAMBIA: Usamos Prisma en vez de writeSubmissions)
    const submission = await prisma.submission.create({
      data: {
        id, // Forzamos tu ID "CA-..."
        title,
        section,
        type,
        authorName: authors, // Mapeo a tu schema
        correspondingAuthor,
        email,
        affiliation,
        abstract,
        keywords,
        fileUrl, 
        status: "recibido", // Estado inicial
      },
    });

    return NextResponse.json({ ok: true, id: submission.id });

  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "Error interno al guardar." }, { status: 500 });
  }
}

// ----------------------------------------------------------------------
// GET: LEER (Con tus filtros de seguridad)
// ----------------------------------------------------------------------
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const email = url.searchParams.get("email");

    // MODO AUTOR: Solo ve SU artículo (Seguridad mantenida)
    if (id && email) {
      const found = await prisma.submission.findFirst({
        where: {
          id: id,
          email: { equals: email, mode: 'insensitive' } // Ignora mayúsculas/minúsculas
        }
      });

      if (!found) return NextResponse.json({ ok: false, error: "No encontrado." }, { status: 404 });

      return NextResponse.json({
        ok: true,
        item: {
          // Devolvemos solo lo que el autor necesita ver
          id: found.id,
          title: found.title,
          section: found.section,
          type: found.type,
          status: found.status,
          createdAt: found.createdAt,
          editorialNotes: found.editorialNotes,
        },
      });
    }

    // MODO PANEL: Ve todo (Ordenado por fecha)
    const items = await prisma.submission.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ ok: true, items });
    
  } catch (error) {
    return NextResponse.json({ ok: false, items: [] });
  }
}

// ----------------------------------------------------------------------
// PATCH: ACTUALIZAR (Con tu seguridad ADMIN_KEY)
// ----------------------------------------------------------------------
export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const id = String(body?.id || "").trim();
    const key = String(body?.key || "").trim();

    // TU CLAVE DE SEGURIDAD (Se mantiene)
    const ADMIN_KEY = process.env.CA_ADMIN_KEY || "CAMBIAME-123";

    if (!id) return NextResponse.json({ ok: false, error: "Falta id." }, { status: 400 });
    if (!key || key !== ADMIN_KEY) {
      return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
    }

    // VALIDACIÓN DE ESTADOS (Se mantiene tu lista estricta)
    const allowed: SubmissionStatus[] = [
      "recibido",
      "revision-editorial",
      "en-revision",
      "cambios-solicitados",
      "aceptado",
      "rechazado",
      "publicado",
    ];

    const status = String(body?.status || "").trim() as SubmissionStatus;
    const editorialNotes = String(body?.editorialNotes || "");
    const reviewerNotes = String(body?.reviewerNotes || "");
    const reviewers = String(body?.reviewers || "");

    if (status && !allowed.includes(status)) {
      return NextResponse.json({ ok: false, error: "Estado inválido." }, { status: 400 });
    }

    // ACTUALIZAR EN NEON
    await prisma.submission.update({
      where: { id },
      data: {
        status,
        editorialNotes,
        reviewerNotes,
        reviewers,
        // Prisma actualiza 'updatedAt' automático si lo configuramos, 
        // pero aquí no es necesario campo extra manual
      }
    });

    return NextResponse.json({ ok: true });

  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Error interno." }, { status: 500 });
  }
}
