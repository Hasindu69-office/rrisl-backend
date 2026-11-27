# Adaptive Research — content update scripts

These scripts update the English Strapi single type  
`api::adaptive-research-department.adaptive-research-department`.

They use whatever database the current Strapi `.env` points to (localhost or Coolify).

## Preconditions

1. Create the EN **Adaptive Research Department** entry once in Strapi Admin (hero stub is enough) if it does not exist. Prefer slug `adaptive-research-department` (or `adaptive-research`).
2. Enable Public role **find** for this content type (Settings → Users & Permissions → Public). Without it the frontend returns 404.
3. Stop any conflicting Strapi process if the script cannot bind/load the app (same pattern as Plant Science / RRCA / BAP / AEU / PPM / RTDD scripts).
4. Upload images and the overview video in CMS section by section after the text is written (scripts preserve existing media when present).
5. Avoid saving Achievements / Publications components with empty required fields (e.g. blank `sectiontitle`) — that blocks later script publishes.
6. Scripts omit empty optional strings (`researchteam`, `description`, `closingparagraph`) instead of sending `null` (Coolify Yup validation).

## Run order

From `rrisl-backend`:

```bash
npm run update-aru-overview
npm run update-aru-staff
npm run update-aru-research-highlights
npm run update-aru-current-research-projects
npm run update-aru-services
npm run update-aru-achievements
npm run update-aru-publications
npm run update-aru-recommendations
```

## Coolify

1. Deploy / sync this backend code to the Coolify Strapi service (include `_publications-data.js`).
2. Open the backend container terminal (`docker exec` / Coolify terminal).
3. `cd` to the app root (where `package.json` lives).
4. Ensure the EN department document exists and Public `find` is enabled on the server.
5. Run the same `npm run update-aru-*` commands in the order above.

Recommendations are hidden (`recommendationsectionpresent: false`) because the source pack has no recommendation content. Achievements include Awards only. Staff includes Technical Officers and Management Assistants groups.
