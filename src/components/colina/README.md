# Colina-style design system (SCCS)

The site follows the "Colina International" design language, rebuilt with SCCS's own
content, logo, photos and colours. Nothing from colinainternational.com is copied
except the layout system and motion.

## Where things live

| Piece | File |
|---|---|
| Tokens: colours, fluid type scale, radii, gutters, buttons, reveal, bento areas, modal animation | `src/app/globals.css` (bottom half) |
| Nav re-tint by section (`data-color`) and the page-load fades | `src/lib/use-section-tint.ts` |
| Sticky nav, mega-menu with drop-in shapes, mobile sheet | `src/components/sccs/header.tsx` |
| Footer | `src/components/sccs/footer.tsx` |
| Home: hero, bento grid, title band, feature boxes, split image, careers, joining table + map | `src/components/colina/home.tsx` |
| "Learn more" modal | `src/components/colina/modal.tsx` |
| Scroll reveal (rise from 10vw + un-squash from scaleY 1.2) | `src/components/home/motion.tsx` (`data-rise`) |
| Inner-page cover | `PageHero` in `src/components/sccs/page-kit.tsx` |

## Colour roles

| Role (spec name) | Token | Value |
|---|---|---|
| Primary field (mint) | `--color-field` | `#EBEBF5` |
| Ink on the field (sage) | `--color-field-ink` | `#34347A` |
| Secondary field (sky) | `--color-rose` | `#F3D3D8` |
| Ink on it (deep teal) | `--color-rose-ink` | `#961A2A` |
| Cards (cream) | `--color-card` | `#FCF8F1` |
| Labels, grey boxes, menus (warm grey) | `--color-slate` | `#6B6980` (darkened for AA) |
| The one loud button | `--grad-cta` | amber `#FBBD4D` → `#E08F0B` |

Swap any of these in `globals.css` and the whole site follows.

## Section colours

Give every full-width section `data-color="field|rose|lgrey|grey|navy|card"`; the nav
takes that colour while the section is under it.
