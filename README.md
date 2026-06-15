# Adana Emlak Ofisi

Adana merkezli, SEO uyumlu emlak ofisi web sitesi ve yönetim paneli. Next.js 15 App Router + Prisma + Gemini API.

## Özellikler

- **Public site:** Satılık/kiralık ilanlar, blog, ilçe sayfaları, iletişim formu
- **Admin panel:** İlan, blog, lead ve site ayarları yönetimi
- **Veritabanı:** Prisma + PostgreSQL (Docker ile local), production-ready
- **Gemini AI:** İlan açıklaması, SEO meta ve blog taslağı üretimi (sunucu tarafı)
- **Cloudinary:** Admin panelinden çoklu görsel yükleme (opsiyonel)
- **Lead sistemi:** İletişim formu, ilan detay mesajları, bildirim altyapısı
- **SEO:** Sitemap, robots.txt, canonical, OpenGraph, Schema.org, ilçe FAQ sayfaları

## Gereksinimler

- Node.js 18.18+
- npm
- Docker Desktop (opsiyonel — local PostgreSQL için)

## Kurulum

```bash
npm install
cp .env.example .env
```

`.env` dosyasını düzenleyin:

```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_SITE_URL=https://adanaemlakofisi.com

ADMIN_EMAIL=admin@adanaemlakofisi.com
ADMIN_PASSWORD_HASH=
ADMIN_SESSION_SECRET=en-az-32-karakter-rastgele-anahtar

GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.0-flash
```

### Admin şifre hash üretimi

Düz metin şifre `.env` dosyasında tutulmaz. Hash üretmek için:

```bash
npm run admin:hash-password -- GucluSifreniz123
```

Çıktıdaki `ADMIN_PASSWORD_HASH=...` satırını `.env` dosyanıza ekleyin.

> `GEMINI_API_KEY`, `ADMIN_PASSWORD_HASH`, `CLOUDINARY_*` ve `RESEND_API_KEY` asla `NEXT_PUBLIC_` önekiyle tanımlanmamalıdır.
> `GOOGLE_SITE_VERIFICATION` değeri Search Console HTML tag kodudur; Gemini API key değildir.

### Lead e-posta bildirimi (Resend)

```env
NOTIFICATION_EMAIL_TO=info@adanaemlakofisi.com
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=Adana Emlak Ofisi <bildirim@adanaemlakofisi.com>
```

Resend hesabı ve doğrulanmış gönderici domain gerekir. Env eksikse lead kaydı yine çalışır; bildirim console'a düşer.

## Veritabanı

**Local (SQLite — Docker gerekmez):**

```bash
npm run db:target:sqlite    # varsayılan, postinstall ile otomatik
npm run db:migrate:deploy
npm run db:seed
```

**Production (PostgreSQL):**

```bash
npm run db:target:postgres
# Render: render.yaml otomatik postgres schema kullanır
# Vercel: vercel.json buildCommand postgres hedefler
```

**Local PostgreSQL (Docker varsa):**

```bash
npm run db:setup:postgres
```

## Geliştirme

```bash
npm run dev
```

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin/login

Admin girişi: `.env` içindeki `ADMIN_EMAIL` ve hash ile doğrulanan şifre.

## Production Build

```bash
npm run build
npm start
```

## Admin Panel Rotaları

| Sayfa | URL |
|-------|-----|
| Giriş | `/admin/login` |
| Dashboard | `/admin` |
| İlanlar | `/admin/ilanlar` |
| Yeni ilan | `/admin/ilanlar/yeni` |
| Blog | `/admin/blog` |
| Leadler | `/admin/leadler` |
| Ayarlar | `/admin/ayarlar` |

## Gemini Servisleri

- `generateListingDescription()` — İlan açıklaması
- `generateSeoMeta()` — Meta title/description
- `generateBlogDraft()` — Blog taslağı (admin blog formu)

