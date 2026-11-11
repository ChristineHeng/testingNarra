# Asia page context

These page names have a specific meaning when discussing the Narra Asia view:

- **Landing page**: `html_asia/index.html`
- **Event listing**: any `html_asia/el-*.html` page
- **SEV**: an event-listing page with its `.sev_popup` visible. The event listing remains underneath the popup.

This terminology applies only to the Asia view.

## AI Playbook navigation

The AI Playbook remembers the page where it was opened and uses browser history for Back navigation:

```text
Landing page -> AI Playbook leaderboard -> strategy details -> leaderboard -> landing page
Event listing -> AI Playbook leaderboard -> strategy details -> leaderboard -> same event listing
SEV -> AI Playbook leaderboard -> strategy details -> leaderboard -> same event listing with the same SEV open
```
