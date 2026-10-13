# Pages domain change and verification retry - 2026-10-13

User uploaded227 files successfully to abexziero-portfolio, deployment d52bbe44.abexziero-portfolio.pages.dev. Initial post-upload verification returned522; user subsequently confirmed the site opens in their browser. This session's web fetch could not independently access either URL.

User requests abexziero.pages.dev. Default deploy project and wrangler name now abexziero; next deploy creates the new project if available and reads its official assigned origin. Exact requested domain enforced: an alternative assigned name aborts upload. Existing old project/deployment remains untouched. New address is not claimed deployed yet; account API access remains unavailable in this session.

Verification moved into reusable scripts/verify-cloudflare.ps1, available via npm run verify:cloudflare without re-upload. HTTP5xx/429/network errors retry up to6 times,5-second spacing and15-second request timeout; other failed statuses stop immediately. Uploaded state remains verification_pending on failed checks and only becomes verified after all7 public paths return200. Tests reproduced old immediate522 failure, then passed transient522 recovery, empty initial project domains, persistent522, network failures and404 fail-fast. Seven unit tests and lint passed. No frontend changes or rebuild required for this script/config update; no live upload performed by this agent.

---
# Cloudflare Pages release preparation - 2026-10-13

Conditional Next static export prepared, retaining standard Next build/dev. Build-time sharp generates21 WebP derivatives with custom responsive image loader. Added isolated root redirect layout and explicit static project params. Export includes404, both locales/cases, motion-source, Cloudflare _redirects/_headers, robots and sitemap. SITE_URL validates HTTPS origin; release flag controls indexing/footer; preview branches stay noindex. Sitemap contains16 canonical public routes. No runtime server/database/Functions.

Deployment script pins Wrangler4.147.0 (4.149.0 npm target unavailable), reuses prepared local cached CLI or pinned npx. Creates a new main-branch Pages project, obtains origin from Cloudflare project listing or successful creation output, records project ownership/status locally, checks/builds, deploys, then fetches public routes. Refuses to overwrite another existing project without matching local deployment record. Auth values never added to content/source. Orchestration tested twice with mocked Cloudflare/commands, including empty initial project domains; no actual API mutations occurred during tests.

Verification:7 unit tests, typecheck, lint, preview static build and release static build passed. Full44 browser tests passed against exported files in3.4m, including404, redirects, ID/EN, themes, contacts, menu focus, original screenshots/new WebP loads and existing motion. Separate release browser test passed with reserved test origin (not deployed): canonical/indexable metadata, final footer, headers, robots and16-route sitemap. Final export restored to noindex preview without test origin.

Lighthouse revealed animated hero bio delaying LCP. Hero bio now stays unsplit and immediately readable; editorial scroll animation elsewhere retained. SplitText paragraphs use natural accessible text rather than prohibited aria-label, with block span lines. Final3 profile/scroll/navbar browser tests reran successfully; final static build/lint passed. Chrome154 Lighthouse mobile simulation: Performance99, Accessibility100, CLS0.001996. Report artifacts/cloudflare-lighthouse-final.json. Earlier diagnostic reports are retained and superseded.

Preview server scripts/serve-out.mjs serves actual export assets and header/redirect rules; it is not Cloudflare runtime emulation. Wrangler parsed rules but local workerd failed with spawn EFTYPE; Cloudflare API calls were denied by session network restrictions even after user completed login. Therefore no Cloudflare project/deployment was created or verified by this agent. Finish from ordinary PowerShell: npm.cmd run deploy:cloudflare. Live URL is reported by the script after upload. Current local preview http://localhost:3006, session75479; release/cloudflare-preview.zip is a noindex preview artifact.

Physical-device/screen-reader and live CDN checks remain outstanding. No claim of online publication.

---
# Navigation order - 2026-10-13

Navbar, hero portals, mobile menu and no-JavaScript navigation reordered About/Work/Services/Experiments/Snippets in ID/EN. About added to desktop links without invented count; its hover/focus/active color uses lilac. Other nav colors now keyed to route, retaining original page colors. Removed separate duplicate mobile About link; Home stays before page navigation. Desktop portals use3 upper and2 lower positions; connector placement, lanes and wordmark anchors reordered together. Mobile visible portals About/Work retained.

npm run check passed (6 unit tests, typecheck, lint, content validation, production build).12 targeted browser tests passed across two runs: navbar colors/counts/rapid hover/keyboard/reduced motion/logo bounce, both-language navigation order, mobile and no-JavaScript links, header geometry/no overflow at1024/1200/1280/1440, connector non-intersection/letter endpoints at768/1024/1440 and compact height, route navigation, Services, menu early close/Hire handoff and repeated theme/locale switches. Initial order test failed before implementation; final test selector excludes locale links that legitimately point at the same About route. Screenshots artifacts/ordered-{portals-desktop,navbar-desktop,menu-mobile}.png; desktop portals and mobile menu inspected. Preview http://localhost:3006/id, session89706.

Full suite, Lighthouse, physical devices and screen reader not rerun for this ordering change. No deployment.

---
# Technologies, contact cards, scroll text and opaque navbar - 2026-10-13

Approved additions implemented: Bootstrap/jQuery in Web; Laravel/Go/Node.js/MySQL in Backend & Data, retaining existing stacks (15 total). Local sanitized Simple Icons assets with visible labels; X/Instagram/Threads icons, WhatsApp/GitHub contact icons and original mail SVG. Email copy remains a separate button inside the same card. Contact values and bilingual copy preserved; Radix focus/escape/menu handoff unchanged. Build validates technology and social assets.

Editorial headings/paragraphs use GSAP SplitText lines/masks, autoSplit and returned ScrollTrigger tweens. Each entrance runs once; resizing/font completion reflows lines and synchronizes animation progress. Reduced motion restores original text; server-rendered text needs no JavaScript. Interactive controls, card links, demo canvases and SVG wordmark keep their existing animators. Sticky header has a theme-matched solid background, border/shadow after8px scroll and cleaned-up passive listener.

Verification: npm run check passed (6 unit tests, typecheck, lint, content validation, production build). Full production Playwright suite43/43 passed in2.9m. Covers ID/EN, themes,375/768/1024/1440,15 logo loads, socials/contact/focus/copy, text scroll/resize/reduced motion, opaque sticky navbar, no-JavaScript routes, existing hero/tools/menu/demos/case studies. Additional client language round trips confirmed no page errors or nested split wrappers. Screenshots inspected: artifacts/updated-about-dark.png and artifacts/updated-hire-light-mobile.png; desktop/mobile contact screenshots available in both themes. Production preview http://localhost:3006, session58563.