## Proje Yapısı

```
app/
  (site)/          # Public sayfalar
  admin/           # Yönetim paneli (noindex)
  api/             # API route'ları
  sitemap.ts       # Dinamik sitemap
  robots.ts        # robots.txt
prisma/
lib/
  auth/            # Session + scrypt şifre
  cloudinary.ts    # Görsel yükleme
  notifications/   # Lead bildirim altyapısı
  gemini/
  seo/
components/
data/blog-seed-content.ts
```

---

## Production Deploy

### Önemli: SQLite sınırlamaları

| Platform | SQLite uygun mu? | Not |
|----------|------------------|-----|
| **Vercel** | Hayır | Ephemeral filesystem; yazılan veriler deploy/restart sonrası kaybolur |
| **Render** | Kısmen | Persistent disk ile mümkün, ancak ölçekleme zor |
| **Önerilen** | PostgreSQL | Neon, Supabase veya Render Managed PostgreSQL |

Production için **PostgreSQL** kullanın. SQLite yalnızca local geliştirme içindir.

### PostgreSQL (varsayılan)

Proje PostgreSQL kullanır. Local: `docker-compose.yml` + `npm run db:up`.

Production: Neon, Supabase veya Render Managed PostgreSQL.

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
```

### SQLite (artık kullanılmıyor)

Vercel gibi ephemeral ortamlarda SQLite uygun değildir. Eski `dev.db` dosyası kullanılmaz.

### Vercel deploy

1. GitHub reposunu Vercel'e bağlayın
2. **Environment Variables** ekleyin (`.env.example` referans)
3. `DATABASE_URL` için Neon veya Supabase PostgreSQL kullanın
4. Build Command: `prisma generate && prisma migrate deploy && next build`
5. `NEXT_PUBLIC_SITE_URL` production domain ile ayarlayın
6. Deploy sonrası: `/sitemap.xml` ve `/robots.txt` kontrol edin

### Render deploy

`render.yaml` PostgreSQL veritabanını otomatik bağlar (`fromDatabase`).

1. Render Dashboard → Blueprint → `render.yaml` ile deploy
2. Veya manuel: Web Service + PostgreSQL oluştur, `DATABASE_URL` bağla
3. Build: `npm install && npx prisma migrate deploy && npm run build`
4. Tüm env değişkenlerini girin

### Cloudinary ayarları

Görsel yükleme için [Cloudinary](https://cloudinary.com) hesabı oluşturun:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Değerler yoksa admin paneli çalışmaya devam eder; görsel URL ile eklenebilir.

### Lead bildirimleri (opsiyonel)

```env
NOTIFICATION_EMAIL_TO=info@adanaemlakofisi.com
RESEND_API_KEY=re_...
```

Şu an `notifyNewLead()` console'a yazar; Resend entegrasyonu modüler yapıda hazırdır.

### SEO kontrol listesi

Deploy sonrası doğrulayın:

- [ ] `https://adanaemlakofisi.com/sitemap.xml` — tüm sayfalar listeleniyor
- [ ] `https://adanaemlakofisi.com/robots.txt` — admin/api disallow
- [ ] Public sayfalarda canonical URL doğru
- [ ] Admin sayfaları `noindex, nofollow`
- [ ] İlan/blog detayda OpenGraph image
- [ ] `public/og-default.svg` varsayılan sosyal görsel

### Google Search Console

