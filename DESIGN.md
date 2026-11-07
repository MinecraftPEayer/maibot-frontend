---
name: maibot
description: Web companion to the maibot Discord bot, set in Discord's own cool dark surfaces.
colors:
  discord-blurple: "#5865F2"
  discord-blurple-hover: "#4752C4"
  discord-blurple-active: "#3C45A5"
  ground: "#1e1f22"
  card: "#2b2d31"
  hairline: "#3f4147"
  foreground: "oklch(0.985 0 0)"
  muted-foreground: "#b5bac1"
  destructive: "oklch(0.704 0.191 22.216)"
  error-text: "oklch(0.885 0.062 18.334)"
  warning: "oklch(0.828 0.189 84.429)"
  warning-text: "oklch(0.962 0.059 95.617)"
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
  mono:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.9em"
    fontWeight: 400
rounded:
  sm: "4px"
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
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: "40px"
    width: "420px"
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
  inline-command:
    typography: "{typography.mono}"
    rounded: "{rounded.sm}"
    padding: "2px 6px"
---

# Design System: maibot

## Overview

**Creative North Star: "Discord's Own Room"**

maibot lives inside the player's Discord habit, so the web side borrows Discord's own dark surfaces rather than shadcn's neutral greys: a near-black, faintly blue ground, one slightly lighter raised card, hairline borders, and Discord's blurple held back for the single action that leaves for Discord. The bar is the finish of Discord's own login screen, not a dashboard template.

Density is low and the voice is quiet. A surface shows a small wordmark, a direct heading, one supporting line, and the action. Status is spoken in tinted inline banners that say what happened and what to do next. Copy is English, sentence case.

Motion is a single entrance: the main container fades in and rises 8px over 500ms with ease-out, and does nothing when reduced motion is requested.

**Key Characteristics:**
- Cool Discord darks (blue-tinted near-black ground, lighter card, hairline border).
- Blurple reserved for the Discord action; elsewhere only as faint atmosphere.
- One raised card on desktop that dissolves to full-bleed content on small screens.
- Tinted inline status banners with a Phosphor icon and recovery copy.
- One entrance motion, reduced-motion safe.

## Colors

A cool, low-chroma dark neutral family carrying a single saturated brand blue.

### Primary
- **Discord Blurple** (`discord-blurple`): the fill of the Login with Discord button, required by Discord's brand rules. Darkens to **Pressed Blurple** (`discord-blurple-hover`) on hover and **Deep Blurple** (`discord-blurple-active`) while pressed.

### Neutral
- **Discord Ground** (`ground`): page background; the near-black, faintly blue base of every surface.
- **Raised Card** (`card`): the one lifted container on desktop.
- **Hairline** (`hairline`): 1px borders on the card.
- **Near White** (`foreground`): headings, wordmark, primary text.
- **Quiet Grey** (`muted-foreground`): supporting lines and helper copy.

### Status
- **Alarm Red** (`destructive`, text in `error-text`): error banners, as a 10% fill and 30% border with light red text.
- **Amber** (`warning`, text in `warning-text`): warning banners, as a 10% fill and 30% border with pale amber text. The inline command chip inside a warning banner uses a 15% amber fill.

### Named Rules
**The One Blurple Rule.** Blurple at full strength fills only the Discord action. Elsewhere it appears only as atmosphere: a radial haze at 14% opacity across the top 28rem of the viewport, and text selection at 40%.

**The Discord Darks Rule.** Dark surfaces use the cool Discord values (ground, card, hairline, quiet grey), never shadcn's stock neutral dark greys. The overrides go on an inner wrapper inside the `.dark` element, because the unlayered `.dark` rule beats utilities placed on the same element.

## Typography

**Body Font:** Google Sans Flex (with Noto Sans TC for CJK, then sans-serif)
**Mono Font:** JetBrains Mono

**Character:** A friendly, rounded geometric sans close to Discord's own voice; mono only for literal commands.