Physical-device, screen-reader and Lighthouse checks not rerun. No deployment.

---
# Technology logos and Abex portrait - 2026-10-13

About now uses user-supplied C:/Users/USER/Downloads/abe.png (768x1119) instead of Nightwing. Public PNG recompressed losslessly; raw decoded pixel comparison confirmed equality with source. Original retained, background/composition unchanged. Next Image intrinsic dimensions and responsive sizes match the full photo frame.

Added9 local Simple Icons SVG logos with24px images, original brand fills and visible labels underneath; Web/Mobile/Data & API groups retained. Ivory36px backing keeps logos legible in dark/light themes. SVG image alt empty/aria-hidden because labels identify technologies. Downloaded paths reconstructed without scripts/external refs, source/license provenance in ASSETS.md and public/icons/technology/LICENSE.md. Build validates all logo mappings/assets and portrait dimensions. No new dependencies or runtime CDN calls.

Existing profile layout test extended; first run failed because logos were absent. Final npm run check passed (6 unit tests, typecheck, lint, content validation, production build). After responsive image sizes adjustment, build reran successfully. Targeted production4 tests passed in19s: both-theme page contrast, GitHub routes/screenshots, responsive profile/contacts and9 logo loads at24px, portrait src/alt, both languages,375/768/1024/1440. Dark desktop and light mobile screenshots inspected: artifacts/portrait-icons-{dark,light}-{desktop,mobile}.png. Preview running http://localhost:3006/id/about, session94464.

Full41-test suite, Lighthouse, screen reader and physical-device checks not rerun for this asset/layout update. No deployment.

---
# Professional workflow timeline and tidier About - 2026-10-13

Approved refinements implemented. Services working approach now has5 translated title/description steps: requirements analysis, planning/design, development, testing/revisions, deployment/documentation. Semantic ordered list, decorative numbered48px nodes and connecting lines; horizontal >=1024px and vertical below1024. Static/server-rendered with no new client dependencies or automatic motion.

About keeps approved Fullstack Developer bio, split into2 paragraphs with18-22px weight400 text. Reduced wordmark/header spacing. Proportional framed Nightwing illustration with original alt/asset, desktop2-column profile layout and mobile profile-first stack with compact illustration. Web/Mobile/Data & API skill groups; Email/WhatsApp/GitHub primary cards and X/Instagram/Threads social row. All labels ID/EN, HTTPS new-tab links retain noopener noreferrer. Profile location/focus and existing Hire dialog remain available. Case studies/hero/theme/motion unchanged.

New layout test observed fail before implementation, then passed. npm run check passed:6 unit tests, typecheck, lint, content validation, production build. Final full Playwright suite41/41 passed in2.7m. New test covers5 steps, horizontal/vertical arrangement, two paragraphs,3 skill groups,3 primary contacts and3 socials, both languages/themes and375/768/1024/1440 widths without overflow. Existing menu early-close regression, reversal/focus/scroll lock, repeated locale/theme switching, portal connectors, toolbar settings, all15 demos, project routes/screenshots, redirect308/invalid404 and no-JavaScript checks passed.

Screenshots generated artifacts/refined-{services,about}-{dark,light}-{desktop,mobile}.png. Dark desktop services/About and light mobile About inspected. Preview running http://localhost:3006/id, session94581. Physical-device, screen-reader and Lighthouse checks not rerun; no publication.

---
# Services page and menu early-close fix - 2026-10-13

Approved migration applied: /id/services and /en/services replace Writing in desktop/mobile navigation and hero portals. Services & Process contains existing3 services and3 working steps; removed both sections from About. New bilingual intro/title and metadata/canonical/hreflang. Old /writing permanently redirects308 for supported locales; invalid locales404. CSS cards/steps match forest/jade themes, single column below1024; server content works without JavaScript. Portal position/peach colour/connections retained, nav count3 derives from data. Desktop dark and mobile light screenshots inspected; mobile menu route self-check ID/EN passed.

Initial full39-test run:38 passed,1 failed due mobile menu remaining in closing state during repeated locale changes. Reproduced deterministically by freezing animation time, opening menu, and closing before first GSAP frame. reverse() at progress0 cannot fire onReverseComplete. Added common finishClosing callback and explicit early-close path when timeline absent/at0; contact handoff retained. Regression test failed before fix and passed after.

Final npm run check passed (6 unit tests, typecheck, lint, content validation and production build). After fix, targeted14-test run:13 passed; one services GET had transient ECONNRESET. Entire services file reran:3/3 passed, including redirect/no-JS/viewport checks and menu regression. Existing menu reversal/focus/lock, Hire handoff and repeated locale/theme tests passed in the targeted run. Production http://localhost:3006/id, session28917. No deployment, physical devices/Lighthouse/screen-reader not rerun.

New user requests during verification: professional5-stage workflow timeline and tidier About layout. These design refinements await confirmation of the proposed layout; current page uses original3 working steps. Screenshots about-current-{desktop,mobile}.png show oversized heavy bio and uneven image/contact spacing to address next.

---
# Fullstack web/mobile positioning - 2026-10-13

Applied approved copy: Fullstack Developer - Web & Mobile. About bio introduces Abex with intuitive interfaces, structured data, API integrations, React/Next.js/Flutter, usability and maintainable code. Hero uses the approved short sentence about connecting interfaces, data and user needs. Both locales, role label, metadata titles/descriptions, focus statement and third service now emphasize fullstack web/mobile and backend/data. Bio highlights changed to role/React/Next.js/Flutter/API. No Agentic/OpenAI/LLM/MCP references remain in these application profile texts. Existing GitHub projects, socials, design, motion and contacts preserved.

npm run check passed:6 unit tests, typecheck, lint, content validation, production build. Targeted production Playwright6/6 passed in21.8s: GitHub content/screenshots/responsive layouts, doodle clearance/parallax, language/theme persistence and manual hero palette. ID/EN browser self-check confirms role/stack, metadata and new copy; screenshots artifacts/fullstack-about-{id,en}.png and fullstack-home-{id,en}-mobile.png. Mobile ID screenshot inspected. Current preview http://localhost:3006/id, production session55981.

Full37-test regression, Lighthouse, screen reader and physical devices not rerun for this copy-only change. No deployment.

---
# GitHub content applied - 2026-10-13

Approved docs/github-content-proposal.md implemented. Replaced3 placeholder projects with Jelajanime and Ralunio Community (aplikasi-kasir). Bilingual summary/role/problem/approach/results, verified stack, project status/year, repository links and Jelajanime README demo URL. Nav count uses projects.length. Case metadata uses translated project summary. Personal/Community statuses replace Placeholder; no invented metrics, client work or open-source claims. Home bio updated, About includes location, learning focus, relevant skills/services and GitHub/X/Instagram/Threads. Hire contact remains WhatsApp/email/GitHub; case contact also includes GitHub. Local motion demos labelled as website explorations, writing remains empty; no GitHub runtime calls/stats widgets.

