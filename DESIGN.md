---
name: maibot
description: Web companion to the maibot Discord bot, set in Discord's own cool dark surfaces.
colors:
  discord-blurple: "#5865F2"
  discord-blurple-hover: "#4752C4"
  discord-blurple-active: "#3C45A5"
  light-action: "#f2f3f5"
  light-action-ink: "#1e1f22"
  light-action-hover: "#dbdee1"
  light-action-active: "#c4c9ce"
  discord-grey: "#4e5058"
  discord-grey-hover: "#6d6f78"
  discord-grey-active: "#5d6069"
  ground: "#1e1f22"
  card: "#2b2d31"
  hairline: "#3f4147"
  foreground: "oklch(0.985 0 0)"
  muted-foreground: "#b5bac1"
  destructive: "oklch(0.704 0.191 22.216)"
  error-text: "oklch(0.885 0.062 18.334)"
  warning: "oklch(0.828 0.189 84.429)"
  warning-text: "oklch(0.962 0.059 95.617)"
  success: "#23a55a"
  success-text: "oklch(0.962 0.044 156.743)"
  maimai-basic: "#45c124"
  maimai-advanced: "#ffba01"
  maimai-expert: "#ff7b7b"
  maimai-master: "#9f51dc"
  maimai-remaster: "#dbaaff"
  maimai-utage: "#ff6ffd"
typography:
  headline:
    fontFamily: "Google Sans Flex, Noto Sans TC, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.333
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Google Sans Flex, Noto Sans TC, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.556
    letterSpacing: "-0.025em"
  stat:
    fontFamily: "Google Sans Flex, Noto Sans TC, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.025em"
    fontFeature: "tnum"
  body:
    fontFamily: "Google Sans Flex, Noto Sans TC, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  body-sm:
    fontFamily: "Google Sans Flex, Noto Sans TC, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Google Sans Flex, Noto Sans TC, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.5
  label-sm:
    fontFamily: "Google Sans Flex, Noto Sans TC, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.429
  caption:
    fontFamily: "Google Sans Flex, Noto Sans TC, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.333
    fontFeature: "tnum"
  mono:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.9em"
    fontWeight: 400
rounded:
  sm: "4px"
  md: "8px"
  lg: "10px"
  xl: "14px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "40px"
components:
  button-discord:
    backgroundColor: "{colors.discord-blurple}"
    textColor: "#ffffff"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    height: "48px"
    width: "100%"
  button-discord-hover:
    backgroundColor: "{colors.discord-blurple-hover}"
  button-discord-active:
    backgroundColor: "{colors.discord-blurple-active}"
  button-action:
    backgroundColor: "{colors.light-action}"
    textColor: "{colors.light-action-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    height: "48px"
    width: "100%"
  button-action-hover:
    backgroundColor: "{colors.light-action-hover}"
  button-action-active:
    backgroundColor: "{colors.light-action-active}"
  button-secondary:
    backgroundColor: "{colors.discord-grey}"
    textColor: "#ffffff"
    typography: "{typography.label-sm}"
    rounded: "{rounded.lg}"
    height: "40px"
    padding: "0 16px"
  button-secondary-hover:
    backgroundColor: "{colors.discord-grey-hover}"
  button-secondary-active:
    backgroundColor: "{colors.discord-grey-active}"
  button-inline:
    textColor: "{colors.foreground}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.md}"
    height: "32px"
    padding: "0 8px"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: "40px"
    width: "420px"
  preview-panel:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: "32px 40px"
    width: "760px"
  banner-error:
    textColor: "{colors.error-text}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
  banner-warning:
    textColor: "{colors.warning-text}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
  banner-success:
    textColor: "{colors.success-text}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
  inline-command:
    typography: "{typography.mono}"
    rounded: "{rounded.sm}"
    padding: "2px 6px"
  drawer-row:
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    height: "56px"
  progress-row:
    typography: "{typography.body-sm}"
    height: "44px"
  difficulty-chip:
    typography: "{typography.caption}"
    rounded: "{rounded.md}"
    height: "24px"
    padding: "0 6px"
---

# Design System: maibot

## Overview

**Creative North Star: "Discord's Own Room"**

