'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID =
  'api::plant-pathology-and-microbiology-department.plant-pathology-and-microbiology-department';
const LOCALE = 'en';
const DEPARTMENT_LABEL = 'Plant Pathology and Microbiology';

const HIGHLIGHTS = [
  {
    title:
      'Trichoderma spp. based biological controlling agents against white root disease in compost and talc carrier media',
    description:
      'Two bio-control formulations were developed by inoculating Trichoderma virens and Trichoderma harzianum into compost- and talc-based carrier media for biological controlling of white root disease of rubber. These formulations aim to provide an effective and environmentally sustainable alternative to conventional inorganic fungicides in prophylactic WRD control, thereby reducing chemical fungicide usage in disease management.',
    researchteam:
      'T.H.P.S. Fernando, K.V.V.S. Kudaligama, M.K.R. Silva, P. Senevirathna, A.H.M.N.R. Aberathne',
    sortorder: 1,
  },
  {
    title: 'Revitalization of productivity in rubber smallholders through new/improved recommendations',
    description:
      'The initiative aims to revitalize the productivity and sustainability of rubber smallholdings through the introduction and adoption of improved cultivation and management recommendations, targeting 1,000 selected growers in the Kalutara and Monaragala districts. Key interventions include improving tapping quality and latex yield through recommended tapping practices, rain guard installation, intercropping, enhanced soil fertility management, and the introduction of low-intensity tapping systems to utilize underproductive rubber lands. Furthermore, integrated short-, medium-, and long-term management strategies will be promoted to mitigate the impacts of Pestalotiopsis leaf fall disease, root diseases, and other major pests, thereby reducing tree mortality, maintaining optimum stand density, and enhancing the economic resilience and livelihoods of rubber smallholders.',
    researchteam:
      'T.H.P.S. Fernando collaboratively with all the other agronomy departments of RRISL, RRI Trainers (Kalutara district), Research Officers, Experimental Officers, Technical Officers, Rubber Extension Officers, and Rubber Development Officers – Kalutara, Monaragala',
    sortorder: 2,
  },
  {
    title:
      'Optimization of chemical management strategy of the Circular Leaf Spot Disease for the field-level mature rubber conditions and development of a national-level management protocol',
    description:
      'The Department focuses on optimizing and validating chemical management strategies for Circular Leaf Spot Disease (CLSD) under large-scale, mature rubber plantation conditions. Research involves evaluating the efficacy of the developed fungicide cocktail through field-scale applications, including drone-assisted spraying in identified disease hotspots, to enhance application efficiency and disease suppression. The ultimate goal is to develop a practical, economically viable, and scientifically validated integrated disease management package for national-level implementation across rubber-growing regions.',
    researchteam:
      'M.K.R. Silva, T.H.P.S. Fernando, L.A.T.S. Liyanaarachchi, H.V.A.S. Koshila, E.A.D.D. Siriwardena, S.C.P. Wijayaratne, E.A.D.N. Nishantha, D.A.N. Mallikaarachchi',
    sortorder: 3,
  },
];

function normalizeTitle(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function mediaId(media) {
  return Number.isInteger(media?.id) ? media.id : null;
}

function getPopulate() {
  return {
    researchhighlightssection: {
      populate: {
        researchhighlightcards: {
          populate: {
            image: true,
          },
        },
      },
    },
  };
}

async function findDepartment(repository) {
  return (
    (await repository.findFirst({ locale: LOCALE, status: 'published', populate: getPopulate() })) ||
    repository.findFirst({ locale: LOCALE, status: 'draft', populate: getPopulate() })
  );
}

function findExistingCard(existingCards, highlight, usedIds) {
  const expectedTitle = normalizeTitle(highlight.title);

  const byTitle = existingCards.find((candidate) => {
    if (usedIds.has(candidate?.id)) return false;
    return normalizeTitle(candidate?.title) === expectedTitle;
  });

  if (byTitle) return byTitle;

  return existingCards.find(
    (candidate) => !usedIds.has(candidate?.id) && candidate?.sortorder === highlight.sortorder
  );
}

function buildCards(existingCards) {
  const usedIds = new Set();

  return HIGHLIGHTS.map((highlight) => {
    const existing = findExistingCard(existingCards, highlight, usedIds);

    if (existing?.id) {
      usedIds.add(existing.id);
    }

    const image = mediaId(existing?.image);
    const payload = {
      title: highlight.title,
      description: highlight.description,
      sortorder: highlight.sortorder,
    };

    if (highlight.researchteam) {
      payload.researchteam = highlight.researchteam;
    }

    if (image) {
      payload.image = image;
    }

    return payload;
  });
}

function assertPublishedResult(department) {
  if (department?.researchhighlightspresent !== true) {
    throw new Error('Research highlights verification failed: the visibility flag is not enabled.');
  }

  const cards = department?.researchhighlightssection?.researchhighlightcards || [];

  if (cards.length !== HIGHLIGHTS.length) {
    throw new Error(
      `Research highlights verification failed: expected ${HIGHLIGHTS.length} cards, found ${cards.length}.`
    );
  }

  for (const expected of HIGHLIGHTS) {
    const actual = cards.find((card) => card?.sortorder === expected.sortorder);

    if (!actual) {
      throw new Error(
        `Research highlights verification failed: missing card with sortorder ${expected.sortorder}.`
      );
    }

    if (actual.title?.trim() !== expected.title) {
      throw new Error(
        `Research highlights verification failed: unexpected title for sortorder ${expected.sortorder}.`
      );
    }

    if (!actual.description?.trim() || actual.description.trim().length < 10) {
      throw new Error(
        `Research highlights verification failed: description missing for sortorder ${expected.sortorder}.`
      );
    }
  }
}

async function main() {
  const appContext = await compileStrapi({ appDir: process.cwd() });
  const app = createStrapi(appContext);

  try {
    await app.load();

    const repository = app.documents(CONTENT_TYPE_UID);
    const department = await findDepartment(repository);

    if (!department?.documentId) {
      throw new Error(
        `English ${DEPARTMENT_LABEL} Department document was not found (${CONTENT_TYPE_UID}). Create the EN single type in Strapi Admin first.`
      );
    }

    const existingCards = department.researchhighlightssection?.researchhighlightcards || [];
    const researchhighlightcards = buildCards(existingCards);
    const preservedCount = researchhighlightcards.filter((card) => card.image).length;
    const verticalText =
      department.researchhighlightssection?.verticaltext?.trim() || 'Research Highlights';

    await repository.update({
      documentId: department.documentId,
      locale: LOCALE,
      data: {
        researchhighlightspresent: true,
        researchhighlightssection: {
          verticaltext: verticalText,
          researchhighlightcards,
        },
      },
    });

    await repository.publish({
      documentId: department.documentId,
      locale: LOCALE,
    });

    const updatedDepartment = await repository.findOne({
      documentId: department.documentId,
      locale: LOCALE,
      status: 'published',
      populate: getPopulate(),
    });

    assertPublishedResult(updatedDepartment);

    console.log(
      `Updated and published the ${LOCALE} ${DEPARTMENT_LABEL} research highlights section with ${HIGHLIGHTS.length} flip tiles (preserved images on ${preservedCount}; upload remaining in CMS).`
    );
  } finally {
    if (app.isLoaded) {
      await app.destroy();
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(`Failed to update the ${DEPARTMENT_LABEL} research highlights section.`);
    console.error(error);
    process.exit(1);
  });