Screenshot download network blocked and GitHub text connector cannot decode images. Found original local project PNGs; Git blob hashes match GitHub exactly: Jelajanime5b9a7777e2985cc48bb2fe232bb43cb2dfdf9915, kasir93b5eb6ee2c96e01466c90ec4a83bf77671f4e6e. WebP optimization retains original dimensions1600x839 and750x1624, files166150 and35110 bytes. Original sources untouched. Local raster validation extended with a failing then passing security/path test. Single screenshot galleries hide redundant previous/next buttons; max-height75svh, contain, intrinsic dimensions. Legacy SVGs retained unused.

Initial browser run found title overflow on small screens: old fixed60px mobile type could not fit longer real project names. DOM bounds confirmed h1/title container overflow at320px; fixed responsive32-60px sizing, bounded flex child and word wrapping. Screenshots reviewed: home375, work1440, case375, portrait gallery1440, About1440. Final npm run check passed (6 unit tests, typecheck, lint, content validation, production build). Final complete Playwright suite37 passed in2.2m, including both locales, new projects, real images, metadata, old slug404s, profile/socials, viewports375/768/1024/1440, existing320px checks, theme persistence, controls/motion/menu/contact and no-JS navigation. Extra no-JS self-check confirmed GitHub code link on the case study.

Live demo availability could not be tested: browser/API network requests denied and web fetch inaccessible. URL is independently present in the project's README; no live availability claim. Physical devices, screen readers and Lighthouse not rerun. Domain remains unset/noindex; no deployment. Preview running http://localhost:3006/id (session99191).

---
# Hire me navbar and matched doodles - 2026-10-13

Home desktop header now shows logo, theme, locale and Hire me/Mari bekerja sama; stage portals handle page navigation. Other pages keep desktop links. Mobile Hire CTA is inside the menu. Radix contact dialog contains primary WhatsApp, email with clipboard feedback and GitHub https://github.com/abexziero (also used by footer). Menu closes before opening contacts; focus trap, Escape, scroll lock and focus restoration verified. Mobile email bar retained. No-JS desktop Hire fallback links to email.

Developer doodle was edited with imagegen to match the hand-drawn right doodle, optimized to127546-byte WebP with real alpha. Both use ivory CSS masks, opacity20% dark /14% light; only right visible on mobile. Parallax remains bounded. Final screenshots: artifacts/hire-{dark,light}-{home,dialog,mobile,mobile-dialog}.png; desktop dark and mobile light dialog inspected. Encoding issue discovered visually in new icon glyphs and corrected with HTML entities/SVG; final screenshot confirms clean arrows, close and copy icons.

npm run check passed twice (5 content/unit tests, typecheck, lint, content validation, production build). Full Playwright regression:35 passed in2.1m. After final cosmetic icon/CSS corrections, check rebuilt successfully and3 contact/navigation/focus tests reran:3 passed. Browser self-check verified native mailto Hire link without JavaScript and mobile email fallback. No new dependencies. Production preview running http://localhost:3006/id.

Physical-device, screen-reader and Lighthouse testing not rerun; no publication performed.

---
# Theme button survives language switches; stronger light palette - 2026-10-13

Bug reproduced with artifacts/inspect-theme-language.mjs on desktop1440 and mobile375: ID->EN rewrites the HTML font class, removing theme-ready. Theme selection remained light but the theme toggle computed display:none. Fixed readiness ownership: ThemeToggle uses its own React data-ready attribute, with undefined server snapshot; hidden without JS, visible once the theme store is ready. Removed unused HTML class marker. Existing storage/blocked-storage/cross-tab/default behaviour retained. Shared useTheme hook also updates the hero palette from the existing store.

Dark colours unchanged. Jade light background retained. Large hero/logo colours now ivory#FFFAEA, gold#FFDA57, coral#FFB591, cyan#8DE5F3; large artwork contrast >=3. Small UI accents use ivory#FFFAEA/gold#FFDA57/peach#FFD4B0/cyan#9AEAF6/lilac#ECD4FF, all >=4.5 on jade. Text/muted/border brightened. Hero manual palettes follow theme while retaining palette index and all settings; server/no-JS SVG defaults use CSS tokens. Logo/About title, cards, controls and demo Canvas/static SVG share tokens; Canvas reads computed colours, existing theme redraw observer retained.

npm run check passed:5 unit/content tests, typecheck, lint, validation and production build. Full production Playwright suite:33 passed in2.1m. New tests cover16 repeated locale switches across home/case study/desktop/mobile, toggle visibility/action and saved selection; stronger light default colours, dark restoration and manual palette retention on theme changes. Existing both-theme11-route contrast checks, navigation/no-JS, cross-tab/storage, all hero tools/motion, navbar/wordmark, connectors/menu/carousel and15 demo checks passed.

Final screenshots refreshed via cutting-mat-preview.mjs. Light and dark1440x1000 hero plus light About inspected. Preview http://localhost:3006/id. No further application changes after checks. Lighthouse, physical-device and screen-reader checks not rerun.

---
# Native cursor reduced to18px - 2026-10-13

SVG native dimensions changed24x24->18x18px, CSS hotspot4,4->3,3. Butter/forest colours and original silhouette retained. Preparation script, browser self-check, native preview and current docs/PRD updated.

Production build/content validation/TypeScript passed. artifacts/check-cursor.mjs passed against the rebuilt preview:18px SVG,3,3 hotspot, desktop native cursor CSS, click/navigation, resize handle cursor, touch defaults, no-JS and no plane overlays. Native18px jade specimen visually inspected in artifacts/cursor-butter-preview.png. Preview http://localhost:3006/id. Unrelated full suite/Lighthouse and physical cursor rendering/Safari/Firefox not rerun.

---
# Native butter cursor; flying planes removed - 2026-10-13

Native CSS cursor replaces the browser pointer shape directly. public/images/cursor-butter.svg embeds the original F:/cursor.png alpha silhouette, coloured with SVG filters: butter#F0CE72/forest outline#0D2118, explicit24x24px, cropped viewBox and4,4 hotspot. No overlay follower or cursor animation. Original file unchanged; preparation/provenance in artifacts/prepare-cursor.mjs and docs/cursor.md.

Removed PaperPlanePointer import/component, plane-flight helper, unit/browser tests, CSS overlay rules and obsolete preview script. npm test restored to5 content tests. Fine/hover media applies native custom cursor; touch retains default. Resize classes retain native direction cursors, text inputs text cursor, and demos crosshair. Existing background parallax retained. Asset checked at build.

