# Portofolio Abex

Next.js, TypeScript, Tailwind, Radix/shadcn dan GSAP. Konten lokal ID/EN, dua proyek personal GitHub, kontak email/WhatsApp/GitHub.

## Lokal

Node >=22.18 dan npm. Jalankan npm.cmd ci lalu npm.cmd run dev. Buka http://localhost:3000/id.

Pemeriksaan: npm.cmd run check dan npm.cmd run test:e2e.

## Cloudflare Pages

Hosting statis tanpa Workers Functions/database. Foto/screenshot diproses menjadi WebP responsif saat build; gambar sumber tetap disimpan.

Sesudah login Cloudflare, jalankan dari PowerShell biasa:

    npm.cmd run deploy:cloudflare

Skrip membuat proyek abexziero dengan branch produksi main, membaca alamat pages.dev dari Cloudflare, menguji kode, membangun rilis, mengupload out/, dan memeriksa route publik. URL/status tersimpan di release-cloudflare.json (diabaikan Git). Proyek yang sudah ada ditolak kecuali memiliki catatan deployment lokal ini, untuk menghindari menimpa website lain.

Jika nama proyek perlu diganti:

    powershell -NoProfile -ExecutionPolicy Bypass -File scripts/deploy-cloudflare.ps1 -ProjectName abex-portfolio-baru

Wrangler dipatok ke4.147.0; CLI cache lokal digunakan jika tersedia. Login:

    node .wrangler/tools/node_modules/wrangler/bin/wrangler.js login

Pada komputer baru:

    npx.cmd --yes wrangler@4.147.0 login

Tidak perlu membagikan token/password. Upload memerlukan jaringan Cloudflare dari terminal.

## Build preview dan produksi

    npm.cmd run build:pages
    npm.cmd run preview:pages

Preview export: http://localhost:3006. Server lokal menyediakan file export serta redirect/header; bukan emulasi Workers. Preview tetap noindex.

Build produksi manual (alamat harus berasal dari proyek Cloudflare yang sudah dibuat):

    $env:SITE_URL='https://alamat-proyek.pages.dev'
    npm.cmd run build:release

Rilis memakai canonical/hreflang/OpenGraph origin tersebut, robots untuk crawling, sitemap16 route dan footer final. Branch preview selain main tetap noindex. out/_redirects mengatur / -> /id serta Writing -> Services; out/_headers mengatur keamanan/cache.

Integrasi Git Cloudflare: build npm run build:pages, output out, Node24, SITE_URL=origin produksi, PORTFOLIO_RELEASE=1, branch produksi main. Direct Upload dan Git integration adalah pilihan proyek terpisah.

## Verifikasi dan rollback

Periksa ID/EN, route404, bahasa/tema, menu/fokus, animasi/reduced motion, gambar, kontak dan HP pada deployment. Preview lokal tidak membuktikan perilaku CDN produksi.

Rollback ke deployment Cloudflare sebelumnya, lalu cek route/kontak lagi. Lisensi aset tercantum di ASSETS.md.

Jika upload berhasil tetapi cek URL belum lolos (misalnya HTTP522), tunggu lalu jalankan npm.cmd run verify:cloudflare. Pemeriksaan mengulang gangguan sementara dan tidak melakukan upload ulang. Status verified hanya dicatat setelah semua route memberi200.
