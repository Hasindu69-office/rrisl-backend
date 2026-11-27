# Biometry Section — content update scripts

These scripts update the English Strapi single type  
`api::biometry-section-department.biometry-section-department`.

They use whatever database the current Strapi `.env` points to (localhost or Coolify).

## Preconditions

1. Create the EN **Biometry Section** entry once in Strapi Admin (hero stub is enough) if it does not exist. Prefer slug `biometry-section-department` (or `biometry-section`).
2. Enable Public role **find** for this content type (Settings → Users & Permissions → Public). Without it the frontend returns 404.
3. Stop any conflicting Strapi process if the script cannot bind/load the app (same pattern as Plant Science / RRCA / BAP / AEU / PPM / RTDD / ARU scripts).
4. Upload images and the overview video in CMS section by section after the text is written (scripts preserve existing media when present).
5. Avoid saving Achievements / Publications components with empty required fields (e.g. blank `sectiontitle`) — that blocks later script publishes.
6. Scripts omit empty optional strings (`researchteam`, `description`, `closingparagraph`) instead of sending `null` (Coolify Yup validation).

## Run order

From `rrisl-backend`:

```bash
npm run update-bm-overview
npm run update-bm-staff
npm run update-bm-research-highlights
npm run update-bm-current-research-projects
npm run update-bm-services
npm run update-bm-achievements
npm run update-bm-publications
npm run update-bm-recommendations
```

## Coolify

1. Deploy / sync this backend code to the Coolify Strapi service (include `_publications-data.js`).
2. Open the backend container terminal (`docker exec` / Coolify terminal).
3. `cd` to the app root (where `package.json` lives).
4. Ensure the EN department document exists and Public `find` is enabled on the server.
5. Run the same `npm run update-bm-*` commands in the order above.

Recommendations are hidden (`recommendationsectionpresent: false`) because the source pack has no recommendation content. Achievements include Awards only. Staff includes Experimental Officers only (Technical Officers listed Vacant).
