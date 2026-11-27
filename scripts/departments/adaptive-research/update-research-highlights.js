'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID = 'api::adaptive-research-department.adaptive-research-department';
const LOCALE = 'en';
const DEPARTMENT_LABEL = 'Adaptive Research';

const HIGHLIGHTS = [
  {
    title: 'Expansion of rubber cultivation to drier climates',
    description:
      'Recommendations have been issued for dry zone rubber cultivation to ensure a higher survival rate and growth. Latex harvesting was commenced in firstly established rubber fields of Mullaithivu, Vavuniya and Anuradhapura districts.',
    researchteam:
      'Dr. (Mrs.) E.S. Munasinghe, Dr. (Mrs.) B.M.D.C. Balasooriya, Mr. P.M.M. Jayathilake',
    sortorder: 1,
  },
  {
    title: 'Adoption levels of RRISL recommendations were identified in the Kalutara district',
    description:
      'The rate of adoption to the RRISL recommendations was identified for the smallholder, medium scale, and estate sector in the Kalutara district.',
    researchteam:
      'Dr. (Mrs.) E.S. Munasinghe, Dr. (Mrs.) B.M.D.C. Balasooriya, Dr. P.K.K.S. Gunaratne, Mr. S.D. Ratnayake, Mr. P.M.M. Jayathilake, Ms. N.M. Piyasena',
    sortorder: 2,
  },
  {
    title: 'Socioeconomic status among plantation workers',
    description:
      'The psychosocioeconomic status of the rubber plantation workforce in the Kalutara district and RRISL-managed estates was identified in terms of education systems, gender equality and child protection.',
    researchteam:
      'Dr. (Mrs.) B.M.D.C. Balasooriya, Dr. (Mrs.) E.S. Munasinghe, Ms. N.M. Piyasena',
    sortorder: 3,
  },
  {
    title:
      'Approaching the voluntary carbon market with the rubber cultivation in Eastern and Uva Provinces',
    description:
      'A Carbon Trading Project for rubber cultivation in Ampara and Moneragala districts was developed and listed in an accredited voluntary carbon registry (VERRA Registry). Carbon footprint was calculated for the rubber related government organizations: Rubber Research Institute of Sri Lanka, Rubber Development Department of Sri Lanka and Thurusaviya Fund.',
    researchteam: 'Dr. (Mrs.) E.S. Munasinghe',
    sortorder: 4,
  },
  {
    title: 'Developing entrepreneurial skills among young rubber farmers in the Ampara District',
    description:
      'Training and capacity building programmes were conducted to develop the entrepreneurial skills of young rubber farmers in Padiyathalawa of Ampara district.',
    researchteam: 'Dr. (Mrs.) E.S. Munasinghe, Mr. P.M.M. Jayathilake',
    sortorder: 5,
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
