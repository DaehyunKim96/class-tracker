## Overview

Class Tracker reads like an editorial education brand that happens to manage tutoring schedules — the surfaces are quiet, white-canvas, generously spaced, and almost monochromatic. The single brand voltage is **Tutor Indigo** (`{colors.primary}` — #4f46e5), used scarcely: every primary CTA pill, the brand wordmark, and inline emphasis links. Beyond that one indigo, the system is white canvas + ink + soft gray elevation bands + a deep near-black editorial canvas (`{colors.surface-dark}` — #0a0b0d) for full-bleed product-mockup heroes.

Type pairs **InterDisplay** for hero headlines with **Inter** for body, captions, and navigation. Display sits at **weight 400** — not the 700+ typical of education-marketing pages. The choice signals editorial calm and trustworthy stewardship rather than gamified urgency.

The page rhythm rotates three modes: bright white editorial sections, soft-gray elevation bands, and **full-bleed dark editorial heroes** carrying layered calendar-mockup cards. The dark hero with floating lesson-card mockups is the single most distinctive component.

**Key Characteristics:**
- Single accent color: `{colors.primary}` (#4f46e5 Tutor Indigo) carries every primary CTA, wordmark, and inline brand link. Used scarcely.
- Modest display weights — InterDisplay at weight 400, never 700+.
- Editorial pill geometry: every CTA is `{rounded.pill}` (100px), every avatar / status dot is `{rounded.full}`, every card is `{rounded.xl}` (24px). Sharp corners absent.
- Full-bleed dark heroes with floating calendar mockups: `{component.hero-band-dark}` plus inline `{component.lesson-card-dark}` mockups is the brand's strongest signature pattern.
- Schedule semantics: `{colors.semantic-completed}` (#059669) and `{colors.semantic-cancelled}` (#cf202f) — text color only, never background fills.
- 96px section rhythm — generous editorial pacing.

## Colors

### Brand & Accent
- **Tutor Indigo** (`{colors.primary}` — #4f46e5): The single brand color. Every primary CTA pill, the Class Tracker wordmark, and inline brand links.
- **Tutor Indigo Active** (`{colors.primary-active}` — #4338ca): Press-state darken on the primary pill.
- **Tutor Indigo Disabled** (`{colors.primary-disabled}` — #c7d2fe): Faded-indigo tint for disabled CTAs.
- **Accent Amber** (`{colors.accent-amber}` — #f59e0b): A small sub-brand accent used very sparingly on highlight glyphs inside hero illustrations. Illustrative-only, not an action color.

### Surface
- **Canvas** (`{colors.canvas}` — #ffffff): The default page floor.
- **Surface Soft** (`{colors.surface-soft}` — #f7f7f8): Subtle alternating band surface.
- **Surface Strong** (`{colors.surface-strong}` — #eef0f3): The light-gray fill behind secondary buttons, search pills, avatar plates.
- **Surface Dark** (`{colors.surface-dark}` — #0a0b0d): Deep near-black canvas for full-bleed dark heroes, CTA bands. Same hex as `{colors.ink}` — page-floor and text-color share the value.
- **Surface Dark Elevated** (`{colors.surface-dark-elevated}` — #16181c): One step lighter, used for floating lesson-card mockups inside dark heroes.

### Hairlines
- **Hairline** (`{colors.hairline}` — #dee1e6): Default 1px divider on white surfaces.
- **Hairline Soft** (`{colors.hairline-soft}` — #eef0f3): Lighter divider — same hex as `{colors.surface-strong}`.

### Text
- **Ink** (`{colors.ink}` — #0a0b0d): Display headings, primary nav, body emphasis.
- **Body** (`{colors.body}` — #5b616e): Default running-text — slightly cool gray.
- **Body Strong** (`{colors.body-strong}` — #0a0b0d): Same as ink, used for stronger emphasis.
- **Muted** (`{colors.muted}` — #7c828a): Sub-titles, breadcrumbs, footer secondary.
- **Muted Soft** (`{colors.muted-soft}` — #a8acb3): Disabled link text.
- **On Primary** (`{colors.on-primary}` — #ffffff): White text on Tutor Indigo CTAs.
- **On Dark** (`{colors.on-dark}` — #ffffff): White text on dark heroes.
- **On Dark Soft** (`{colors.on-dark-soft}` — #a8acb3): Muted off-white for secondary text on dark.

### Schedule Semantics
- **Semantic Scheduled** (`{colors.semantic-scheduled}` — #4f46e5): "Scheduled / upcoming" status — same hex as the brand, reserved for status indicators on calendar surfaces.
- **Semantic Completed** (`{colors.semantic-completed}` — #059669): "Class completed" green, text color only.
- **Semantic Cancelled** (`{colors.semantic-cancelled}` — #cf202f): "Class cancelled" red, text color only.

## Typography

### Font Family
The system runs **InterDisplay** (display headlines), **Inter** (body, navigation, captions, buttons), and **JetBrains Mono** for tabular time / date / number data. Fallback stack: `-apple-system, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`.

The display/body split is functional: InterDisplay carries hero headlines only; Inter carries everything else.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-mega}` | 80px | 400 | 1.0 | -2px | Homepage hero h1 |
| `{typography.display-xl}` | 64px | 400 | 1.0 | -1.6px | Subsidiary heroes |
| `{typography.display-lg}` | 52px | 400 | 1.0 | -1.3px | Section heads |
| `{typography.display-md}` | 44px | 400 | 1.09 | -1px | CTA-band headlines |
| `{typography.display-sm}` | 36px | 400 | 1.11 | -0.5px | Sub-section heads — Inter |
| `{typography.title-lg}` | 32px | 400 | 1.13 | -0.4px | Card group titles |
| `{typography.title-md}` | 18px | 600 | 1.33 | 0 | Component titles, lesson row primary |
| `{typography.title-sm}` | 16px | 600 | 1.25 | 0 | List labels |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Default body |
| `{typography.body-strong}` | 16px | 700 | 1.5 | 0 | Emphasized body |
| `{typography.body-sm}` | 14px | 400 | 1.5 | 0 | Footer body |
| `{typography.caption}` | 13px | 400 | 1.5 | 0 | Photo captions, helper text |
| `{typography.caption-strong}` | 12px | 600 | 1.5 | 0 | Badge pill labels |
| `{typography.number-display}` | 18px | 500 | 1.4 | 0 | Times, dates, durations — JetBrains Mono |
| `{typography.button}` | 16px | 600 | 1.15 | 0 | Standard CTA pill |
| `{typography.nav-link}` | 14px | 500 | 1.4 | 0 | Top-nav menu items |

### Principles
- **Display weight stays at 400.** The single most distinctive typographic choice — signals "calm institutional brand" rather than "edtech-marketing urgency."
- **Negative letter-spacing on display only.** Display uses -1px to -2px tracking; body stays at 0.
- **JetBrains Mono on every time/date/number.** Lesson start times, durations, dates — anything tabular renders in JetBrains Mono.

### Note on Font Substitutes
Inter and JetBrains Mono are open-source web fonts; both load from Google Fonts.
- **InterDisplay → Inter** at weight 400, letter-spacing -1.5%.
- **Inter → Inter** at weight 400 / 500 / 600 / 700.
- **JetBrains Mono → JetBrains Mono** at weight 500.

## Layout

### Spacing System
- **Base unit:** 4px.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.base}` 16px · `{spacing.md}` 20px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- **Section padding:** `{spacing.section}` (96px) for every major editorial band.
- **Card internal padding:** `{spacing.xl}` (32px) for feature cards and lesson-card mockups.

### Grid & Container
- **Max content width:** ~1200px centered. Hero photography full-bleed.
- **Editorial body:** Single 12-column grid.
- **Feature card grids:** 2-up at desktop for hero splits, 3-up for benefit grids.
- **Calendar grid:** 7-column week grid on desktop, single-column day list on mobile.
- **Footer:** 4-column link list at desktop (smaller than Coinbase's 6 — fewer surfaces).

### Whitespace Philosophy
Generous editorial pacing — closer to a long-form magazine than to a productivity dashboard. 96px between bands; cards inside bands sit 24px apart. Density lives inside the calendar view, not on marketing surfaces.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | 80% of surfaces |
| Hairline border | 1px `{colors.hairline}` | Feature card outlines on white |
| Soft drop | `0 4px 12px rgba(0, 0, 0, 0.04)` | Single shadow tier — hovered cards |
| Photographic | Full-bleed calendar-mockup cards | Hero depth |

### Decorative Depth
- **Layered lesson-card mockups inside dark heroes** is the most distinctive decorative pattern — a `{component.lesson-card-dark}` floats above a darker base canvas, often with a second smaller card overlapping at an angle, suggesting "this week + next week."
- **Geometric brand illustrations** carry illustrative depth where shadows would otherwise.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Reserved (essentially unused) |
| `{rounded.xs}` | 4px | Inline tags |
| `{rounded.sm}` | 8px | Compact rows |
| `{rounded.md}` | 12px | Form inputs |
| `{rounded.lg}` | 16px | Mid-size cards |
| `{rounded.xl}` | 24px | Feature cards, lesson-card mockups, calendar surfaces |
| `{rounded.pill}` | 100px | All CTA buttons, search pills, badges |
| `{rounded.full}` | 9999px | Avatar circles, status dots |

Pill for interactive, card-radius (24px) for containers, full circle for avatars and dots. Sharp corners absent.

## Components

### Top Navigation

**`top-nav-light`** — Default top nav on white pages. Background `{colors.canvas}`, text `{colors.ink}`, height 64px. Layout: Class Tracker wordmark left, primary horizontal menu (캘린더 / 수업 기록 / 학생 / 도움말), Sign In + Sign Up CTAs right.

**`top-nav-on-dark`** — Top nav over a dark hero band. Background `{colors.surface-dark}`, text `{colors.on-dark}`. Same layout.

### Buttons

**`button-primary`** — The signature Tutor Indigo pill. Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button}` (16px / 600), padding 12px × 20px, height 44px, rounded `{rounded.pill}` (100px).

**`button-primary-active`** — Press state. Background `{colors.primary-active}`, deeper indigo.

**`button-primary-disabled`** — Faded indigo tint. Background `{colors.primary-disabled}`. Cursor not-allowed.

**`button-secondary-light`** — Soft-gray secondary on white surfaces. Background `{colors.surface-strong}`, text `{colors.ink}`, same pill geometry.

**`button-secondary-dark`** — Used on dark heroes. Background `{colors.surface-dark-elevated}`, text `{colors.on-dark}`, same pill geometry.

**`button-outline-on-dark`** — Transparent pill with white outline. Background transparent, text `{colors.on-dark}`, 1px white border.

**`button-tertiary-text`** — Inline text link. Background transparent, text `{colors.primary}`, type `{typography.button}`.

**`button-pill-cta`** — Larger pill CTA used on the homepage hero ("수업 시작하기"). Same Tutor Indigo palette but with 56px height and 16px × 32px padding for a prouder stance.

### Hero Bands

**`hero-band-dark`** — The signature full-bleed dark hero. Background `{colors.surface-dark}`, text `{colors.on-dark}`, full-bleed layered lesson-card mockups. Display headline left in `{typography.display-mega}` (80px / 400), subhead in `{typography.body-md}`, two CTAs.

**`hero-band-light`** — White-canvas variant used on inner pages. Background `{colors.canvas}`, text `{colors.ink}`. Same skeleton, light palette.

### Cards

**`lesson-card-dark`** — The floating lesson mockup. Background `{colors.surface-dark-elevated}`, text `{colors.on-dark}`, rounded `{rounded.xl}` (24px), padding 32px. Often shown as 2 stacked cards at slight rotation, mimicking layered week views.

**`lesson-card-light`** — Light-canvas variant used on the calendar surface for individual lessons. Background `{colors.canvas}`, text `{colors.ink}`, same geometry, 1px hairline border.

**`feature-card`** — Used in 3-up and 2-up grids. Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.title-md}`, rounded `{rounded.xl}`, padding 32px.

### Calendar Surfaces

**`lesson-row`** — Horizontal row in lesson history lists. Background transparent, 1px hairline divider. Layout: 32px circular subject icon left, lesson subject + date, time column in `{typography.number-display}`, status column with `{component.lesson-status-cell}`.

**`lesson-status-cell`** — Inline status cell. Color only — indigo, green, or red text in `{typography.caption-strong}`, no background fill.
- `scheduled` → `{colors.semantic-scheduled}`
- `completed` → `{colors.semantic-completed}`
- `cancelled` → `{colors.semantic-cancelled}` (struck-through time)

**`calendar-grid`** — The week / month grid surface. Background `{colors.canvas}`, 1px hairline cell dividers, day-of-week headers in `{typography.caption-strong}`. Rounded `{rounded.xl}` around the outer container.

**`calendar-day-cell`** — Individual day cell inside the grid. Background `{colors.canvas}`, padding `{spacing.sm}`. Today is marked with a `{rounded.full}` indigo dot under the date number — not a background fill.

**`time-block`** — Visual block representing a lesson's time span inside a day cell. Background `{colors.primary}` at 10% opacity, text `{colors.primary}`, rounded `{rounded.sm}`, padding 4px × 8px. Time in `{typography.number-display}`.

**`avatar-circle`** — Circular plate for student / parent / teacher avatars. Background `{colors.surface-strong}`, rounded `{rounded.full}`, 32px diameter. Initials in `{typography.caption-strong}` `{colors.ink}`.

### Forms

**`text-input`** — Standard text input. Background `{colors.canvas}`, text `{colors.ink}`, rounded `{rounded.md}` (12px), padding 14px × 16px, height 48px, 1px hairline border. On focus, border thickens to 2px Tutor Indigo.

**`search-input-pill`** — Pill-shaped search bar. Background `{colors.surface-strong}`, rounded `{rounded.pill}`, padding 12px × 20px, height 44px.

### Tags & Badges

**`badge-pill`** — Small uppercase pill used as section labels ("이번 주", "오늘"). Background `{colors.surface-strong}`, text `{colors.ink}`, type `{typography.caption-strong}`, rounded `{rounded.pill}`.

### CTA / Footer

**`cta-band-dark`** — Pre-footer "수업을 시작해보세요" band. Background `{colors.surface-dark}`, text `{colors.on-dark}`, vertical padding 96px. Centered headline + two CTAs.

**`footer-light`** — Closing white-canvas footer. Background `{colors.canvas}`, text `{colors.body}`. 4-column link list.

**`footer-link`** — Individual footer link. Background transparent, text `{colors.body}`.

**`legal-band`** — Bottom strip beneath footer columns. All text `{colors.muted}` at `{typography.caption}`.

## Do's and Don'ts

### Do
- Reserve `{colors.primary}` (Tutor Indigo) for primary CTAs, wordmark, brand-glyph illustrations, inline accent links.
- Set every CTA as `{rounded.pill}` (100px); every avatar as `{rounded.full}`.
- Keep InterDisplay headlines at weight 400.
- Use the dark/light band rotation as page rhythm.
- Render every time / date / duration in JetBrains Mono via `{typography.number-display}`.
- Pair every dark hero with a layered lesson-card mockup stack.

### Don't
- Don't introduce a secondary brand color. Tutor Indigo is the only action color; schedule green/red are semantic-only.
- Don't bold display copy — display sits at weight 400; bolding shifts the brand voice.
- Don't add drop shadow tiers — system has one shadow tier.
- Don't use sharp `{rounded.none}` (0px) on CTAs.
- Don't mix InterDisplay and Inter inside the same headline.
- Don't use schedule green/red as a button background.
- Don't fill today's calendar cell with brand color — only mark with a `{rounded.full}` dot under the date.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 640px | Hero h1 80→40px; feature card grid 1-up; lesson row stacks; nav collapses to hamburger; calendar collapses from week-grid to day-list. |
| Tablet | 640–1024px | Hero h1 64px; feature card grid 2-up; lesson rows stay horizontal but compress columns. |
| Desktop | 1024–1280px | Full hero h1 80px; feature card grid 3-up; full 7-column calendar grid. |
| Wide | > 1280px | Content caps at 1200px; hero photography full-bleed. |

### Touch Targets
- Primary CTA pill at 44px height — at WCAG AAA.
- Larger hero pill (`{component.button-pill-cta}`) at 56px — well above AAA.
- Avatar circles at 32px — borderline; padded 8px row creates effective 48px tap zone.
- Calendar day cells padded so each cell is at least 44px tall on touch.

### Collapsing Strategy
- Top nav switches to hamburger sheet below 768px. Sign Up CTA stays visible.
- Hero h1 steps down: 80 → 64 → 52 → 44 → 36px on smallest screens.
- Layered lesson-card mockups collapse from 2 stacked into a single card on mobile.
- Calendar week-grid collapses to vertical day-list on mobile, one day per row.
- Lesson rows on mobile stack vertically: subject line on top, time + status line beneath.

## Iteration Guide

1. Focus on a single component at a time. Reference YAML keys directly.
2. New CTAs default to `{rounded.pill}` (100px); new avatars default to `{rounded.full}`. Cards use `{rounded.xl}`.
3. Variants live as separate entries inside the `components:` block.
4. Use `{token.refs}` everywhere — never inline hex.
5. Hover state never documented. Only Default and Active/Pressed.
6. InterDisplay 400 for display, Inter 400/500/600/700 for body. JetBrains Mono on every time/date/duration.
7. Tutor Indigo stays scarce — one or two indigo moments per band.

## Known Gaps

- InterDisplay is implemented as Inter at weight 400 with -1.5% tracking — there is no separate display cut.
- In-product editing surfaces (lesson note editor, scheduling modal) are not yet captured in this document.
- Animation timings out of scope.
- Form validation states beyond focus not yet captured.
- Accent amber appears only inside hero illustrations; documented as illustrative-only.
