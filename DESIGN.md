# Lokang — DESIGN.md

Direction: **"Above the water / below the water."** A cinematic, photo-led site in two moods.
Above the waterline (light, airy, competition-day daylight) for the story and the pools.
Below the waterline (deep, quiet, clear) for the engineering: the ZAM steel, the data, the build.
Photography and footage carry the page; type is editorial and large; UI chrome stays thin.

Benchmarks studied: Myrtha Pools (image-led, large declarative headlines, sector blocks, project cards
with country + year). Not based on a UXKIN comparison (not connected).

## Color
| Token | Value | Role |
|---|---|---|
| `--chlorine` | #F6F9FA | Light page background (above water) |
| `--paper` | #FFFFFF | Cards, form fields on light |
| `--abyss` | #03141F | Dark background (below water chapters, footer) |
| `--deep` | #072A3B | Raised surfaces on dark |
| `--ink` | #0A1A24 | Body text and headings on light (16.9:1 on chlorine) |
| `--ink-2` | #46596A | Secondary text on light (6.9:1) |
| `--foam` | #E9F3F7 | Text on dark (16:1 on abyss) |
| `--foam-2` | #9BB4C2 | Secondary text on dark (8.4:1) |
| `--pool` | #0A84B8 | Primary: buttons, links on light (4.6:1 on white) |
| `--pool-bright` | #36C2EE | Primary on dark: links, focus, highlights |
| `--lane` | #E2412B | Accent, used sparingly: the ZAM "proof" moments, lane-rope details |
| `--line` | rgba(10,26,36,.12) / rgba(233,243,247,.12) | Hairlines on light / dark |
No gradients as decoration. Color comes from photography.

## Typography
- Display: **Instrument Serif** (400, italic for emphasis words) — emotive statements, section titles.
- Text/UI: **Geist** (400/500/600) — body, nav, buttons, labels.
- Data: **Geist Mono** (500) — specs, hours, units, eyebrow labels.
Scale (clamp, desktop → phone): Hero 136→56 / H2 88→44 / H3 40→28 / Lead 22→19 / Body 17 / Small 14 / Label 12 mono uppercase +0.14em.
Line-height: display 0.95, headings 1.05, body 1.6. Measure 60–70ch. `text-wrap: balance` on headings.

## Spacing
8-pt scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160. Section padding 160 desktop / 96 phone.
Content width 1320 max; text columns 640 max. Full-bleed media breaks the grid on purpose.

## Shape & depth
Radius: 0 for full-bleed media, 4 for inputs, 999 for buttons/pills. No card shadows; depth comes
from image overlap and parallax. One shadow only for the floating quote panel.

## Components
- Buttons: primary (pool fill, white text), secondary (1px outline), quiet (text + arrow). Hover: arrow nudges 4px; focus: 2px pool-bright ring offset 3px; disabled: 40% opacity.
- Nav: transparent over hero, turns chlorine with hairline after the hero. "Request a quote" always visible.
- Project card: full-bleed photo, country · year in mono, project name in serif.
- Data chart: thin hairline axes, lane red for galvanized rust, pool-bright for ZAM, values labelled directly.
- Inputs: 52px tall, 4px radius, label above.

## Imagery & motion
- Footage: hero "dive" (aerial over 50 m lanes → through the surface → clear water and lane floor).
- Photos: full-bleed, real projects first; generated imagery only as atmosphere, never as named projects.
- Icons: Lucide-style 1.5px stroke, sparingly.
- Motion: scroll-scrubbed hero, slow Ken Burns on photos (scale 1→1.08), clip-path reveals,
  counted numbers, animated chart draw-in. Ease cubic-bezier(.2,.7,.2,1). All off under prefers-reduced-motion.