maibot lives inside the player's Discord habit, so the web side borrows Discord's own dark surfaces rather than shadcn's neutral greys: a near-black, faintly blue ground, one slightly lighter raised card, hairline borders, and Discord's blurple held back for the single action that leaves for Discord. The bar is the finish of Discord's own login screen, not a dashboard template.

Density is low and the voice is quiet. A surface shows a small wordmark, a direct heading, one supporting line, and the action. Status is spoken in tinted inline banners that say what happened and what to do next. Copy is English, sentence case. Where a surface shows the player's own maimai data (the upload preview), density rises to a scannable reading list, and that data is allowed to wear maimai's own images and difficulty colours; the room around it stays Discord's.

Motion is restrained: the main card fades in and rises 8px over 500ms with ease-out; content that replaces a loading placeholder only fades in over 200ms, so the entrance never plays twice; a preview panel that appears beside the card fades in over 500ms after a 150ms delay. Everything turns off when reduced motion is requested.

**Key Characteristics:**
- Cool Discord darks (blue-tinted near-black ground, lighter card, hairline border).
- Blurple reserved for the Discord action; the other main action is Discord's light filled button; quiet actions are Discord's grey.
- One raised card on desktop that dissolves to full-bleed content on small screens; data surfaces add a wider preview panel beside it.
- Tinted inline status banners (error, warning, success) with a Phosphor icon and recovery copy.
- Player data in maimai's own visual language, confined to the data.
- One entrance motion plus a short swap fade, reduced-motion safe.

## Colors

A cool, low-chroma dark neutral family carrying a single saturated brand blue, with maimai's difficulty colours admitted only inside player data.

### Primary
- **Discord Blurple** (`discord-blurple`): the fill of the Login with Discord button, required by Discord's brand rules. Darkens to **Pressed Blurple** (`discord-blurple-hover`) on hover and **Deep Blurple** (`discord-blurple-active`) while pressed.

### Secondary
- **Light Action** (`light-action`, label in `light-action-ink`): Discord's light filled button, the main action on a surface that isn't the Discord sign-in (Upload). Steps down to `light-action-hover` and `light-action-active`. The player's name plate on the upload preview reuses this fill.
- **Discord Grey** (`discord-grey`): Discord's own secondary button grey, for quiet actions such as Sign out and Try again. Lightens to `discord-grey-hover` on hover and settles to `discord-grey-active` while pressed.

### Neutral
- **Discord Ground** (`ground`): page background; the near-black, faintly blue base of every surface.
- **Raised Card** (`card`): the lifted card and the preview panel on desktop.
- **Hairline** (`hairline`): 1px borders on the card and panel, and the dividers between list rows and drawers.
- **Near White** (`foreground`): headings, wordmark, primary text.
- **Quiet Grey** (`muted-foreground`): supporting lines, helper copy, row meta and table headers.
- **Veils**: white at 3–7% for skeleton bars, image wells, overview rows and row hover; white at 10% for the disabled light action.

### Status
- **Alarm Red** (`destructive`, text in `error-text`): error banners, as a 10% fill and 30% border with light red text; the failed-item icon and its Retry action.
- **Amber** (`warning`, text in `warning-text`): warning banners, as a 10% fill and 30% border with pale amber text. The inline command chip inside a warning banner uses a 15% amber fill.
- **Discord Green** (`success`, text in `success-text`): success banners (upload finished), the done-item check icon, and the "New" record badge at 15% fill.

### Player Data
- **maimai difficulty colours** (`maimai-basic`, `maimai-advanced`, `maimai-expert`, `maimai-master`, `maimai-remaster`, `maimai-utage`): solid fill on difficulty chips (with a dark or white ink chosen per colour for legibility); mixed into the surface at 14–18% for recent-play rows and credit tiles, with a 45% mix as the tile border; and as column-header colour in the judgement table.

### Named Rules
**The One Blurple Rule.** Blurple at full strength fills only the Discord action. Elsewhere it appears only as atmosphere: a radial haze at 14% opacity across the top 28rem of the viewport, and text selection at 40%.

**The Discord Darks Rule.** Dark surfaces use the cool Discord values (ground, card, hairline, quiet grey), never shadcn's stock neutral dark greys. The overrides go on an inner wrapper inside the `.dark` element, because the unlayered `.dark` rule beats utilities placed on the same element.

