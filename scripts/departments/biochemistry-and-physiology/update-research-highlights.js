'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID =
  'api::biochemistry-and-physiology-department.biochemistry-and-physiology-department';
const LOCALE = 'en';
const DEPARTMENT_LABEL = 'Biochemistry and Physiology';

const HIGHLIGHTS = [
  {
    title: 'Low-Intensity Harvesting (LIH) Systems',
    description:
      'Low-Intensity Harvesting (LIH) systems are designed to reduce labour requirements and production costs while maintaining sustainable latex yields. The Department develops and optimizes reduced-intensity tapping systems and site-specific stimulation schedules through field evaluations. These technologies help improve plantation profitability while safeguarding tree health and productivity.',
    researchteam: null,
    sortorder: 1,
  },
  {
    title: 'Locally Manufactured Ethephon Stimulant',
    description:
      'Ethephon is a widely used yield stimulant in rubber cultivation. The Department successfully developed a locally manufactured ethephon formulation, reducing dependence on imported products and lowering costs for the industry. Current research focuses on improving its performance through the incorporation of anti-stress compounds.',
    researchteam: null,
    sortorder: 2,
  },
  {
    title: 'Climate Resilience and Physiological Adaptability of Rubber Clones',
    description:
      'The expansion of rubber cultivation into non-traditional growing regions requires clones that can withstand diverse environmental conditions. Our research evaluates the physiological performance of promising clones in Intermediate and Dry Zone environments. The findings support the identification of climate-resilient rubber clones/genotypes for future cultivation.',
    researchteam: null,
    sortorder: 3,
  },
  {
    title: 'Latex Diagnosis Technology',
    description:
      'Latex diagnosis is a physiological tool used to assess tree health, productivity, and stress status. The Department employs latex physiological indices and modelling approaches to evaluate new Hevea genotypes, characterize the metabolic regimes of newly developed clones, and facilitate the early detection of physiological stress conditions. This technology also supports optimizing tapping and stimulation practices.',
    researchteam: null,
    sortorder: 4,
  },
  {
    title: 'Rubber Wood Research',
    description:
      'Rubber wood is an increasingly important source of timber and value-added products. Our research focuses on understanding timber properties across clones, ages and stem heights, and developing environmentally friendly preservation techniques. These efforts enhance the quality, durability, and market value of rubber wood.',
    researchteam: null,
    sortorder: 5,
  },
  {
    title: 'National-Level Extension Programmes',
    description:
      'The Department actively disseminates research findings and technologies to industry stakeholders across Sri Lanka. Major extension initiatives include the promotion of Low-Intensity Harvesting systems and the expansion of rubber cultivation into nontraditional growing areas. These programmes support sustainable development and technology adoption within the rubber sector.',
    researchteam: null,
    sortorder: 6,
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
      researchteam: highlight.researchteam || null,
      sortorder: highlight.sortorder,
    };

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
