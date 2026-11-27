# Plant Pathology and Microbiology — content update scripts

These scripts update the English Strapi single type  
`api::plant-pathology-and-microbiology-department.plant-pathology-and-microbiology-department`.

They use whatever database the current Strapi `.env` points to (localhost or Coolify).

## Preconditions

1. Create the EN **Plant Pathology and Microbiology Department** entry once in Strapi Admin (hero stub is enough) if it does not exist. Prefer slug `plant-pathology-and-microbiology-department` (or `plant-pathology-and-microbiology`).
2. Enable Public role **find** for this content type (Settings → Users & Permissions → Public). Without it the frontend returns 404.
3. Stop any conflicting Strapi process if the script cannot bind/load the app (same pattern as Plant Science / RRCA / BAP / AEU scripts).
4. Upload images and the overview video in CMS section by section after the text is written (scripts preserve existing media when present).
5. Avoid saving Achievements / Publications components with empty required fields (e.g. blank `sectiontitle`) — that blocks later script publishes.
6. Scripts omit empty optional strings (`researchteam`, `description`, `closingparagraph`) instead of sending `null` (Coolify Yup validation).

## Run order

From `rrisl-backend`:

```bash
npm run update-ppm-overview
npm run update-ppm-staff
npm run update-ppm-research-highlights
npm run update-ppm-current-research-projects
npm run update-ppm-services
npm run update-ppm-achievements
npm run update-ppm-publications
npm run update-ppm-recommendations
```

## Coolify

1. Deploy / sync this backend code to the Coolify Strapi service (include `_publications-data.js`).
2. Open the backend container terminal (`docker exec` / Coolify terminal).
3. `cd` to the app root (where `package.json` lives).
4. Ensure the EN department document exists and Public `find` is enabled on the server.
5. Run the same `npm run update-ppm-*` commands in the order above.

Recommendations are enabled (`recommendationsectionpresent: true`) with one **New Recommendations** group. Achievements include Patents and Industrial Designs, Awards, and Grants (Internation / Local). Staff includes Experimental Officers and Technical Officers groups.
