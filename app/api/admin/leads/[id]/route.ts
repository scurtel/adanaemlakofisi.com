import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/guard";
import { deleteLead, updateLeadStatus } from "@/lib/queries/leads";
import type { LeadStatus } from "@/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}
export async function PATCH(request: Request, { params }: RouteParams) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const { id } = await params;
  const body = await request.json();
  const status = body.status as LeadStatus;
  const valid: LeadStatus[] = ["yeni", "arandi", "ilgileniyor", "kapandi", "olumsuz"];
  if (!valid.includes(status)) {
    return NextResponse.json({ error: "Geçersiz durum." }, { status: 400 });
  }
  const lead = await updateLeadStatus(id, status);
  return NextResponse.json(lead);
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const { id } = await params;
  await deleteLead(id);
  return NextResponse.json({ success: true });
}
