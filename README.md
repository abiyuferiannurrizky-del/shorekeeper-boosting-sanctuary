# Shorekeeper Boosting Sanctuary

# BONGJOKI — PREMIUM GAME BOOSTING PLATFORM

Build a complete, premium, modern gaming boosting service website called BONGJOKI.

This is not a generic gaming website. The website must have a distinctive visual identity inspired by the Black Shores faction and Shorekeeper character from Wuthering Waves.

The overall experience should feel like an elegant futuristic interface from the Black Shores universe: mysterious, atmospheric, sophisticated, ethereal, and technologically advanced.

IMPORTANT: Prioritize exceptional visual quality, consistent design, functional navigation, reusable components, and clean architecture.

---

# 1. BRAND IDENTITY & ART DIRECTION

Brand name: BONGJOKI

Brand category: Gaming Boosting Service.

Primary visual inspiration:
- Black Shores from Wuthering Waves.
- Shorekeeper as the main visual character.
- Futuristic oceanic atmosphere.
- Ethereal blue butterflies and flowers.
- Celestial and constellation elements.
- Elegant science-fiction interfaces.

COLOR PALETTE:

Primary background:
- Deep navy: #080E1A
- Midnight blue: #0D1628
- Dark blue: #121F35

Secondary colors:
- Ice blue: #8BCDF5
- Pale cyan: #B7E8FF
- Lavender: #B7B9E8
- Silver white: #E7EDF5

Accent colors:
- Glowing cyan: #6CCFFF
- Soft blue: #4B91C8

Avoid:
- Bright gaming RGB colors.
- Excessive neon effects.
- Generic esports design.
- Excessive purple gradients.
- Oversized rounded cards everywhere.

DESIGN LANGUAGE:

Use:
- Premium dark glassmorphism.
- Thin silver borders.
- Subtle blue illumination.
- Elegant serif headings combined with modern sans-serif body typography.
- Delicate ornamental lines.
- Butterfly and celestial motifs.
- Subtle background particles.
- Soft atmospheric gradients.
- Refined hover and transition animations.

The design should look expensive, polished, and carefully art-directed.

SHOREKEEPER ARTWORK:

Use Shorekeeper as the primary character artwork.

Place her prominently in the homepage hero section and as a visual element in the streaming overlay.

Prefer a high-quality transparent PNG or WebP character asset.

Keep the character visually separated from interface elements.

Do not distort, stretch, or crop the character unnaturally.

If no artwork asset is available, create a visually appropriate placeholder that can easily be replaced with an uploaded Shorekeeper image.

Use artwork as a separate layer rather than embedding text or queue information into the image.

---

# 2. WEBSITE ARCHITECTURE

Create these pages:

1. /
   Homepage.

2. /queue
   Public live queue.

3. /admin
   Admin dashboard.

4. /overlay
   OBS streaming overlay.

5. /history
   Completed order history.

6. /services
   Available boosting services.

Create consistent navigation and reusable components.

---

# 3. HOMEPAGE

Create an immersive landing page.

HERO SECTION:

- BONGJOKI logo and branding.
- Large Shorekeeper artwork positioned on the right.
- Elegant headline:

  "YOUR JOURNEY, OUR RESONANCE."

- Supporting text:

  "Premium Gaming Boosting Service."

- Primary button: VIEW QUEUE.
- Secondary button: EXPLORE SERVICES.

BACKGROUND:

- Deep navy atmospheric background.
- Subtle oceanic light effects.
- Floating blue particles.
- Delicate butterfly elements.
- Subtle animated light waves.

NAVIGATION:

- Home
- Services
- Queue
- History
- Discord

Include a small LIVE QUEUE indicator showing the current number of active orders.

SERVICES SECTION:

Display available game categories:

- Mobile Legends
- Other Games

Use premium service cards with subtle artwork and elegant hover effects.

QUEUE PREVIEW:

Display the first three active queue entries.

Include a button linking to the full queue page.

FOOTER:

- BONGJOKI branding.
- Discord community link placeholder.
- Service information.
- Copyright information.

---

# 4. PUBLIC QUEUE PAGE

This is one of the most important features of the platform.

Create a dedicated live queue management display.

PAGE HEADER:

- Title: LIVE QUEUE
- Subtitle: "Track the progress of your order in real time."
- Live connection indicator.
- Last updated information.

QUEUE STATISTICS:

Display:
- Total active queues.
- Currently processing.
- Waiting orders.
- Completed today.

QUEUE TABLE:

Columns:
- Queue Number.
- Customer Name.
- Discord Username.
- Service.
- Queue Status.

QUEUE STATUS DESIGN:

WAITING:
Neutral blue-gray styling.

PROCESSING:
Glowing cyan styling.

DONE:
Soft green styling.

FUNCTIONAL REQUIREMENTS:

- Automatically sort active queues.
- Processing orders should be clearly distinguished.
- Completed orders should not appear in the active queue.
- Show a friendly empty state when no orders are active.
- Add subtle animations when queue entries change.
- Make the layout responsive.

Prepare the interface for future Supabase Realtime integration.

---

# 5. ADMIN DASHBOARD

Create a dedicated administrative interface.

The admin dashboard must prioritize usability and operational efficiency over decorative elements.

SIDEBAR:

- Overview.
- Queue Management.
- Order History.
- Import / Export.
- Settings.

OVERVIEW:

Display:
- Total orders.
- Active orders.
- Processing orders.
- Completed orders.
- Recent activity.

QUEUE MANAGEMENT:

