# Biochemistry and Physiology — content update scripts

These scripts update the English Strapi single type  
`api::biochemistry-and-physiology-department.biochemistry-and-physiology-department`.

They use whatever database the current Strapi `.env` points to (localhost or Coolify).

## Preconditions

1. Create the EN **Biochemistry and Physiology Department** entry once in Strapi Admin (hero stub is enough) if it does not exist. Prefer slug `biochemistry-and-physiology-department` (or `biochemistry-and-physiology`).
2. Enable Public role **find** for this content type (Settings → Users & Permissions → Public). Without it the frontend returns 404.
3. Stop any conflicting Strapi process if the script cannot bind/load the app (same pattern as Plant Science / RRCA scripts).
4. Upload images and the overview video in CMS section by section after the text is written (scripts preserve existing media when present).
5. Avoid saving Achievements / Publications components with empty required fields (e.g. blank `sectiontitle`) — that blocks later script publishes.

## Run order

From `rrisl-backend`:

```bash
npm run update-bap-overview
npm run update-bap-staff
npm run update-bap-research-highlights
npm run update-bap-current-research-projects
npm run update-bap-services
npm run update-bap-achievements
npm run update-bap-publications
npm run update-bap-recommendations
```

## Coolify

1. Deploy / sync this backend code to the Coolify Strapi service.
2. Open the backend container terminal (`docker exec` / Coolify terminal).
3. `cd` to the app root (where `package.json` lives).
4. Ensure the EN department document exists and Public `find` is enabled on the server.
5. Run the same `npm run update-bap-*` commands in the order above.

Recommendations are enabled (`recommendationsectionpresent: true`) with New and Revised groups. Achievements include Patents and Industrial Designs, Awards, and Grants. Empty service labels from the source pack with no detail body (Land evaluation, E-testing, Plant Certification) are omitted.
