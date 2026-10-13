# Implementation ledger — PRD.md

- Workspace initially empty, no Git repository; implement in requested directory. No existing callers/data to preserve.
- Scope: local profile/projects/UI translations -> routes/metadata -> server sections -> client motion -> content/build/browser tests.
- Ruling: keep site unpublished because identity/contact/domain remain placeholders, as explicitly required by PRD.
- Ruling: use original SVG mockups, no external imagery or invented commercial outcomes.
- Ruling: design CLI cannot run (Python unavailable); follow approved editorial dark/lime/Geist direction and skill accessibility guidance.
- Ruling: registry network denied (EACCES); copy read-only npm cache into writable workspace and install cached compatible stable releases.

## Rulings and review
- Native scroll snap is the Carousel track owner, preserving swipe and no-JavaScript browsing without adding Embla. The approved user plan names Carousel, not Embla; corrected the accidental Embla reference in this PRD transcription.
- Full-viewport decoration caused mobile document overflow; clipped within hero after failing browser regression.
- Radix Portal mounts after the parent layout effect; bind the menu timeline when the panel ref becomes ready. Rapid opposite commands reverse the existing timeline.
- DynamicParams false produced Next.js NoFallbackError server logs for invalid routes. Default dynamic params plus explicit notFound preserves prerendered known routes and proper 404 responses without those errors.
- Cache restoration initially removed compatible optional WASM peer versions. Restored original registry metadata for those peers; a clean offline npm ci then installed 491 packages successfully.
- Fresh review found inaccessible landscape menu content. Confirmed with failing 812x375 regression; fixed panel scrolling and nonshrinking content. No confirmed Critical issues.

## Verification
- Content tests: five passing. Build validates translations, slugs, local assets, URLs and contact configuration.
- Typecheck, ESLint and production build passed; ID/EN home and six project pages prerendered.
- Initial ten Playwright Chromium tests passed: routes/language, 404, responsive widths, reduced motion, interruptible menu/focus/scroll lock, loop, slider, no JS, late images/resize/keyboard, touch and repeat-navigation cleanup.
- Final suite: 11 Playwright Chromium tests passed, including the landscape menu regression; result recorded in VERIFICATION.md.
- Clean npm ci --offline --ignore-scripts passed in isolated scratch directory, proving lockfile synchronization.
- Release gate intentionally rejects placeholders; no deployment performed.
- Lighthouse production/mobile: ID Performance 98, EN 95, FORMA EN 94; Accessibility 100 and CLS 0 on all three. JSON reports in ignored artifacts/.
- Real screen reader, iOS Safari, Chrome Android, and Vercel preview remain manual checks.

## Abex profile update
- Added the supplied identity, Indonesian bio, English translation and email; normalized WhatsApp to 628125569833.
- Updated profile labels and metadata. Domain and demonstration projects remain placeholders.
- Full content tests, typecheck, lint and production build passed; all 11 browser tests passed with real contact-link assertions. Release gate still rejects publication.

## Responsive navbar and hero artwork — 2026-10-11
- User approved replacing the hero project card with the supplied Nightwing illustration and hiding Menu at desktop widths; mobile retains the accessible Sheet.
- Navbar links animate underline and pressed scale with GSAP, track the current section, and scroll in 0.6 seconds with replacement/cancellation and a reduced-motion fallback. Mobile section navigation waits for menu exit and scroll unlock.
- Resizing an open menu to desktop closes it and restores focus to a visible navigation link.
- Updated case navigation tests to use the project gallery; added coverage for artwork loading, responsive navbar, consecutive clicks, menu navigation, resizing and reduced-motion destinations.
- Full check passed; 12 Chromium tests passed. Desktop/mobile screenshots inspected. Illustration provenance recorded in ASSETS.md; publication rights remain unverified.
- Lighthouse rerun: ID Performance 95, EN 93, FORMA EN 96; Accessibility 100 and CLS 0 on all three routes.

## GSAP navigation, swipe, footer and text update
- Reproduced stale About indicator at 1024px: native scroll callbacks ran before ScrollSmoother rendered the final transform. Header now updates after the smoother renders, with native scroll/rAF fallback; underline animation has one context owner.
- Shared ScrollTo helper animates the actual window scroll, temporarily reduces smoother catch-up and restores it on completion/interruption. A pinned target uses its existing trigger start so Work opens at the first card.
- HomeMotion adds SplitText word stagger, a reversible scroll-driven horizontal entrance and scoped Observer gestures. Normal vertical scroll and native project swipes remain available; CTA links work without JS.
- Footer adds an original SVG curve with speed-dependent MorphSVG/elastic bounce. Reduced motion reverts the curve to static geometry; links/text remain stationary.
- Default GSAP focus handling owns nonpinned content; gallery keyboard handling owns pinned cards. Pointer focus no longer invokes gallery keyboard positioning.
- Full check passed and 14 browser tests passed. Fresh reviewer verified rapid navbar navigation, natural gallery click and Hero swipe; no Critical/Important findings remain. Local preview moved to 3002 because earlier servers retained stale modules.
- Lighthouse mobile rerun: ID Performance 96, EN 95, FORMA EN 96; Accessibility 100 and CLS 0 on all three routes.

