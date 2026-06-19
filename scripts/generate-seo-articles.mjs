/**
 * Gemini API ile SEO blog makaleleri üretir.
 * Kullanım: node scripts/generate-seo-articles.mjs
 */
import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnv() {
  try {
    const raw = readFileSync(join(root, ".env"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    /* .env yoksa ortam değişkenlerine güven */
  }
}

loadEnv();

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY bulunamadı (.env kontrol edin)");
  process.exit(1);
}

const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: modelName });

const ARTICLES = [
  {
    slug: "adanada-ev-alinacak-en-iyi-semtler",
    title: "Adana'da Ev Alınacak En İyi Semtler (2026 Rehberi)",
    targetKeyword: "Adana'da ev alınacak en iyi semtler",
    secondaryKeywords: ["Adana yatırım bölgeleri", "Çukurova ev fiyatları", "Seyhan satılık daire", "Adana emlak yatırımı"],
    relatedSlugs: ["cukurova-mi-seyhan-mi", "adana-satilik-daire-fiyatlari-2026", "yatirim-icin-adana-hangi-bolgeler-one-cikiyor"],
  },
  {
    slug: "cukurova-mi-seyhan-mi",
    title: "Çukurova mı Seyhan mı? Ev Almak İçin Hangisi Daha Mantıklı?",
    targetKeyword: "Çukurova mı Seyhan mı",
    secondaryKeywords: ["Çukurova satılık daire", "Seyhan satılık daire", "Adana konut yatırımı", "Adana emlak rehberi"],
    relatedSlugs: ["adanada-ev-alinacak-en-iyi-semtler", "adana-satilik-daire-fiyatlari-2026", "adana-ev-alirken-nelere-dikkat-edilmeli"],
  },
  {
    slug: "adanada-arsa-yatirimi",
    title: "Adana'da Arsa Yatırımı Yapılacak Bölgeler",
    targetKeyword: "Adana arsa yatırımı",
    secondaryKeywords: ["Sarıçam arsa yatırımı", "Karaisalı arsa", "Adana yatırım fırsatları", "Adana değerlenen bölgeler"],
    relatedSlugs: ["yatirim-icin-adana-hangi-bolgeler-one-cikiyor", "adanada-ev-alinacak-en-iyi-semtler", "adana-mi-mersin-mi-yatirim"],
  },
  {
    slug: "adana-satilik-daire-fiyatlari-2026",
    title: "Adana'da Satılık Daire Fiyatları 2026",
    targetKeyword: "Adana satılık daire fiyatları",
    secondaryKeywords: ["Çukurova daire fiyatları", "Seyhan daire fiyatları", "Adana konut piyasası", "Adana emlak fiyatları"],
    relatedSlugs: ["adana-satilik-daire-fiyatlari-nasil-degerlendirilir", "cukurova-mi-seyhan-mi", "adanada-ev-alinacak-en-iyi-semtler"],
  },
  {
    slug: "adana-mi-mersin-mi-yatirim",
    title: "Yatırım İçin Adana mı Mersin mi?",
    targetKeyword: "Adana mı Mersin mi yatırım",
    secondaryKeywords: ["Adana gayrimenkul yatırımı", "Mersin gayrimenkul yatırımı", "konut yatırımı Türkiye", "yatırım amaçlı daire"],
    relatedSlugs: ["yatirim-icin-adana-hangi-bolgeler-one-cikiyor", "adanada-arsa-yatirimi", "adanada-ev-alinacak-en-iyi-semtler"],
  },
];

function buildPrompt(article) {
  return `Sen Adana merkezli profesyonel bir emlak danışmanı ve SEO içerik yazarısın. Aşağıdaki blog makalesini Türkçe yaz.

MAKALE:
Başlık: ${article.title}
Slug: ${article.slug}
Ana anahtar kelime: ${article.targetKeyword}
İkincil anahtar kelimeler: ${article.secondaryKeywords.join(", ")}

ZORUNLU KURALLAR:
1. Minimum 2500 kelime (çok önemli — kısa yazma)
2. Ana anahtar kelime ilk 100 kelimede doğal geçsin
3. Çukurova, Seyhan, Sarıçam, Yüreğir, Karaisalı ilçeleri doğal şekilde geçsin
4. Mahalle örnekleri ver (Toros, Güzelyalı, Reşatbey, Yeni Baraj, Beyazevler, Kiremithane vb.)
5. En az 2 markdown tablo kullan (| Kolon | formatında)
6. Yapay zeka kokmayan, doğal, insan gibi Türkçe
7. Abartılı vaat yok: "kesin kazanç", "garantili getiri" kullanma
8. E-E-A-T uyumlu: deneyim, veri, karşılaştırma, gerçekçi analiz
9. İç linkler doğal geçsin: /satilik, /kiralik, /iletisim, /adana/cukurova-emlak, /adana/seyhan-emlak, /adana/saricam-emlak, /adana/yuregir-emlak, /blog/adana-ev-alirken-nelere-dikkat-edilmeli
10. Yatırım analizi bölümleri olsun
11. CTA: "Adana'da satılık daire, arsa veya yatırım fırsatları hakkında bilgi almak için bizimle iletişime geçebilirsiniz." sonuç bölümünde geçsin
12. content içinde ## ve ### başlıklar kullan
13. ## Sık Sorulan Sorular bölümünde tam 8 soru olsun; her soru ### başlık, altında cevap paragrafı
14. metaTitle max 60 karakter
15. metaDescription max 155 karakter

Yanıtı SADECE geçerli JSON ver (markdown code fence kullanma):
{
  "slug": "${article.slug}",
  "title": "${article.title}",
  "excerpt": "150-200 karakter özet",
  "content": "tam makale metni (\\n ile satır sonları)",
  "tags": ["adana", "..."],
  "metaTitle": "max 60 karakter",
  "metaDescription": "max 155 karakter",
  "category": "rehber",
  "seoExtras": {
    "featuredImagePrompt": "İngilizce görsel prompt",
    "ogDescription": "Open Graph açıklaması",
    "socialShareText": "Sosyal medya paylaşım metni (max 280 karakter)",
    "relatedPosts": ${JSON.stringify(article.relatedSlugs)},
    "featuredSnippetOpportunities": ["snippet fırsatı 1", "..."],
    "peopleAlsoAsk": ["PAA sorusu 1", "..."],
    "faqs": [{"question": "...", "answer": "..."}]
  }
}`;
}

