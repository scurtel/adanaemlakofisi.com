import type { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "adana-ev-alirken-nelere-dikkat-edilmeli",
    title: "Adana'da Ev Alırken Nelere Dikkat Edilmeli?",
    excerpt:
      "Adana'da konut satın alma sürecinde tapu durumu, lokasyon, bina yaşı ve bütçe planlaması gibi temel kontrol noktaları.",
    content: `Adana'da ev almak, doğru planlama ve bilinçli kararlar gerektiren önemli bir süreçtir. İlk adım olarak bütçenizi netleştirmeniz ve kredi kullanacaksanız ön onay sürecini tamamlamanız önerilir.

Tapu kaydı, imar durumu ve kat mülkiyeti belgelerini mutlaka kontrol edin. Binanın yaşı, asansör durumu, ısıtma sistemi ve aidat gibi düzenli giderleri değerlendirmeye alın.

Lokasyon seçerken günlük ihtiyaçlarınıza, ulaşım imkânlarına ve mahallenin gelişim potansiyeline bakın. Profesyonel emlak danışmanlığı, sürecin şeffaf ilerlemesine yardımcı olur.`,
    publishedAt: "2025-05-01",
    author: "Adana Emlak Ofisi",
    tags: ["satılık", "rehber", "adana"],
  },
  {
    id: "2",
    slug: "adana-satilik-daire-fiyatlari-nasil-degerlendirilir",
    title: "Adana'da Satılık Daire Fiyatları Nasıl Değerlendirilir?",
    excerpt:
      "İlçe, mahalle, metrekare ve bina özelliklerinin fiyat üzerindeki etkisini anlamak için pratik bir değerlendirme çerçevesi.",
    content: `Satılık daire fiyatlarını değerlendirirken yalnızca metrekareye bakmak yeterli değildir. İlçe ve mahalle, binanın yaşı, kat konumu, manzara, site olanakları ve yakın çevredeki altyapı fiyatı doğrudan etkiler.

Benzer özellikteki ilanları karşılaştırarak piyasa aralığını görebilirsiniz. Ekspertiz raporu veya profesyonel değer analizi, özellikle yüksek tutarlı alımlarda faydalı olabilir.

Fiyat görüşmelerinde şeffaflık ve belgeli bilgi paylaşımı, güvenilir bir alım sürecinin temelidir.`,
    publishedAt: "2025-04-28",
    author: "Adana Emlak Ofisi",
    tags: ["satılık", "fiyat", "adana"],
  },
  {
    id: "3",
    slug: "adana-kiralik-ev-arayanlar-icin-rehber",
    title: "Adana'da Kiralık Ev Arayanlar İçin Rehber",
    excerpt:
      "Kiralık konut ararken sözleşme, depozito, aidat ve mahalle seçimi konularında bilmeniz gerekenler.",
    content: `Kiralık ev ararken öncelikle bütçenizi ve ulaşım ihtiyaçlarınızı belirleyin. İlan detaylarında aidat, depozito ve faturaların kime ait olduğunu netleştirin.

Kira sözleşmesini imzalamadan önce tapu bilgisi ve yetki durumunu kontrol edin. Depozito ve iade koşullarını yazılı olarak kayıt altına alın.

Mahalle gezisi yaparak çevredeki market, okul ve toplu taşıma erişimini yerinde değerlendirmek, uzun vadeli memnuniyet için önemlidir.`,
    publishedAt: "2025-04-25",
    author: "Adana Emlak Ofisi",
    tags: ["kiralık", "rehber", "adana"],
  },
  {
    id: "4",
    slug: "yatirim-icin-adana-hangi-bolgeler-one-cikiyor",
    title: "Yatırım İçin Adana'da Hangi Bölgeler Öne Çıkıyor?",
    excerpt:
      "Gelişen ilçe ve mahallelerde konut ve arsa yatırımı yaparken dikkat edilmesi gereken kriterler.",
    content: `Adana'da yatırım yaparken bölgenin ulaşım projeleri, nüfus artışı, ticari aktivite ve imar planları gibi faktörleri birlikte değerlendirmek gerekir.

Çukurova, Seyhan ve Yüreğir gibi merkez ilçelerde konut talebi sürekli görülürken, Sarıçam ve çevre mahallelerde yeni yerleşim alanları dikkat çekmektedir.

Yatırım kararı vermeden önce bölgesel piyasa verilerini inceleyin ve uzun vadeli planınıza uygunluğu değerlendirin.`,
    publishedAt: "2025-04-20",
    author: "Adana Emlak Ofisi",
    tags: ["yatırım", "bölge", "adana"],
  },
  {
    id: "5",
    slug: "yabancilar-turkiyede-gayrimenkul-alirken-nelere-dikkat-etmeli",
    title: "Yabancılar Türkiye'de Gayrimenkul Alırken Nelere Dikkat Etmeli?",
    excerpt:
      "Tapu işlemleri, yasal süreçler ve lokasyon seçimi: yabancı alıcılar için temel bilgilendirme rehberi.",
    content: `Türkiye'de gayrimenkul satın almak isteyen yabancı uyruklu alıcıların tapu müdürlüğü süreçlerini, çeviri ve noter işlemlerini önceden planlaması önerilir.

Hangi bölgelerde mülk edinimine izin verildiği, tapu durumu ve imar kayıtları profesyonel destekle kontrol edilmelidir.

Adana gibi gelişen şehirlerde konut ve ticari gayrimenkul seçenekleri değerlendirilirken, yerel piyasa bilgisi ve dil desteği süreci kolaylaştırır.`,
    publishedAt: "2025-04-15",
    author: "Adana Emlak Ofisi",
    tags: ["yabancı", "rehber", "adana"],
  },
];

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
