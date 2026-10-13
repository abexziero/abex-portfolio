# Penyesuaian konten GitHub Abex

Status: disetujui Abex dan diterapkan.
Sumber diperiksa 13 Oktober 2026 melalui konektor GitHub: profil README, kedua README proyek, package.json Jelajanime, dan struktur sumber Dart aplikasi kasir.

## Beranda dan Tentang

ID: Full-stack developer untuk web dan mobile, dengan fokus pada Agentic Engineering. Saya membangun aplikasi, otomatisasi bot, dan integrasi API; berbasis di Kalimantan Timur, Indonesia.

EN: Full-stack developer for web and mobile, focused on Agentic Engineering. I build applications, bot automation, and API integrations; based in East Kalimantan, Indonesia.

Bio panjang mempertahankan informasi OpenAI Codex/LLM yang diberikan Abex. Agentic AI, LLM tooling dan MCP ditampilkan sebagai fokus pengembangan/pembelajaran sesuai README, tanpa klaim hasil bisnis.

Layanan: aplikasi web dan integrasi API; aplikasi mobile/offline; otomatisasi dan pengembangan berbantuan AI. Stack utama: Next.js, React, TypeScript, Tailwind, GSAP, Flutter, Dart, SQLite, GraphQL. Teknologi lain di profil tidak otomatis dianggap bukti tingkat keahlian.

## Karya: Jelajanime

- Slug: jelajanime.
- Status: proyek personal, katalog anime web.
- ID: Katalog anime berbahasa Indonesia dengan pencarian, filter, detail anime, watchlist lokal, dan trailer resmi.
- EN: An Indonesian anime catalog with search, filters, anime details, a local watchlist, and official trailers.
- Stack: Next.js, React, TypeScript, Tailwind CSS, GSAP, AniList GraphQL API.
- Pendekatan: App Router, provider katalog dan adapter AniList terpisah dari UI; pencarian debounce, filter dengan pagination, watchlist localStorage dengan sinkronisasi antar-tab, dialog trailer.
- Hasil/batasan: implementasi dan demo web tersedia menurut README; data bergantung pada AniList, watchlist lokal pada browser, tautan tonton menuju layanan resmi. Tidak menyatakan jumlah pengguna atau peningkatan performa yang belum diukur.
- Kode: https://github.com/abexziero/jelajanime
- Demo: https://jelajanime.vercel.app — tautan sesuai README; pengecekan live dibatasi jaringan lingkungan.
- Gambar: screenshot asli docs/preview.png, diberi alt ID/EN; bukan mockup FORMA/ORBIT/MONO.

## Karya: Aplikasi Kasir / Ralunio Community

- Slug: aplikasi-kasir.
- Status: proyek portofolio, edisi demo Community.
- ID: Aplikasi kasir Android offline untuk UMKM: katalog produk, transaksi tunai, stok barang, dan riwayat penjualan.
- EN: An offline Android point-of-sale portfolio app for small businesses: product catalog, cash checkout, inventory, and sales history.
- Stack: Flutter, Dart, SQLite.
- Pendekatan: transaksi atomik, validasi stok, perlindungan penyimpanan ganda, PIN lokal PBKDF2 dan ekspor JSON tanpa kredensial PIN.
- Hasil/batasan: satu pemilik/satu perangkat; tidak mencakup printer, pembayaran nontunai, cloud, atau impor/restore. Ini edisi demo, bukan bukti penggunaan oleh pelanggan. Lisensi sumber bukan lisensi open source; jangan memberi label open source.
- Kode: https://github.com/abexziero/aplikasi-kasir
- Demo publik: tidak ditemukan; tidak membuat tautan APK/demo rekaan.
- Gambar: screenshot asli docs/images/community-cashier.png dengan data contoh dan alt ID/EN.

## Penerapan

- Ganti tiga proyek placeholder dengan dua proyek nyata tersebut; jumlah kartu/nav mengikuti data.
- Studi kasus ID/EN memakai fitur dan batasan README; label proyek dibedakan dari placeholder.
- Hapus penggunaan gambar dan isi placeholder lama dari halaman karya.
- Eksperimen/Snippets tetap merupakan demo interaksi website ini, dijelaskan sebagai eksplorasi lokal; bukan repositori atau pekerjaan klien. Tulisan tetap kosong sampai tersedia artikel asli.
- Pertahankan desain, tema, motion, toolbar dan Hire me WhatsApp/email/GitHub.
- Tambahkan tautan X, Instagram dan Threads dari README pada Tentang; pilihan Hire me tetap tiga kanal yang sudah disepakati.
- Konten disimpan lokal, tidak melakukan fetch GitHub saat pengunjung membuka halaman; tidak menambahkan statistik/analytics pihak ketiga.
- Sesuaikan metadata, teks preview, slug dan pengujian yang sebelumnya memakai tiga proyek demo. Domain final belum tersedia, jadi status noindex tetap berlaku.
- Verifikasi content check, typecheck, lint, build, kedua bahasa, studi kasus, kontak, layout mobile/desktop dan navigasi bahasa.

## Sumber

- Profil: https://github.com/abexziero/abexziero/blob/main/README.md
- Jelajanime: https://github.com/abexziero/jelajanime/blob/main/README.md
- Stack Jelajanime: https://github.com/abexziero/jelajanime/blob/main/package.json
- Kasir: https://github.com/abexziero/aplikasi-kasir/blob/main/README.md