**The Data Wears maimai Rule.** maimai's difficulty colours and DX NET images belong to the player's data (rows, tiles, chips, plates), never to the shell, cards, buttons or banners.

## Typography

**Body Font:** Google Sans Flex (with Noto Sans TC for CJK, then sans-serif)
**Mono Font:** JetBrains Mono

**Character:** A friendly, rounded geometric sans close to Discord's own voice; mono only for literal commands.

### Hierarchy
- **Headline** (700, 1.5rem, tight tracking, balanced wrap): the surface heading ("Sign in to maibot", "Upload data to maibot").
- **Title** (600, 1.125rem, tight tracking): the maibot wordmark in the header, and a panel heading ("What will be uploaded").
- **Stat** (600, 1.25rem, tight tracking, tabular figures): the achievement figure on a credit tile.
- **Body** (400, 1rem, relaxed 1.625 leading, pretty wrap): the supporting line under the heading, in Quiet Grey.
- **Body small** (400, 0.875rem, relaxed leading): banner text, helper lines, list rows and tables.
- **Label** (600, 1rem): full-width buttons and drawer titles.
- **Label small** (600, 0.875rem): the secondary button, inline actions, and small section headings.
- **Caption** (700, 0.75rem, tabular figures): difficulty chip text and tile meta.
- **Mono** (0.9em relative to surrounding text): inline bot commands such as `/link`.

### Named Rules
**The Literal Command Rule.** A bot command the player must type is set in JetBrains Mono inside a small tinted chip; prose around it stays in the sans.

**The Aligned Figures Rule.** Every number a player compares (ratings, counts, achievements, DX scores, judgements) uses tabular figures.

## Layout

Surfaces center a single column in the viewport, with the content block sitting slightly above center (extra 96px bottom padding on the main area). A plain header carries the wordmark at the top left (24px / 20px padding, growing to 40px / 28px from `sm`).

The main container is 420px wide at most. From the `sm` breakpoint (640px) it is a raised card with 40px padding. Below `sm` the card frame (border, fill, shadow, radius) drops away and content sits full-bleed on the ground with light padding (16px page gutter plus 8px).

Vertical rhythm inside the card: heading, 8px, supporting line, 24px, banner or progress list (when present), 32px, action, 16px, helper line.

Data surfaces widen to a 1240px row. From `lg` (1024px) the card sits on the left and stays in view (sticky, 32px from the top) while a preview panel up to 760px wide fills the rest; below `lg` the panel stacks under the card with a 24px gap (32px from `sm`). The panel follows the card's rules: framed from `sm` with 32px × 40px padding, full-bleed below it.

Lists are rows divided by hairlines rather than separate boxes: progress rows are 44px, drawer summaries 56px. Tables are fixed-layout so long song titles truncate instead of pushing figures out of line; secondary columns hide below `sm`.

## Elevation & Depth

Depth is tonal first: the card is one step lighter than the ground and edged with a hairline. A single soft, low, diffuse drop shadow under the card and the preview panel adds lift on desktop. Inside them, depth is only tonal veils (white at 3–7%), never a second shadow. The faint blurple haze at the top of the viewport is atmosphere, not elevation.

### Shadow Vocabulary
- **Card lift** (`box-shadow: 0 24px 48px -12px rgb(0 0 0 / 0.6)`): the desktop card and preview panel only.

### Named Rules
**The One Lift Rule.** Only top-level containers cast a shadow; anything inside them separates by tone or hairline.

## Shapes

Softly rounded: the card and panel use a 14px radius; buttons, banners, drawer summaries, tiles and image wells 10px; difficulty chips, inline actions and skeleton bars 8px; inline command chips 4px. Borders are 1px hairlines. The shadcn base-lyra button primitive ships square corners and 12px text; maibot surfaces override it to the rounded forms below. maimai DX NET's own plates keep their native silhouettes.

## Components

