export const SITE_CONFIG = {
  name: "Adana Emlak Ofisi",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://adanaemlakofisi.com",
  description:
    "Adana'da satılık ve kiralık konut, arsa, iş yeri ve yatırım fırsatları için güvenilir emlak danışmanlığı.",
  phone: "+90 322 000 00 00",
  whatsapp: "903220000000",
  email: "info@adanaemlakofisi.com",
  address: "Adana Merkez — adres bilgisi yakında eklenecek",
  locale: "tr_TR",
} as const;

export const DISTRICTS = [
  {
    slug: "seyhan-emlak",
    name: "Seyhan",
    description:
      "Adana'nın merkez ilçesi Seyhan'da konut, ticari gayrimenkul ve yatırım fırsatları.",
  },
  {
    slug: "cukurova-emlak",
    name: "Çukurova",
    description:
      "Çukurova ilçesinde modern konut projeleri ve satılık daire seçenekleri.",
  },
  {
    slug: "yuregir-emlak",
    name: "Yüreğir",
    description:
      "Yüreğir'de uygun fiyatlı konutlar ve gelişen mahallelerde yatırım imkânları.",
  },
  {
    slug: "saricam-emlak",
    name: "Sarıçam",
    description:
      "Sarıçam'da yeni yerleşim alanları ve aileler için konut alternatifleri.",
  },
  {
    slug: "karaisali-emlak",
    name: "Karaisalı",
    description:
      "Karaisalı'da arsa, tarla ve doğayla iç içe yaşam sunan gayrimenkul seçenekleri.",
  },
  {
    slug: "ceyhan-emlak",
    name: "Ceyhan",
    description:
      "Ceyhan'da tarım ve sanayi bölgesine yakın konut ve arsa fırsatları.",
  },
  {
    slug: "kozan-emlak",
    name: "Kozan",
    description:
      "Kozan'da şehir merkezi ve çevre mahallelerde satılık ve kiralık ilanlar.",
  },
] as const;

export const SERVICES = [
  {
    title: "Satılık Konut Danışmanlığı",
    description:
      "Adana'da satılık daire, villa ve müstakil ev seçeneklerinde şeffaf süreç yönetimi.",
  },
  {
    title: "Kiralık Konut Danışmanlığı",
    description:
      "Kiralık konut arayanlar için bütçe ve lokasyona uygun ilan eşleştirmesi.",
  },
  {
    title: "Arsa ve Yatırım Danışmanlığı",
    description:
      "Arsa, tarla ve yatırım amaçlı gayrimenkullerde bölgesel piyasa bilgisi.",
  },
  {
    title: "Ticari Gayrimenkul Danışmanlığı",
    description:
      "Dükkan, ofis ve iş yeri kiralama veya satın alma süreçlerinde danışmanlık.",
  },
  {
    title: "Yabancılara Gayrimenkul Danışmanlığı",
    description:
      "Türkiye'de gayrimenkul edinmek isteyen yabancı müşteriler için rehberlik.",
  },
  {
    title: "Ekspertiz ve Piyasa Değer Analizi",
    description:
      "Gayrimenkulünüzün güncel piyasa değerini anlamanıza yardımcı analiz hizmeti.",
  },
] as const;