Final production build/TypeScript/content validation passed, targeted lint passed,5 content unit tests passed. Nine production browser tests passed in19.4s: theme/default/storage/no-JS, routes/404, contacts, carousel, menu reversal/focus, existing doodle parallax and responsive clearance. Browser self-check artifacts/check-cursor.mjs passed custom cursor CSS/asset colour/dimensions, no plane elements, link navigation, Type resize handle, touch suppression and no-JS. Cursor SVG rendered and inspected at native24px on jade and enlarged96px on forest in artifacts/cursor-butter-preview.png. Headless screenshots cannot capture the OS cursor; physical pointer rendering/Safari/Firefox and Lighthouse not checked. Preview http://localhost:3006/id. Previous plane reports below are historical.

---
# Five-plane trail and safe roaming - 2026-10-13

Five owned SVG planes sized24/21/18/15/12px, decreasing opacity70/63/56/49/42%. Followers sample the leader's actual bounded140px path history at30/57/81/102px, preserving the same route through turns. Mouse movement follows as before. After180ms stationary the leader travels110px/s through free space, replacing the small pointer orbit.

plane-flight.ts builds a40px orthogonal grid and routes only through connected nodes/segments clear of padded rectangles (28px buffer includes rotation). Destinations are at least65% of the reachable region's maximum distance from the start, avoiding repeated short hops. Obstacles include header, actual transformed SVG/wordmark, bio, portals, toolbar, visible notes and active control panel/handles. Measured every120ms and on resize. Unsafe entry is relocated to a safe start; unsafe/incomplete followers stay hidden until sufficient safe history forms. Plane viewport margins remain18px; hidden-tab/leave/blur/media/unmount ticker/listener cleanup, touch/reduced-motion/no-JS suppression and click-through remain.

npm run check passed (7 unit tests, typecheck, lint, validation, production build) before the final destination-distance adjustment. After that adjustment, all7 unit tests, production build/typecheck/validation and changed-file lint passed again. Full34-test production run:33 passed and one follow-mode test used polling slower than the180ms idle threshold. After simulating continuous pointer movement at16ms intervals and extending random destinations, five final relevant production tests passed in34.0s: following/idle roaming/click-through/bounds/lifecycle, touch/no-JS, and existing doodle parallax/clearance. Roaming test samples every frame for9s at1440x1000 and1024x600 while hero changes, requires five visible planes, >180px exploration and zero hero/viewport collisions. Two unit checks cover60 randomized safe routes, long-distance targets and fully obstructed space. No further application changes after those final checks.

Final dark/light screenshots refreshed using artifacts/paper-plane-preview.mjs; dark trail detail and light full hero inspected. PRD updated. Preview http://localhost:3006/id. Physical devices, Lighthouse and screen-reader checks were not rerun.

---
# Paper-plane pointer with idle flight - 2026-10-12

PaperPlanePointer adds an owned inline SVG ivory line-art plane,24px/70% opacity. GSAP ticker/quickSetter drive position and heading without React frame updates. Mouse movement follows with exponential smoothing and a small offset. After180ms stationary, flight continues around the cursor in a26x18px ellipse (~6.6s orbit); rotation follows velocity with shortest-angle smoothing. Targets stay18px inside viewport; idle orbit centres are adjusted near edges so the rotated24px sprite remains visible.

Enabled only >=1024px/fine mouse/hover/no reduced motion. Touch/non-mouse input hides it. Pointer leave, blur and visibility change hide/remove ticker; media change/unmount remove listeners and revert GSAP styles. Declarative CSS also hides mobile/touch/reduced-motion/no-JS. Mounted once in locale layout, aria-hidden/nonfocusable/pointer-events none, native cursor retained. Existing doodle parallax unchanged.

Production build/content validation/TypeScript passed; targeted ESLint passed. Six production browser tests passed in13.8s: follows cursor, moves/rotates while stationary, stays within viewport corners, click-through navigation, single instance, leave/blur/visibility reset, mobile/reduced-motion/touch/no-JS hidden; existing doodle motion/clearance and menu/theme/no-JS checks. Screenshots artifacts/paper-plane-{dark,light}.png and -detail.png generated; dark detail and light full hero visually inspected. Preview http://localhost:3006/id. No full unrelated suite, Lighthouse, physical-device or screen-reader rerun.

---
# Doodle balance and restrained parallax - 2026-10-12

Left doodle max width increased320->380px (mobile150->170px); a0.35px ivory drop-shadow slightly strengthens its stroke appearance. Right decorative frame height reduced to340px on wide desktop,170px tablet,90px short desktop and200px mobile, retaining contain/no clipping. Bio clearance tests use actual image aspect ratio and verify at least20px separation, ID/EN,375x812/768x900/1024x900/1440x1000/1024x600.

DoodleMotion is a null-rendering client effect mounted once in locale layout. GSAP quickTo eases body CSS offsets over0.8s, max+/-5px horizontal and+/-4px vertical; left moves oppositely at65% amplitude. Enabled only >=1024px/fine mouse/hover/no reduced motion. Pointer leave, blur and visibility reset; matchMedia/unmount reverts offsets/tweens and removes listeners. Existing static CSS decorations remain without JavaScript. No asset regeneration.

Final production build/content validation/TypeScript and targeted lint passed. Six relevant production browser tests passed in17.8s: bounded parallax/reset/reduced-motion/mobile, bilingual bio clearance, both-theme page contrast, blocked storage/no-JS, menu reversal/focus, centered responsive hero. Screenshots refreshed at375/768/1024/1440 in both themes; light1440, dark1024 and light375 inspected. Preview http://localhost:3006/id. No full unrelated suite, Lighthouse, screen-reader or physical-device rerun.

---
# Developer doodle bottom-left - 2026-10-12

Generated with built-in imagegen: ivory outlined laptop/code symbol, coffee, tiny robot, cable and stars. Transparent source alpha self-check passed (79.39% fully transparent, foreground present). Optimized WebP saved to public/images/developer-doodle.webp, 860px wide, 123246 bytes. Exact prompt/provenance recorded in docs/developer-background.md. Existing right doodle retained.

CSS body::after adds a fixed bottom-left decorative layer, max320px wide/max260px tall/17% opacity. Mobile max150px wide/max160px tall/15%, bottom96px above contact bar. Negative stacking index within the existing body isolation, pointer-events none; no additional React component or animation. Asset existence validated at build.

