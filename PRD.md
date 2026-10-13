# Portofolio Abex — frontend mengikuti Hipuku

## Tujuan dan keputusan terbaru
Rombak frontend mengikuti struktur, komposisi, background, tipografi, dan interaksi https://www.hipuku.dev/ sedekat mungkin. Desain landing page panjang sebelumnya diganti sepenuhnya. Keputusan terbaru ini menggantikan kebutuhan lama mengenai galeri horizontal beranda, section swipe, panel layanan berulang, underline section, dan footer bounce.

Identitas Abex, bio Agentic Engineering, email abexziero@gmail.com, WhatsApp 628125569833, ID/EN dan tema terang/gelap tetap tersedia. Next.js App Router, TypeScript, Tailwind, shadcn/Radix, GSAP; konten lokal, tanpa CMS/login/database/form/analytics.

## Struktur dan konten
- `/` → `/id`; beranda `/id` dan `/en` berupa satu stage yang memenuhi viewport, tanpa section vertikal di bawahnya atau footer besar.
- `/{lang}/work`: dua kartu proyek personal GitHub dalam susunan kipas dengan judul halaman di bawahnya. Tautan tetap menuju studi kasus `/{lang}/projects/{slug}`.
- `/{lang}/experiments`: lima eksplorasi Abex dengan tiga kartu kipas pembuka; terhubung ke demo Snippets. Aplikasi milik Hipuku tidak ditampilkan sebagai karya Abex.
- `/{lang}/snippets`: tiga preview kipas dan semua 15 demo yang sudah tersedia, indeks, deskripsi dan viewer kode yang diunduh saat dibuka.
- `/{lang}/about`: profil, bio, skill, ilustrasi pilihan Abex, kontak. Artwork tidak berada di beranda.
- `/{lang}/services`: Layanan & Cara Kerja, tiga layanan dan tiga langkah pendekatan kerja. `/{lang}/writing` mengarah permanen ke halaman ini.
- Navbar beranda desktop menampilkan logo, tema, bahasa dan CTA Mari bekerja sama/Hire me; navigasi menggunakan stage portal. Halaman lain mempertahankan navigasi desktop. Mobile menyediakan CTA di menu. Dialog kontak menawarkan WhatsApp utama, email/salin alamat dan GitHub https://github.com/abexziero; focus trap, Escape, scroll lock dan pengembalian fokus. Contact bar email mobile tetap tersedia.
- Pengalih bahasa mempertahankan route/slug. Locale dan slug invalid 404. Metadata, HTML lang, canonical dan hreflang mengikuti halaman.

