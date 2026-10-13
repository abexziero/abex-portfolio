# Asset provenance

- `public/projects/*.svg`: six original vector compositions created for this demo. No client work, stock photos, external product images, or commercial results are implied.
- `src/app/icon.svg`: original vector icon.
- `public/images/robin.jpg`: Nightwing comic illustration supplied and selected by Abex from the local Downloads folder. This is an avatar illustration, not a personal photograph. Artist/source and publication rights have not been verified; resolve before publishing.
- `public/images/robin1.png`: replacement Nightwing cutout supplied by Abex from Downloads, 362×552 PNG with real alpha transparency. Used directly, without image generation or editing. Artist/source and publication rights remain unverified.
- `public/images/robin2.png`: current Hero image supplied by Abex from Downloads, 432×578 Nightwing illustration with real alpha transparency. Used directly. Artist/source and publication rights remain unverified.
- `src/app/fonts/geist-latin.woff2`: unmodified Geist Latin font bundled with Next.js. Copyright 2024 The Geist Project Authors. Distributed under SIL Open Font License 1.1; see adjacent `OFL.txt` and https://github.com/vercel/geist-font/blob/main/OFL.txt.

SVG interface figures are illustrative data; bilingual alt text describes the mockups. They are not screenshots of deployed products.

- `public/images/developer-doodle-hand.webp`: imagegen edit of original developer doodle, styled against user pt.jpg. Real alpha; ivory is applied through a CSS mask. See docs/developer-background.md for provenance.

- `public/projects/jelajanime.webp`: optimized original README screenshot from abexziero/jelajanime/docs/preview.png (1600x839), source Git blob SHA1 5b9a7777e2985cc48bb2fe232bb43cb2dfdf9915.
- `public/projects/aplikasi-kasir.webp`: optimized original README screenshot from abexziero/aplikasi-kasir/docs/images/community-cashier.png (750x1624), source Git blob SHA1 93b5eb6ee2c96e01466c90ec4a83bf77671f4e6e. Local copies verified against GitHub hashes before optimization; sources unmodified. Kasir screenshot uses sample data. Older placeholder SVGs are retained as unused historical assets.

- `public/images/abe.png`: current About portrait supplied by Abex from C:/Users/USER/Downloads/abe.png,768x1119. PNG recompressed losslessly; original retained. Background and composition unchanged. Replaces Nightwing in About.
- `public/icons/technology/*.svg`:15 Simple Icons logo paths (React, Next.js, TypeScript, Tailwind CSS, GSAP, Bootstrap, jQuery, Flutter, Dart, Laravel, Go, Node.js, MySQL, SQLite, GraphQL), downloaded from https://github.com/simple-icons/simple-icons/tree/develop/icons on2026-10-13. Paths/viewBox retained; native brand fill taken from data/simple-icons.json. SVGs rebuilt using only verified path data, without scripts/external references. CC0 license in adjacent LICENSE.md. Decorative alongside visible technology labels.
- `public/icons/social/*.svg`: Simple Icons X, Instagram, Threads, WhatsApp and GitHub paths, same source/date/sanitization as technology logos. Brand fills from Simple Icons metadata; ivory surfaces preserve visibility across themes. Mail icon is original inline SVG.
- `public/optimized/`: generated WebP derivatives of abe.png and the two original project screenshots, widths320/480/640/768/1024/1280/1600, quality82 and without upscaling. Original files retained. Generated at Pages build time; no external image service or new visual material.
