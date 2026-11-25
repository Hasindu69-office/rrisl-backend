'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID =
  'api::agricultural-economics-department.agricultural-economics-department';
const LOCALE = 'en';
const DEPARTMENT_LABEL = 'Agricultural Economics';

const HIGHLIGHTS = [
  {
    title: 'Sustainability Assessment of Smallholder Rubber Farming Systems',
    description:
      'Developing sustainability frameworks and indicators to assess economic, environmental, social, technical and institutional aspects of smallholder rubber farming.',
    researchteam: 'J.K.S Sankalpa, P.G.N ishani, Dilhan Rathnayaka',
    sortorder: 1,
  },
  {
    title: 'Food Security and Livelihood Studies',
    description:
      'Assessing food security, dietary diversity, household livelihoods and coping strategies during food crises in plantation communities, with policy-oriented recommendations.',
    researchteam: 'P.G.N ishani, J.K.S Sankalpa, Dilhan Rathnayaka',
    sortorder: 2,
  },
  {
    title: 'Rubber Market Intelligence and Economic Data Analysis',
    description:
      'Collecting and analysing domestic and international prices, production, trade and consumption data to identify trends and support industry decision-making.',
    researchteam: 'P.G.N ishani, J.K.S Sankalpa, Dilhan Rathnayaka',
    sortorder: 3,
  },
  {
    title: 'Trade Competitiveness and Policy Analysis',
    description:
      'Examining the export performance and competitiveness of natural rubber and rubber-based products, including the effects of tariffs, trade policies and developments in major overseas markets.',
    researchteam: 'P.G.N ishani, J.K.S Sankalpa, Dilhan Rathnayaka',
    sortorder: 4,
  },
  {
    title: 'Rubber Industry Information Systems and Decision Support',
    description:
      'Developing and maintaining databases on rubber prices, production, consumption, trade and wider industry performance.',
    researchteam: 'P.G.N ishani, J.K.S Sankalpa, Dilhan Rathnayaka',
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