## Contact indicator at the scroll limit
- Reproduced Contact displaying About at viewport heights 1080/1440px: the final section could not reach the 40% threshold because the window had reached its maximum scroll.
- Header now recognizes the rendered end of content and selects the last visible section; ordinary section tracking and hover/focus motion are unchanged.
- Failing regression passed after the fix: heights 1080/1440/2160, rapid Services-to-Contact clicks, pointer leaving, Home/End and reduced motion. Full check and all 15 browser tests passed. Preview on port 3002 restarted and verified.

## Mobile scroll and tablet Hero alignment
- Mobile Work entrance previously continued until the section reached the header, keeping visible content horizontally clipped too long. It now completes at 60% viewport height on compact or touch devices.
- At tablet height 1024px, Work was already within the viewport at initial load, making the old negative trigger start translate Hero toward the left edge immediately. Clamped trigger start and stationary compact/touch Hero preserve the existing gutters; desktop retains its exit motion.
- New regression failed before the fix, then passed with CDP vertical touch gestures and widths 375/640/768/820/1024. Full check and all 16 browser tests passed. ID/EN headings measured across 320–1180px without text overflow; tablet/mobile screenshots inspected. Preview restarted on port 3002.

## Supplied transparent Hero image
- Replaced the active Hero image with Abex's existing robin1.png cutout; verified real alpha transparency. Original source remains available.
- Removed the dark portrait frame and used contain sizing with correct 362×552 intrinsic dimensions; content validation now allows safe local JPG/PNG paths.
- Full check passed; 3 relevant browser tests passed. Verified loading, transparent wrapper and no overflow at 375/768/1440; preview on port 3002 restarted.
- Subsequently replaced the active asset with Abex's robin2.png (432×578, verified alpha), updated image dimensions and bilingual alt text. Full check and the responsive navbar/artwork browser test passed; verified the actual decoded replacement and no overflow at 375/768/1440. Preview restarted on port 3002.

## Electric-blue palette
- Applied the approved charcoal/blue palette to semantic tokens, navigation, buttons, focus states, badges, surfaces, Contact, carousel, borders and favicon; added a subtle static Hero glow.
- Replaced lime-specific button utilities with primary-token utilities. Layout and GSAP interactions retain their existing implementation; local project mockups keep their independent artwork palettes.
- Full check and 16 browser tests passed. Inspected desktop/mobile screenshots; checked contrast for primary/muted text, CTA idle/hover/focus and focus ring. Lighthouse mobile: ID Performance 98, EN 97, FORMA EN 95; Accessibility 100 and CLS 0 on all three.

## Midnight + Tangerine
- Applied the selected #14151B/#FFAB70/#F4F1ED palette, neutral midnight cards, warm secondary text, subdued tangerine glow/borders and matching favicon.
- Found stale electric-blue CSS in the initial Turbopack output. A Webpack build generated the correct CSS; build script now selects Webpack. Verified actual computed accent before checking contrast or reporting completion.
- Content checks, typecheck, lint and Webpack production build passed; 16 browser tests passed in 56.3s. Inspected mobile/desktop screenshots, checked 375/768/1440px overflow and verified CTA hover/focus contrast above 4.5:1. Preview updated on port 3002.
- Lighthouse mobile rerun: Performance 97 and Accessibility 100 on ID/EN/FORMA EN; CLS 0.0474/0/0.0024 respectively, all within the PRD threshold.

## Obsidian + Ice
- Applied the selected #111113/#DCE6F0/#F5F5F7 palette to semantic tokens, neutral surfaces, secondary text, glow, borders, scrollbar and favicon. Illustration retains its supplied colors.
- Full check passed using Webpack; verified actual computed palette and matching favicon. All 16 browser tests passed in 55.8s. Inspected desktop/mobile screenshots and checked 375/768/1440px overflow. CTA hover contrast is 12.21:1; primary/muted text and focus ring pass their contrast targets. Production preview updated on port 3002.
- Lighthouse mobile rerun: Performance 97/92/97 on ID/EN/FORMA EN; Accessibility 100 on all three; CLS 0.0474/0/0.0024. All PRD targets pass.
