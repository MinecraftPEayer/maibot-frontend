---
version: 1
slug: "src-app-auth-login-page-tsx"
primary_target: "src/app/auth/login/page.tsx"
related_targets: []
---

# /auth/login

Mode: Operate. Visitor: a player who already uses the maibot bot and wants to sign in. One action: Login with Discord. States: OAuth failed or cancelled (callback returns with `?error=`), and signed in but no maimai account linked yet (`?error=not_linked`), which points them to `/link` in Discord.

User chose the category standard (canon) with Discord's own login page as the craft bar. Avoid: template look, decoration, an official SEGA look.

## Direction contract

THESIS: The standard sign-in card, built to the finish of Discord's own login screen. It refuses dashboard-template filler: no placeholder logo tile, no legal small print, no feature list.

OWN-WORLD: Discord's dark surfaces. Page ground near-black with a faint blurple haze at the top; one raised card in a slightly lighter neutral with a hairline border; Google Sans Flex (Noto Sans TC for CJK); Discord blurple #5865F2 only on the button; status messages in a tinted inline banner (red for errors, amber for not linked).

STORY: The player sees the maibot name, one line on what's inside (scores, rating, B50), and one button. After a failed or unlinked sign-in, the card tells them what happened and what to do next.

FIRST VIEWPORT: A 420px card centred on the screen. Wordmark "maibot", heading "Sign in", one supporting line, then a full-width 48px blurple button with the Discord logo. A status banner, when there is one, sits between the copy and the button. A single quiet helper line sits under the button.

FORM: canon (the category standard), Discord login as the bar. seed:bd09511cddb6e7da

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
