import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/guard";
import {
  createBlogPost,
  getAllBlogPostsAdmin,
  type BlogInput,
} from "@/lib/queries/blog";

function parseBlogBody(body: Record<string, unknown>): BlogInput | { error: string } {
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

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;
  const posts = await getAllBlogPostsAdmin();
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const body = await request.json();
  const parsed = parseBlogBody(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const post = await createBlogPost(parsed);
  return NextResponse.json(post, { status: 201 });
}
