import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/guard";
import { deleteBlogPost, getBlogById, updateBlogPost } from "@/lib/queries/blog";

function parseBlogBody(body: Record<string, unknown>) {
  const title = String(body.title || "").trim();
  const excerpt = String(body.excerpt || "").trim();
  const content = String(body.content || "").trim();

  if (!title) return { error: "Başlık gerekli." };
  if (!excerpt) return { error: "Özet gerekli." };
  if (!content) return { error: "İçerik gerekli." };

  const tags = Array.isArray(body.tags)
    ? body.tags.map(String).filter(Boolean)
    : String(body.tags || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

  return {
    title,
    excerpt,
    content,
    coverImage: body.coverImage ? String(body.coverImage) : null,
    category: body.category ? String(body.category) : null,
    tags,
    metaTitle: body.metaTitle ? String(body.metaTitle) : null,
    metaDescription: body.metaDescription ? String(body.metaDescription) : null,
    isPublished: Boolean(body.isPublished),
    slug: body.slug ? String(body.slug).trim() : undefined,
  };
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const { id } = await params;
  const existing = await getBlogById(id);
  if (!existing) return NextResponse.json({ error: "Yazı bulunamadı." }, { status: 404 });

  const body = await request.json();
  const parsed = parseBlogBody(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const post = await updateBlogPost(id, parsed);
  return NextResponse.json(post);
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const { id } = await params;
  await deleteBlogPost(id);
  return NextResponse.json({ success: true });
}
