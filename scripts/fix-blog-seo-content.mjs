/** blog-seo-content.ts içindeki bozuk sparse array girişlerini temizler */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { blogSeoPosts } = await import(pathToFileURL(join(root, "data/blog-seo-content.ts")).href);

const valid = blogSeoPosts.filter((p) => p && p.slug && p.content);

function escapeForTs(str) {
  return str.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

const tsContent = `// Otomatik üretildi: scripts/generate-seo-articles.mjs
// Tarih: ${new Date().toISOString().slice(0, 10)}

export const blogSeoPosts = [
${valid
  .map(
    (p) => `  {
    slug: ${JSON.stringify(p.slug)},
    title: ${JSON.stringify(p.title)},
    excerpt: ${JSON.stringify(p.excerpt)},
    content: \`${escapeForTs(p.content)}\`,
    tags: ${JSON.stringify(p.tags)},
    metaTitle: ${JSON.stringify(p.metaTitle)},
    metaDescription: ${JSON.stringify(p.metaDescription)},
    category: ${JSON.stringify(p.category || "rehber")},
  }`
  )
  .join(",\n")}
];
`;

writeFileSync(join(root, "data/blog-seo-content.ts"), tsContent);
console.log(`✓ ${valid.length} geçerli makale yazıldı`);