### Buttons
- **Shape:** gently curved (10px). Full-width buttons are 48px tall with a 12px gap between icon and label.
- **Discord:** Discord Blurple fill, white 600-weight 16px label, Discord logo at 24×18 to the left. Pressed Blurple on hover, Deep Blurple while pressed; inherits the primitive's 1px press-down nudge.
- **Light action:** Light Action fill with dark ink, same 48px full-width form, for the main non-Discord action (Upload). Disabled turns to a 10% white veil with Quiet Grey text and a not-allowed cursor; busy keeps the fill and shows the progress cursor.
- **Secondary:** Discord Grey fill, white 14px 600-weight label, 40px tall with 16px side padding, 16px icon. For quiet actions (Sign out, Try again); never blurple.
- **Inline:** text-only, 32px tall, 8px radius, 16px icon, a 6% white veil on hover. Sits flush at a row's edge (Read again, Retry); Retry on a failed row takes the error text colour and a red veil.
- **Focus:** every button shows a 2px white ring at 80% opacity, offset 2px, with the offset colored to the surface beneath.
- **Pending:** the label states the action in progress ("Opening Discord…", "Checking…"), the icon swaps for a spinning Phosphor circle-notch (static under reduced motion), and repeat clicks are blocked.

### Cards / Containers
- **Corner Style:** 14px.
- **Background:** Raised Card on Discord Ground.
- **Shadow Strategy:** card lift (see Elevation & Depth), desktop only.
- **Border:** 1px Hairline.
- **Internal Padding:** 40px on the card, 32px × 40px on the preview panel; frame removed below `sm`.
- **Loading:** a skeleton of the same footprint in veiled bars (5–7% white, pulsing only when motion is allowed), replaced by the content with the 200ms swap fade.

### Status Banner
- **Style:** inline block, 10px radius, 1px border at 30% of the tone, 10% tone fill, 12px × 16px padding, 14px relaxed text. Error and warning are announced with `role="alert"`, success with `role="status"`.
- **Tones:** error (Alarm Red, warning-circle icon), warning (Amber, link-break icon), success (Discord Green, filled check-circle icon).
- **Icon:** Phosphor, 20px, top-aligned with the first line.
- **Copy:** says what happened, then the next step.

### Progress List
- **Style:** hairline-divided rows, 44px tall, 14px text: a 20px state icon, the item name, and its count or note right-aligned in tabular Quiet Grey.
- **States:** waiting (dashed circle at 60% grey, name in Quiet Grey), loading (spinning circle-notch), done (filled Discord Green check), failed (filled Alarm Red cross plus an inline Retry).

### Drawers
- **Style:** native disclosure rows, 56px summary, hairline below each, title in Label weight on the left, meta count in Quiet Grey, a 16px caret that turns 180° over 200ms when open (instant under reduced motion).
- **Hover / Focus:** 3% white veil on hover; the standard white focus ring.

### Player Data
- **Difficulty chip:** 24px tall, 8px radius, solid maimai difficulty colour with its paired ink, bold caption text: level plus a 75%-opacity DX / STD tag.
- **Recent-play rows:** each row tinted with its difficulty colour at 18%, rounded 8px at the row's ends, separated by 4px gaps.
- **Credit tile:** 10px radius, 16px padding, difficulty tint at 14% with a 45% border; achievement in the Stat style, judgements in a compact table whose column headers take the judgement's colour.
- **Profile plates:** maimai DX NET's own rating plate, class and course badges, title plate and overview icons, loaded straight from DX NET; the name plate is a 48px Light Action bar.

## Do's and Don'ts

### Do:
- **Do** set dark surfaces on Discord Ground with one Raised Card and a Hairline border.
- **Do** keep blurple fill for the Discord action, with hover and active steps from the palette.
- **Do** use the Light Action button for a surface's main non-Discord action, and Discord Grey for quiet actions.
- **Do** put status in a tinted inline banner with a Phosphor icon and recovery copy.
- **Do** set bot commands in JetBrains Mono inside a small tinted chip.
- **Do** use tabular figures for every number a player compares.
- **Do** use the single fade-and-rise entrance (8px, 500ms, ease-out), a 200ms fade for content swapped in after loading, and turn both off for reduced motion.
- **Do** drop the card and panel frames below 640px and let content sit full-bleed.

### Don't:
- **Don't** use shadcn's stock neutral dark greys on a maibot surface; use the Discord darks.
- **Don't** spend blurple on headings, links, borders, or secondary buttons.
- **Don't** use an official SEGA / maimai look for the site's own chrome (shell, cards, buttons, banners). The exception is player data on the upload preview (`/update-data`), which may use maimai DX NET's own images: rating plate, class and course badges, title plate, overview icons, and maimai's difficulty colours as row and tile tints.
