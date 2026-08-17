# AURA Paris — Master Design System

Generated as an end-to-end UI/UX Pro Max demonstration from the skill's current product, style, color, typography, landing-page, UX, and Next.js guidance.

## Product fit

- Product: premium travel concierge / hospitality service
- Audience: affluent English-speaking leisure travelers, roughly 30–55, planning a 3–7 day Paris trip
- Context: inspiration and evaluation on desktop; inquiry and itinerary reference on mobile
- Brand promise: Paris feels personal and spontaneous because the difficult logistics are handled quietly in the background
- Primary conversion: submit a concise trip brief

## Design direction

### Pattern

**Hero-Centric + Storytelling + Social Proof**

Recommended flow:
1. Immersive hero with one primary CTA
2. Curated experience categories
3. Trust/service-proof strip
4. Simple explanation of how the concierge works
5. Traveler story / outcome proof
6. Service metrics
7. Low-friction trip brief

### Style

**Premium dark editorial with restrained liquid-glass surfaces**

This is a synthesis of the skill matches:
- Travel/Tourism → storytelling, motion, destination inspiration
- Hotel/Hospitality → hero-centric, liquid glass, minimalism, social proof
- Luxury/Premium Brand → liquid glass, restrained palette, premium storytelling

Use glass only for navigation, cards, and overlays. Do not make every content surface translucent.

### Color tokens

| Token | Value | Use |
|---|---:|---|
| `--ink` | `#05070B` | page background |
| `--surface` | `#0B1018` | opaque section surface |
| `--surface-strong` | `#111827` | elevated solid surface |
| `--text` | `#F7F3EA` | primary text |
| `--muted-text` | `rgba(247,243,234,.72)` | secondary copy |
| `--gold` | `#E7C86E` | primary CTA / premium accent |
| `--gold-strong` | `#D4AF37` | emphasis / selected state |
| `--sky` | `#73B7FF` | travel/destination secondary accent |
| `--line` | `rgba(255,255,255,.15)` | borders/dividers |

Rules:
- Gold is for actions and premium emphasis, not decorative gradients everywhere.
- Sky blue may support atmosphere and travel context, but must not compete with the CTA.
- Normal body text should meet WCAG AA contrast; avoid the previous low-opacity gray-on-dark treatment.

### Typography

Skill match: **Classic Elegant — Playfair Display + Inter**.

Implementation-safe fallback in this project:
- Display: Georgia / Times New Roman / serif
- Body: Inter if available, then system sans

Scale:
- Hero: 40–60px, tight display leading
- Section H2: 36–60px
- Card H3: 18–20px
- Body: 14–16px, 1.5–1.75 line-height
- Eyebrow/labels: 11–12px, uppercase, high tracking

### Motion

- Standard interaction transition: 150–250ms
- Major entrance: 500–700ms maximum
- Motion should reveal hierarchy or reinforce spatial context, not decorate every element
- Respect `prefers-reduced-motion`
- Disable WebGL/parallax for reduced-motion users and weak mobile devices
- No auto-rotating content without pause controls

### Components

#### Primary CTA
- Filled warm gold
- Dark text
- 44px minimum height
- Clear action label: “Plan my Paris” / “Send trip brief”
- One primary CTA per section

#### Secondary action
- Text or subtle glass treatment
- Never same visual weight as primary CTA

#### Cards
- 16–32px radius depending on scale
- Glass only when background depth adds meaning
- Body copy at comfortable contrast (`white/68` or higher on this background)

#### Forms
- Visible labels; placeholders are examples only
- 48px controls preferred on mobile
- Inline success/error feedback via accessible live region
- Preserve focus visibility

## Accessibility checklist

- [x] Visible global `:focus-visible` ring
- [x] Skip link to main content
- [x] Navigation has accessible label
- [x] Mobile menu control has accessible name
- [x] Form uses visible labels and autocomplete hints
- [x] Status feedback uses `aria-live`
- [x] Touch targets are at least 44px
- [x] Reduced-motion preference disables WebGL via existing capability hook
- [x] Reduced-motion CSS suppresses nonessential animation
- [x] Body-copy contrast increased from low-opacity gray
- [ ] Run automated contrast/a11y tooling in a browser before production release

## Next.js implementation rules

- Keep pages and static content as Server Components by default
- Keep `use client` at leaf interactive components only
- Preserve explicit dimensions / stable layout for media to avoid CLS
- Use `next/image` for future photographic assets
- Avoid shipping WebGL to weak devices; existing capability detection already does this
- Keep hero effects out of the critical interaction path

## Anti-patterns to avoid

- Generic AI purple/pink gradients
- Cheap-looking gold used everywhere
- Multiple equally dominant CTAs
- Low-contrast gray body copy on dark surfaces
- Decorative-only animation and scroll-jacking
- Fake partner logos or unsupported trust claims
- Complex booking forms before the user has spoken to the concierge