Provide:
- Add queue.
- Edit queue.
- Remove queue.
- Mark as processing.
- Mark as completed.
- Search by customer name.
- Filter by status.
- Sort by queue number.

ADD QUEUE FORM:

Fields:
- Customer name.
- Discord username.
- Discord User ID.
- Game.
- Service details.
- Notes.

QUEUE DATA STRUCTURE:

- id
- queue_number
- customer_name
- discord_username
- discord_id
- game
- service
- status
- created_at
- completed_at

Use confirmation dialogs for destructive operations.

ADMIN SECURITY:

Prepare the application for Supabase authentication.

Only authorized administrators should be able to access management functions.

Do not expose administrative functions on public pages.

---

# 6. STREAMING OVERLAY — OBS

This feature is extremely important.

Create a dedicated route:

/overlay

This route is designed specifically for OBS Studio Browser Source.

The overlay must be visually consistent with the Black Shores theme.

OVERLAY DESIGN:

- Transparent background.
- No website navigation.
- No unnecessary page elements.
- No visible scrollbars.
- Compact, readable layout.
- Shorekeeper artwork positioned on the right.
- Queue panel positioned on the left.
- Elegant Black Shores visual decorations.
- Subtle cyan illumination.

OVERLAY CONTENT:

Header:
BONGJOKI
BLACK SHORES QUEUE SYSTEM
LIVE STATUS

Queue entries:
- Queue number.
- Customer name.
- Discord username.
- Current status.

Display only the first five active queue entries.

Include a small summary:
- Active orders.
- Processing orders.
- Completed today.

TECHNICAL REQUIREMENTS:

- Default canvas size: 1920 x 1080.
- Support smaller resolutions.
- Transparent body and root backgrounds.
- No margins or padding around the overall overlay canvas unless needed for layout.
- Use CSS variables to allow customization.
- Avoid animations that consume excessive resources.
- Add subtle entry and exit transitions for queue changes.

Create a separate overlay layout that does not depend on the homepage styling.

The overlay must be usable directly as an OBS Browser Source URL.

IMPORTANT:
The overlay must eventually receive queue data from the same database as the public website and admin dashboard.

Do not use a screenshot or static image as the actual overlay interface.

---

# 7. IMPORT & EXPORT SYSTEM

Prepare an administration page for spreadsheet management.

IMPORT:

- Support CSV and Excel files.
- Preview rows before importing.
- Validate required fields.
- Detect duplicate entries.
- Show clear error messages.
- Allow administrators to confirm import.

EXPORT:

- Export active queue.
- Export completed orders.
- Export all queue records.
- Support CSV and XLSX.

Use the same database structure as the queue management system.

---

# 8. DISCORD BOT INTEGRATION PREPARATION

The platform will eventually connect to a Discord bot.

Prepare the backend architecture for these slash commands:

/add
Parameters:
- nama_joki
- tag_nama (Discord User)

/done
Parameters:
- nama_joki
- tag_nama (Discord User)

/queue

/remove

/edit

/export

EXPECTED BEHAVIOR:

When an administrator executes /add:
- Create a new queue record.
- Assign a queue number.
- Store the Discord User ID.
- Update the database.
- Automatically update the public website and OBS overlay.

When an administrator executes /done:
- Validate the customer identity.
- Mark the matching order as completed.
- Record completion time.
- Remove the entry from active queues.
- Update the website and OBS overlay.

Only authorized Discord administrators can execute management commands.

Do not put Discord bot tokens in frontend code.

Do not implement fake Discord connectivity.

The actual bot will be developed and connected in a separate implementation phase.

---

# 9. DATABASE & TECHNICAL ARCHITECTURE

Technology preferences:

- React.
- TypeScript.
- Tailwind CSS.
- Supabase PostgreSQL.
- Supabase Realtime.
- Supabase Authentication.
- Edge Functions or secure server-side API for protected operations.

Create reusable components.

Keep frontend and backend responsibilities separate.

Use proper loading states, error states, empty states, and success notifications.

Prepare database integration without pretending that mock data is live database data.

SECURITY:

- Never expose Supabase service role keys.
- Protect administrative routes.
- Validate all sensitive operations server-side.
- Use Row Level Security.
- Public users should only be able to read permitted queue information.
- Only authorized administrators can modify queue data.

---

# 10. RESPONSIVE DESIGN

Desktop:
- Full immersive experience.
- Wide layout.
- Large Shorekeeper artwork.

Tablet:
- Adapted two-column layout.

Mobile:
- Compact navigation.
- Vertical content arrangement.
- Readable queue cards.
- Properly scaled artwork.

The OBS overlay should remain independently configurable.

---

# 11. DEVELOPMENT INSTRUCTIONS

Build the project in phases.

PHASE 1:
Create the complete visual frontend, navigation, responsive layouts, homepage, public queue, admin dashboard, history page, services page, and OBS overlay.

PHASE 2:
Connect Supabase database and authentication.

PHASE 3:
Implement real-time queue updates.

PHASE 4:
Implement secure Discord bot integration.

PHASE 5:
Implement spreadsheet import and export.

PHASE 6:
Testing, security validation, and deployment.

For the initial generation, focus on PHASE 1.

Use realistic sample data only for visual prototyping.

Keep the code modular and easy to maintain.

Do not sacrifice functional usability for visual effects.

The final result should feel like a premium official Black Shores-inspired gaming service platform, with Shorekeeper as its visual identity.

BONGJOKI should look unique, elegant, immersive, and professional.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3472ca18-ec2a-480e-b1cb-e6db23cd02ae).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