Production build, content validation and TypeScript passed; lint for changed validation script passed. Four relevant production tests passed in15.8s: both-theme routes/token contrast, blocked storage/no-JS, menu reversal/focus, centered responsive hero at375/768/1024/1440. Final screenshots refreshed; 1440x1000 dark/light and375x812 light visually inspected. Doodle remains below the hero controls and above mobile contact area, with clear background alpha. Preview http://localhost:3006/id. No Lighthouse, full unrelated suite or physical-device rerun.

---
# Transparent pt doodle background - 2026-10-12

User-supplied Downloads/pt.jpg edited with built-in imagegen; original unchanged. First output rejected for surrounding artefacts. Second transparent output optimized to public/images/pt-doodle.webp (860px wide, 237554 bytes). Prompt/provenance in docs/pt-background.md. Source alpha self-check passed: 69.85% fully transparent, visible foreground present. Transparent line art inspected on the actual forest/jade background; no black rectangle visible.

Body decoration is fixed bottom-right, up to 430px wide/460px tall with 24% opacity. Mobile up to 190px wide/210px tall, 20% opacity, bottom96px above contact bar. Body isolation places it behind content; pointer-events none and CSS-only decoration preserve interaction/accessibility/no-JS. Build now asserts asset presence.

Production build/content validation/TypeScript passed, lint for changed validation script passed. Five production browser tests passed in 18.5s: both-theme routes/contrast, blocked storage/no-JS, menu reversal/focus, centered viewport layout at375/768/1024/1440 and navigation/language. Final optimized-asset screenshots refreshed; desktop dark/light and mobile light inspected. Preview http://localhost:3006/id. Full unrelated suite, Lighthouse and physical-device checks not rerun.

---
# Distinct portal colours - 2026-10-12

