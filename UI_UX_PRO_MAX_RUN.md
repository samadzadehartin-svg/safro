# UI/UX Pro Max — End-to-End Example Run

## Realistic user prompt

> Redesign the AURA Paris homepage into a premium, conversion-focused concierge experience for affluent English-speaking travelers planning a 3–7 day Paris trip. Keep the existing Next.js/WebGL hero concept, but make the site feel more editorial and luxurious, improve trust and mobile usability, and fix obvious accessibility issues. Use restrained motion, one clear inquiry CTA, and avoid generic AI gradients or fake-looking luxury clichés.

## Step 1 — Analyze requirements

- **Product type:** hybrid of Travel/Tourism Agency + Hotel/Hospitality + Luxury/Premium Brand
- **Audience:** affluent leisure travelers, roughly 30–55
- **Context:** desktop inspiration/evaluation + mobile inquiry/on-trip use
- **Style keywords:** premium, editorial, cinematic, restrained, dark, story-led, calm
- **Detected stack:** Next.js 16 / React 19 from `apps/web/package.json`
- **Platform:** responsive web

## Step 2 — Generate design system

Skill search intent:

```bash
python .../ui-ux-pro-max/scripts/search.py \
  "luxury travel tourism hotel hospitality concierge premium editorial" \
  --design-system -p "AURA Paris" --persist --output-dir <project-root>
```

Most relevant current database matches:

- **Travel/Tourism Agency:** Aurora UI + Motion-Driven; Storytelling-Driven + Hero-Centric; destination inspiration; mobile-first
- **Hotel/Hospitality:** Liquid Glass + Minimalism; Hero-Centric + Social Proof; warm neutrals + gold; luxury imagery
- **Luxury/Premium Brand:** Liquid Glass + Glassmorphism; Storytelling + Feature-Rich; black + gold + white; slow premium reveals

Synthesis chosen for this site:

- Pattern: Hero-Centric + Storytelling + Social Proof
- Style: premium dark editorial + restrained glass
- CTA: warm gold, one dominant action
- Secondary accent: travel sky blue
- Typography target: Playfair Display + Inter; local-safe implementation fallback uses Georgia + system sans
- Effects: subtle reveals; WebGL only as progressive enhancement
- Anti-patterns: cheap visuals, fast animation, generic purple/pink AI gradients, complex inquiry flow

Persisted output:

- `design-system/aura-paris/MASTER.md`
- `design-system/aura-paris/pages/home.md`

## Step 3 — Detailed domain searches

### UX / accessibility

Search intent:

```bash
python .../search.py "focus contrast form labels reduced motion touch responsive" --domain ux
```

Applied guidance:
- visible focus indicators
- 4.5:1 target for normal text
- visible form labels
- 44px+ web touch targets
- no horizontal overflow
- reduced-motion support
- accessible async form status

### Landing / conversion

Search intent:

```bash
python .../search.py "hero social proof storytelling primary CTA premium service" --domain landing
```

Applied guidance:
- hero-dominant first viewport
- one primary CTA
- visible next-content cue
- trust/proof before the form
- low-friction inquiry rather than a complex booking funnel

### Style

Search intent:

```bash
python .../search.py "liquid glass premium dark storytelling minimal" --domain style
```

Applied guidance:
- glass only where it creates depth/hierarchy
- restrained surface treatment
- premium typography and whitespace
- no decorative effects that reduce readability

## Step 4 — Next.js stack guidance

Search intent:

```bash
python .../search.py "client components images performance responsive" --stack nextjs
```

Applied guidance:
- page remains a Server Component
- client code stays in interactive leaf components (`Hero`, `NavBar`, `ContactForm`, WebGL scene)
- existing WebGL capability gating is preserved
- future photography should use `next/image`; current experience uses CSS/WebGL rather than ordinary `<img>` tags

## Step 5 — Implementation changes

### Hero
- Replaced broad “Experience Paris Like Never Before” language with outcome-oriented positioning: **“Paris, beautifully handled.”**
- Moved the primary CTA to the actual conversion target (`#contact`).
- Added subordinate secondary exploration action.
- Added concise trust/service cues above the fold.
- Made Framer Motion respect reduced-motion preference.

### Navigation
- Simplified labels.
- Added accessible navigation label.
- Increased touch target sizes.
- Made the primary nav CTA visually dominant and consistent with the hero.

### Accessibility and system styling
- Added skip link.
- Added visible global focus ring.
- Increased low-opacity body text contrast.
- Added 44px minimum button target.
- Added semantic design tokens and restrained gold/sky accents.
- Added global reduced-motion fallback.

### Contact form
- Preserved visible labels and strengthened them.
- Added `autocomplete` attributes.
- Added `aria-busy` and polite live feedback.
- Improved disabled/loading copy.
- Increased control size for mobile.

### Trust / credibility
- Removed invented partner/media-style logo names and replaced them with truthful service capabilities.
- Rewrote developer-facing API copy in the customer-facing contact section.
- Removed framework names from the public footer.

## Step 6 — Pre-delivery review

- [x] SVG icon set is consistent (Lucide)
- [x] No emoji used as UI icons
- [x] Primary clickable targets are 44px+
- [x] Hover transitions are restrained
- [x] Focus is visibly styled
- [x] Reduced motion is respected
- [x] Client Components remain scoped to interactive leaves
- [x] Form has visible labels and accessible status feedback
- [x] Mobile fallback exists when WebGL is disabled
- [x] No fake partner logos remain
- [ ] Browser-based contrast audit still recommended before production
- [ ] Full production build requires dependency installation in an environment with the package cache/network available

## What the skill added beyond “make it prettier”

The useful part is not a single visual style. It forces a sequence: classify the product and audience, ground style/color/type choices in product-specific data, supplement with targeted UX rules, route implementation advice through the actual framework, persist a design system, and then audit the result against interaction/accessibility anti-patterns.

## Verification performed in this sandbox

- TypeScript parser check reached only unresolved-module errors caused by absent dependencies; no syntax diagnostics were emitted for the edited TSX files.
- `npm ci --offline` was attempted and failed because the sandbox does not contain the required npm cache entry for `concurrently`. No package installation was attempted from the network.