### Hierarchy
- **Headline** (700, 1.5rem, tight tracking, balanced wrap): the surface heading ("Sign in to maibot").
- **Title** (600, 1.125rem, tight tracking): the maibot wordmark in the header.
- **Body** (400, 1rem, relaxed 1.625 leading, pretty wrap): the supporting line under the heading, in Quiet Grey.
- **Body small** (400, 0.875rem, relaxed leading): banner text and helper lines.
- **Label** (600, 1rem): the primary button.
- **Mono** (0.9em relative to surrounding text): inline bot commands such as `/link`.

### Named Rules
**The Literal Command Rule.** A bot command the player must type is set in JetBrains Mono inside a small tinted chip; prose around it stays in the sans.

## Layout

Surfaces center a single column in the viewport, with the content block sitting slightly above center (extra 96px bottom padding on the main area). A plain header carries the wordmark at the top left (24px / 20px padding, growing to 40px / 28px from `sm`).

The main container is 420px wide at most. From the `sm` breakpoint (640px) it is a raised card with 40px padding. Below `sm` the card frame (border, fill, shadow, radius) drops away and content sits full-bleed on the ground with light padding (16px page gutter plus 8px).

Vertical rhythm inside the container: heading, 8px, supporting line, 24px, banner (when present), 32px, action, 16px, helper line.

## Elevation & Depth

Depth is tonal first: the card is one step lighter than the ground and edged with a hairline. A single soft, low, diffuse drop shadow under the card adds lift on desktop. The faint blurple haze at the top of the viewport is atmosphere, not elevation. Nothing else casts a shadow.

### Shadow Vocabulary
- **Card lift** (`box-shadow: 0 24px 48px -12px rgb(0 0 0 / 0.6)`): the desktop card only.

## Shapes

Softly rounded: the card uses a 14px radius, buttons and banners 10px, inline command chips 4px. Borders are 1px hairlines. The shadcn base-lyra button primitive ships square corners and 12px text; maibot surfaces override it to the rounded, 16px form below.

## Components

### Buttons
- **Shape:** gently curved (10px), 48px tall, full container width, 12px gap between icon and label.
- **Primary (Discord):** Discord Blurple fill, white 600-weight 16px label, Discord logo at 24×18 to the left.
- **Hover / Active:** Pressed Blurple on hover, Deep Blurple while pressed; inherits the primitive's 1px press-down nudge.
- **Focus:** 2px white ring at 80% opacity, offset 2px, with the offset colored to the surface beneath.
- **Pending:** label becomes "Opening Discord…", the logo swaps for a spinning Phosphor circle-notch (static under reduced motion), and repeat clicks are blocked.

### Cards / Containers
- **Corner Style:** 14px.
- **Background:** Raised Card on Discord Ground.
- **Shadow Strategy:** card lift (see Elevation & Depth), desktop only.
- **Border:** 1px Hairline.
- **Internal Padding:** 40px; frame removed below `sm`.

### Status Banner
- **Style:** inline block, 10px radius, 1px border at 30% of the tone, 10% tone fill, 12px × 16px padding, 14px relaxed text, announced with `role="alert"`.
- **Tones:** error (Alarm Red, warning-circle icon) and warning (Amber, link-break icon).
- **Icon:** Phosphor, 20px, top-aligned with the first line.
- **Copy:** says what happened, then the next step.

## Do's and Don'ts

### Do:
- **Do** set dark surfaces on Discord Ground with one Raised Card and a Hairline border.
- **Do** keep blurple fill for the Discord action, with hover and active steps from the palette.
- **Do** put status in a tinted inline banner with a Phosphor icon and recovery copy.
- **Do** set bot commands in JetBrains Mono inside a small tinted chip.
- **Do** use the single fade-and-rise entrance (8px, 500ms, ease-out) and turn it off for reduced motion.
- **Do** drop the card frame below 640px and let content sit full-bleed.

### Don't:
- **Don't** use shadcn's stock neutral dark greys on a maibot surface; use the Discord darks.
- **Don't** spend blurple on headings, links, borders, or secondary buttons.
- **Don't** use an official SEGA / maimai look.
