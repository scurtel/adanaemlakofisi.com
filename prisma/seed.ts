import { PrismaClient } from "@prisma/client";
import { blogSeedPosts } from "../data/blog-seed-content";
import { blogSeoPosts } from "../data/blog-seo-content";
import { listings } from "../data/listings";

const prisma = new PrismaClient();
const allBlogPosts = [...blogSeedPosts, ...blogSeoPosts].filter(
  (post) => post?.slug && post?.content
);

function mapPropertyType(type: string): string {
  if (type === "is-yeri") return "is_yeri";
  return type;
}

async function main() {
  for (const listing of listings) {
    await prisma.listing.upsert({
      where: { slug: listing.slug },
      create: {
        slug: listing.slug,
        title: listing.title,
        type: listing.type,
        propertyType: mapPropertyType(listing.propertyType),
        city: listing.city,
        district: listing.district,
        neighborhood: listing.neighborhood,
        price: listing.price,
        currency: listing.currency,
        grossM2: listing.grossM2,
        netM2: listing.netM2 ?? null,
        roomCount: listing.roomCount ?? null,
        buildingAge: listing.buildingAge ?? null,
        floor: listing.floor ?? null,
        totalFloors: listing.totalFloors ?? null,
        heating: listing.heating ?? null,
        description: listing.description,
        features: JSON.stringify(listing.features),
        images: JSON.stringify(listing.images),
        contactPhone: listing.contactPhone,
        whatsappPhone: listing.whatsappPhone,
        isFeatured: listing.featured ?? false,
        isPublished: true,
      },
      update: {
        title: listing.title,
        type: listing.type,
        propertyType: mapPropertyType(listing.propertyType),
        city: listing.city,
        district: listing.district,
        neighborhood: listing.neighborhood,
        price: listing.price,
        currency: listing.currency,
        grossM2: listing.grossM2,
        netM2: listing.netM2 ?? null,
        roomCount: listing.roomCount ?? null,
        buildingAge: listing.buildingAge ?? null,
        floor: listing.floor ?? null,
        totalFloors: listing.totalFloors ?? null,
        heating: listing.heating ?? null,
        description: listing.description,
        features: JSON.stringify(listing.features),
        images: JSON.stringify(listing.images),
        contactPhone: listing.contactPhone,
        whatsappPhone: listing.whatsappPhone,
        isFeatured: listing.featured ?? false,
        isPublished: true,
      },
    });
  }

  for (const post of allBlogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        tags: JSON.stringify(post.tags),
        category: post.category || "rehber",
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
        isPublished: true,
      },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        tags: JSON.stringify(post.tags),
        category: post.category || "rehber",
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
        isPublished: true,
      },
    });
  }

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      siteName: "Adana Emlak Ofisi",
      phone: "+90 322 000 00 00",
      whatsappPhone: "903220000000",
      email: "info@adanaemlakofisi.com",
      address: "Adana Merkez — adres bilgisi yakında eklenecek",
    },
    update: {},
  });

  console.log(`Seed tamamlandı: ${listings.length} ilan, ${allBlogPosts.length} blog yazısı.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
