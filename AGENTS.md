<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- Queue data goes through `src/lib/queue/store.ts` (`useQueue`, `queueActions`, one realtime subscription in __root). Why: pages, admin and overlay share one source.
- Public views read `queue_public` (RLS: active orders + every finished order, no time window) (trigger-synced mirror without discord_id/notes); admin reads/writes `queue_entries`, RLS allows admins only. Why: never expose private fields publicly, realtime only on the safe table.
- Admin role lives in `user_roles`; first signed-in user can claim it via `claim_first_admin()` while no admin exists. Why: bootstrap without hand-editing data.
- Queue rules (sorting, stats, numbering, import validation) live in pure functions in `src/lib/queue/logic.ts` / `csv.ts` with tests in `src/test/`. Why: reusable server-side for the Discord bot.
- `/overlay` uses its own stylesheet (`src/components/overlay/overlay.css`, `--ov-*` vars) and `html.overlay-mode` for a transparent page. Why: OBS browser source must not inherit site styling.
- Discord bot tokens and admin writes stay server-side only. Why: security requirement.