1. [Google Search Console](https://search.google.com/search-console) → Mülk ekle
2. Domain veya URL öneki seçin (`https://adanaemlakofisi.com`)
3. Doğrulama: HTML tag yöntemi → `GOOGLE_SITE_VERIFICATION` env değerini `.env`'e ekleyin
4. Sitemap gönder: `https://adanaemlakofisi.com/sitemap.xml`
5. URL denetimi ile ana sayfa ve örnek ilan sayfasını kontrol edin

### Domain DNS

| Kayıt | Değer |
|-------|-------|
| Vercel | CNAME `www` → `cname.vercel-dns.com` veya A kayıtları |
| Render | CNAME → `your-service.onrender.com` |
| Apex domain | Platform dokümantasyonuna göre ALIAS/ANAME veya A kaydı |

SSL sertifikası platform tarafından otomatik sağlanır.

---

## Hostinger Node.js Deployment

### Önemli notlar

- Hostinger Node.js uygulaması `PORT` ortam değişkenini kullanır; `npm start` `0.0.0.0` üzerinde dinler.
- **SQLite:** `DATABASE_URL=file:./prisma/production.db` gibi kalıcı bir dosya yolu kullanın. Deploy/restart sonrası veri kaybını önlemek için dosyanın uygulama dizininde kalıcı olduğundan emin olun. Uzun vadede **PostgreSQL** (Neon, Supabase) daha güvenlidir.
- Admin şifresi düz metin değil; `ADMIN_PASSWORD_HASH` kullanılır. Üretmek için: `npm run admin:hash-password -- Sifreniz`

### Panel adımları

1. Hostinger panelinde **Websites → Node.js App** (veya **Application**) bölümünü açın.
2. GitHub repo olarak `scurtel/adanaemlakofisi.com` seçin.
3. **Branch:** `main`
4. **Node version:** 20 veya 22
5. **Build command:**
   ```bash
   npm install && npm run db:target:sqlite && npx prisma migrate deploy && npm run build
   ```
6. **Start command:**
   ```bash
   npm start
   ```
7. **Environment variables** (Hostinger panelinden girin):

   | Değişken | Açıklama |
   |----------|----------|
   | `DATABASE_URL` | `file:./prisma/production.db` veya PostgreSQL URL |
   | `GEMINI_API_KEY` | Google Gemini API anahtarı |
   | `ADMIN_EMAIL` | Admin giriş e-postası |
   | `ADMIN_PASSWORD_HASH` | `npm run admin:hash-password` ile üretilen hash |
   | `ADMIN_SESSION_SECRET` | En az 32 karakter rastgele anahtar |
   | `NEXT_PUBLIC_SITE_URL` | `https://adanaemlakofisi.com` |
   | `GEMINI_MODEL` | `gemini-2.0-flash` (opsiyonel) |

8. **Domain:** `adanaemlakofisi.com` uygulamaya bağlayın.

### İlk deploy sonrası (SSH veya Hostinger terminal)

Veritabanı boşsa seed çalıştırın:

```bash
npm run db:seed
```

Admin şifre hash üretimi (local veya SSH):

```bash
npm run admin:hash-password -- GucluSifreniz123
```

Çıktıdaki `ADMIN_PASSWORD_HASH` değerini Hostinger env'e ekleyin.

### Hostinger build/start özeti

| Ayar | Değer |
|------|-------|
| Build | `npm install && npm run db:target:sqlite && npx prisma migrate deploy && npm run build` |
| Start | `npm start` |
| Node | 20+ |

## Güvenlik

- Admin şifresi scrypt hash ile doğrulanır (`ADMIN_PASSWORD_HASH`)
- Session cookie: `httpOnly`, `secure` (production), `sameSite: strict` (production)
- `/admin` ve `/api/admin/*` session korumalı
- Gizli anahtarlar yalnızca sunucu env'de; frontend'e sızmaz

## Komutlar Özeti

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Production build |
| `npm run db:generate` | Prisma client |
| `npm run db:target:sqlite` | Local SQLite şeması |
| `npm run db:target:postgres` | Production PostgreSQL şeması |
| `npm run db:setup:postgres` | Docker PG + migrate + seed |
| `npm run db:migrate:deploy` | Production migration |
| `npm run db:seed` | Örnek veri |
| `npm run admin:hash-password` | Admin şifre hash üret |
| `npm run lint` | ESLint |
