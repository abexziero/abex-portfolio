export const locales = ["id", "en"] as const;
export const heroArtwork = { src: "/images/abe.png", width: 768, height: 1119, alt: { id: "Foto Abex", en: "Portrait of Abex" } };
export const technologyIcons: Record<string, string> = { "React": "react", "Next.js": "nextdotjs", "TypeScript": "typescript", "Tailwind CSS": "tailwindcss", "GSAP": "gsap", "Bootstrap": "bootstrap", "jQuery": "jquery", "Flutter": "flutter", "Dart": "dart", "Laravel": "laravel", "Go (Golang)": "go", "Node.js": "nodedotjs", "MySQL": "mysql", "SQLite": "sqlite", "GraphQL": "graphql" };
export const socialIcons: Record<string, string> = { X: "x", Instagram: "instagram", Threads: "threads", WhatsApp: "whatsapp", GitHub: "github" };
export type Locale = (typeof locales)[number];
export type Text = Record<Locale, string>;
export function isLocale(value: string): value is Locale { return value === "id" || value === "en"; }

export const profile: {
  name: Text; bio: Text; email: string | null; whatsapp: string | null; domain: string | null;
  location: Text; learning: Text; verified: boolean; social: { label: string; url: string }[];
} = {
  name: { id: "Abex", en: "Abex" },
  bio: {
    id: "Saya Abex, Fullstack Developer yang membangun aplikasi web dan mobile dengan antarmuka yang intuitif, pengelolaan data yang terstruktur, dan integrasi API. Menggunakan React, Next.js, dan Flutter, saya berfokus pada solusi yang mudah digunakan, kode yang mudah dikembangkan, serta fitur yang menjawab kebutuhan nyata.",
    en: "I'm Abex, a Fullstack Developer building web and mobile applications with intuitive interfaces, structured data management, and API integrations. Using React, Next.js, and Flutter, I focus on usable solutions, maintainable code, and features that address real needs.",
  },
  location: { id: "Kalimantan Timur, Indonesia", en: "East Kalimantan, Indonesia" },
  learning: { id: "Fokus pada pengembangan frontend, backend, pengelolaan data, dan integrasi API.", en: "Focused on frontend and backend development, data management, and API integrations." },
  email: "abexziero@gmail.com", whatsapp: "628125569833", domain: null, verified: true, social: [{ label: "GitHub", url: "https://github.com/abexziero" }, { label: "X", url: "https://twitter.com/akbarwsnu" }, { label: "Instagram", url: "https://instagram.com/akbarwsnu" }, { label: "Threads", url: "https://www.threads.com/@akbarwsnu" }],
};