function extractJson(text) {
  let cleaned = text.trim();
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) cleaned = fenceMatch[1].trim();
  cleaned = cleaned.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    // JSON içinde kaçan karakterler için son çare: ilk { ile son } arası
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }
    throw new Error("JSON parse edilemedi");
  }
}

function loadExistingPosts() {
  const path = join(root, "data/blog-seo-content.ts");
  try {
    const raw = readFileSync(path, "utf8");
    const slugs = [...raw.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
    return new Set(slugs);
  } catch {
    return new Set();
  }
}

function appendToOutput(post, seoExtras) {
  const tsPath = join(root, "data/blog-seo-content.ts");
  const metaPath = join(root, "data/blog-seo-meta.json");

  let meta = {};
  try {
    meta = JSON.parse(readFileSync(metaPath, "utf8"));
  } catch {
    /* yeni dosya */
  }
  meta[post.slug] = seoExtras;

  let existingPosts = [];
  try {
    const raw = readFileSync(tsPath, "utf8");
    const match = raw.match(/export const blogSeoPosts = \[([\s\S]*)\];/);
    if (match && match[1].trim()) {
      // Mevcut içeriği koru — slug bazlı birleştirme seed'de yapılacak
    }
  } catch {
    /* yeni dosya */
  }

  const entry = `  {
    slug: ${JSON.stringify(post.slug)},
    title: ${JSON.stringify(post.title)},
    excerpt: ${JSON.stringify(post.excerpt)},
    content: \`${escapeForTs(post.content)}\`,
    tags: ${JSON.stringify(post.tags)},
    metaTitle: ${JSON.stringify(post.metaTitle)},
    metaDescription: ${JSON.stringify(post.metaDescription)},
    category: ${JSON.stringify(post.category || "rehber")},
  }`;

  const generated = loadGeneratedEntries();
  const filtered = generated.filter((e) => !e.includes(`slug: "${post.slug}"`));
  filtered.push(entry);

  const tsContent = `// Otomatik üretildi: scripts/generate-seo-articles.mjs
// Tarih: ${new Date().toISOString().slice(0, 10)}

export const blogSeoPosts = [
${filtered.join(",\n")}
];
`;
  writeFileSync(tsPath, tsContent, "utf8");
  writeFileSync(metaPath, JSON.stringify(meta, null, 2), "utf8");
  console.log(`  → Kaydedildi: ${post.slug}`);
}

function loadGeneratedEntries() {
  const path = join(root, "data/blog-seo-content.ts");
  try {
    const raw = readFileSync(path, "utf8");
    const inner = raw.match(/export const blogSeoPosts = \[([\s\S]*)\];/)?.[1] ?? "";
    const entries = [];
    let depth = 0;
    let current = "";
    for (const ch of inner) {
      current += ch;
      if (ch === "{") depth++;
      if (ch === "}") {
        depth--;
        if (depth === 0 && current.trim()) {
          entries.push(current.trim().replace(/,\s*$/, ""));
          current = "";
        }
      }
    }
    return entries.filter(Boolean);
  } catch {
    return [];
  }
}

function escapeForTs(str) {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");
}

async function generateArticle(article, index) {
  console.log(`\n[${index + 1}/5] Üretiliyor: ${article.title}`);
  const prompt = buildPrompt(article);
  const result = await model.generateContent(prompt);
  const raw = result.response.text().trim();
  try {
    const parsed = extractJson(raw);
    const wordCount = parsed.content.split(/\s+/).length;
    console.log(`  ✓ ${wordCount} kelime üretildi`);
    if (wordCount < 2000) {
      console.warn(`  ⚠ Kelime sayısı hedefin altında (${wordCount} < 2500)`);
    }
    return parsed;
  } catch (err) {
    console.error(`  ✗ JSON parse hatası, ham yanıt kaydediliyor`);
    writeFileSync(join(root, `scripts/raw-${article.slug}.txt`), raw);
    throw err;
  }
}

async function main() {
  const existing = loadExistingPosts();
  const meta = {};

  for (let i = 0; i < ARTICLES.length; i++) {
    const article = ARTICLES[i];
    if (existing.has(article.slug)) {
      console.log(`\n[${i + 1}/5] Atlandı (zaten var): ${article.slug}`);
      continue;
    }

    let post;
    let retries = 0;
    while (retries < 3) {
      try {
        post = await generateArticle(article, i);
        break;
      } catch {
        retries++;
        if (retries >= 3) throw new Error(`Makale üretilemedi: ${article.slug}`);
        console.log(`  Yeniden deneniyor (${retries + 1}/3)...`);
        await new Promise((r) => setTimeout(r, 4000));
      }
    }
    const { seoExtras, ...blogPost } = post;
    appendToOutput(blogPost, seoExtras);
    meta[blogPost.slug] = seoExtras;
    if (i < ARTICLES.length - 1) await new Promise((r) => setTimeout(r, 2000));
  }

  console.log("\n✓ Tüm makaleler hazır: data/blog-seo-content.ts");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
