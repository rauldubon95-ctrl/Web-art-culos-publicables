import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug, type } = body; 

    if (!slug) return NextResponse.json({ error: "Falta slug" }, { status: 400 });

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
    
    if (country) {
      await prisma.visitorCountry.upsert({
        where: { code: country },
        update: { count: { increment: 1 } },
        create: { code: country, count: 1 },
      });
    }

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
