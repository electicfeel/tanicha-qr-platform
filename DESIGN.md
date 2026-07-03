---
name: TANICHA QR Platform
description: Dark, flat, border-defined control surface for managing dynamic links, QR codes, and brand bio pages
colors:
  ink: "#f5f5f5"
  canvas: "#0a0a0a"
  surface: "#171717"
  border: "#262626"
  border-interactive: "#404040"
  muted: "#737373"
  muted-strong: "#a3a3a3"
  accent: "#10b981"
  accent-bright: "#34d399"
  accent-deep: "#064e3b"
  danger: "#f87171"
typography:
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  heading:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.4
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.4
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
rounded:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "#ffffff"
    textColor: "{colors.canvas}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "10px 12px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "10px 16px"
  card:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "20px"
  chip-status:
    backgroundColor: "{colors.accent-deep}"
    textColor: "{colors.accent-bright}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
---

# Design System: TANICHA QR Platform

## 1. Overview

**Creative North Star: "The Utility Panel"**

This is a control surface, not a showcase. A marketing team opens it between other tasks to spin up a short link or QR, repoint a campaign, read a click trend, arrange a brand's bio page, and drag a link into a brand folder — then leaves.

One exception carries a different register: the **public bio page** (`/p/{handle}`, Linktree-style). Its *editor* lives inside this utility panel and follows every rule here; the *rendered page itself* is brand surface — mobile-first (opened from IG/TikTok bios), themed per brand (brand logo + colors over the system's own), fast and script-light. The utility panel disappears into work; the bio page represents a brand. Don't let the two bleed into each other. The interface earns its keep by disappearing into that work. Everything is dark, flat, and border-defined: a near-black canvas (#0a0a0a) with content lifted one tonal step onto #171717 surfaces, separated by hairline #262626 borders. There is no chrome for chrome's sake, no gradient, no shadow, no decorative motion. Depth is communicated by tone and a single-pixel line, the way a well-built instrument panel reads at a glance.

The one voice of color is **Signal Green** (emerald). It appears only where state lives — an active QR, a selected folder, a live drop target, a keyboard focus ring — never as decoration. Against the monochrome field, that restraint is what makes the green mean something. Type is a single family (Inter) at a tight, fixed rem scale; a monospace face shows up only for machine tokens like a `/r/{code}` short link. Components are **tactile and confident**: real hover and focus feedback, honest press states, generous hit areas — restrained in ornament, not in responsiveness.

What this system explicitly rejects: the **SaaS / AI-generic** look (identical card grids wall to wall, gradient fills and gradient text, hero-metric templates, tiny uppercase tracked eyebrows over every heading, decorative glassmorphism) and anything **cluttered or over-dense** (crowded actions, buried hierarchy, no clear next step). Usability beats expression, every time.

**Key Characteristics:**
- Dark, flat, border-defined — depth from tone + 1px lines, never shadow
- Emerald is a state signal, used on a handful of elements per screen, never decoration
- One type family (Inter), fixed rem scale, mono only for codes
- Thai-first UX copy: direct, short, immediately legible
- WCAG AA legibility is a floor, not a nice-to-have

## 2. Colors

A monochrome neutral field carrying a single green signal, plus one red for destructive intent.

### Primary
- **Signal Green** (#10b981, emerald-500): the system's one voice. Drop-target highlights, keyboard focus rings, the "live" pulse of state. Brighter **Signal Green Bright** (#34d399, emerald-400) carries the active status chip and small-on-dark text; **Signal Green Deep** (#064e3b, emerald-900) is the tinted backing behind active chips and drop zones. Never used to decorate a surface.

### Neutral
- **Ink** (#f5f5f5, neutral-100): primary text and the fill of the one primary button.
- **Canvas** (#0a0a0a, neutral-950): the body background. Everything sits on this near-black.
- **Surface** (#171717, neutral-900): inputs and raised fields, one tonal step above canvas.
- **Border** (#262626, neutral-800): hairline dividers and resting card/tile edges.
- **Border Interactive** (#404040, neutral-700): the edge of interactive controls (buttons, inputs); lightens toward #737373 on hover.
- **Muted** (#737373, neutral-500): secondary text, counts, meta, `/r/{code}` — the legibility floor on canvas (~4.8:1).
- **Muted Strong** (#a3a3a3, neutral-400): secondary text that needs to read comfortably (destinations, section meta).

### Semantic
- **Danger** (#f87171, red-400): destructive actions only (delete). Paired with a red-900/50 hairline border; text lifts to red-300 on hover.

### Named Rules
**The Accent-as-Signal Rule.** Emerald is reserved for *state* — active, selected, drop-target, focus. If it is doing decoration, it is wrong; remove it or replace it with a neutral. Its rarity is the point.

**The Legibility-Floor Rule.** No meaningful text uses neutral-600 (#525252) on canvas — it fails AA (~2.6:1). Muted text bottoms out at neutral-500 (#737373); prefer neutral-400 when the text carries real information.

## 3. Typography

**Display Font:** Inter (with ui-sans-serif, system-ui fallback)
**Body Font:** Inter (same family)
**Label/Mono Font:** ui-monospace / SFMono-Regular / Menlo (codes only)

**Character:** One well-tuned humanist sans does all the work — titles, headings, body, labels, buttons. No display/body pairing; contrast comes from weight and size, not from a second face. The monospace is a functional signal, not a style: it marks machine-readable tokens (`/r/AbC123`) so they read as "copy this exactly."

### Hierarchy
- **Title** (600, 1.5rem / 24px, line-height 1.2, tracking -0.01em): page headers ("QR ทั้งหมด").
- **Heading** (500–600, 1rem / 16px): QR names, the primary label inside a card or tile.
- **Body** (400, 0.875rem / 14px): the default. Most on-screen text and controls.
- **Label** (400, 0.75rem / 12px): section labels, counts, meta, short-link codes, empty-state hints.
- **Micro** (400, 0.625rem / 10px): the sparkline caption ("7 วัน") only.
- **Mono** (400, 0.75rem): `/r/{code}` short links.

### Named Rules
**The One-Family Rule.** Inter carries everything. A second UI face is prohibited; if two "heading" styles look different across screens, one is a bug.

**The Fixed-Scale Rule.** Type sizes are fixed rem steps, never fluid `clamp()`. This is a product tool viewed at consistent DPI; a heading that shrinks in a panel looks worse, not designed.

## 4. Elevation

This system is **flat by default and uses zero box-shadows.** Depth is built entirely from two tonal steps (canvas #0a0a0a → surface #171717) and 1px borders (#262626 at rest, #404040/#525252 on interactive hover). A card is not "above" the page; it is a region *outlined* on the page. State that would normally be a shadow — hover, focus, active drop — is expressed with a border-color shift or a low-opacity emerald tint instead.

### Named Rules
**The Flat-By-Default Rule.** No `box-shadow`, ever, for elevation. Hierarchy is border + tonal step. If a surface needs to feel "raised," lighten its border or step its background one tone — do not float it.

**The State-Not-Ornament Rule.** The only things that visibly change are responses to the user: border lightens on hover, an emerald ring on focus, an emerald tint on a live drop target. Nothing moves or glows for decoration.

## 5. Components

Character across the board: **tactile and confident** — clear hit areas, honest hover/focus/active feedback, restrained ornament.

### Buttons
- **Shape:** 8px radius (`rounded-lg`).
- **Primary:** Ink fill (#f5f5f5) on canvas text (#0a0a0a), `8px 16px` padding, font-weight 500. Hover lifts the fill to pure white (#ffffff). Exactly one per surface (the header "+ สร้าง QR"; the inline "สร้าง" confirm).
- **Secondary / Ghost:** transparent fill, 1px Border-Interactive (#404040) edge, Ink text, `10px 12px`. Hover lightens the border to #737373. This is the workhorse (แก้ไข / ดาวน์โหลด / เปิด·ปิด / + โฟลเดอร์ใหม่).
- **Danger:** transparent fill, red-900/50 border, Danger text (#f87171); hover lightens border to red-700 and text to red-300. Delete only.
- **Focus (all):** a 2px emerald focus-visible ring (`emerald-500/70`) with a 2px offset over canvas. Never removed without replacement.

### Chips
- **Status chip:** `rounded-full`, text-xs, `2px 8px`. **Active ("เปิด")** = Signal Green Deep backing (emerald-900/40) + Signal Green Bright text (#34d399). **Inactive ("ปิด")** = neutral-800 backing + neutral-500 text, intentionally quiet (an off QR should recede).

### Cards / Containers
- **Corner:** 16px (`rounded-2xl`).
- **Background:** transparent over canvas; a 1px Border (#262626) defines the edge. Hover lightens the border to neutral-600.
- **Shadow Strategy:** none — see Elevation.
- **Internal Padding:** 20px (`p-5`).
- **Behavior:** the QR "file" card is draggable (`cursor-grab`); while dragging it dims to 50% opacity and its border lifts, so the user sees exactly what they're moving.

### Folder Tile
- **Shape:** 12px radius (`rounded-xl`), 1px border, a 📁 glyph + name + count.
- **States:** resting Border (#262626); **active** (open folder) = Ink border (#f5f5f5) on surface; **drop target** = emerald-500 border + emerald-500/10 tint. Doubles as both navigation (click to open) and a drop zone.

### Inputs / Fields
- **Style:** Surface fill (#171717), 1px Border-Interactive edge, 8px radius, body text.
- **Focus:** border lightens to Muted Strong (#a3a3a3); no glow. Placeholder is Muted (#737373), never dimmer.

### Navigation
- **Top bar:** 1px bottom Border, wordmark left ("TANICHA QR", widest tracking, Ink + muted "QR"), the single primary action right.
- **Breadcrumb:** "หน้าแรก / 📁 Folder" on the list surface; "หน้าแรก" is itself a drop target (drag a QR onto it to remove it from a folder).

### Signature: Sparkline + Drag-Organize
- **Sparkline:** a 7-day mini bar chart on every QR card, bars in emerald-500/60 — a glanceable scan trend, not a full chart.
- **Drag-organize:** the Google-Drive-style list where QR "files" drag into brand "folders." The whole IA is the product's organizing metaphor; keep it obvious and physical.

## 6. Do's and Don'ts

### Do:
- **Do** keep emerald a *state* signal — active, selected, drop target, focus — on only a handful of elements per screen (**The Accent-as-Signal Rule**).
- **Do** build depth from 1px borders + the canvas→surface tonal step (#0a0a0a → #171717), never shadow (**The Flat-By-Default Rule**).
- **Do** set every type element in Inter; reserve monospace for machine tokens like `/r/{code}` (**The One-Family Rule**).
- **Do** hold WCAG AA: meaningful text at neutral-500 (#737373) minimum on canvas, neutral-400 when it carries information; placeholders at #737373, not dimmer.
- **Do** give every interactive element a visible emerald `focus-visible` ring, and keep one clear primary action per surface.

### Don't:
- **Don't** ship the **SaaS / AI-generic** look: identical card grids wall to wall, gradient fills, gradient text (`background-clip: text`), the hero-metric template, tiny uppercase tracked eyebrows over every section, or decorative glassmorphism.
- **Don't** let a surface get **cluttered or over-dense** — crowded actions, buried hierarchy, no obvious next step. If a screen has more than one primary action, one is wrong.
- **Don't** use neutral-600 (#525252) for any readable text on canvas — it fails AA (~2.6:1).
- **Don't** put gray text on the emerald chip or any colored fill; use the fill's own hue (emerald-400 on emerald-900).
- **Don't** add side-stripe borders (`border-left`/`border-right` > 1px as an accent) or any `box-shadow` for elevation.