Portal idle text and borders now use Work ivory, Experiments butter, Writing peach, Snippets ice and About lilac (#D3BCE8 dark / #E7DAF6 light). Existing GSAP circular fill/text roll remains; hover/focus uses the assigned fill with forest text. Mobile filled Work/About retain ivory/lilac rather than overriding their colours.

Production build/content validation/TypeScript passed; lint for the updated contrast test passed. Two production tests passed in 38.0s: both-theme contrast across 11 routes now includes portal small text >=4.5 and five distinct idle colours with matching borders; connector geometry/layout still passes ID/EN at tablet/desktop/short viewports. Browser self-check artifacts/portal-colours-check.mjs passed all five hover/focus/exit/reset states and mobile Work/About colours in both themes. Screenshots refreshed via cutting-mat-preview.mjs; dark desktop hero visually inspected. PRD updated. Preview http://localhost:3006/id.

Full unrelated suite, Lighthouse and physical-device checks were not rerun for this CSS-only change.

---
# Forest default and cutting-mat light theme - 2026-10-12

Production preview: http://localhost:3006/id. Default is forest #0D2118 regardless of OS colour scheme. Light mode is jade cutting mat #2D6B4F. Manual preferences remain saved and synchronised across tabs; blocked storage permits in-session switching, and no-JavaScript defaults to forest. Grid, layout and GSAP behaviour are retained.

Hero/manual palettes, navbar bounce/hover colours, toolbar, Work/Experiments cards, About typography, Snippets canvas/static previews and favicon now use ivory, butter, peach and ice colours. Light-theme small-text accents and muted text are brighter for contrast. Screenshots exposed missing Work card backgrounds; these were restored and a regression assertion now requires opaque pastel cards with forest text.

npm run check passed: 5 content tests, typecheck, lint, validation and production build. Full production Playwright run passed 29 tests in 1.9m before the final Work card CSS restoration. After that restoration, production build/typecheck/content validation and lint for the updated test passed again; six relevant production tests passed, covering both themes across 11 routes, text contrast >=4.5, large hero fills >=3, opaque Work cards, mobile/no-JS and all 15 demo behaviours. Theme tests also cover stored preferences, blocked storage, invalid preferences and cross-tab reset. One initial test failure was floating-point menu geometry (43.99997 versus 44px); the assertion allows 0.01px tolerance and separately requires computed CSS height 44px.

Final screenshots refreshed: artifacts/cutting-mat-{dark,light}-{hero,mobile,work,about}.png. Desktop hero, light mobile, light Work and dark About visually inspected. PRD updated. No deployment, Lighthouse rerun, physical iOS/Android or screen-reader review in this revision. Earlier reports below are historical.

---
# Toolbar instruction placement - 2026-10-12

Preview: http://localhost:3006/id. Instructions now use a normal-flow figcaption inside the control panel, directly below its displayed value. Removed the floating absolute annotation and arrow; text uses 12px Parkinsans and theme-aware muted foreground. Instructions remain available on tablet/short desktop screens. Short-screen active controls reserve less top padding and permit the panel's full content height, including Opacity. Indonesian colour instruction now matches the Warna button name. Closing controls still hides the instruction and preserves the hero settings.

npm run check passed (5 content unit tests, typecheck, lint, content validation, production build); after the small copy correction, content validation/production build passed again. Three relevant production browser tests passed in 13.9s (instruction layout plus normal/reduced-motion settings retention). The final instruction test passed again in 7.5s against the rebuilt preview: all five tools, ID/EN, dark/light, 1440x900, 1024x600, 768x900, note inside/below value, no arrow, visible panel/slider, correct tool-specific text and close behaviour. Screenshots artifacts/toolbar-hint-panel.png and artifacts/toolbar-hint-panel-short.png inspected; colour screenshot refreshed after the copy correction. Full unrelated browser suite, Lighthouse and physical-device checks were not rerun.

---

# Hero toolbar keeps its last settings - 2026-10-12

Production preview: http://localhost:3006/id. Controls and presentation are separate: closing a tool or pressing Escape leaves palette, scale, spacing, radius and opacity unchanged. Reset clears every setting and resumes the original automatic demonstration. The first manual edit disables the automatic demo until Reset; pointer leave and tab visibility cannot restart it. No hero settings are written to browser storage; reload/unmount restores defaults. Cutting-mat theme remains deferred.

Manual Spacing retains the four Abex letter shapes, fitting their spacing within the fixed SVG frame. Manual Radius rounds the owned letter contours with quadratic curves (no persistent alpha-threshold filter), with a geometry-dependent limit to retain readability. Opacity uses an accessible range slider from 0.25 to 1. Values remain applied across tool switches, close, media changes and responsive clamping. Focus returns to the tool when closed. Intro no longer clears the entire transform after its completion, which previously overwrote early spacing edits.

Final npm run check passed: 5 content unit tests, typecheck, lint without warnings, content validation and production build. Full production browser suite: 26 passed in 1.4m before the final one-line intro-cleanup adjustment. After that adjustment, four focused production tests passed in 10.4s: intro filter cleanup/media transitions, last settings under normal/reduced motion, and editing during the intro. Tests hold manual values for 25 simulated seconds after closing/hover/tab visibility, then verify reopening and Reset. Existing route/theme/mobile/menu/carousel/no-JavaScript, connector geometry, default token-loop and 15 demo checks passed in the full run. No further code changes followed those final checks.

Screenshots inspected: artifacts/hero-toolbar-saved.png and artifacts/hero-opacity-short.png (1440x900 saved appearance, 1024x600 opacity control). Physical devices, screen reader and Lighthouse were not rerun. Persistence after refresh was intentionally left out pending the user's decision.

---

# Navbar typography and letter endpoints ? 2026-10-12

Preview: http://localhost:3006/id. Desktop navigation is 15px/500 (logo unchanged, 44px targets retained). Hero anchors now target the top contours of a (Writing), b (Experiments), e (Work), right arm of x (Snippets), left arm of x (About). Portal horizontal positions moved closer to assigned letters to shorten routes and avoid intersections. Two-row placement, hover notes and native mobile navigation remain.

Fresh npm run check passed: 5 content unit tests, typecheck, lint, production build. Geometry test passed in Webpack development mode (37.4s) for ID/EN at 768x900, 1024x900, 1440x900, 1024x600: endpoint contour checks on settled letters, connector intersection samples, button clearance, row alignment and note bounds. Screenshot artifacts/hero-letter-connectors.png inspected. Three production navbar tests passed in 14.4s, verifying 15px/500 typography, both-theme colours, active/focus/reduced-motion behaviour and wordmark bounce/reset. Geometry during automatic morph/scale, physical devices, unrelated full suite and Lighthouse were not audited in this revision.

---

# Hero portal layout tidy ? 2026-10-12

Preview: http://localhost:3006/id. Screenshot reference: user Downloads/99.png. Hero navigation now uses two aligned rows: Writing/Experiments/Snippets above, Work/About below. Portal heights are 44px; row gaps 48px normally and 24px on short desktop viewports. Connector paths exit each button's bottom centre and turn in separate lanes below the button rows, avoiding other buttons. Hover notes are horizontally bounded to the canvas; short-screen notes appear below buttons, and the stage reserves extra top space. Native mobile Work/About layout remains available.

Fresh npm run check passed (5 content unit tests, typecheck, lint, production build). Nine targeted production browser tests passed in 39.8s. New geometry test covers ID/EN at 768x900, 1024x900, 1440x900 and 1024x600: equal row alignment, 44px targets, note bounds/no button overlap, and connector samples avoiding other buttons. Existing hero viewport/mobile, routes, five tools, intro-filter cleanup, morph/keyboard/reduced-motion, contact and stable colour-loop tests passed. Screenshots artifacts/hero-portals-tidy.png and artifacts/hero-portals-tidy-short.png inspected. Physical devices, unrelated full suite and Lighthouse were not rerun.

---

# Navbar wordmark motion ? 2026-10-12

Preview: http://localhost:3006/id. Navbar abex now has four visual letter spans with one accessible link label. Hover/focus plays a GSAP bounce per letter (0.55s, stagger 0.06s) alongside lavender/pink/orange/blue colours. Letters settle at y0; colour remains until both hover and focus end. Exit cancels the entire staggered bounce/colour tween before resetting, preventing delayed children from overriding reset. Light theme uses darker accent equivalents, reduced motion changes colour without bouncing. CSS provides readable letters and colour states without JavaScript. GSAP media context/listeners clean up on navigation/unmount. Hero and footer wordmarks were not changed.

Fresh npm run check passed: 5 unit/content tests, typecheck, lint, production build. Final three navbar tests passed in 14.8s, including stagger order, all-letter settling, distinct colours, hover/focus exit, rapid interruption, reduced motion and existing navbar themes/routes. Seven portfolio browser tests passed before the last tween-cancellation adjustment. Full unrelated suite, Lighthouse and physical-device review were not repeated.

---

# Hero multicolour default ? 2026-10-12

Preview: http://localhost:3006/id. Automatic token loop keeps the original lavender/pink/orange/blue fills. Palette changes occur only by clicking Colour (or keyboard shortcut 1); hovering no longer cycles palettes. Repeated clicks cycle palettes, Deselect/Escape restores original fills. ID/EN instructions updated. Other token animations and pointer goo remain available.

Fresh npm run check passed (5 unit/content tests, typecheck, lint, production build). Eight targeted browser tests passed in 26.1s: stable fills across automatic phases/repeat, manual colour clicks, hover stability, Escape reset and shortcut under reduced motion, plus existing hero tools/routes/contact checks. A separate normal-motion browser assertion confirmed click, hover stability and reset. Unrelated full suite, Lighthouse and physical devices were not rerun.

---

# Desktop navbar animation ? 2026-10-12

Preview: http://localhost:3006/id. Desktop links now use per-item reference colours (lavender/yellow/green/blue), with darker light-theme equivalents. GSAP animates colour mixing over 300ms using (.45,0,.55,1), and count opacity/y4-to-0 using (0,0,.2,1). Hover exit hides non-active counts; keyboard focus receives the same states; active-page colour/count persist. Overwrite prevents tween queues, matchMedia handles reduced motion, and context/listeners clean up on route changes/unmount. Mobile menu remains unchanged. CSS provides hover/focus/current states without JavaScript.

Fresh npm run check passed: 5 unit tests, typecheck, lint without warnings, production build. Full 21-test run had 20 passes and one test-selector ambiguity (header/footer both use .wordmark). After scoping that test selector to the header, both navbar tests passed in 16.2 seconds; the other 19 tests had passed in the full run. Navbar tests verify all four colours in both themes, count positions, rapid hover/focus, active routes and reduced-motion changes. Lighthouse and physical-device checks were not rerun.

---

# Hero edge smoothing fix ? 2026-10-12

Preview: http://localhost:3006/id. Intro filter now applies only during its 1.2-second animation and is cleared afterward. Base SVG has no permanent alpha-threshold filter, including without JavaScript and under reduced motion. Hover goo remains separate. GSAP context restores filter styles when media conditions change/unmount.

Fresh npm run check passed (5 unit/content tests, typecheck, lint without warnings, production build). All 7 targeted rebuild browser tests passed in 19.5 seconds, including the new filter cleanup/media-switch test, five tools, morph/resize, automatic token cycle, routes and contact bar. Browser computed filter after intro: none. Screenshot artifacts/hero-filter-fixed.png inspected. Full unrelated browser suite and Lighthouse were not rerun for this fix; older scores below are historical. Physical-device review remains outstanding.

---

# Verification ? full frontend rebuild, 2026-10-12

Production preview: http://localhost:3005/id. No deployment performed. Earlier reports below describe superseded builds.

- Fresh npm run check passed: 5 content unit tests, TypeScript, ESLint, bilingual content validation and production build with 23 prerendered pages.
- Fresh Playwright run: 18 Chromium tests passed in 44.1 seconds; no failures. Covers ID/EN, theme persistence/blocked storage, locale/slug 404, language-preserving routes, project contacts/carousel, no-JavaScript navigation, mobile menu interruption/focus restoration, centered one-viewport homepage at 375/768/1024/1440px, all five hero tools, keyboard morph/resize and reduced motion, contact copy/Escape, automatic five-token cycle, lazy source download, all 15 demo outputs and pause/reset, touch/static fallbacks.
- Direct inspection of Hipuku through local Chrome: homepage, mobile navigation, Work, Experiments, Snippets, About, toolbar states; screenshots, computed colors/grid/font and public animation scripts inspected. Pixel-identical rendering has not been established. Own Abex wordmark/identity/icons remain; Hipuku project applications and credentials are not presented as Abex's work.
- Old long homepage, pinned project gallery, ScrollSmoother and eight unused components/helpers removed. Homepage is a single viewport with SVG wordmark, connections, five design tools, automatic token cycle, local pointer goo and mobile contact bar. Work/About/Experiments/Snippets/Writing are separate pages. Writing remains empty; three projects are clearly marked demo placeholders.
- Parkinsans is local with its SIL OFL license. Dark palette and 44px grid measured from the reference; light theme and responsive layout verified. Navbar vitals use local browser Performance API without analytics requests.
- Latest desktop/mobile homepage screenshots inspected: artifacts/rebuild-final-home-desktop.png and artifacts/rebuild-final-home-mobile.png. Work and Snippets fan-card screenshots also inspected. Snippets contains 15 interactive demos plus three decorative fan previews.

Latest Lighthouse mobile production audits:

| Route | Performance | Accessibility | CLS | TBT |
| --- | --- | --- | --- | --- |
| /id | 89 | 100 | 0 | 158 ms |
| /id/snippets | 95 | 100 | 0.001915 | 173 ms |

Reports: artifacts/lighthouse-rebuild-home.json and artifacts/lighthouse-rebuild-snippets.json. Accessibility and CLS targets passed on both audited routes. Homepage Performance >=90 is not yet accepted (89 in this run); Snippets passed. Other routes were not Lighthouse-audited. Scores are local synthetic measurements, not real-device results.

Remaining: physical iOS/Android, screen reader review, exact reference pixel comparison, homepage performance target, illustration rights, real project materials and final domain. Shape Pit uses circular collision envelopes rather than exact polygon rigid-body physics. Placeholder materials/missing domain keep pages noindexed and final publication gated.

---

# Verification — 2026-10-12

## Historical Hipuku-inspired adaptation (superseded)

Production preview: http://localhost:3005/id. No deployment performed. The sections below this current report describe earlier builds and do not establish acceptance for this revision.

- `npm run check`: five content unit tests, TypeScript, ESLint, content validation and Webpack production build passed.
- Playwright: all 27 Chromium tests passed; `test-results/.last-run.json` records `passed` and no failed tests. Includes both languages, three new page types, all 15 demo outputs and pause controls, theme persistence, mobile/static and reduced-motion previews, no-JavaScript fallback, menu interruption, gallery scroll/resize/focus, navbar tracking and existing case studies.
- Source viewer: no initial `/motion-source` request; opening the viewer downloads the fixed public frontend source once. The resource is prerendered at build time; no user-selected filesystem path. Without JavaScript, a download link remains available.
- Desktop and mobile screenshots inspected. Hero artwork now resides in About; responsive typography, design controls, editorial Work, five curated motion experiments and fifteen snippets implemented.
- Demo Canvas initialization waits until near the viewport. Offscreen and hidden-tab animation stops. Native scrolling on case studies and new pages avoids moving drag/click targets during interactions. Home retains desktop ScrollSmoother and the pinned horizontal project sequence.

Latest Lighthouse mobile production reports (`artifacts/lighthouse-reference-final-home.json` and `artifacts/lighthouse-reference-final-snippets.json`):

| Route | Performance | Accessibility | CLS | TBT |
| --- | --- | --- | --- | --- |
| /id | 67 | 100 | 0.000168 | 1026 ms |
| /id/snippets | 75 | 100 | 0 | 1074 ms |

Performance varied substantially across local runs (home previously 90–94, snippets 84–89, one later snippets run 62). The reason for the variation is not established; Performance >=90 is **not accepted** for this revision. Accessibility and CLS meet their targets in the latest audits. No claims are made for unaudited routes.

Reference fidelity: palette values verified from Hipuku's public wordmark and structure/snippet descriptions from public pages. Direct browser access to the reference was denied, so pixel comparison, exact timings and its underlying implementation were not verified. These are original adaptations; Shape Pit uses circular collision envelopes rather than precise polygon rigid-body physics. Experiments are curated motion demos, not copies of Hipuku's separate applications.

Remaining: physical iOS/Android, screen reader review, reference pixel comparison, performance target, illustration rights, real project materials and final domain. Placeholder projects and missing domain keep publishing blocked and pages noindexed.

## Historical verification — 2026-10-11

Local production preview at localhost:3002, restarted after the horizontal gallery window Webpack build. Node 24.19, Next.js 16.3.5, Playwright Chromium. No deployment performed.

| Check | Result |
| --- | --- |
| Content unit tests | 5 passed; reject missing translations, duplicate/unsafe slugs, missing/traversal assets, unsafe URLs and invalid contacts |
| Content build validation | 3 projects, complete ID/EN, six local mockups and local hero artwork with bilingual alt text |
| TypeScript | Passed |
| ESLint | Passed, no warnings |
| Production build | Passed; two home pages and six case studies prerendered |
| Playwright | 20 passed in 1.2m against the horizontal gallery window production build |
| Transparent Hero replacement | Full check passed; 3 relevant browser tests passed in 13.6s after replacing the image |
| Latest robin2 Hero | Full check passed; responsive navbar/artwork test passed in 5.6s; decoded robin2 PNG, correct 432×578 dimensions, contain sizing and no overflow confirmed at 375/768/1440px |
| Clean installation | npm ci --offline --ignore-scripts passed in isolated scratch directory, 491 packages |
| HTTP headers | HSTS, DENY framing, nosniff, referrer policy and noindex configured; checked 200 and 404 responses |
| Publication gate | Expected rejection because the final domain and real project materials remain missing |

Browser coverage: ID/EN and language-preserving project routes, unknown locale/slug 404, canonical/noindex, Abex profile and configured email/WhatsApp links, 375/768/1024/1440 and landscape widths, reduced motion, menu reversal/Escape/focus trap/scroll lock/focus restoration, pause/resume, carousel controls/keyboard, no-JavaScript links, delayed images, gallery focus after resize, touch context, repeated navigation cleanup, pointer interaction, landscape menu scrolling. Visual desktop/mobile screenshots inspected.

Latest regressions additionally cover About/Contact underline after the cursor leaves at 1024/1440px, actual ScrollTo destinations including the pinned gallery start, pointer and CDP touch swipes, SplitText accessible heading, elastic footer deformation and static reduced-motion geometry. Independent browser review verified natural gallery scroll/click and rapid navigation without overflow or page errors.

Contact indicator regression: reproduced the previous failure at a 1080px viewport height before the fix. The new test covers heights 1080/1440/2160px, Services-to-Contact interruption, pointer leaving, a single active link, Home/End, and both motion preferences. End-of-page detection uses the rendered content boundary so ScrollSmoother catch-up cannot prematurely activate Contact. Restarted the preview on port 3002 and confirmed Contact at height 2160px.

Mobile/tablet transition regression: the new test failed before the fix (Work still shifted 184px at 60% viewport height). After the fix it verifies the settled entrance at widths 375/640/768/820/1024, intact Hero gutters on initial load, no page overflow and real CDP vertical touch scrolling. Desktop/touch swipe and reduced-motion tests remain passing. Inspected tablet/mobile screenshots; measured ID/EN headings at widths 320/375/640/768/820/1024/1180 with no text overflow. At 768px, initial heading left now equals the 38.4px gutter. Production preview restarted on port 3002.

Hero replacement: supplied robin1.png is 362×552, RGBA, with nonopaque pixels. Copied directly to public/images; updated intrinsic dimensions, PNG validation and contain sizing; removed the portrait frame/background. Browser checks at 375/768/1440 confirm the replacement loads, transparent wrapper, contain fit and no page overflow. Tablet screenshot inspected. Navbar/artwork, mobile scroll/gutters and text/swipe/reduced-motion browser tests passed; the full browser suite was not repeated for this asset-only update.

## Lighthouse mobile, local production

Obsidian + Ice: background #111113, foreground #F5F5F7, accent #DCE6F0, card #1C1C20. Updated surfaces, text, borders, CTA hover/focus, Contact, Hero glow and favicon. Inspected desktop/mobile screenshots and checked 375/768/1440px overflow. Measured contrast: body 17.32:1, muted/card 7.29:1, muted/contact 7.52:1, accent/contact 13.86:1, CTA idle/focus 14.93:1 and hover 12.21:1; focus ring/background 14.93:1. All 16 browser tests passed against the actual rendered ice build.

Build note: a previous Turbopack build retained electric-blue CSS although source tokens had changed. Production build now explicitly selects Webpack. Content checks, TypeScript, lint and Webpack production build passed. Verified computed root --primary is #dce6f0 and favicon uses #DCE6F0 before reporting the update complete.

| Route | Performance | Accessibility | CLS |
| --- | --- | --- | --- |
| /id | 97 | 100 | 0.0474 |
| /en | 92 | 100 | 0 |
| /en/projects/forma | 97 | 100 | 0.0024 |

JSON reports retained in ignored `artifacts/lighthouse-id.json`, `lighthouse-en.json`, `lighthouse-en-projects-forma.json`. Lab results vary with hardware/network; these runs after the Obsidian + Ice Webpack build meet PRD targets.

## Remaining manual acceptance

Gallery clipping and horizontal sequence fix: reproduced the previous 1122.5px-tall Work section pinned below the 86px navbar on a 1440×720 viewport. The initial fallback removed horizontal scroll on short desktops; the final revision preserves it by pinning only the card window while the heading scrolls normally. Preview images use viewport-dependent max-height and object-fit contain. Vertical wheel scrolling traverses all cards before releasing the gallery toward Services. Tests failed against the previous fallback and pass against this revision. Track height is measured independently of the pin window's fixed inline height. ResizeObserver, viewport resize and image load recalculate eligibility; native fallback applies only when the cards still cannot fit, or for mobile/touch/reduced motion. Global scroll measurements refresh after changes so later section navigation remains correct.

Full unit/content checks, typecheck, ESLint and production build passed. Browser regressions cover 1440×720 ID and 1024×768 EN natural wheel scrolling, horizontal movement while Services remains below the viewport, arrival at the last-card CTA followed by release to Services, subsequent Services/About/Contact navigation, repeated 1400↔720 height changes, simulated card content growth/shrink, keyboard focus and delayed images. Additional measurements confirm pin eligibility at desktop heights 480/600/900px; at 720px the full gallery window remains between y86 and y672. Existing mobile swipe, reduced-motion, theme, menu, repeated navigation, navbar underline, tall-viewport Contact and footer tests all passed (20 tests total). Inspected the 720px horizontal-scroll screenshot. Lighthouse was not rerun for this gallery-only change; figures below are from the preceding theme build.

Light/dark update: full content tests, typecheck, lint and production build passed. Added regressions for system preference changes, keyboard toggle, saved preferences across reloads/languages/case studies, cross-tab synchronization, invalid saved values, blocked storage, no-JavaScript system fallback, 320/375/768/1440px controls and layout, and themed invalid-locale 404. Restricted locale dynamic parameters to the two supported locales so unknown locales use the themed global 404. Mobile case-title badges now wrap instead of extending past the viewport (375px page previously measured 380px wide, now 375px). Inspected both themes at 375/768/1440px plus mobile menu and case-study screenshots.

Lighthouse mobile on the final production `/id`: light Performance 96, Accessibility 100, CLS 0.0474; dark Performance 97, Accessibility 100, CLS 0.0474. Theme selections persisted in the audit browser profile; reports retained in ignored `artifacts/lighthouse-theme-light.json` and `artifacts/lighthouse-theme-dark.json`. EN routes were browser-tested; their previous Lighthouse figures above predate this theme update.

- Real screen reader, iOS Safari, and Chrome Android devices, including physical swipe/scroll and animation performance.
- Real project materials, identity, contact and domain verification.
- Publication rights and attribution for the user-supplied Nightwing illustration.
- Vercel preview review, HTTPS deployment and post-deployment route/contact checks.

The native Carousel track intentionally uses platform scroll snap; GSAP controls only slide contents. No CMS, forms, analytics, database, login, or fabricated results were added.

Cleanup note: sandbox policy rejected deletion of the generated `artifacts/install-check` directory. It remains ignored, alongside local reports; application source/build is unaffected.
