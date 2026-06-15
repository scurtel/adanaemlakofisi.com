import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/guard";
import { getLeads } from "@/lib/queries/leads";
import type { LeadStatus } from "@/types";

export async function GET(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as LeadStatus | null;
  const leads = await getLeads(status ? { status } : {});
  return NextResponse.json(leads);
}
