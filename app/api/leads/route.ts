import { NextResponse } from "next/server";
import { createLead } from "@/lib/queries/leads";
import { notifyNewLead } from "@/lib/notifications/leadNotification";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const email = body.email ? String(body.email).trim() : undefined;
    const message = String(body.message || "").trim();
    const source = String(body.source || "iletisim").trim();
    const listingId = body.listingId ? String(body.listingId) : undefined;

    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Geçerli bir ad girin." }, { status: 400 });
    }
    if (!phone || phone.length < 10) {
      return NextResponse.json({ error: "Geçerli bir telefon girin." }, { status: 400 });
    }
    if (!message || message.length < 5) {
      return NextResponse.json({ error: "Mesaj en az 5 karakter olmalı." }, { status: 400 });
    }

    const lead = await createLead({ name, phone, email, message, source, listingId });

    let listingTitle: string | null = null;
    if (listingId) {
      const listing = await prisma.listing.findUnique({
        where: { id: listingId },
        select: { title: true },
      });
      listingTitle = listing?.title ?? null;
    }

    await notifyNewLead({
      id: lead.id,
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      message: lead.message,
      source: lead.source,
      listingId: lead.listingId,
      listingTitle,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Kayıt oluşturulamadı." }, { status: 500 });
  }
}
