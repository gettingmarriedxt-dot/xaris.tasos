# Xaris & Tasos — Wedding Website

A production-quality wedding microsite. Built with plain HTML, CSS, and JavaScript — no installation required to view. Deployed via Netlify in minutes.

---

## Quick Start (local preview)

1. Open the folder in Windows Explorer
2. Double-click `index.html`
3. It opens in your browser — done

No server, no Node, no installation needed.

---

## Files

```
/
├── index.html          ← main page (all sections)
├── styles.css          ← all visual design
├── script.js           ← interactions, rendering, RSVP
├── config.js           ← ALL wedding content (edit this)
├── supabase-schema.sql ← run once in Supabase
└── images/             ← put your photos here
```

---

## What to update in config.js

Open `config.js` — it is the single source of truth for everything on the website.

### 1 — Names

```js
couple: {
  partner1:  "Xaris",
  partner2:  "Tasos",
  fullNames: "Xaris & Tasos",
  introduction: "..."   // short intro text
}
```

### 2 — Wedding date

```js
date: {
  iso:         "2027-06-14T17:00:00+03:00",  // Athens summer = +03:00, winter = +02:00
  display:     "14 June 2027",
  displayLong: "Sunday, 14 June 2027"
}
```

### 3 — RSVP deadline

```js
rsvpDeadline: { display: "1 May 2027" }
```

### 4 — Venues

```js
events: [
  {
    venue:   "Name of Your Ceremony Venue",
    address: "Full Address, Athens, Greece",
    mapUrl:  "https://www.google.com/maps/place/YOUR+VENUE"
    // Get the link from maps.google.com → search your venue → copy URL
  }
]
```

### 5 — Your photos

1. Add photos to the `/images/` folder
2. Update paths in `config.js`:

```js
hero:    { image: "images/hero.jpg" },
story:   [ { image: "images/story-01.jpg" }, ... ],
gallery: [ { src: "images/gallery-01.jpg", size: "large", alt: "..." }, ... ]
// size: "large" (2×2 grid span) | "medium" (tall) | "small" (normal)
```

### 6 — Story text, FAQ, travel, accommodation, dress code

All in `config.js`. Set `enabled: false` on any section to hide it.

### 7 — Contact email

```js
contact: { email: "hello@yourdomain.com" }
```

---

## Supabase RSVP Setup

The form works in demo mode by default (no data saved). To save real RSVPs:

