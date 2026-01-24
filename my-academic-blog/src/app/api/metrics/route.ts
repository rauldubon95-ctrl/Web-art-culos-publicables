import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug, type } = body; 

    if (!slug) return NextResponse.json({ error: "Falta slug" }, { status: 400 });

    // 1. ACTUALIZAR LOS CONTADORES RÁPIDOS (Para el Footer)
    await prisma.postMetric.upsert({
      where: { slug },
      update: {
        views: type === 'view' ? { increment: 1 } : undefined,
        downloads: type === 'download' ? { increment: 1 } : undefined,
        lastView: new Date(),
      },
      create: {
        slug,
        views: type === 'view' ? 1 : 0,
        downloads: type === 'download' ? 1 : 0,
      },
    });

    const country = req.headers.get("x-vercel-ip-country");
    
    // 2. ACTUALIZAR CONTADOR DE PAÍSES (Para el Footer)
    if (country) {
      await prisma.visitorCountry.upsert({
        where: { code: country },
        update: { count: { increment: 1 } },
        create: { code: country, count: 1 },
      });
    }

    // 3. NUEVO: GRABAR EN EL HISTORIAL (Para tus Gráficas Futuras)
    // Esto guarda fecha y hora exacta de cada visita
    await prisma.analyticsLog.create({
      data: {
        slug: slug,
        type: type || 'view',
        country: country || 'unknown',
        // createdAt se pone automático con la fecha de hoy
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error métricas:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function GET() {
  try {
    const totalViews = await prisma.postMetric.aggregate({
      _sum: { views: true, downloads: true }
    });
    
    const totalCountries = await prisma.visitorCountry.count();

    return NextResponse.json({
      views: totalViews._sum.views || 0,
      downloads: totalViews._sum.downloads || 0,
      countries: totalCountries
    });
  } catch (error) {
    return NextResponse.json({ views: 0, downloads: 0, countries: 0 });
  }
}