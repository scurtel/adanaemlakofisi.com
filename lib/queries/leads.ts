import { prisma } from "@/lib/db";
import type { LeadStatus } from "@/types";

export interface LeadInput {
  name: string;
  phone: string;
  email?: string;
  message: string;
  source: string;
  listingId?: string;
}

export async function createLead(input: LeadInput) {
  return prisma.lead.create({
    data: {
      name: input.name.trim(),
      phone: input.phone.trim(),
      email: input.email?.trim() || null,
      message: input.message.trim(),
      source: input.source,
      listingId: input.listingId || null,
      status: "yeni",
    },
  });
}

export async function getLeads(filters: { status?: LeadStatus } = {}) {
  return prisma.lead.findMany({
    where: filters.status ? { status: filters.status } : undefined,
    include: { listing: { select: { id: true, title: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  return prisma.lead.update({ where: { id }, data: { status } });
}

export async function deleteLead(id: string) {
  await prisma.lead.delete({ where: { id } });
}

export async function getLeadCounts() {
  const [total, yeni] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "yeni" } }),
  ]);
  return { total, yeni };
}
