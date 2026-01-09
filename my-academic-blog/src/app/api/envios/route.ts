import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

type SubmissionStatus =
  | "recibido"
  | "revision-editorial"
  | "en-revision"
  | "cambios-solicitados"
  | "aceptado"
  | "rechazado"
  | "publicado";

type Submission = {
  id: string;
  createdAt: string;

  title: string;
  section: string;
  type: string;

  authors: string;
  correspondingAuthor: string;
  email: string;

  affiliation?: string;
  abstract?: string;
  keywords?: string;

  fileName?: string;
  filePath?: string;

  status: SubmissionStatus;

  // seguimiento editorial
  lastUpdatedAt?: string;
  editorialNotes?: string;
  reviewerNotes?: string;
  reviewers?: string; // lista simple: "Nombre (correo); Nombre (correo)"
};

function safeName(name: string) {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function readSubmissions(filePath: string): Promise<Submission[]> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}

async function writeSubmissions(filePath: string, items: Submission[]) {
  await fs.writeFile(filePath, JSON.stringify(items, null, 2), "utf8");
}

function getPaths() {
  const root = process.cwd();
  return {
    dataPath: path.join(root, "data", "submissions.json"),
    uploadDir: path.join(root, "uploads"),
  };
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();

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

    if (!title || !section || !type || !authors || !correspondingAuthor || !email) {
      return NextResponse.json({ ok: false, error: "Faltan campos obligatorios." }, { status: 400 });
    }

    const id = `CA-${Date.now().toString(36).toUpperCase()}`;
    const createdAt = new Date().toISOString();

    const { dataPath, uploadDir } = getPaths();
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.mkdir(path.dirname(dataPath), { recursive: true });

    let fileName: string | undefined;
    if (file && typeof file.arrayBuffer === "function") {
      const extFromName = (file.name || "").split(".").pop()?.toLowerCase();
      const ext = extFromName && ["pdf", "docx"].includes(extFromName) ? extFromName : "bin";

      fileName = `${safeName(id)}-${safeName(title).slice(0, 60)}.${ext}`;
      const fileAbs = path.join(uploadDir, fileName);

      const buf = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(fileAbs, buf);
    }

    const submission: Submission = {
      id,
      createdAt,
      title,
      section,
      type,
      authors,
      correspondingAuthor,
      email,
      affiliation: affiliation || undefined,
      abstract: abstract || undefined,
      keywords: keywords || undefined,
      fileName,
      filePath: fileName ? `uploads/${fileName}` : undefined,
      status: "recibido",
      lastUpdatedAt: createdAt,
      editorialNotes: "",
      reviewerNotes: "",
      reviewers: "",
    };

    const existing = await readSubmissions(dataPath);
    existing.unshift(submission);
    await writeSubmissions(dataPath, existing);

    return NextResponse.json({ ok: true, id });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Error interno." }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { dataPath } = getPaths();
  const items = await readSubmissions(dataPath);

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const email = url.searchParams.get("email");

  // modo autor: filtra por id + email
  if (id && email) {
    const found = items.find((x) => x.id === id && x.email.toLowerCase() === email.toLowerCase());
    if (!found) return NextResponse.json({ ok: false, error: "No encontrado." }, { status: 404 });

    // devolvemos sin ruta absoluta
    return NextResponse.json({
      ok: true,
      item: {
        id: found.id,
        title: found.title,
        section: found.section,
        type: found.type,
        status: found.status,
        createdAt: found.createdAt,
        lastUpdatedAt: found.lastUpdatedAt,
        editorialNotes: found.editorialNotes,
      },
    });
  }

  // modo panel: listado completo
  return NextResponse.json({ ok: true, items });
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const id = String(body?.id || "").trim();
    const key = String(body?.key || "").trim();

    // Clave demo (cambiar luego). Se puede mover a .env
    const ADMIN_KEY = process.env.CA_ADMIN_KEY || "CAMBIAME-123";

    if (!id) return NextResponse.json({ ok: false, error: "Falta id." }, { status: 400 });
    if (!key || key !== ADMIN_KEY) {
      return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
    }

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

    if (!allowed.includes(status)) {
      return NextResponse.json({ ok: false, error: "Estado inválido." }, { status: 400 });
    }

    const { dataPath } = getPaths();
    const items = await readSubmissions(dataPath);

    const idx = items.findIndex((x) => x.id === id);
    if (idx === -1) return NextResponse.json({ ok: false, error: "No encontrado." }, { status: 404 });

    const now = new Date().toISOString();
    items[idx] = {
      ...items[idx],
      status,
      editorialNotes,
      reviewerNotes,
      reviewers,
      lastUpdatedAt: now,
    };

    await writeSubmissions(dataPath, items);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Error interno." }, { status: 500 });
  }
}
