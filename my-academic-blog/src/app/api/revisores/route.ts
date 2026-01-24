import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

// ----------------------------------------------------------------------
// POST: Generar link y ENVIAR CORREO (Invitación)
// ----------------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const submissionId = String(body?.submissionId || "");
    const key = String(body?.key || "");
    const reviewerName = String(body?.reviewerName || "Colega");
    const reviewerEmail = String(body?.reviewerEmail || "").trim();

    // 1. SEGURIDAD
    const ADMIN_KEY = process.env.CA_ADMIN_KEY || "CAMBIAME-123";
    if (key !== ADMIN_KEY) {
      return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
    }

    if (!submissionId || !reviewerEmail) {
      return NextResponse.json({ ok: false, error: "Faltan datos (ID o Email)" }, { status: 400 });
    }

    // 2. GENERAR TOKEN ÚNICO
    const token = randomBytes(16).toString("hex");

    // 3. GUARDAR EN BASE DE DATOS
    const newReview = await prisma.reviewToken.create({
      data: {
        token,
        submissionId,
        reviewerName,
        reviewerEmail,
        status: "pendiente",
      },
    });

    // 4. CONFIGURAR EL ENVÍO DE CORREO (NODEMAILER)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, 
        pass: process.env.GMAIL_PASS, 
      },
    });

    const origin = req.headers.get("origin") || "http://localhost:3000";
    const magicLink = `${origin}/revision/evaluar?token=${token}`;

    // 5. ENVIAR EL CORREO
    await transporter.sendMail({
      from: '"Cuadernos Abiertos" <no-reply@cuadernosabiertos.org>',
      to: reviewerEmail,
      subject: `Invitación a revisión: "${reviewerName}"`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #111;">Estimado/a ${reviewerName},</h2>
          <p>El Consejo Editorial de <strong>Cuadernos Abiertos</strong> le extiende una cordial invitación para evaluar un manuscrito en su área de especialidad.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #000; margin: 20px 0;">
            <p style="margin: 0; color: #555;">Hemos generado un enlace seguro de acceso directo. No requiere usuario ni contraseña.</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${magicLink}" style="background-color: #000; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
              Acceder al Manuscrito y Evaluar
            </a>
          </div>

          <p style="font-size: 12px; color: #888; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
            Si el botón no funciona, copie este enlace en su navegador:<br/>
            <a href="${magicLink}" style="color: #666;">${magicLink}</a>
          </p>
        </div>
      `,
    });

    return NextResponse.json({ 
      ok: true, 
      message: "Invitación enviada correctamente",
      reviewId: newReview.id 
    });

  } catch (error: any) {
    console.error("Error enviando correo:", error);
    return NextResponse.json({ ok: false, error: "Error al enviar correo: " + error.message }, { status: 500 });
  }
}

// ----------------------------------------------------------------------
// GET: Ver revisiones (Historial)
// ----------------------------------------------------------------------
export async function GET(req: Request) {
  const url = new URL(req.url);
  const submissionId = url.searchParams.get("submissionId");
  if (!submissionId) return NextResponse.json({ ok: false, items: [] });

  const reviews = await prisma.reviewToken.findMany({
    where: { submissionId },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ ok: true, items: reviews });
}

// ----------------------------------------------------------------------
// PUT: GUARDAR EVALUACIÓN (Lo que faltaba)
// ----------------------------------------------------------------------
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { token, verdict, feedback } = body;

    if (!token || !verdict) {
      return NextResponse.json({ ok: false, error: "Datos incompletos" }, { status: 400 });
    }

    // 1. Buscar token
    const review = await prisma.reviewToken.findUnique({ where: { token } });
    if (!review) return NextResponse.json({ ok: false, error: "Enlace inválido" }, { status: 404 });

    // 2. Guardar dictamen
    await prisma.reviewToken.update({
      where: { id: review.id },
      data: {
        status: "completado",
        verdict,
        feedback,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}