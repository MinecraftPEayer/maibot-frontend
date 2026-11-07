# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

maimai DX players who already use the maibot Discord bot. They sign in with their Discord account to see their own scores on the web instead of through bot commands.

## Product Purpose

maibot-frontend is the web companion to the maibot Discord bot. Its main job is to let a player view their scores, rating and Best 50 (B50) in a browser. Success means a player can sign in and reach their own score data quickly.

## Positioning

The site shows the same data the player's maibot account already holds. Identity is the player's Discord account, so there is no separate sign-up.

## Operating Context

- Players link their maimai account through the bot first (`/link`, bookmarklet). The website reads data the bot already stores.
- The bot's existing commands cover the same areas: `b50`, `rating`, `score`, `scores`, `recent`, `top`, `song`, `chart`, `course`, `graph`.

## Capabilities and Constraints

- Next.js 16 App Router on Vercel, pnpm, Tailwind v4, shadcn/ui.
- Sign-in is Discord OAuth only. Route `/auth/discord` starts the flow, `/auth/discord/callback` finishes it. Sessions are stored by the bot, and the browser never calls the bot directly.
- `/auth/login` has a single action: Login with Discord.
- UI copy is English.
- Undecided: what the site does beyond viewing scores (account settings, server admin).

## Brand Commitments

- Name: maibot.
- The Discord sign-in button uses Discord's blurple `#5865F2` and the Discord logo (`src/assets/discord-logo.svg`), following Discord's brand rules.

## Evidence on Hand

- Discord logo: `src/assets/discord-logo.svg`.
- No maibot logo, screenshots, user counts or testimonials exist yet. Do not invent them.

## Product Principles

- Discord is the identity. Never ask for anything the player's Discord account already answers.
- The player's own score data is the point. Every screen should get them to it with the fewest steps.
- Stay honest about what the bot knows. Don't show or claim data the bot does not hold.
