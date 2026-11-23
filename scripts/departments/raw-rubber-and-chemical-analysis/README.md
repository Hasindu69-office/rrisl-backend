# Raw Rubber and Chemical Analysis — content update scripts

These scripts update the English Strapi single type  
`api::raw-rubber-and-chemical-analysis-department.raw-rubber-and-chemical-analysis-department`.

They use whatever database the current Strapi `.env` points to (localhost or Coolify).

## Preconditions

1. Create the EN **Raw Rubber and Chemical Analysis Department** entry once in Strapi Admin (hero stub is enough) if it does not exist.
2. Stop any conflicting Strapi process if the script cannot bind/load the app (same pattern as Plant Science scripts).
3. Upload images and the overview video in CMS section by section after the text is written (scripts preserve existing media when present).

## Run order

From `rrisl-backend`:

```bash
npm run update-rrca-overview
npm run update-rrca-staff
npm run update-rrca-research-highlights
npm run update-rrca-current-research-projects
npm run update-rrca-services
npm run update-rrca-achievements
npm run update-rrca-publications
npm run update-rrca-recommendations
```

## Coolify

1. Deploy / sync this backend code to the Coolify Strapi service.
2. Open the backend container terminal (`docker exec` / Coolify terminal).
3. `cd` to the app root (where `package.json` lives).
4. Run the same `npm run update-rrca-*` commands in the order above.

Recommendations are intentionally hidden (`recommendationsectionpresent: false`) because the source pack has no recommendation content. Patents/industrial designs were omitted from achievements because none were listed in the source; Awards and Grants are populated.
