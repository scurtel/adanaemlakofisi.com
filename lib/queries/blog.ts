import { prisma } from "@/lib/db";
import { mapBlogPost } from "@/lib/mappers";
import { toJsonArray } from "@/lib/utils/json";
import { slugify } from "@/lib/utils/slug";
import { isPrismaMissingTableError } from "./safe";

export async function getPublishedBlogPosts() {
  try {
    const rows = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(mapBlogPost);
  } catch (error) {
    if (isPrismaMissingTableError(error)) return [];
    throw error;
  }
}

export async function getBlogBySlug(slug: string, publishedOnly = true) {
  try {
    const row = await prisma.blogPost.findUnique({ where: { slug } });
    if (!row) return null;
    if (publishedOnly && !row.isPublished) return null;
    return mapBlogPost(row);
  } catch (error) {
    if (isPrismaMissingTableError(error)) return null;
    throw error;
  }
}

export async function getAllBlogPostsAdmin() {
  const rows = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(mapBlogPost);
}

export async function getBlogById(id: string) {
  const row = await prisma.blogPost.findUnique({ where: { id } });
  return row ? mapBlogPost(row) : null;
}

export interface BlogInput {
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  category?: string | null;
  tags: string[];
  metaTitle?: string | null;
  metaDescription?: string | null;
  isPublished?: boolean;
  slug?: string;
}

async function ensureUniqueBlogSlug(baseSlug: string, excludeId?: string) {
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${baseSlug}-${counter++}`;
  }
}

export async function createBlogPost(input: BlogInput) {
  const baseSlug = input.slug || slugify(input.title);
  const slug = await ensureUniqueBlogSlug(baseSlug);
  const row = await prisma.blogPost.create({
    data: {
      slug,
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      coverImage: input.coverImage ?? null,
      category: input.category ?? null,
      tags: toJsonArray(input.tags),
      metaTitle: input.metaTitle ?? null,
      metaDescription: input.metaDescription ?? null,
      isPublished: input.isPublished ?? false,
    },
  });
  return mapBlogPost(row);
}

export async function updateBlogPost(id: string, input: BlogInput) {
  let slug = input.slug;
  if (slug) slug = await ensureUniqueBlogSlug(slug, id);

  const row = await prisma.blogPost.update({
    where: { id },
    data: {
      ...(slug ? { slug } : {}),
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      coverImage: input.coverImage ?? null,
      category: input.category ?? null,
      tags: toJsonArray(input.tags),
      metaTitle: input.metaTitle ?? null,
      metaDescription: input.metaDescription ?? null,
      isPublished: input.isPublished ?? false,
    },
  });
  return mapBlogPost(row);
}

export async function deleteBlogPost(id: string) {
  await prisma.blogPost.delete({ where: { id } });
}

export async function getRelatedBlogPosts(
  currentSlug: string,
  tags: string[],
  limit = 3
) {
  const posts = await getPublishedBlogPosts();
  return posts
    .filter((p) => p.slug !== currentSlug)
    .map((p) => ({
      post: p,
      score: p.tags.filter((t) => tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score || b.post.publishedAt.localeCompare(a.post.publishedAt))
    .slice(0, limit)
    .map((r) => r.post);
}

export async function getBlogSlugs() {
  try {
    const rows = await prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { slug: true },
    });
    return rows.map((r) => r.slug);
  } catch (error) {
    if (isPrismaMissingTableError(error)) return [];
    throw error;
  }
}