1. Go to [supabase.com](https://supabase.com) — create a free account
2. **New Project** → choose Frankfurt region (closest to Greece)
3. **SQL Editor** → paste `supabase-schema.sql` → Run
4. **Project Settings → API** → copy **Project URL** and **anon / public** key
5. Update `config.js`:

```js
supabase: {
  url:     "https://xxxx.supabase.co",
  anonKey: "eyJ..."   // anon key only — never the service_role key
}
```

**View responses:** Supabase dashboard → Table Editor → rsvps → Export CSV

---

## Deployment (Netlify)

**Simplest:** Go to [app.netlify.com](https://app.netlify.com), sign up free, drag your project folder onto the dashboard. Done — live in 60 seconds.

**With Git:** Push to a private GitHub repo → Netlify → Import from Git → auto-deploys on every update.

**Custom domain:** Buy `xarisandtasos.com` or `.wedding` (~€10/year), add it in Netlify → Domain Management → HTTPS is automatic.

---

## Checklist before going live

- [ ] Names updated in `config.js`
- [ ] Wedding date updated (with correct `+03:00` or `+02:00` offset)
- [ ] Venue names, addresses, and Google Maps links updated
- [ ] Real photos added to `/images/` and paths updated in `config.js`
- [ ] Story text updated (three chapters)
- [ ] Contact email updated
- [ ] Supabase connected and RSVP tested
- [ ] Tested on mobile phone

---

<!-- Original brief preserved below for reference -->
# WEDDING WEBSITE — FULL BUILD BRIEF

## 1. Mission

Build a complete, production-quality wedding microsite for a real couple.

The goal is **not** to make another mockup or starter template. The goal is to build the actual wedding website, with a polished visual experience, real RSVP functionality, real deployment readiness, and an easy workflow for replacing all wedding-specific content.

The website should be inspired by the overall experience and visual feel of the supplied reference website, but **must not be a pixel-perfect copy or reproduction**.

The final result should feel like a premium editorial wedding website: elegant, minimal, romantic, photographic, highly polished, mobile-first, and intentionally designed.

---

# 2. Reference website

Original reference:

https://myikona-events.gr/event/326/OTNZ/93bd7445

The user supplied a screen recording of the reference website in this conversation:

`/mnt/data/1000005082.mp4`

IMPORTANT: The video is the visual reference. Inspect it carefully.

The reference site appears to be a mobile-first wedding/event microsite with:

* Large editorial wedding photography
* Elegant serif typography
* Warm cream / beige / brown visual language
* Lots of whitespace
* Large couple names
* Event information
* Ceremony/reception details
* Storytelling sections
* Photo gallery
* RSVP functionality
* Maps/location information
* Event cards
* Subtle decorative elements
* Vertical storytelling / scrolling experience
* Sophisticated but restrained animation
* Strong photography-led design

Use the reference to understand the **UX, emotional tone, pacing, and quality bar**.

Do NOT reproduce the exact layout, typography, wording, graphics, decorative shapes, or pixel-level styling.

Create an original visual system.

---

# 3. Copyright/design requirement

This is important.

The user initially wanted something "basically indistinguishable" from the reference, but then specifically raised copyright concerns.

Therefore:

### DO:

* Take inspiration from the general concept
* Use similar UX patterns where appropriate
* Use a premium wedding/editorial aesthetic
* Use large photography
* Use serif + sans typography
* Use elegant event cards
* Use scrolling storytelling
* Use RSVP, gallery, map and calendar functionality
* Create an original visual identity

### DON'T:

* Pixel-copy the reference
* Copy its exact typography
* Copy exact decorative illustrations
* Copy its exact layout section-by-section
* Copy its copy/text
* Copy logos or branding
* Copy proprietary assets
* Reproduce the site's exact CSS/HTML
* Make a clone that could reasonably be mistaken for the original service

The result should clearly be an **original wedding website inspired by the category and mood**.

---

# 4. Existing starter

A starter website has already been created during the conversation.

A ZIP exists at:

`/mnt/data/full-wedding-website.zip`

It contains:

```text
full-wedding-website/
├── index.html
├── styles.css
├── script.js
├── config.js
├── supabase-schema.sql
└── README.md
```

There is also an earlier starter ZIP:

`/mnt/data/wedding-microsite-starter.zip`

The latest ZIP is the more relevant one.

However, **do not treat the existing starter as the final product**.

Use it as scaffolding/reference if useful, but improve/rearchitect/rebuild it as needed.

---

# 5. Current technical approach

The existing starter is deliberately simple:

* HTML
* CSS
* JavaScript
* No React required
* No Node.js required
* No npm required
* Browser-native JavaScript

This was intentional because the user asked how JavaScript can run without installing it.

A normal browser already contains a JavaScript engine.

However, for the final production website, you are free to use a more sophisticated stack if it materially improves the result.

If you choose React/Next.js/Vite/etc., set everything up so the user can run it easily.

Do not introduce complexity merely for the sake of complexity.

---

# 6. User's technical understanding

The user is not necessarily a web developer.

They asked why JavaScript can run without downloading JavaScript when Python requires Python to be installed.

We explained:

* Python requires a Python runtime/interpreter.
* Browsers already contain JavaScript engines.
* Chrome uses V8.
* Firefox uses SpiderMonkey.
* Safari uses JavaScriptCore.
* Therefore normal browser JavaScript does not require a separate JavaScript installation.

The user wants to build the site with agents and is comfortable following setup instructions, but the final project should be as easy as reasonably possible to run/deploy.

---

# 7. Core website requirements

Build these sections/features.

## HERO

Large full-screen/near-full-screen wedding image.

Display:

* Couple names
* Wedding date
* Short "We're getting married" style introduction
* RSVP CTA
* Elegant navigation
* Subtle scroll cue

The hero should feel cinematic and premium.

---

# 8. Couple section

Show the couple prominently.

Include:

* Names
* Optional short introduction
* Wedding date
* Short emotional statement

Potentially include an editorial portrait.

The design should avoid generic "template wedding website" aesthetics.

---

# 9. Countdown

Live countdown to the wedding.

Display:

* Days
* Hours
* Minutes
* Seconds

Requirements:

* Correct timezone handling
* Automatically updates
* Handles wedding date passing gracefully
* Good mobile presentation
* Accessible

Wedding date is currently a placeholder and MUST be made configurable.

---

# 10. Our story

Create a visually interesting story/timeline section.

Potential structure:

1. How we met
2. Important milestone / proposal
3. Now / getting married

The actual copy should be configurable.

Use photography and editorial typography.

Avoid making the section look like a generic vertical Bootstrap timeline.

---

# 11. Wedding events

At minimum:

## Ceremony

Show:

* Venue
* Date
* Time
* Address
* Google Maps button
* Add-to-calendar button

## Reception

Show:

* Venue
* Date
* Time
* Address
* Google Maps button
* Add-to-calendar button

## Optional additional event

Potential example:

* Welcome drinks
* Pool party
* Brunch
* After party
* Next-day gathering

The architecture should allow arbitrary events to be added/removed.

Ideally, events should come from configuration/data rather than requiring HTML duplication.

---

# 12. Maps

Each venue should have:

* Address
* "Open map" CTA

Prefer Google Maps URLs or configurable map URLs.

Do not hardcode a specific venue until the user provides the actual venue.

---

# 13. Calendar integration

Allow guests to add events to Google Calendar.

Potentially support:

* Ceremony
* Reception
* Other events

Calendar data should include:

* Event name
* Start/end time
* Venue
* Address
* Description

Use correct timezone handling.

If practical, also offer an `.ics` download.

---

# 14. Gallery

This is a major part of the website.

Requirements:

* Beautiful responsive masonry/editorial gallery
* Multiple aspect ratios
* High-quality images
* Lazy loading
* Fullscreen lightbox
* Keyboard support
* Close button
* Escape-to-close
* Previous/next navigation
* Mobile swipe if practical
* Good image loading performance

Images should be configurable.

The current starter uses Unsplash placeholders.

Those are temporary only.

The final site should make it easy to replace them with the couple's actual images.

---

# 15. RSVP

This must eventually be a REAL RSVP system.

Required fields:

* Full name
* Email
* Attending / not attending
* Number of guests
* Dietary requirements
* Optional message

Potential future fields:

* Guest names
* Meal choice
* Accommodation needed
* Transport needed
* Song request

Build the architecture so these can be added easily.

---

# 16. RSVP database

Supabase is the preferred simple backend unless there is a strong reason to use something else.

The existing starter includes:

`supabase-schema.sql`

Current schema concept:

```sql
create table if not exists public.rsvps (
  id bigint generated by default as identity primary key,
  name text not null,
  email text not null,
  attendance text not null check (attendance in ('yes','no')),
  guests integer not null default 1 check (guests between 1 and 6),
  dietary text,
  message text,
  created_at timestamptz not null default now()
);
```

Use Row Level Security.

Guests should be able to INSERT RSVPs.

Guests should NOT be able to publicly SELECT all RSVPs.

The couple/admin should be able to view/manage RSVP data securely.

Never expose a Supabase service-role key in browser code.

---

# 17. RSVP admin

Ideally build a simple admin workflow/dashboard.

Possible approaches:

### Option A

Use Supabase's dashboard as the admin interface.

### Option B

Build a protected `/admin` page.

If building an admin interface, it should support:

* RSVP list
* Attending count
* Declined count
* Total guests
* Dietary requirements
* Search
* Filtering
* Export CSV

Authentication must be implemented properly.

Do not create fake client-side password protection.

---

# 18. RSVP confirmation

After successful RSVP:

Show a polished confirmation state.

Example concept:

"Thank you — we've got your RSVP."

Do not expose raw database/API errors to guests.

Handle:

* Validation
* Network failure
* Duplicate submissions
* Loading state
* Success state
* Error state

---

# 19. Wedding configuration

Create a single clean configuration/data layer.

For example:

```js
const wedding = {
  couple: {
    groom: "...",
    bride: "..."
  },

  date: {
    iso: "...",
    display: "...",
    timezone: "Europe/Athens"
  },

  rsvpDeadline: "...",

  story: [
    {
      title: "...",
      text: "...",
      image: "..."
    }
  ],

  events: [
    {
      type: "Ceremony",
      title: "...",
      date: "...",
      start: "...",
      end: "...",
      venue: "...",
      address: "...",
      mapUrl: "..."
    }
  ],

  gallery: [
    "...",
    "..."
  ]
};
```

The exact implementation is up to the agent.

The critical requirement is that changing the wedding should NOT require hunting through 20 files.

---

# 20. Photo management

Make image replacement extremely easy.

Ideally:

```text
/public/images/
    hero.jpg
    story-01.jpg
    story-02.jpg
    gallery-01.jpg
    gallery-02.jpg
    ...
```

Then configuration references those local images.

Do not depend on Unsplash for the production version.

Optimize images appropriately.

Consider:

* WebP/AVIF
* responsive sizes
* lazy loading
* width/height attributes
* image compression

---

# 21. Design direction

The visual direction should be:

### Mood

* Elegant
* Romantic
* Mediterranean/editorial
* Warm
* Sophisticated
* Minimal
* Intimate
* Expensive-looking without being flashy

### Typography

Use a refined editorial serif for:

* Names
* Headlines
* Quotes

Use a clean sans-serif for:

* Navigation
* Labels
* Body copy
* Buttons
* Form fields

Do NOT use the exact typography treatment from the reference.

---

# 22. Color direction

Start around:

* Warm ivory
* Cream
* Soft beige
* Earthy brown
* Muted terracotta
* Dark charcoal

But create an original palette.

Make colors CSS variables/theme tokens.

Example:

```css
--background:
--surface:
--text:
--muted:
--accent:
--dark:
```

---

# 23. Animation

Animations should be subtle.

Possible:

* Hero entrance
* Image reveal
* Scroll-triggered fade/translate
* Gentle image zoom
* Button hover
* Gallery transitions
* Menu transitions

Avoid:

* excessive parallax
* gimmicky effects
* huge motion
* animations that hurt performance
* motion that causes accessibility problems

Respect:

```css
prefers-reduced-motion
```

---

# 24. Mobile-first

This is extremely important.

The reference experience is strongly mobile-oriented.

Design for:

* iPhone-sized screens
* Android phones
* small phones
* tablets
* desktop

Test approximately:

* 320px
* 375px
* 390px
* 430px
* 768px
* 1024px
* 1440px+

No horizontal scrolling.

Buttons should be thumb-friendly.

Typography must remain beautiful on small screens.

---

# 25. Navigation

Mobile:

* compact header
* hamburger/menu
* smooth scrolling
* menu closes after selection

Desktop:

* elegant minimal navigation

Potential anchors:

* Story
* Details
* Gallery
* RSVP

Could also include:

* Accommodation
* Travel
* FAQ

if required.

---

# 26. Additional useful sections

The agent should consider adding these if they improve the real wedding experience:

## Travel / Getting there

* Airport
* Parking
* Taxi
* Driving
* Public transport

## Accommodation

* Recommended hotels
* Links
* Booking info

## Dress code

Simple visual explanation.

## FAQ

Examples:

* Can I bring a plus one?
* Is there parking?
* What should I wear?
* Are children invited?
* What time should I arrive?

## Gift information

If the couple wants it.

## Contact

Optional wedding contact person.

These should be easy to enable/disable.

---

# 27. Performance

The site should feel fast despite being photography-heavy.

Requirements:

* Lazy-load below-the-fold images
* Preload hero image
* Optimize image dimensions
* Avoid massive JS bundles
* Avoid unnecessary libraries
* Avoid layout shift
* Good Lighthouse performance where practical

---

# 28. Accessibility

Implement:

* Semantic HTML
* Proper heading hierarchy
* Alt text
* Form labels
* Keyboard navigation
* Focus states
* Accessible dialogs/lightboxes
* `aria-expanded`
* `aria-label` where needed
* Reduced-motion support
* Sufficient contrast

---

# 29. SEO / sharing

Include:

* `<title>`
* meta description
* Open Graph title
* Open Graph description
* Open Graph image
* canonical URL if appropriate
* favicon
* social sharing preview

The title should use the couple's names.

Example:

`Alex & Sam — Wedding`

---

# 30. Deployment

The final project should be deployable easily.

Preferred:

* Vercel
* Netlify
* Cloudflare Pages

If using Next.js, configure it correctly.

If using a static app, make deployment extremely simple.

The final README should contain exact commands/clicks.

---

# 31. Domain

Eventually the site should support a custom domain such as:

```text
alexandsam.com
```

or:

```text
alexandsam.wedding
```

The agent should explain the simplest deployment/domain workflow.

---

# 32. Security

Important:

* Never expose Supabase service-role credentials
* Validate RSVP inputs
* Use RLS
* Protect admin functionality
* Don't put secrets in Git
* Don't trust client-side guest counts blindly
* Consider rate limiting / spam protection
* Consider honeypot/CAPTCHA if abuse becomes an issue

---

# 33. Content placeholders

Until the actual wedding details are provided, use obvious placeholders.

Do not accidentally present placeholder details as real.

Examples:

```text
COUPLE_NAME
WEDDING_DATE
CEREMONY_VENUE
RECEPTION_VENUE
ADDRESS
RSVP_DEADLINE
```

Avoid leaving fake "Example Street 12" content in a production-looking deployment.

---

# 34. What the agent should do autonomously

The user wants to use an agent because they want the site **actually built**, not just explained.

Therefore the agent should:

1. Inspect the supplied reference video.
2. Inspect the existing starter ZIP if useful.
3. Establish the visual design system.
4. Build/rebuild the frontend.
5. Set up the backend architecture.
6. Implement the RSVP flow.
7. Implement the gallery.
8. Implement calendar/maps.
9. Test responsive layouts.
10. Test forms.
11. Test accessibility.
12. Test deployment build.
13. Fix obvious bugs.
14. Produce a polished final project.
15. Give concise instructions for changing wedding data.
16. Give deployment instructions.

Do not stop after creating a rough scaffold.

---

# 35. Agent workflow

Recommended phases:

## Phase 1 — Reconnaissance

Inspect:

* supplied reference video
* existing starter
* project structure

Extract:

* visual rhythm
* section types
* typography hierarchy
* image ratios
* navigation behavior
* interaction patterns

Then deliberately design an original interpretation.

## Phase 2 — Architecture

Choose the simplest stack capable of producing the desired result.

Prefer:

* Next.js + TypeScript + Tailwind if a production app benefits from it

OR

* Vite + React if simpler

OR

* plain HTML/CSS/JS if that genuinely produces the best maintainable result.

Do not choose a framework merely because it is fashionable.

## Phase 3 — Frontend

Build all sections.

## Phase 4 — Backend

Connect Supabase.

## Phase 5 — Testing

Test:

* desktop
* mobile
* form submission
* invalid form
* successful RSVP
* failed RSVP
* gallery
* navigation
* calendar
* maps
* accessibility

## Phase 6 — Polish

Improve:

* typography
* spacing
* animation
* image cropping
* responsive behavior
* loading performance

## Phase 7 — Delivery

Provide:

* source code
* setup instructions
* environment variables
* Supabase instructions
* deployment instructions
* content editing instructions

---

# 36. Existing files

Latest starter:

`/mnt/data/full-wedding-website.zip`

Reference video:

`/mnt/data/1000005082.mp4`

Use these files if your environment allows access.

---

# 37. Current starter functionality

The existing starter already demonstrates:

* hero
* countdown
* story
* events
* gallery
* RSVP
* map links
* calendar links
* mobile menu
* Supabase-ready RSVP structure

It currently uses:

```text
index.html
styles.css
script.js
config.js
supabase-schema.sql
```

Its RSVP is currently either:

* localStorage demo mode, OR
* Supabase mode when configured

The agent should replace the demo architecture with the final production implementation where appropriate.

---

# 38. What "done" means

The project is NOT done if it only:

* renders a hero
* has placeholder buttons
* has fake RSVP functionality
* has no database
* is not responsive
* is merely a static screenshot
* requires manually editing many files
* contains obvious broken links
* has fake admin security
* has no deployment path

The project IS done when a couple can realistically:

1. Add their names.
2. Add their wedding date.
3. Add their venues.
4. Add their photos.
5. Configure RSVP deadline.
6. Connect Supabase.
7. Deploy the site.
8. Send the URL to guests.
9. Receive/manage RSVPs.

---

# 39. Important UX principle

This should feel like a **real wedding invitation on the web**, not a SaaS dashboard.

Avoid:

* cards everywhere
* excessive borders
* generic Tailwind-looking UI
* giant UI button collections
* default gradients
* stock-template appearance
* excessive icons
* corporate language

Think:

**editorial magazine + luxury invitation + modern photography portfolio**

rather than:

**web app + form builder**

---

# 40. Final instruction to the agent

Take ownership of the implementation.

Do not merely tell me how I could build this.

Actually build it.

Use the supplied reference video to understand the visual target, while deliberately creating an original design that does not copy the reference website.

Use the existing starter as a starting point only if it helps.

Prioritize:

1. Visual quality
2. Mobile experience
3. Real RSVP functionality
4. Easy content management
5. Performance
6. Accessibility
7. Deployment simplicity

When finished, give me:

* the completed project
* exact setup instructions
* exact Supabase setup instructions
* exact deployment instructions
* a concise list of what I need to replace with the real couple's content

Do not assume placeholder names, dates, venues, or photographs are the final wedding information.