## Acuan visual dan motion
- Referensi kini diinspeksi langsung melalui Chrome lokal dengan Chrome DevTools MCP. Screenshot, DOM, CSS terukur dan observasi script publik disimpan di artifacts untuk perbandingan, tidak dimasukkan ke bundle aplikasi.
- Tema utama hijau hutan: background #0D2118, teks #E8EEDD, muted #B7CBB8, surface #153226, border #355443. Tema terang cutting mat: background #2D6B4F, teks #FFFAEA, muted #FFF0CC, surface #24573F, border #9EC5AD. Grid tetap 44px. Hero gelap memakai ivory #F6F1DC, butter #F0CE72, peach #EBA580 dan ice #BCDCDD. Hero/logo besar tema terang memakai ivory #FFFAEA, gold #FFDA57, coral #FFB591 dan cyan #8DE5F3; teks kecil memakai ivory #FFFAEA, gold #FFDA57, peach #FFD4B0, cyan #9AEAF6 dan lilac #ECD4FF untuk kontras >=4,5. Palet manual Colour mengikuti tema tanpa mengganti pilihan palet/setting lain. Canvas dan SVG preview demo juga membaca token tema. Semua halaman, toolbar, kartu dan demo mengikuti token tema.
- Font Parkinsans lokal, variable 300–800, SIL OFL; lisensi disertakan. Ikon dan monogram Abex dibuat sebagai SVG milik aplikasi, tanpa aset Font Awesome Pro, logo Hipuku, atau badge penghargaan palsu.
- Hero memakai wordmark SVG Abex di tengah, bio terpusat, lima label navigasi dalam dua baris (Layanan/Eksperimen/Snippets, lalu Karya/Tentang), tinggi tombol seragam dan garis penghubung ke kontur huruf yang menghindari tombol lain: Layanan?a, Eksperimen?b, Karya?e, Snippets?sisi kanan x, Tentang?sisi kiri x; mobile menampilkan nama, kode token, bio serta tombol Work/About.
- Intro wordmark: gaussian blur 14→0 selama 1,2 detik, stagger huruf .05 detik, translasi vertikal 18%, easing berbasis kurva referensi. Bio/toolbar masuk pada desktop; bio mobile langsung tersedia.
- Hover tanpa tool memberi goo lokal. Colour (shortcut 1) mengganti palet; Type mengatur skala lewat delapan handle. Spacing manual mengatur jarak antarhuruf dalam ruang SVG yang tetap; Radius membulatkan sudut huruf tanpa mengganti tulisan menjadi kotak. Radius dibatasi oleh ketebalan bentuk dan viewport. Opacity memakai slider 0,25-1. Pengaturan terakhir tetap berlaku setelah kontrol ditutup atau Escape; penutupan tidak memicu ulang morph. Setelah perubahan manual pertama, demo otomatis berhenti dan tidak dilanjutkan oleh hover/perpindahan tab. Reset mengembalikan warna, skala, jarak, radius dan opacity awal serta mengaktifkan kembali demo. Pengaturan hero hanya disimpan selama komponen halaman terbuka; refresh/navigasi keluar beranda mengembalikan nilai awal, tanpa localStorage.
- Portal memakai teks/border berbeda sejak diam: Karya ivory, Eksperimen butter, Layanan peach, Snippets ice dan Tentang lilac (#D3BCE8 gelap / #ECD4FF terang). Hover/fokus mengisi portal dengan warna tersebut dan teks forest. Mobile Karya/Tentang mempertahankan warna yang sama. Label navigasi mendukung wipe melingkar, text roll, anotasi hover/fokus, dan garis yang diukur ulang setelah resize. Kartu kipas merespons hover/fokus dengan transform GSAP.
- Petunjuk tool berada di dalam panel kontrol, tepat di bawah nilai pengaturan, memakai teks kecil dengan warna muted sesuai tema; tanpa panah atau anotasi mengambang. Petunjuk tersedia di tablet dan layar desktop pendek.
- Lima tool memiliki shortcut 1-5; Escape menutup kontrol dan mempertahankan hasil. Fokus kembali ke tombol tool setelah kontrol ditutup; Reset mengembalikan fokus ke Colour. Reduced motion menonaktifkan intro, auto-loop dan gerakan hover; pengaturan manual tetap tersedia.
- Menu memakai timeline reversible, focus trap, scroll lock, Escape dan fokus kembali. Navbar menghitung page-current, tanpa scroll spy section. Navbar desktop memakai teks 15px/bobot 500 dan warna per item (Work ivory, Experiments butter, Services peach, Snippets ice), animasi GSAP warna 300ms serta angka opacity 0?1/y 4?0; fokus mengikuti hover, halaman aktif mempertahankan state dan reduced motion langsung menerapkan state.
- Wordmark navbar Abex: hover/fokus memberi pantulan huruf bergiliran 0,55 detik dengan stagger 0,06 detik dan aksen ivory/butter/peach/ice; posisi kembali normal setelah pantulan, warna kembali setelah hover/fokus berakhir. Pembatalan mencakup semua tween tertunda; reduced motion hanya mengubah warna.
- Semua halaman menggunakan scroll native. Tidak ada ScrollSmoother, galeri pinning atau timeline section dari desain lama.
- 15 Snippets: velocity marquee, ripple grid, flocking, shape pit, text scramble, motion path, parallax tilt, path editor, text loop, text pressure, flow field, cloth pluck, iron filings, metaballs, spring drag. Desktop pointer/keyboard interaktif; touch/reduced motion statis. Pause/resume/reset, offscreen/hidden-tab pause, listener/ticker cleanup. Tanpa JS terdapat diagram dan navigasi dasar.
- Demo adalah implementasi asli; Shape Pit memakai envelope tumbukan melingkar. Tidak menjanjikan simulasi poligon Matter.js yang identik.

- Tema default selalu gelap, terlepas dari tema sistem operasi. Pilihan manual light/dark tersimpan di localStorage dan tersinkron antartab. Tanpa JavaScript memakai tema gelap; storage diblokir tetap memungkinkan pilihan selama sesi. Kesiapan tombol tema disimpan pada atribut React data-ready milik tombol, tanpa ketergantungan pada class HTML yang berubah saat ID/EN.

- Doodle dari pt.jpg pengguna, background hitam dihapus dengan imagegen dan alpha dipertahankan dalam /images/pt-doodle.webp. Dekorasi CSS fixed kanan bawah, maksimum 430px desktop dan 190px mobile; noninteraktif, di belakang konten dan menyesuaikan ruang contact bar.

- Pendamping doodle kiri bawah: laptop kode, kopi, robot mini, kabel dan bintang, dibuat dengan imagegen sebagai garis tangan transparan /images/developer-doodle-hand.webp. Kedua doodle memakai mask ivory #F6F1DC, opacity 20% gelap / 14% terang. Kiri maksimal 380px desktop dan disembunyikan di mobile; kanan tetap menjadi ilustrasi utama.

- Keseimbangan doodle: gambar kanan dibatasi tinggi 340px desktop, 170px tablet dan 90px layar pendek, untuk menjaga jarak dari bio. Parallax GSAP menggeser kanan maksimum 5px horizontal/4px vertikal; kiri bergerak berlawanan dengan amplitudo 65%. Hanya desktop >=1024px dengan pointer mouse/fine dan tanpa reduced motion. Pointer keluar/blur/visibility reset; media/unmount membersihkan tween dan listener. Tanpa JS dekorasi tetap statis.

- Cursor native: bentuk dari F:\cursor.png sebagai SVG18px, butter #F0CE72 dan outline #0D2118, hotspot(3,3). CSS cursor pada fine pointer/hover; bukan elemen pengikut pointer, tanpa animasi cursor. Touch memakai perilaku bawaan, teks/resize/crosshair mempertahankan cursor fungsional. Fallback auto/pointer jika aset ditolak browser. Animasi pesawat, helper jalur dan tes terkait dihapus.

## Keamanan dan penerimaan
- Validasi konten bertipe: terjemahan, slug unik/aman, aset lokal, HTTPS demo/kode, kontak tervalidasi; tanpa raw HTML/MDX executable, secret atau hasil proyek rekaan.
- Header HSTS, anti-framing, nosniff, referrer policy dan CSP yang ada tetap berlaku. Tautan tab baru noopener noreferrer. Prerender resource kode memakai path tetap.
- Pengukuran performa navbar berasal dari Performance API browser lokal; tidak dikirim ke server analytics.
- npm check: unit/content, typecheck, lint, production build. Playwright mencakup bahasa/routes/404, tema, no-JS, satu-viewport hero, menu reversal/fokus, lima tool, salin kontak, studi kasus/carousel dan 15 demo.
- Verifikasi 375/768/1024/1440px, portrait/landscape, tanpa overflow halaman atau kontrol terpotong; perbandingan visual dengan referensi dan screenshot lokal.
- Target Lighthouse mobile production: Performance ≥90, Accessibility ≥95, CLS ≤0,1; laporkan hasil aktual, jangan menggunakan skor build lama.
- Perangkat fisik iOS/Android dan screen reader tetap perlu review manual. Semua halaman noindex; publikasi menunggu domain final, materi proyek nyata, hak ilustrasi dan review deployment Vercel.

## Referensi
- https://www.hipuku.dev/ dan halaman Work/Experiments/Snippets/About, diinspeksi melalui browser lokal.
- https://github.com/google/fonts/blob/main/ofl/parkinsans/OFL.txt
- Panduan Next lokal di node_modules/next/dist/docs/; https://gsap.com/docs/v3/Plugins/MorphSVGPlugin/ dan https://gsap.com/docs/v3/Plugins/CustomEase/.

## Konten GitHub disetujui - 2026-10-13
Karya nyata: Jelajanime (Next.js/React/TypeScript/Tailwind/GSAP/AniList GraphQL) dan Ralunio Community/aplikasi-kasir (Flutter/Dart/SQLite). Slug jelajanime dan aplikasi-kasir menggantikan forma/orbit/mono; jumlah nav berasal dari projects.length. Screenshot lokal asli diverifikasi hash GitHub; satu gambar per studi kasus dengan dimensi asli dan tinggi maksimum75svh. Label proyek personal/Community demo, bukan placeholder atau kerja klien. Kasir bukan open source; batas edisi sesuai README. Bio hero full-stack web/mobile dan lokasi Kalimantan Timur; Tentang menampilkan stack utama, fokus pembelajaran Agentic AI/LLM tooling/MCP, layanan dan sosial GitHub/X/Instagram/Threads. Hire me tetap WhatsApp/email/GitHub. Eksperimen/Snippets dijelaskan sebagai demo lokal website; tulisan belum tersedia. Tidak ada statistik pengguna atau hasil bisnis rekaan, fetch GitHub runtime, atau analytics. Domain final belum tersedia; noindex tetap berlaku.

## Identitas profesional terbaru - disetujui Abex
Jabatan utama Fullstack Developer - Web & Mobile. Bio Tentang memperkenalkan Abex sebagai pembangun aplikasi web/mobile dengan antarmuka intuitif, pengelolaan data terstruktur dan integrasi API memakai React, Next.js dan Flutter; fokus pada kegunaan, kode yang mudah dikembangkan dan kebutuhan nyata. Hero: Membangun aplikasi web dan mobile yang menghubungkan antarmuka, data, dan kebutuhan pengguna. Metadata kedua bahasa mengikuti posisi tersebut. Layanan ketiga menjadi backend/pengelolaan data, dan fokus tambahan mencakup frontend/backend/data/API. Highlight bio mengikuti jabatan dan stack. Keputusan ini menggantikan penekanan Agentic/AI pada deskripsi diri sebelumnya. Proyek, kontak dan desain tetap sesuai keputusan terakhir.

## Layanan dan cara kerja - disetujui Abex
Halaman Tulisan diganti Layanan (Services), route /{lang}/services. Judul Layanan & Cara Kerja / Services & Process; tiga kartu layanan web/mobile/backend dan tiga langkah pendekatan kerja memakai konten bilingual yang sudah ada. Kedua bagian dipindahkan dari Tentang; Tentang berisi profil, lokasi/fokus, skill dan kontak. Navbar, menu mobile dan portal hero memakai label/route baru; jumlah nav layanan mengikuti copy.services.length. Posisi, warna peach, konektor dan hover/fokus portal dipertahankan. /{lang}/writing menjadi redirect permanen308 ke /{lang}/services untuk locale valid; locale invalid tetap404. Metadata/canonical/hreflang memakai route dan deskripsi layanan. Rendering server; konten dan navigasi dasar tersedia tanpa JavaScript.

## Timeline kerja dan perapihan Tentang - disetujui Abex
Pendekatan kerja menjadi lima tahap bilingual: analisis kebutuhan, perencanaan/desain, pengembangan, pengujian/revisi, deploy/dokumentasi. Timeline bernomor dan garis penghubung horizontal pada desktop >=1024px, vertikal pada tablet/mobile; judul dan deskripsi setiap tahap tetap tersedia tanpa JavaScript. Tentang memakai dua paragraf bio yang sama dengan font400/18-22px, dua kolom desktop dengan ilustrasi berbingkai proporsional, serta susunan vertikal mobile. Skill dikelompokkan Web/Mobile/Data & API. Tiga kartu kontak Email/WhatsApp/GitHub dan tautan sosial X/Instagram/Threads terpisah. Metadata, kontak asli, tema dan motion navbar/hero dipertahankan.

## Logo teknologi dan foto About terbaru
Teknologi utama memakai9 SVG logo24px dengan nama di bawahnya, tetap terbagi Web/Mobile/Data & API. Warna brand dari metadata Simple Icons, alas ivory menjaga keterbacaan di kedua tema. Semua aset lokal; SVG dekoratif dengan alt kosong karena nama terlihat. Pemeriksaan build menggagalkan mapping/aset logo yang hilang. Foto About kini abe.png dari Abex (768x1119), memakai dimensi intrinsik dan bingkai sesuai rasio; komposisi/latar asli dipertahankan. Ilustrasi sebelumnya tidak lagi ditampilkan di About.

## Teknologi, sosial, kontak dan scroll terbaru - disetujui Abex
Teknologi menjadi15 item: Web (React, Next.js, TypeScript, Tailwind CSS, GSAP, Bootstrap, jQuery), Mobile (Flutter, Dart), Backend & Data (Laravel, Go/Golang, Node.js, MySQL, SQLite, GraphQL). X/Instagram/Threads memakai logo lokal dan label. Dialog Hire me menampilkan ikon, detail WhatsApp/email/GitHub, serta tombol salin sebagai kontrol terpisah di dalam kartu email.

Judul dan paragraf editorial tiap halaman memakai pola Responsive line splits on scroll: GSAP SplitText lines/mask, autoSplit dan ScrollTrigger; masuk dari bawah per baris, disesuaikan saat resize/font selesai, cleanup saat pindah route. Navbar, kontrol, demo interaktif, kartu bertautan dan wordmark SVG mempertahankan animasi masing-masing. Reduced motion dan tanpa JavaScript menampilkan teks langsung.

Navbar sticky berlatar solid mengikuti tema; garis batas dan bayangan lembut muncul setelah scroll8px agar konten tidak menembus navigasi.

## Urutan navigasi terbaru - disetujui Abex
Navbar desktop, menu mobile, portal hero dan navigasi tanpa JavaScript memakai urutan Tentang / Karya / Layanan / Eksperimen / Snippets. Tentang tidak memakai angka jumlah; tautan lainnya mempertahankan jumlah asli. Menu mobile tetap memiliki Beranda sebelum lima halaman, tanpa duplikasi Tentang. Portal desktop menempatkan Tentang/Karya/Layanan di baris atas dan Eksperimen/Snippets di bawah; konektor dihitung ulang mengikuti posisi tersebut dan ujung huruf wordmark. Mobile mempertahankan dua portal ringkas dengan urutan Tentang/Karya. Warna mengikuti halaman (Tentang lilac, Karya ivory, Layanan peach, Eksperimen butter, Snippets ice), bukan indeks urutan. Hire me, bahasa dan tema tetap di kanan navbar.

## Persiapan Cloudflare Pages - disetujui Abex
Target hosting kini Cloudflare Pages gratis dengan static export, menggantikan rencana Vercel. Build standar Next.js tetap tersedia; build:pages menghasilkan out/, WebP responsif, _redirects dan _headers. Metadata/robots/sitemap/footer memakai SITE_URL dan PORTFOLIO_RELEASE, hanya produksi main boleh diindeks. Tanpa origin/flag rilis, preview tetap noindex. Route / dialihkan ke /id; Writing lama308 ke Services; locale/slug invalid404.

deploy:cloudflare memakai Wrangler4.147.0, membuat proyek baru main, membaca URL yang diberikan Cloudflare, menjalankan checks/build rilis, mengupload dan memeriksa route publik. Proyek lain tidak ditimpa tanpa catatan deployment lokal. Tidak ada token/password di source atau paket upload. Upload hanya dapat diselesaikan dari terminal dengan akses API Cloudflare.

Bio hero tetap terbaca langsung agar LCP tidak tertunda. SplitText dipakai pada halaman yang digulir, menggunakan span block; paragraf mempertahankan teks aksesibel alami tanpa aria-label yang dilarang. Mode reduced motion dan cleanup tetap berlaku.

## Alamat rilis terbaru
Abex meminta abexziero.pages.dev. Nama proyek default menjadi abexziero; pembuatan/upload berikutnya menggunakan origin resmi Cloudflare dan menolak URL alternatif. Proyek abexziero-portfolio yang sudah berhasil diupload dipertahankan. Verifikasi publik mengulang error sementara, membedakan upload berhasil dari status verified, dan dapat dijalankan ulang tanpa upload lewat verify:cloudflare.