export const ui = {
  id: {
    stage: { home: "Beranda", about: "Tentang", services: "Layanan", deselect: "Tutup pengaturan", copy: "Salin alamat", copied: "Alamat disalin", copyError: "Gagal menyalin. Pilih alamat untuk mengirim email.", typeHint: "tarik sudut untuk mengubah ukuran", spaceHint: "tarik untuk mengatur jarak antarhuruf", radiusHint: "tarik sudut untuk mengubah radius", opacityHint: "atur slider untuk transparansi huruf", workNote: "studi kasus", experimentsNote: "eksplorasi kecil", snippetsNote: "gerakan, dibedah", aboutNote: "siapa dan bagaimana", servicesNote: "layanan & cara kerja", reset: "Kembali ke awal" },
    codeLoading: "Memuat kode…", codeError: "Kode gagal dimuat. Tutup dan buka kembali untuk mencoba.", codeDownload: "Unduh kode demo",
    designControls: "Eksplorasi desain", designColor: "Warna", designType: "Tipografi", designSpacing: "Spasi", designRadius: "Radius", designOpacity: "Opasitas", allWork: "Semua karya", demoCode: "Lihat kode penggerak demo",
    snippets: "Snippets", experiments: "Eksperimen", nameHint: "Klik tombol Warna untuk warna baru", referenceBio: "Membangun aplikasi web dan mobile yang menghubungkan antarmuka, data, dan kebutuhan pengguna.", motionTitle: "motion snippets", motionIntro: "Lima belas demo gerakan dan interaksi di website ini. Eksplorasi lokal untuk menjelajahi detail antarmuka.", pointerNotice: "Demo interaktif membutuhkan komputer dengan pointer. Di layar sentuh dan reduced motion, tersedia preview statis.", motionPause: "Jeda", motionResume: "Lanjutkan", motionReset: "Ulangi", motionHint: "Gerakkan pointer, klik atau tarik untuk menjelajah. Tombol panah dan Enter juga dapat digunakan.", experimentsIntro: "Eksplorasi tipografi, gerakan, dan interaksi yang dibuat di website ini. Buka demo untuk mencoba.",
    metaTitle: "Abex — Fullstack Developer | Web & Mobile", metaDescription: "Abex, Fullstack Developer web dan mobile di Kalimantan Timur. React, Next.js, Flutter, pengelolaan data, dan integrasi API. Jelajahi proyek dan studi kasus.",
    skip: "Lewati ke konten", menu: "Menu", close: "Tutup menu", navLabel: "Navigasi utama", language: "Bahasa", themeLight: "Aktifkan mode terang", themeDark: "Aktifkan mode gelap", nav: ["Karya", "Layanan", "Tentang", "Kontak"],
    demo: "Portofolio demo", placeholder: "Placeholder", heroEyebrow: "FULLSTACK DEVELOPER / WEB & MOBILE",
    heroLine1: "Ide yang bagus.", heroLine2: "Website yang", heroLine3: "berkesan.", heroText: "Mengubah ide menjadi pengalaman digital yang rapi, cepat, dan mudah digunakan. Dari halaman pertama hingga detail terakhir.",
    viewWork: "Jelajahi karya", contact: "Mari bicara", heroCard: "Eksplorasi terbaru", scroll: "Gulir untuk menjelajah", index: "PORTOFOLIO / 2026",
    workEyebrow: "01 / KARYA PILIHAN", workTitle: "Dibangun dengan", workAccent: "tujuan.", workText: "Tiga proyek dari GitHub: katalog anime berbasis API, aplikasi kasir Android offline, dan website sekolah dengan CMS.", workHint: "Gulir untuk melihat karya", caseStudy: "Lihat studi kasus", demoNotice: "Proyek personal / bukan pekerjaan klien",
    servicesPageTitle: "Layanan & Cara Kerja", servicesPageIntro: "Pengembangan aplikasi web dan mobile, dari antarmuka hingga data. Berikut layanan yang saya kerjakan dan pendekatan dalam membangun setiap fitur.", servicesEyebrow: "02 / LAYANAN", servicesTitle: "Dari konsep", servicesAccent: "ke layar.", servicesText: "Fondasi yang kuat. Antarmuka yang jelas. Interaksi yang terasa alami.",
    services: [
  {
    "title": "Aplikasi web & integrasi API",
    "text": "Katalog, dashboard, dan antarmuka responsif yang terhubung ke API. Jelajanime memakai AniList GraphQL sebagai sumber data.",
    "tags": "Next.js / React / TypeScript / GraphQL"
  },
  {
    "title": "Aplikasi mobile & offline",
    "text": "Aplikasi Android dengan penyimpanan lokal, transaksi, dan pengelolaan data. Portofolio kasir dibangun dengan Flutter dan SQLite.",
    "tags": "Flutter / Dart / SQLite"
  },
  {
    "title": "Backend & pengelolaan data",
    "text": "Logika aplikasi, penyimpanan data, dan integrasi layanan untuk mendukung alur kerja yang konsisten dari antarmuka hingga data.",
    "tags": "API / SQLite / Data"
  }
],
    pause: "Jeda gerakan", resume: "Lanjutkan gerakan", skillLabel: "Teknologi utama", socialLabel: "Temukan saya juga di", skillGroups: [{"title":"Web","items":["React","Next.js","TypeScript","Tailwind CSS","GSAP","Bootstrap","jQuery"]},{"title":"Mobile","items":["Flutter","Dart"]},{"title":"Backend & Data","items":["Laravel","Go (Golang)","Node.js","MySQL","SQLite","GraphQL"]}], skillWords: ["NEXT.JS","REACT","TYPESCRIPT","TAILWIND","GSAP","FLUTTER","DART","SQLITE","GRAPHQL","BOOTSTRAP","JQUERY","LARAVEL","GO","NODE.JS","MYSQL"],
    aboutEyebrow: "03 / TENTANG", aboutTitle: "Kode yang rapi.", aboutAccent: "Kolaborasi yang jelas.", aboutLabel: "Fullstack Developer — Web & Mobile", approachLabel: "Pendekatan kerja", approach: [{"title":"Analisis kebutuhan","text":"Memahami tujuan, pengguna, ruang lingkup, dan prioritas fitur."},{"title":"Perencanaan & desain","text":"Menyusun alur aplikasi, struktur data, rancangan antarmuka, dan tahapan pengerjaan."},{"title":"Pengembangan","text":"Membangun frontend, backend, dan aplikasi mobile sesuai kebutuhan, dengan integrasi API."},{"title":"Pengujian & revisi","text":"Memeriksa fungsi, tampilan responsif, serta alur pengguna; menyempurnakan hasil dari umpan balik."},{"title":"Deploy & dokumentasi","text":"Menyiapkan rilis, konfigurasi, dokumentasi penggunaan, dan serah terima hasil."}],
    contactEyebrow: "04 / MULAI PERCAKAPAN", contactTitle: "Punya ide", contactAccent: "berikutnya?", contactText: "Ceritakan tujuan, ruang lingkup, dan jadwal proyek Anda. Kita mulai dari percakapan yang sederhana.", hire: "Mari bekerja sama", hireTitle: "Ceritakan proyekmu", hireDescription: "Pilih cara paling nyaman untuk menghubungi saya.", closeContact: "Tutup kontak", email: "Email", whatsapp: "WhatsApp", unavailable: "Kontak belum diisi", footer: "Dibangun dengan perhatian pada detail.", previewNote: "Pratinjau portofolio - domain final belum diisi.",
    back: "Kembali ke karya", overview: "Ringkasan", problem: "Masalah", role: "Peran", approachHeading: "Pendekatan", results: "Hasil & batasan", stack: "Teknologi", gallery: "Galeri proyek", previous: "Slide sebelumnya", next: "Slide berikutnya", slide: "Slide", of: "dari", demoLink: "Buka demo", codeLink: "Lihat kode", noLinks: "Demo dan kode belum tersedia.", caseCta: "Mari bangun sesuatu yang berarti.", nextProject: "Proyek berikutnya", projectType: "Proyek personal", year: "Tahun proyek",
  },
  en: {
    stage: { home: "Home", about: "About", services: "Services", deselect: "Close controls", copy: "Copy address", copied: "Address copied", copyError: "Could not copy. Select the address to send an email.", typeHint: "drag a corner through the scale", spaceHint: "drag a gap to space the letters", radiusHint: "drag a corner to round the letters", opacityHint: "adjust the slider to fade the letters", workNote: "case studies", experimentsNote: "small explorations", snippetsNote: "motion, taken apart", aboutNote: "who and how", servicesNote: "services & process", reset: "Reset" },
    codeLoading: "Loading code…", codeError: "Code could not load. Close and reopen to retry.", codeDownload: "Download demo code",
    designControls: "Design playground", designColor: "Colour", designType: "Type", designSpacing: "Spacing", designRadius: "Radius", designOpacity: "Opacity", allWork: "All work", demoCode: "View the demo engine code",
    snippets: "Snippets", experiments: "Experiments", nameHint: "Click Colour for a new hue", referenceBio: "Building web and mobile applications that connect interfaces, data, and user needs.", motionTitle: "motion snippets", motionIntro: "Fifteen motion and interaction demos on this website. Local explorations of interface details.", pointerNotice: "Interactive demos need a computer with a pointer. Touch screens and reduced motion receive static previews.", motionPause: "Pause", motionResume: "Resume", motionReset: "Reset", motionHint: "Move your pointer, click or drag to explore. Arrow keys and Enter work too.", experimentsIntro: "Typography, motion, and interaction explorations built for this website. Open a demo to try them.",
    metaTitle: "Abex — Fullstack Developer | Web & Mobile", metaDescription: "Abex, a web and mobile Fullstack Developer based in East Kalimantan. React, Next.js, Flutter, data management, and API integrations. Explore projects and case studies.",
    skip: "Skip to content", menu: "Menu", close: "Close menu", navLabel: "Main navigation", language: "Language", themeLight: "Switch to light mode", themeDark: "Switch to dark mode", nav: ["Work", "Services", "About", "Contact"],
    demo: "Demo portfolio", placeholder: "Placeholder", heroEyebrow: "FULLSTACK DEVELOPER / WEB & MOBILE",
    heroLine1: "Good ideas.", heroLine2: "Memorable", heroLine3: "websites.", heroText: "Turning ideas into considered, fast, and intuitive digital experiences. From the first page to the very last detail.",
    viewWork: "Explore the work", contact: "Let's talk", heroCard: "Latest exploration", scroll: "Scroll to explore", index: "PORTFOLIO / 2026",
    workEyebrow: "01 / SELECTED WORK", workTitle: "Built with", workAccent: "purpose.", workText: "Three projects from GitHub: an API-driven anime catalog, an offline Android point-of-sale app, and a school website with a CMS.", workHint: "Scroll to explore the work", caseStudy: "View case study", demoNotice: "Personal project / not client work",
    servicesPageTitle: "Services & Process", servicesPageIntro: "Web and mobile application development, from interfaces to data. Explore the services I offer and my approach to building each feature.", servicesEyebrow: "02 / SERVICES", servicesTitle: "From concept", servicesAccent: "to screen.", servicesText: "A solid foundation. A clear interface. Interactions that feel natural.",
    services: [
  {
    "title": "Web applications & API integrations",
    "text": "Responsive catalogs, dashboards, and interfaces connected to APIs. Jelajanime uses AniList GraphQL as its data source.",
    "tags": "Next.js / React / TypeScript / GraphQL"
  },
  {
    "title": "Mobile & offline applications",
    "text": "Android applications with local storage, transactions, and data management. The POS portfolio app uses Flutter and SQLite.",
    "tags": "Flutter / Dart / SQLite"
  },
  {
    "title": "Backend & data management",
    "text": "Application logic, data storage, and service integrations supporting consistent workflows from the interface to the data layer.",
    "tags": "API / SQLite / Data"
  }
],
    pause: "Pause motion", resume: "Resume motion", skillLabel: "Core technologies", socialLabel: "Find me elsewhere", skillGroups: [{"title":"Web","items":["React","Next.js","TypeScript","Tailwind CSS","GSAP","Bootstrap","jQuery"]},{"title":"Mobile","items":["Flutter","Dart"]},{"title":"Backend & Data","items":["Laravel","Go (Golang)","Node.js","MySQL","SQLite","GraphQL"]}], skillWords: ["NEXT.JS","REACT","TYPESCRIPT","TAILWIND","GSAP","FLUTTER","DART","SQLITE","GRAPHQL","BOOTSTRAP","JQUERY","LARAVEL","GO","NODE.JS","MYSQL"],
    aboutEyebrow: "03 / ABOUT", aboutTitle: "Considered code.", aboutAccent: "Clear collaboration.", aboutLabel: "Fullstack Developer — Web & Mobile", approachLabel: "Working approach", approach: [{"title":"Requirements analysis","text":"Understand goals, users, scope, and feature priorities."},{"title":"Planning & design","text":"Define application flows, data structures, interface designs, and implementation milestones."},{"title":"Development","text":"Build the frontend, backend, and mobile application as needed, including API integrations."},{"title":"Testing & revisions","text":"Check functionality, responsive layouts, and user flows; refine the result through feedback."},{"title":"Deployment & documentation","text":"Prepare the release, configuration, usage documentation, and project handover."}],
    contactEyebrow: "04 / START A CONVERSATION", contactTitle: "Your next", contactAccent: "good idea?", contactText: "Share your goals, scope, and project timeline. Let's start with a simple conversation.", hire: "Hire me", hireTitle: "Tell me about your project", hireDescription: "Choose the best way to get in touch.", closeContact: "Close contact", email: "Email", whatsapp: "WhatsApp", unavailable: "Contact not yet provided", footer: "Built with attention to detail.", previewNote: "Portfolio preview - final domain not yet provided.",
    back: "Back to work", overview: "Overview", problem: "The problem", role: "Role", approachHeading: "Approach", results: "Results & limitations", stack: "Technology", gallery: "Project gallery", previous: "Previous slide", next: "Next slide", slide: "Slide", of: "of", demoLink: "Open demo", codeLink: "View code", noLinks: "Demo and code are not available yet.", caseCta: "Let's build something meaningful.", nextProject: "Next project", projectType: "Personal project", year: "Project year",
  },
};
export type Copy = (typeof ui)[Locale];
export type Project = {
  placeholder: boolean; status: Text; year: number;
  slug: string; title: string; category: Text; summary: Text; role: Text; problem: Text; approach: Text; results: Text;
  tech: string[]; images: { src: string; width: number; height: number; alt: Text }[]; demo: string | null; code: string | null;
};
export const projects: Project[] = [
  {
    "placeholder": false,
    "status": {
      "id": "Proyek personal",
      "en": "Personal project"
    },
    "year": 2026,
    "slug": "jelajanime",
    "title": "Jelajanime",
    "category": {
      "id": "Web / Katalog anime",
      "en": "Web / Anime catalog"
    },
    "summary": {
      "id": "Katalog anime berbahasa Indonesia dengan pencarian, filter, detail anime, watchlist lokal, dan trailer resmi.",
      "en": "An Indonesian anime catalog with search, filters, anime details, a local watchlist, and official trailers."
    },
    "role": {
      "id": "Pengembangan aplikasi web, antarmuka responsif, animasi, dan integrasi AniList GraphQL.",
      "en": "Web application development, responsive interfaces, motion, and AniList GraphQL integration."
    },
    "problem": {
      "id": "Menyediakan cara menjelajahi katalog anime berbahasa Indonesia, dari pencarian dan filter hingga detail judul, trailer, dan daftar tontonan pribadi.",
      "en": "Providing an Indonesian anime discovery experience, from search and filters to title details, trailers, and a personal watchlist."
    },
    "approach": {
      "id": "Next.js App Router dengan provider katalog dan adapter AniList terpisah dari UI. Pencarian memakai debounce, filter memakai pagination, watchlist tersimpan di localStorage dan sinkron antar-tab, serta trailer dibuka dalam dialog.",
      "en": "Next.js App Router with a catalog provider and an AniList adapter separated from the UI. Search is debounced, filters use pagination, watchlists use localStorage with cross-tab synchronization, and trailers open in a dialog."
    },
    "results": {
      "id": "Kode aplikasi tersedia di GitHub, dengan tautan situs pada README. Katalog bergantung pada AniList; watchlist tersimpan di browser. Tautan tonton menuju layanan resmi. Tidak ada metrik pengguna atau hasil bisnis yang diklaim.",
      "en": "Application code is available on GitHub, with a site link in the README. The catalog depends on AniList; watchlists are stored in the browser. Watch links lead to official services. No user metrics or business outcomes are claimed."
    },
    "tech": [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "GSAP",
      "AniList GraphQL"
    ],
    "images": [
      {
        "src": "/projects/jelajanime.webp",
        "width": 1600,
        "height": 839,
        "alt": {
          "id": "Screenshot asli beranda Jelajanime dengan hero anime dan katalog dari README proyek",
          "en": "Original Jelajanime homepage screenshot showing the anime hero and catalog from the project README"
        }
      }
    ],
    "demo": "https://jelajanime.vercel.app",
    "code": "https://github.com/abexziero/jelajanime"
  },
  {
    "placeholder": false,
    "status": {
      "id": "Demo Community",
      "en": "Community demo"
    },
    "year": 2026,
    "slug": "aplikasi-kasir",
    "title": "Ralunio Community",
    "category": {
      "id": "Android / Kasir offline",
      "en": "Android / Offline POS"
    },
    "summary": {
      "id": "Aplikasi kasir Android offline untuk UMKM: katalog produk, transaksi tunai, stok barang, dan riwayat penjualan.",
      "en": "An offline Android point-of-sale portfolio app for small businesses: product catalog, cash checkout, inventory, and sales history."
    },
    "role": {
      "id": "Pengembangan aplikasi Flutter, penyimpanan SQLite, alur transaksi, dan antarmuka kasir.",
      "en": "Flutter application development, SQLite storage, transaction flows, and cashier interfaces."
    },
    "problem": {
      "id": "Membangun alur kasir sederhana yang tetap berjalan tanpa koneksi internet, dengan katalog produk, transaksi tunai, stok, dan riwayat pada satu perangkat.",
      "en": "Building a simple cashier workflow that works without an internet connection, with products, cash transactions, inventory, and history on one device."
    },
    "approach": {
      "id": "Flutter dan Dart dengan SQLite lokal. Pembayaran menggunakan transaksi atomik, validasi stok, dan perlindungan penyimpanan ganda. PIN lokal memakai PBKDF2 dan pembatasan percobaan; ekspor JSON tidak menyertakan kredensial PIN.",
      "en": "Flutter and Dart with local SQLite storage. Checkout uses atomic transactions, stock validation, and duplicate-save protection. Local PINs use PBKDF2 and attempt limiting; JSON exports omit PIN credentials."
    },
    "results": {
      "id": "Repository menyediakan edisi demo Community untuk satu pemilik dan satu perangkat. Screenshot memakai data contoh. Tidak mencakup printer, pembayaran nontunai, cloud, atau impor/restore. Lisensi sumber mengizinkan belajar dan penggunaan internal; penggunaan komersial untuk pihak lain memerlukan izin. Tidak ada klaim penggunaan oleh pelanggan.",
      "en": "The repository provides a Community demo for one owner and one device. The screenshot uses sample data. It excludes printing, non-cash payments, cloud features, and import/restore. Source licensing permits learning and internal use; commercial use for others requires permission. No customer adoption is claimed."
    },
    "tech": [
      "Flutter",
      "Dart",
      "SQLite"
    ],
    "images": [
      {
        "src": "/projects/aplikasi-kasir.webp",
        "width": 750,
        "height": 1624,
        "alt": {
          "id": "Screenshot asli kasir Ralunio Community di Android dengan produk dan data contoh",
          "en": "Original Ralunio Community Android cashier screenshot with products and sample data"
        }
      }
    ],
    "demo": null,
    "code": "https://github.com/abexziero/aplikasi-kasir"
  },
  {
    "placeholder": false,
    "status": {
      "id": "Proyek personal / Studi implementasi",
      "en": "Personal project / Implementation study"
    },
    "year": 2026,
    "slug": "web-sekolah-modern",
    "title": "Web Sekolah Modern",
    "category": {
      "id": "Web / Portal sekolah & CMS",
      "en": "Web / School portal & CMS"
    },
    "summary": {
      "id": "Portal informasi sekolah dan CMS untuk MA Annur Samarinda, dengan berita, agenda, galeri, serta alur draft, tinjauan, dan publikasi.",
      "en": "A school information portal and CMS for MA Annur Samarinda, with news, events, a gallery, and draft, review, and publishing workflows."
    },
    "role": {
      "id": "Pengembangan website responsif, animasi, CMS, autentikasi, dan penyimpanan MariaDB.",
      "en": "Responsive website development, motion, CMS, authentication, and MariaDB storage."
    },
    "problem": {
      "id": "Memudahkan pengunjung menemukan informasi sekolah dan operator memperbarui konten, sambil menjaga draft serta revisi tetap privat hingga diterbitkan.",
      "en": "Helping visitors find school information and operators update content, while keeping drafts and revisions private until publication."
    },
    "approach": {
      "id": "Next.js App Router, React, TypeScript, dan Tailwind CSS dengan animasi GSAP. CMS memakai MariaDB, autentikasi Better Auth dengan MFA/TOTP wajib, pembagian peran, autosave draft, pratinjau, tinjauan, dan publikasi berbasis snapshot revisi.",
      "en": "Next.js App Router, React, TypeScript, and Tailwind CSS with GSAP motion. The CMS uses MariaDB, Better Auth with mandatory MFA/TOTP, role-based access, draft autosave, previews, review, and revision-snapshot publishing."
    },
    "results": {
      "id": "Kode dan preview GitHub Pages tersedia. Preview publik menampilkan halaman informasi dan berita contoh; login, dashboard, database, dan media privat memerlukan server Next.js. Sebagian materi masih contoh yang perlu disahkan sekolah. PPDB online, rapor, keuangan, dan alumni belum termasuk. Tidak ada klaim peluncuran resmi atau metrik pengguna.",
      "en": "The code and a public preview on GitHub Pages are available. The preview shows information pages and sample news; login, the dashboard, database, and private media require a Next.js server. Some materials are examples awaiting school approval. Online admissions, report cards, finance, and alumni features are not included. No official launch or user metrics are claimed."
    },
    "tech": ["Next.js", "React", "TypeScript", "Tailwind CSS", "GSAP", "MariaDB"],
    "images": [
      {
        "src": "/projects/web-sekolah-modern.webp",
        "width": 1920,
        "height": 978,
        "alt": {
          "id": "Screenshot asli beranda Web Sekolah Modern untuk MA Annur Samarinda dari README proyek",
          "en": "Original Web Sekolah Modern homepage screenshot for MA Annur Samarinda from the project README"
        }
      }
    ],
    "demo": "https://abexziero.github.io/web-sekolah-modern/",
    "code": "https://github.com/abexziero/web-sekolah-modern"
  }
];
