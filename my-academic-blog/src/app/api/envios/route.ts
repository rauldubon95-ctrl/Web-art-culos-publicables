import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth"; 
import { put } from "@vercel/blob"; // [NUEVO] Importamos la nube
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

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
// POST: RECEPCIÓN DE MANUSCRITOS (HÍBRIDO: NUBE + LOCAL)
// ----------------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const form = await req.formData();

    // 1. Recibir datos
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
    let fileUrl = "";

    // 2. LÓGICA DE GUARDADO INTELIGENTE
    if (file && file.size > 0) {
      const ext = (file.name || "").split(".").pop()?.toLowerCase() || "pdf";
      const filename = `${safeName(id)}-${safeName(title).slice(0, 50)}.${ext}`;

      // A) MODO PRODUCCIÓN (Vercel Blob)
      // Si existe el token de Vercel, usamos la nube automáticamente.
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        console.log("☁️ Subiendo a Vercel Blob Storage...");
        const blob = await put(filename, file, {
          access: 'public',
        });
        fileUrl = blob.url;
      } 
      // B) MODO DESARROLLO (Local / Codespaces)
      // Si no hay token, usamos el disco local.
      else {
        console.log("💻 Guardando en disco local (Codespaces)...");
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await fs.mkdir(uploadDir, { recursive: true });
        
        const fileAbs = path.join(uploadDir, filename);
        const buf = Buffer.from(await file.arrayBuffer());
        await fs.writeFile(fileAbs, buf);
        
        fileUrl = `/uploads/${filename}`;
      }
    }

    // 3. Guardar en Base de Datos (Neon)
    const submission = await prisma.submission.create({
      data: {
        id,
        title,
        section,
        type,
        authorName: authors,
        correspondingAuthor,
        email,
        affiliation,
        abstract,
        keywords,
        fileUrl, 
        status: "recibido",
      },
    });

    return NextResponse.json({ ok: true, id: submission.id });

  } catch (e: any) {
    console.error("Error crítico en POST:", e);
    return NextResponse.json({ ok: false, error: "Error al procesar el envío." }, { status: 500 });
  }
}

// ----------------------------------------------------------------------
// GET: CONSULTA DE ESTADO (SEGURIDAD DE SESIÓN)
// ----------------------------------------------------------------------
export async function GET(req: Request) {
  try {
    const session = await auth(); 
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (id) {
      const found = await prisma.submission.findUnique({
        where: { id: id }
      });

      if (!found) return NextResponse.json({ ok: false, error: "No encontrado." }, { status: 404 });

      // Verificamos permisos: Dueño o Admin
      const isOwner = session?.user?.email === found.email;
      // Puedes definir tu email como admin aquí o en variables de entorno
      const isAdmin = session?.user?.email === "raul.dubon@ues.edu.sv"; 

      if (isOwner || isAdmin) {
         return NextResponse.json({ ok: true, item: found });
      } else {
        // Vista pública restringida
        return NextResponse.json({
          ok: true,
          item: {
            id: found.id,
            title: found.title,
            status: found.status,
            createdAt: found.createdAt,
          }
        });
      }
    }

    // Para ver LISTA COMPLETA (Solo admins logueados)
    if (!session?.user) {
       return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
    }

    const items = await prisma.submission.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ ok: true, items });
    
  } catch (error) {
    return NextResponse.json({ ok: false, items: [] }, { status: 500 });
  }
}